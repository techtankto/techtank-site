-- ────────────────────────────────────────────────────────────
-- Contribution board — a public, GitHub-issues-style list of
-- concrete tasks people can pick up to help run TechTank.
--
-- Product rules:
--   * Anyone can browse the board (public read).
--   * People APPLY to a task before starting work. Applying is
--     handled by the `apply-to-task` edge function, which records
--     the application and pings Slack. Applicants are anonymous —
--     TechTank has no user accounts — so they leave a name + email
--     on the application itself.
--   * A task is publicly "available" only while `status = 'open'`
--     AND nobody is assigned. Assignment is a plain name an admin
--     sets (usually an applicant), independent from status.
--   * Difficulty and status are enums; tags are validated app-side
--     against a fixed set, so growing the set is a code edit.
--
-- All writes go through SECURITY DEFINER RPCs that call
-- `assert_caller_is_admin()` first (see 001_admin.sql).
-- ────────────────────────────────────────────────────────────

CREATE TYPE public.contribution_task_status AS ENUM (
  'open',
  'in_progress',
  'done'
);

CREATE TYPE public.contribution_task_difficulty AS ENUM (
  'quick_win',
  'two_hours',
  'a_few_hours',
  'bigger_project'
);

CREATE TABLE public.contribution_tasks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  -- One-line summary shown on the board row.
  summary       text NOT NULL DEFAULT '',
  -- Full description, authored as markdown by an admin.
  body_markdown text NOT NULL DEFAULT '',
  status        public.contribution_task_status NOT NULL DEFAULT 'open',
  difficulty    public.contribution_task_difficulty NOT NULL DEFAULT 'a_few_hours',
  -- Discipline slugs from the fixed set in constants/contribution-board.
  tags          text[] NOT NULL DEFAULT '{}',
  -- The name the task was handed to, set by an admin. Independent from
  -- `status`: assigning does not flip the status, but an assigned task
  -- stops accepting applications.
  assigned_name text,
  -- Manual ordering for the board; lower sorts first.
  sort_order    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_contribution_tasks_sort
  ON public.contribution_tasks (sort_order, created_at);

CREATE TRIGGER trg_contribution_tasks_updated_at
  BEFORE UPDATE ON public.contribution_tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── applications ─────────────────────────────────────────────
-- One row per applicant-email-per-task. Written only by the
-- `apply-to-task` edge function (service role); read only through
-- the admin RPC. Never exposed on the public board. Deduped
-- case-insensitively on email so a repeat apply is a no-op.

CREATE TABLE public.contribution_task_applications (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id        uuid NOT NULL REFERENCES public.contribution_tasks(id)
                   ON DELETE CASCADE,
  applicant_name  text NOT NULL,
  applicant_email text NOT NULL,
  message        text NOT NULL DEFAULT '',
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_contribution_task_applications_unique
  ON public.contribution_task_applications (task_id, lower(applicant_email));

CREATE INDEX idx_contribution_task_applications_task
  ON public.contribution_task_applications (task_id);

-- ── RLS ──────────────────────────────────────────────────────
-- The board is public-read. There are no public write policies:
-- admin writes go through SECURITY DEFINER RPCs, and applications
-- are written by the service-role edge function.

ALTER TABLE public.contribution_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_task_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contribution tasks are publicly readable"
  ON public.contribution_tasks
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Applications have no SELECT/INSERT policy on purpose: only the
-- service role (edge function) and SECURITY DEFINER RPCs touch them.

-- ── public read RPCs ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.get_public_contribution_tasks()
RETURNS TABLE (
  id            uuid,
  title         text,
  summary       text,
  body_markdown text,
  status        public.contribution_task_status,
  difficulty    public.contribution_task_difficulty,
  tags          text[],
  assigned_name text,
  sort_order    integer,
  created_at    timestamptz,
  updated_at    timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.id, t.title, t.summary, t.body_markdown, t.status, t.difficulty,
    t.tags, t.assigned_name, t.sort_order, t.created_at, t.updated_at
  FROM public.contribution_tasks t
  ORDER BY t.sort_order ASC, t.created_at ASC;
$$;

REVOKE EXECUTE ON FUNCTION public.get_public_contribution_tasks() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_contribution_tasks()
  TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_public_contribution_task(p_id uuid)
RETURNS TABLE (
  id            uuid,
  title         text,
  summary       text,
  body_markdown text,
  status        public.contribution_task_status,
  difficulty    public.contribution_task_difficulty,
  tags          text[],
  assigned_name text,
  sort_order    integer,
  created_at    timestamptz,
  updated_at    timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.id, t.title, t.summary, t.body_markdown, t.status, t.difficulty,
    t.tags, t.assigned_name, t.sort_order, t.created_at, t.updated_at
  FROM public.contribution_tasks t
  WHERE t.id = p_id;
$$;

REVOKE EXECUTE ON FUNCTION public.get_public_contribution_task(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_contribution_task(uuid)
  TO anon, authenticated;

-- ── admin RPCs ───────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.admin_list_contribution_tasks()
RETURNS TABLE (
  id                uuid,
  title             text,
  summary           text,
  body_markdown     text,
  status            public.contribution_task_status,
  difficulty        public.contribution_task_difficulty,
  tags              text[],
  assigned_name     text,
  application_count bigint,
  sort_order        integer,
  created_at        timestamptz,
  updated_at        timestamptz
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
      t.tags, t.assigned_name,
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

-- Insert (p_id NULL) or update (p_id set) a task. Returns the row.
CREATE OR REPLACE FUNCTION public.admin_save_contribution_task(
  p_id            uuid,
  p_title         text,
  p_summary       text,
  p_body_markdown text,
  p_status        public.contribution_task_status,
  p_difficulty    public.contribution_task_difficulty,
  p_tags          text[]
)
RETURNS public.contribution_tasks
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.contribution_tasks;
  v_next_order integer;
BEGIN
  PERFORM public.assert_caller_is_admin();

  IF p_id IS NULL THEN
    SELECT COALESCE(max(sort_order), -1) + 1
      INTO v_next_order
      FROM public.contribution_tasks;

    INSERT INTO public.contribution_tasks (
      title, summary, body_markdown, status, difficulty, tags, sort_order
    )
    VALUES (
      p_title, p_summary, p_body_markdown, p_status, p_difficulty,
      COALESCE(p_tags, '{}'), v_next_order
    )
    RETURNING * INTO v_row;
  ELSE
    UPDATE public.contribution_tasks
       SET title         = p_title,
           summary       = p_summary,
           body_markdown = p_body_markdown,
           status        = p_status,
           difficulty    = p_difficulty,
           tags          = COALESCE(p_tags, '{}')
     WHERE id = p_id
    RETURNING * INTO v_row;

    IF v_row.id IS NULL THEN
      RAISE EXCEPTION 'contribution task % not found', p_id
        USING ERRCODE = 'P0002';
    END IF;
  END IF;

  RETURN v_row;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_save_contribution_task(
  uuid, text, text, text, public.contribution_task_status,
  public.contribution_task_difficulty, text[]
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_save_contribution_task(
  uuid, text, text, text, public.contribution_task_status,
  public.contribution_task_difficulty, text[]
) TO authenticated;

-- Hand a task to someone (usually an applicant), or clear the
-- assignment with NULL. Independent from status on purpose.
CREATE OR REPLACE FUNCTION public.admin_assign_contribution_task(
  p_task_id       uuid,
  p_assigned_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.assert_caller_is_admin();

  UPDATE public.contribution_tasks
     SET assigned_name = NULLIF(btrim(p_assigned_name), '')
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

CREATE OR REPLACE FUNCTION public.admin_delete_contribution_task(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.assert_caller_is_admin();
  DELETE FROM public.contribution_tasks WHERE id = p_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_delete_contribution_task(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_delete_contribution_task(uuid)
  TO authenticated;

-- Reorder the whole board: set sort_order to each id's position in
-- the passed array.
CREATE OR REPLACE FUNCTION public.admin_reorder_contribution_tasks(
  p_ordered_ids uuid[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.assert_caller_is_admin();

  UPDATE public.contribution_tasks AS t
     SET sort_order = ord.pos
    FROM (
      SELECT id, (idx - 1) AS pos
      FROM unnest(p_ordered_ids) WITH ORDINALITY AS u(id, idx)
    ) AS ord
   WHERE t.id = ord.id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_reorder_contribution_tasks(uuid[])
  FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_reorder_contribution_tasks(uuid[])
  TO authenticated;

-- Admin: applicants for a task, newest first.
CREATE OR REPLACE FUNCTION public.admin_list_contribution_task_applications(
  p_task_id uuid
)
RETURNS TABLE (
  id              uuid,
  applicant_name  text,
  applicant_email text,
  message         text,
  created_at      timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.assert_caller_is_admin();
  RETURN QUERY
    SELECT a.id, a.applicant_name, a.applicant_email, a.message, a.created_at
    FROM public.contribution_task_applications a
    WHERE a.task_id = p_task_id
    ORDER BY a.created_at DESC;
END;
$$;

REVOKE EXECUTE ON FUNCTION
  public.admin_list_contribution_task_applications(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION
  public.admin_list_contribution_task_applications(uuid) TO authenticated;
