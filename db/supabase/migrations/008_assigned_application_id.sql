-- ────────────────────────────────────────────────────────────
-- Tie an assignment to the application it came from.
--
-- The admin UI matched the assignee to an applicant by comparing
-- `assigned_name` with `applicant_name`, so two applicants sharing a name
-- both read as "on it". `assigned_application_id` records which
-- application was assigned; it stays NULL for a hand-typed name, and
-- `ON DELETE SET NULL` keeps the name if the application row goes away.
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.contribution_tasks
  ADD COLUMN assigned_application_id uuid
    REFERENCES public.contribution_task_applications(id) ON DELETE SET NULL;

-- Backfill only where the name identifies exactly one applicant on the task;
-- an ambiguous name stays unlinked rather than guessing.
UPDATE public.contribution_tasks t
   SET assigned_application_id = a.id
  FROM public.contribution_task_applications a
 WHERE a.task_id = t.id
   AND a.applicant_name = t.assigned_name
   AND (
     SELECT count(*)
     FROM public.contribution_task_applications b
     WHERE b.task_id = t.id AND b.applicant_name = t.assigned_name
   ) = 1;

-- A hand-typed assignment has no application, so it clears the link.
CREATE OR REPLACE FUNCTION public.admin_assign_contribution_task(
  p_task_id       uuid,
  p_assigned_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name text := NULLIF(btrim(p_assigned_name), '');
BEGIN
  PERFORM public.assert_caller_is_admin();

  UPDATE public.contribution_tasks
     SET assigned_name = v_name,
         assigned_application_id = NULL,
         status = CASE
           WHEN v_name IS NOT NULL THEN 'in_progress'::public.contribution_task_status
           WHEN status = 'in_progress' THEN 'open'::public.contribution_task_status
           ELSE status
         END
   WHERE id = p_task_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'contribution task % not found', p_task_id
      USING ERRCODE = 'P0002';
  END IF;
END;
$$;

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

  -- Reassigning is intentional; reopening a finished task from a stale list is not.
  UPDATE public.contribution_tasks
     SET assigned_name = v_app.applicant_name,
         assigned_application_id = v_app.id,
         status = 'in_progress'
   WHERE id = v_app.task_id
     AND status <> 'done'
  RETURNING title INTO v_title;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'closed');
  END IF;

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

-- The return type gains a column, which CREATE OR REPLACE can't change.
DROP FUNCTION public.admin_list_contribution_tasks();

CREATE FUNCTION public.admin_list_contribution_tasks()
RETURNS TABLE (
  id                      uuid,
  title                   text,
  summary                 text,
  body_markdown           text,
  status                  public.contribution_task_status,
  difficulty              public.contribution_task_difficulty,
  tags                    text[],
  assigned_name           text,
  assigned_application_id uuid,
  application_count       bigint,
  sort_order              integer,
  created_at              timestamptz,
  updated_at              timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.assert_caller_is_admin();
  RETURN QUERY
    SELECT
      t.id, t.title, t.summary, t.body_markdown, t.status, t.difficulty,
      t.tags, t.assigned_name, t.assigned_application_id,
      (
        SELECT count(*)
        FROM public.contribution_task_applications a
        WHERE a.task_id = t.id
      ) AS application_count,
      t.sort_order, t.created_at, t.updated_at
    FROM public.contribution_tasks t
    ORDER BY t.sort_order ASC, t.created_at ASC;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_list_contribution_tasks() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_list_contribution_tasks() TO authenticated;
