"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { messageSlackUsers } from "@/utils/slack/client";
import { SITE_URL, assignmentMessage } from "@/utils/slack/messages";
import {
  adminContributionTaskSchema,
  contributionTaskApplicationSchema,
  type AdminContributionTask,
  type ContributionDifficulty,
  type ContributionStatus,
  type ContributionTaskApplication,
} from "@/constants/contribution-board";

// Cookie-authed reads/writes over SECURITY DEFINER RPCs; the SQL
// `assert_caller_is_admin()` gate throws for non-admins rather than leaking data.

export interface SaveContributionTaskInput {
  id: string | null;
  title: string;
  summary: string;
  bodyMarkdown: string;
  status: ContributionStatus;
  difficulty: ContributionDifficulty;
  tags: string[];
}

export async function listContributionTasks(): Promise<AdminContributionTask[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("admin_list_contribution_tasks");
  if (error) throw new Error(error.message);
  return adminContributionTaskSchema.array().parse(data ?? []);
}

export async function saveContributionTask(input: SaveContributionTaskInput): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("admin_save_contribution_task", {
    p_id: input.id,
    p_title: input.title,
    p_summary: input.summary,
    p_body_markdown: input.bodyMarkdown,
    p_status: input.status,
    p_difficulty: input.difficulty,
    p_tags: input.tags,
  });
  if (error) throw new Error(error.message);
}

export async function assignContributionTask(taskId: string, assignedName: string | null): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("admin_assign_contribution_task", {
    p_task_id: taskId,
    p_assigned_name: assignedName,
  });
  if (error) throw new Error(error.message);
}

export async function deleteContributionTask(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("admin_delete_contribution_task", { p_id: id });
  if (error) throw new Error(error.message);
}

export async function reorderContributionTasks(orderedIds: string[]): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("admin_reorder_contribution_tasks", {
    p_ordered_ids: orderedIds,
  });
  if (error) throw new Error(error.message);
}

export async function listTaskApplications(taskId: string): Promise<ContributionTaskApplication[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("admin_list_contribution_task_applications", {
    p_task_id: taskId,
  });
  if (error) throw new Error(error.message);
  return contributionTaskApplicationSchema.array().parse(data ?? []);
}

interface AssignRpcResult {
  status: "assigned" | "not_found" | "closed";
  task_id?: string;
  task_title?: string;
  assignee_name?: string;
  assignee_slack_user_id?: string | null;
  admin_slack_user_id?: string | null;
}

/**
 * Assign a listed applicant and introduce them to the assigning organizer
 * on Slack. Returns an error message rather than throwing, since Next
 * redacts thrown server-action errors in production.
 */
export async function assignApplication(applicationId: string): Promise<{ error: string | null }> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("admin_assign_application", { p_application_id: applicationId });
  if (error) {
    if (error.code === "42501") return { error: "Not authorized." };
    console.error("[assignApplication] rpc failed:", error.message);
    return { error: "Couldn't assign that applicant." };
  }

  const result = data as AssignRpcResult;
  if (result.status === "not_found") return { error: "Application not found." };
  if (result.status === "closed") return { error: "This task is already marked done. Reopen it before assigning." };

  await notifyAssignment(result, `${SITE_URL}/tasks/${result.task_id}`);
  return { error: null };
}

/**
 * Tell the assignee they're on it: a group DM with the organizer when
 * possible, else a 1:1 DM naming them. Best-effort; never throws, since the
 * assignment is already committed.
 */
async function notifyAssignment(result: AssignRpcResult, taskUrl: string): Promise<void> {
  const assigneeSlackId = result.assignee_slack_user_id ?? null;
  if (!assigneeSlackId) return;

  const adminSlackId = result.admin_slack_user_id ?? null;
  // A group DM needs a second, different person; self-assignment has no one to group with.
  const groupWith = adminSlackId && adminSlackId !== assigneeSlackId ? adminSlackId : null;

  const base = {
    taskTitle: result.task_title ?? "a task",
    taskUrl,
    assigneeSlackId,
    assigneeName: result.assignee_name ?? "you",
  };

  if (groupWith) {
    const failure = await messageSlackUsers(
      [groupWith, assigneeSlackId],
      assignmentMessage({ ...base, adminSlackId: groupWith, grouped: true }),
    );
    if (!failure) return;
    console.error(`[assignApplication] group DM failed, falling back to solo DM: ${failure}`);
  }

  await messageSlackUsers([assigneeSlackId], assignmentMessage({ ...base, adminSlackId: groupWith, grouped: false }));
}
