"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { dmSlackUser, notifySlack } from "@/utils/slack/client";
import { SITE_URL, applicationNotification, applicationReceiptDm } from "@/utils/slack/messages";

interface ApplyRpcResult {
  status: "applied" | "already_applied" | "closed" | "not_found" | "wrong_workspace";
  task_title?: string;
  applicant_name?: string;
  slack_user_id?: string;
}

/**
 * Outcome of an apply. Returned rather than thrown: Next redacts thrown
 * server-action errors in production, and the panel needs these messages.
 */
export type ApplyResult = { status: "applied" | "closed" } | { status: "error"; message: string };

/**
 * A signed-in Slack member applies to a task. Authorization is entirely in
 * `apply_to_contribution_task`, which runs as the cookie session's user and
 * enforces identity, workspace, the open/unassigned rule, and dedupe. This
 * only adds the Slack receipt and organizer alert, which never fail the
 * request: the row is committed before they run.
 */
export async function applyToTask(taskId: string, message: string): Promise<ApplyResult> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("apply_to_contribution_task", {
    p_task_id: taskId,
    p_message: message,
  });
  if (error) {
    // 42501 is the "not signed in" guard inside the function.
    if (error.code === "42501") return { status: "error", message: "Please connect Slack to apply." };
    console.error("[applyToTask] rpc failed:", error.message);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  const result = data as ApplyRpcResult;
  switch (result.status) {
    case "not_found":
      return { status: "error", message: "Task not found." };
    case "wrong_workspace":
      return { status: "error", message: "That Slack account isn't in the TechTank workspace." };
    case "closed":
      return { status: "closed" };
    case "already_applied":
      return { status: "applied" };
  }

  // DM the applicant first so the organizer alert can report whether the receipt landed.
  const title = result.task_title ?? "a task";
  const taskUrl = `${SITE_URL}/tasks/${taskId}`;
  const dmFailure = result.slack_user_id
    ? await dmSlackUser(
        result.slack_user_id,
        applicationReceiptDm({ taskTitle: title, taskUrl, browseUrl: `${SITE_URL}/tasks` }),
      )
    : "no Slack id on the application";

  await notifySlack(
    applicationNotification({
      taskTitle: title,
      taskUrl,
      adminUrl: `${SITE_URL}/admin/tasks`,
      applicantSlackId: result.slack_user_id ?? null,
      applicantName: result.applicant_name ?? "Someone",
      note: message,
      dmFailure,
    }),
  );

  return { status: "applied" };
}
