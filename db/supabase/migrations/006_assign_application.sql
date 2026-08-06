-- ────────────────────────────────────────────────────────────
-- Assigning an applicant (as opposed to a free-text name).
--
-- `admin_assign_contribution_task` takes a plain name and can't notify
-- anyone: a name has no Slack identity. This RPC assigns a specific
-- *application*, so it can hand back both the assignee's Slack id and
-- the assigning admin's, which the `assign-task` edge function uses to
-- open a group DM introducing the two of them.
--
-- The state change is identical to a normal assignment: the task's
-- `assigned_name` is set and it moves to `in_progress`.
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.admin_assign_application(p_application_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_app   public.contribution_task_applications;
  v_title text;
  v_admin_slack text;
BEGIN
  PERFORM public.assert_caller_is_admin();

  SELECT * INTO v_app
  FROM public.contribution_task_applications
  WHERE id = p_application_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'not_found');
  END IF;

  UPDATE public.contribution_tasks
     SET assigned_name = v_app.applicant_name,
         status = 'in_progress'
   WHERE id = v_app.task_id
  RETURNING title INTO v_title;

  SELECT slack_user_id INTO v_admin_slack
  FROM public.admins
  WHERE auth_user_id = auth.uid();

  RETURN jsonb_build_object(
    'status', 'assigned',
    'task_id', v_app.task_id,
    'task_title', v_title,
    'assignee_name', v_app.applicant_name,
    'assignee_slack_user_id', v_app.slack_user_id,
    'admin_slack_user_id', v_admin_slack
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_assign_application(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_assign_application(uuid) TO authenticated;
