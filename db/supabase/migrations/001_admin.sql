-- ────────────────────────────────────────────────────────────
-- Admin foundation for the TechTank back office.
--
-- TechTank has no passwords — everyone signs in with Slack.
-- Admin authority is a row in `admins`
-- keyed on the caller's auth.uid(). Every admin write in the app
-- goes through a SECURITY DEFINER RPC that calls
-- `assert_caller_is_admin()` first, so the SQL boundary — not the
-- UI — is the real gate.
--
-- Seeding an admin (local): create the auth user in Studio
-- (http://localhost:54523 → Authentication → Add user), then
--   INSERT INTO public.admins (auth_user_id, email)
--   VALUES ('<the-new-auth-uuid>', 'organizer@example.com');
-- ────────────────────────────────────────────────────────────

-- Shared trigger to keep `updated_at` current on UPDATE.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.admins (
  auth_user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Admins read their own membership through the gate below; there is
-- no public policy. RLS on with no policy = deny-all to anon /
-- authenticated, which is what we want (only SECURITY DEFINER
-- functions touch this table).
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- The one gate every admin RPC calls first. Raises 42501 (insufficient
-- privilege) when the caller is anonymous or not an admin.
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

  IF NOT EXISTS (
    SELECT 1 FROM public.admins WHERE auth_user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.assert_caller_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assert_caller_is_admin() TO authenticated;

-- Caller-scoped "am I an admin?" check so the app can gate the back
-- office without leaking the admins table. Returns false for anon.
CREATE OR REPLACE FUNCTION public.is_caller_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE auth_user_id = auth.uid()
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_caller_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_caller_admin() TO authenticated;
