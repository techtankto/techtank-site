-- ────────────────────────────────────────────────────────────
-- Assignment drives status.
--
-- There is no separate "taken" state: handing a task
-- to someone IS the task being in progress. So assigning now moves
-- the task to `in_progress`, and clearing the assignment hands it
-- back to `open`.
--
-- Clearing only reopens a task that was `in_progress`; a `done` task
-- that loses its assignee stays done.
-- ────────────────────────────────────────────────────────────

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
         status = CASE
           -- Handing it to someone starts the work.
           WHEN v_name IS NOT NULL THEN 'in_progress'::public.contribution_task_status
           -- Unassigning puts it back on the board, unless it's finished.
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

REVOKE EXECUTE ON FUNCTION public.admin_assign_contribution_task(uuid, text)
  FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_assign_contribution_task(uuid, text)
  TO authenticated;

-- Backfill: any task that was assigned while still reading `open`
-- (the old "taken" state) becomes `in_progress`.
UPDATE public.contribution_tasks
   SET status = 'in_progress'
 WHERE assigned_name IS NOT NULL
   AND status = 'open';
