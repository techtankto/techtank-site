/**
 * apply-to-task — a signed-in Slack member applies to a task.
 *
 * The function does NOT decide who may apply. It forwards the caller's
 * own JWT to `apply_to_contribution_task`, which enforces identity,
 * workspace membership, the open/unassigned rule and de-duplication in
 * SQL. That keeps one gate rather than two that can drift apart, and
 * means this function can't be a weaker back door.
 *
 * What it owns is notification, which Postgres shouldn't be doing:
 *   - tells the organizers in Slack, @-mentioning the applicant so the
 *     mention is clickable straight to a DM
 *   - DMs the applicant their receipt
 *
 * Slack is the only channel: TechTank sends no email at all. Neither
 * call can fail the request, because the row is already committed and
 * losing a notification must never lose an application.
 */

import { createCallerClient } from "../_shared/supabase.ts";
import { HttpError, servePost } from "../_shared/http.ts";
import { notifySlack, dmSlackUser } from "../_shared/slack.ts";
import { applicationNotification, applicationReceiptDm } from "../_shared/slack-messages.ts";

const SITE_URL = Deno.env.get("PUBLIC_SITE_URL") ?? "https://www.techtankto.com";

interface ApplyResult {
  status: "applied" | "already_applied" | "closed" | "not_found" | "wrong_workspace";
  task_title?: string;
  applicant_name?: string;
  applicant_email?: string;
  slack_user_id?: string;
}

servePost("apply-to-task", async (req) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) throw new HttpError(401, "Please connect Slack to apply.");

  const { task_id: taskId, message } = (await req.json()) as { task_id?: string; message?: string };
  if (!taskId) throw new HttpError(400, "task_id is required");

  // Runs as the caller, so RLS and the SECURITY DEFINER gate see their
  // real identity rather than the service role.
  const caller = createCallerClient(authHeader);
  const { data, error } = await caller.rpc("apply_to_contribution_task", {
    p_task_id: taskId,
    p_message: message ?? "",
  });
  if (error) {
    // 42501 is the "not signed in" guard inside the function.
    if (error.code === "42501") throw new HttpError(401, "Please connect Slack to apply.");
    throw error;
  }

  const result = data as ApplyResult;
  switch (result.status) {
    case "not_found":
      throw new HttpError(404, "Task not found");
    case "wrong_workspace":
      throw new HttpError(403, "That Slack account isn't in the TechTank workspace.");
    case "closed":
      throw new HttpError(409, "This task is no longer taking applications.");
    case "already_applied":
      return { ok: true, already_applied: true };
  }

  // Fresh application: tell everyone, but never at the cost of the
  // request that already succeeded. DM the applicant first so the
  // organizer message can report whether their receipt landed — a
  // missing scope or revoked token would otherwise leave them
  // un-messaged with nobody the wiser.
  const title = result.task_title ?? "a task";
  const taskUrl = `${SITE_URL}/tasks/${taskId}`;

  const dmFailure = result.slack_user_id
    ? await dmSlackUser(result.slack_user_id, applicationReceiptDm({ taskTitle: title, taskUrl, browseUrl: `${SITE_URL}/tasks` }))
    : "no Slack id on the application";

  await notifySlack(
    applicationNotification({
      taskTitle: title,
      taskUrl,
      adminUrl: `${SITE_URL}/admin/tasks`,
      applicantSlackId: result.slack_user_id ?? null,
      applicantName: result.applicant_name ?? "Someone",
      note: message ?? "",
      dmFailure,
    }),
  );

  return { ok: true, already_applied: false };
});
