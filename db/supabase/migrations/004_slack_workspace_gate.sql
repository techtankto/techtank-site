-- ────────────────────────────────────────────────────────────
-- Slack workspace gate.
--
-- Organizers sign in with Slack (Supabase's `slack_oidc` provider).
-- Signing in with Slack proves you are in *a* Slack workspace, not
-- necessarily OURS, so the workspace has to be checked server-side.
--
-- Two layers, and only the second one is a control:
--   1. The sign-in URL passes `team=<id>`, which makes Slack
--      pre-select the right workspace. That is a convenience hint the
--      client could change, so it proves nothing.
--   2. This migration compares the `team_id` claim carried in the
--      caller's JWT against the configured workspace, in SQL, where
--      the browser cannot reach it. That is the actual gate.
--
-- A caller with no Slack claim at all (there should be none now that
-- email sign-in is off, but older rows may exist) falls back to the
-- `admins` allowlist: the workspace check only applies when the caller
-- actually carries a team claim.
-- ────────────────────────────────────────────────────────────

-- ── configuration ────────────────────────────────────────────
-- One row per setting. Deliberately a table rather than a hardcoded
-- constant so setting or rotating the workspace id is a data change,
-- not a migration.

CREATE TABLE public.app_settings (
  key        text PRIMARY KEY,
  value      text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
-- No policies: only SECURITY DEFINER functions read this.

CREATE TRIGGER trg_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- NULL means "no workspace configured", which disables the check so a
-- half-configured environment can't lock every organizer out. Set it
-- with:
--   UPDATE public.app_settings SET value = 'T0123456789'
--    WHERE key = 'slack_team_id';
INSERT INTO public.app_settings (key, value)
VALUES ('slack_team_id', NULL);

CREATE OR REPLACE FUNCTION public.allowed_slack_team_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT NULLIF(btrim(value), '')
  FROM public.app_settings
  WHERE key = 'slack_team_id';
$$;

-- ── the caller's Slack workspace ─────────────────────────────
-- Supabase copies the OIDC claims onto the user. Slack's `team_id`
-- arrives nested under `custom_claims` as the fully-qualified
-- `https://slack.com/team_id` key (verified against a live sign-in);
-- the other spellings are belt-and-braces for other providers/versions.
-- If none match this returns NULL, which DISABLES the gate for that
-- caller, so getting the path right is what makes the check real.

CREATE OR REPLACE FUNCTION public.caller_slack_team_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT COALESCE(
    u.raw_user_meta_data -> 'custom_claims' ->> 'https://slack.com/team_id',
    u.raw_user_meta_data ->> 'https://slack.com/team_id',
    u.raw_user_meta_data ->> 'team_id',
    u.raw_user_meta_data -> 'team' ->> 'id'
  )
  FROM auth.users u
  WHERE u.id = auth.uid();
$$;

/**
 * True when the caller is allowed by the workspace rule:
 *   - no workspace configured  → allowed (check disabled)
 *   - caller has no Slack claim → allowed (legacy/pre-Slack row)
 *   - caller has a Slack claim  → must match the configured workspace
 */
CREATE OR REPLACE FUNCTION public.caller_workspace_ok()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT
    public.allowed_slack_team_id() IS NULL
    OR public.caller_slack_team_id() IS NULL
    OR public.caller_slack_team_id() = public.allowed_slack_team_id();
$$;

REVOKE EXECUTE ON FUNCTION public.allowed_slack_team_id() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.caller_slack_team_id() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.caller_workspace_ok() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.caller_workspace_ok() TO authenticated;

-- ── admins can now be matched by Slack identity ──────────────
-- An organizer seeded before they ever signed in has an email but no
-- auth user yet, so `auth_user_id` becomes nullable and the row is
-- claimed on first Slack sign-in by matching the verified email.

ALTER TABLE public.admins
  ADD COLUMN slack_user_id text,
  ADD COLUMN slack_team_id text;

-- Order matters: the column can't drop NOT NULL while it is still the
-- primary key, and the table can't be left without one in between.
ALTER TABLE public.admins DROP CONSTRAINT admins_pkey;
ALTER TABLE public.admins ADD COLUMN id uuid NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE public.admins ADD PRIMARY KEY (id);
ALTER TABLE public.admins ALTER COLUMN auth_user_id DROP NOT NULL;

CREATE UNIQUE INDEX idx_admins_auth_user ON public.admins (auth_user_id)
  WHERE auth_user_id IS NOT NULL;
CREATE UNIQUE INDEX idx_admins_email ON public.admins (lower(email));

/**
 * Bind the signed-in user to their `admins` row. Called after sign-in.
 * Matches on the verified email so an organizer can be pre-authorised
 * by email before they have ever logged in, then records the Slack
 * identity for DM links. Returns true if the caller is an admin.
 *
 * Refuses to bind a caller from the wrong Slack workspace.
 */
CREATE OR REPLACE FUNCTION public.claim_admin_membership()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_email text;
  v_slack_user text;
  v_slack_team text;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  IF NOT public.caller_workspace_ok() THEN
    RETURN false;
  END IF;

  SELECT lower(u.email),
         COALESCE(
           u.raw_user_meta_data ->> 'provider_id',
           u.raw_user_meta_data ->> 'sub',
           u.raw_user_meta_data ->> 'https://slack.com/user_id'
         ),
         public.caller_slack_team_id()
    INTO v_email, v_slack_user, v_slack_team
    FROM auth.users u
   WHERE u.id = auth.uid();

  -- Already bound: just refresh the Slack identity.
  UPDATE public.admins
     SET slack_user_id = COALESCE(v_slack_user, slack_user_id),
         slack_team_id = COALESCE(v_slack_team, slack_team_id)
   WHERE auth_user_id = auth.uid();
  IF FOUND THEN
    RETURN true;
  END IF;

  -- Pre-authorised by email and signing in for the first time.
  UPDATE public.admins
     SET auth_user_id  = auth.uid(),
         slack_user_id = COALESCE(v_slack_user, slack_user_id),
         slack_team_id = COALESCE(v_slack_team, slack_team_id)
   WHERE auth_user_id IS NULL
     AND lower(email) = v_email;

  RETURN FOUND;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_admin_membership() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_admin_membership() TO authenticated;

-- ── fold the workspace check into the existing gates ─────────

CREATE OR REPLACE FUNCTION public.assert_caller_is_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  IF NOT public.caller_workspace_ok() THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.admins WHERE auth_user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_caller_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT public.caller_workspace_ok()
     AND EXISTS (
       SELECT 1 FROM public.admins WHERE auth_user_id = auth.uid()
     );
$$;
