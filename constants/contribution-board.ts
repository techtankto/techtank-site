/**
 * Shared vocabulary for the contribution board — the public list of
 * concrete tasks people can pick up to help run TechTank. The DB
 * stores slugs; this module is the single source of truth mapping
 * those slugs to labels, so the board, the admin editor, and any
 * validation all agree. Growing the tag set is a one-line edit here
 * (tags are app-validated, not a DB enum).
 */

// ── status ───────────────────────────────────────────────────

export const CONTRIBUTION_STATUSES = ["open", "in_progress", "done"] as const;
export type ContributionStatus = (typeof CONTRIBUTION_STATUSES)[number];

export const CONTRIBUTION_STATUS_LABEL: Record<ContributionStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  done: "Done",
};

// ── difficulty ───────────────────────────────────────────────

export const CONTRIBUTION_DIFFICULTIES = ["quick_win", "two_hours", "a_few_hours", "bigger_project"] as const;
export type ContributionDifficulty = (typeof CONTRIBUTION_DIFFICULTIES)[number];

export const CONTRIBUTION_DIFFICULTY_LABEL: Record<ContributionDifficulty, string> = {
  quick_win: "Quick win",
  two_hours: "Small",
  a_few_hours: "Medium",
  bigger_project: "Large",
};

/** Expected time investment, shown alongside the label so the four
 * tiers read at a glance. */
export const CONTRIBUTION_DIFFICULTY_DURATION: Record<ContributionDifficulty, string> = {
  quick_win: "<1h",
  two_hours: "1-3h",
  a_few_hours: "3-8h",
  bigger_project: "multi-session",
};

// ── tags (disciplines) ───────────────────────────────────────
// A mix of creative, organizing, and engineering disciplines that
// fit a dev/tech community.

export const CONTRIBUTION_TAGS = [
  "photography",
  "videography",
  "video_editing",
  "design",
  "illustration",
  "social_media_strategy",
  "copywriting",
  "branding",
  "hosting",
  "logistics",
  "frontend",
  "backend",
  "web_dev",
  "data",
  "ai_ml",
  "devops",
  "documentation",
] as const;
export type ContributionTag = (typeof CONTRIBUTION_TAGS)[number];

export const CONTRIBUTION_TAG_LABEL: Record<ContributionTag, string> = {
  photography: "Photography",
  videography: "Videography",
  video_editing: "Video editing",
  design: "Design",
  illustration: "Illustration",
  social_media_strategy: "Social media strategy",
  copywriting: "Copywriting",
  branding: "Branding",
  hosting: "Hosting",
  logistics: "Logistics",
  frontend: "Frontend",
  backend: "Backend",
  web_dev: "Web dev",
  data: "Data",
  ai_ml: "AI / ML",
  devops: "DevOps",
  documentation: "Documentation",
};

function isContributionTag(value: string): value is ContributionTag {
  return (CONTRIBUTION_TAGS as readonly string[]).includes(value);
}

export function contributionTagLabel(value: string): string {
  return isContributionTag(value) ? CONTRIBUTION_TAG_LABEL[value] : value;
}

// ── task shapes ──────────────────────────────────────────────

/** Public task shape (the `get_public_contribution_task(s)` RPCs).
 * Carries the assignee's display name only — no internal ids. */
export interface ContributionTask {
  id: string;
  title: string;
  summary: string;
  body_markdown: string;
  status: ContributionStatus;
  difficulty: ContributionDifficulty;
  tags: string[];
  assigned_name: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** Admin task shape — adds the applicant count. */
export interface AdminContributionTask extends ContributionTask {
  application_count: number;
}

/** One applicant row (admin-only). */
export interface ContributionTaskApplication {
  id: string;
  applicant_name: string;
  applicant_email: string;
  message: string;
  /** Slack user id, when the applicant connected Slack. Enables the
   * DM deep link in the admin panel. */
  slack_user_id: string | null;
  created_at: string;
}

/**
 * Whether a task is taking applications right now. Assigning a task
 * moves it to `in_progress` (see `admin_assign_contribution_task`), so
 * status alone is the gate; the assignee check is belt-and-braces for
 * any row written before that rule existed.
 */
export function isTakingApplications(task: Pick<ContributionTask, "status" | "assigned_name">): boolean {
  return task.status === "open" && task.assigned_name === null;
}
