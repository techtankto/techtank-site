-- ────────────────────────────────────────────────────────────
-- Guard against storing the wrong kind of Slack id.
--
-- A live bug stored a DM *channel* id (`D0…`) in `admins.slack_user_id`
-- where a *user* id (`U…`/`W…`) belongs. Feeding a channel id to
-- conversations.open then quietly failed the assignment group DM.
--
-- Slack id prefixes: users are `U` (or `W` on Enterprise Grid),
-- workspaces/teams are `T`, DMs are `D`, channels `C`. CHECK
-- constraints make a mis-typed id fail loudly at write time instead of
-- surfacing as a broken Slack message days later.
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.admins
  ADD CONSTRAINT admins_slack_user_id_shape
    CHECK (slack_user_id IS NULL OR slack_user_id ~ '^[UW]'),
  ADD CONSTRAINT admins_slack_team_id_shape
    CHECK (slack_team_id IS NULL OR slack_team_id ~ '^T');

ALTER TABLE public.contribution_task_applications
  ADD CONSTRAINT applications_slack_user_id_shape
    CHECK (slack_user_id IS NULL OR slack_user_id ~ '^[UW]'),
  ADD CONSTRAINT applications_slack_team_id_shape
    CHECK (slack_team_id IS NULL OR slack_team_id ~ '^T');

-- Refresh the Slack identity from the token on every sign-in, always.
-- The previous COALESCE(new, old) kept a stale value when the new one
-- was null; overwriting unconditionally means a once-bad row self-heals
-- the next time that organizer signs in, and the token is the source of
-- truth anyway.
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

  -- Already bound: refresh identity to match the token.
  UPDATE public.admins
     SET slack_user_id = v_slack_user,
         slack_team_id = v_slack_team
   WHERE auth_user_id = auth.uid();
  IF FOUND THEN
    RETURN true;
  END IF;

  -- Pre-authorised by email, signing in for the first time.
  UPDATE public.admins
     SET auth_user_id  = auth.uid(),
         slack_user_id = v_slack_user,
         slack_team_id = v_slack_team
   WHERE auth_user_id IS NULL
     AND lower(email) = v_email;

  RETURN FOUND;
END;
$$;
