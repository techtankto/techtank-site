// Shared vocabulary and row schemas for the task board. Growing the tag
// set is a one-line edit here (tags are app-validated, not a DB enum).

import { z } from "zod";

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

// ── row schemas ──────────────────────────────────────────────
// These validate RPC responses at runtime (see the actions files) and
// are the source of the row types.

export const contributionTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  body_markdown: z.string(),
  status: z.enum(CONTRIBUTION_STATUSES),
  difficulty: z.enum(CONTRIBUTION_DIFFICULTIES),
  tags: z.array(z.string()),
  assigned_name: z.string().nullable(),
  sort_order: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type ContributionTask = z.infer<typeof contributionTaskSchema>;

export const adminContributionTaskSchema = contributionTaskSchema.extend({
  // Set when the assignee is a listed applicant; null for a hand-typed name.
  assigned_application_id: z.string().nullable(),
  application_count: z.coerce.number(),
});
export type AdminContributionTask = z.infer<typeof adminContributionTaskSchema>;

export const contributionTaskApplicationSchema = z.object({
  id: z.string(),
  applicant_name: z.string(),
  applicant_email: z.string(),
  message: z.string(),
  slack_user_id: z.string().nullable(),
  created_at: z.string(),
});
export type ContributionTaskApplication = z.infer<typeof contributionTaskApplicationSchema>;

/** Whether a task is taking applications right now. The assignee check is
 * belt-and-braces — assigning already moves a task off `open`. */
export function isTakingApplications(task: Pick<ContributionTask, "status" | "assigned_name">): boolean {
  return task.status === "open" && task.assigned_name === null;
}
