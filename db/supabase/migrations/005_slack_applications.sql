-- ────────────────────────────────────────────────────────────
-- Applying now requires a verified Slack identity.
--
-- Before this, anyone on the internet could POST an application with
-- any name and any email. That was an open door: unlimited spam, an
-- enumeration oracle, and a way to make TechTank's domain email
-- arbitrary strangers.
--
-- Now the applicant signs in with Slack first, and everything about
-- them comes from the verified token rather than from the request
-- body. The client no longer sends a name or an email at all, so it
-- cannot lie about either.
--
-- Authorisation lives here, in SQL, so the edge function is reduced to
-- sending notifications and cannot become a second, weaker gate.
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.contribution_task_applications
  ADD COLUMN applicant_auth_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN slack_user_id text,
  ADD COLUMN slack_team_id text;

-- One application per Slack identity per task. The existing
-- case-insensitive email index still stands for rows written before
-- this migration.
CREATE UNIQUE INDEX idx_contribution_task_applications_slack
  ON public.contribution_task_applications (task_id, slack_user_id)
  WHERE slack_user_id IS NOT NULL;

/**
 * Apply to a task as the signed-in Slack user.
 *
 * Returns jsonb: { status, slack_user_id, applicant_name, task_title }
 * where status is one of:
 *   applied          — recorded, notify the organizers
 *   already_applied  — same person, same task; do not re-notify
 *   closed           — no longer taking applications
 *   not_found        — no such task
 *   wrong_workspace  — signed in, but not to the TechTank workspace
 *
 * Identity is read from auth.users, never from arguments, so the only
 * thing a caller controls is which task and what message.
 */
CREATE OR REPLACE FUNCTION public.apply_to_contribution_task(
  p_task_id uuid,
  p_message text DEFAULT ''
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_task     public.contribution_tasks;
  v_email    text;
  v_name     text;
  v_slack_id text;
  v_team_id  text;
  v_message  text := left(btrim(COALESCE(p_message, '')), 2000);
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  IF NOT public.caller_workspace_ok() THEN
    RETURN jsonb_build_object('status', 'wrong_workspace');
  END IF;

  SELECT * INTO v_task FROM public.contribution_tasks WHERE id = p_task_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'not_found');
  END IF;

  -- Same rule the board shows: open and unassigned, or nothing.
  IF v_task.status <> 'open' OR v_task.assigned_name IS NOT NULL THEN
    RETURN jsonb_build_object('status', 'closed', 'task_title', v_task.title);
  END IF;

  SELECT lower(u.email),
         NULLIF(btrim(COALESCE(
           u.raw_user_meta_data ->> 'full_name',
           u.raw_user_meta_data ->> 'name',
           u.raw_user_meta_data ->> 'preferred_username',
           split_part(u.email, '@', 1)
         )), ''),
         COALESCE(
           u.raw_user_meta_data ->> 'provider_id',
           u.raw_user_meta_data ->> 'sub',
           u.raw_user_meta_data ->> 'https://slack.com/user_id'
         ),
         public.caller_slack_team_id()
    INTO v_email, v_name, v_slack_id, v_team_id
    FROM auth.users u
   WHERE u.id = auth.uid();

  INSERT INTO public.contribution_task_applications
    (task_id, applicant_name, applicant_email, message,
     applicant_auth_user_id, slack_user_id, slack_team_id)
  VALUES
    (p_task_id, COALESCE(v_name, v_email), v_email, v_message,
     auth.uid(), v_slack_id, v_team_id)
  ON CONFLICT DO NOTHING;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'status', 'already_applied',
      'task_title', v_task.title,
      'applicant_name', COALESCE(v_name, v_email),
      'slack_user_id', v_slack_id
    );
  END IF;

  RETURN jsonb_build_object(
    'status', 'applied',
    'task_title', v_task.title,
    'applicant_name', COALESCE(v_name, v_email),
    'applicant_email', v_email,
    'slack_user_id', v_slack_id
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.apply_to_contribution_task(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.apply_to_contribution_task(uuid, text) TO authenticated;

/**
 * Has the caller already applied to this task? Lets the apply panel
 * show the acknowledgement on load for the right person, rather than
 * trusting this browser's localStorage.
 */
CREATE OR REPLACE FUNCTION public.has_applied_to_contribution_task(p_task_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.contribution_task_applications a
    WHERE a.task_id = p_task_id
      AND a.applicant_auth_user_id = auth.uid()
  );
$$;

REVOKE EXECUTE ON FUNCTION public.has_applied_to_contribution_task(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_applied_to_contribution_task(uuid) TO authenticated;

-- ── admin: surface the Slack id so organizers can DM ─────────

DROP FUNCTION IF EXISTS public.admin_list_contribution_task_applications(uuid);

CREATE FUNCTION public.admin_list_contribution_task_applications(p_task_id uuid)
RETURNS TABLE (
  id              uuid,
  applicant_name  text,
  applicant_email text,
  message         text,
  slack_user_id   text,
  created_at      timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.assert_caller_is_admin();
  RETURN QUERY
    SELECT a.id, a.applicant_name, a.applicant_email, a.message,
           a.slack_user_id, a.created_at
    FROM public.contribution_task_applications a
    WHERE a.task_id = p_task_id
    ORDER BY a.created_at DESC;
END;
$$;

REVOKE EXECUTE ON FUNCTION
  public.admin_list_contribution_task_applications(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION
  public.admin_list_contribution_task_applications(uuid) TO authenticated;
