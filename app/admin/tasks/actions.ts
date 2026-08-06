"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import type {
  AdminContributionTask,
  ContributionDifficulty,
  ContributionStatus,
  ContributionTaskApplication,
} from "@/constants/contribution-board";

/**
 * Admin back-office mutations/reads. Each runs against a cookie-authed
 * Supabase client, so the SECURITY DEFINER RPCs see the caller's
 * identity and `assert_caller_is_admin()` gates every one at the SQL
 * boundary. A non-admin caller gets a thrown error, never data.
 */

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
  return (data ?? []) as AdminContributionTask[];
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
  return (data ?? []) as ContributionTaskApplication[];
}
