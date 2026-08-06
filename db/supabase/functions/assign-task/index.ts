/**
 * assign-task — an organizer assigns an applicant to a task.
 *
 * The state change (set assignee, move to in_progress) is done in SQL
 * by `admin_assign_application`, which asserts the caller is an admin,
 * so this function can't be a weaker gate. What it adds is the Slack
 * introduction: a group DM between the bot, the contributor, and the
 * assigning organizer, so the two of them can start talking straight
 * away.
 *
 * The group DM needs `mpim:write`. If that's missing (or the organizer
 * has no Slack id) it falls back to a 1:1 DM to the contributor that
 * names the organizer, so the contributor is always told either way.
 * The Slack step can never fail the request — the assignment is already
 * committed.
 */

import { createCallerClient } from "../_shared/supabase.ts";
import { HttpError, servePost } from "../_shared/http.ts";
import { messageSlackUsers } from "../_shared/slack.ts";
import { assignmentMessage } from "../_shared/slack-messages.ts";

const SITE_URL = Deno.env.get("PUBLIC_SITE_URL") ?? "https://www.techtankto.com";

interface AssignResult {
  status: "assigned" | "not_found";
  task_id?: string;
  task_title?: string;
  assignee_name?: string;
  assignee_slack_user_id?: string | null;
  admin_slack_user_id?: string | null;
}

/**
 * Tell the contributor they're on it. Prefer a group DM that also
 * includes the assigning organizer; fall back to a 1:1 DM (naming the
 * organizer) when there's no one to group with or the group DM fails.
 * Best-effort: the assignment is already committed, so this never throws.
 */
async function notifyAssignment(result: AssignResult, taskUrl: string): Promise<void> {
  const assigneeSlackId = result.assignee_slack_user_id ?? null;
  if (!assigneeSlackId) return; // no one to reach

  const adminSlackId = result.admin_slack_user_id ?? null;
  // A group DM only makes sense with a second, different person. Assigning
  // yourself (or an organizer with no Slack id) has no one to group with.
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
    if (!failure) return; // group DM landed; done
    console.error(`[assign-task] group DM failed, falling back to solo DM: ${failure}`);
  }

  // Solo DM: no group possible, or the group DM failed. `groupWith` also
  // decides whether to name the organizer (null on self-assignment).
  await messageSlackUsers([assigneeSlackId], assignmentMessage({ ...base, adminSlackId: groupWith, grouped: false }));
}

servePost("assign-task", async (req) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) throw new HttpError(401, "Not authorized");

  const { application_id: applicationId } = (await req.json()) as { application_id?: string };
  if (!applicationId) throw new HttpError(400, "application_id is required");

  const caller = createCallerClient(authHeader);
  const { data, error } = await caller.rpc("admin_assign_application", { p_application_id: applicationId });
  if (error) {
    if (error.code === "42501") throw new HttpError(403, "Not authorized");
    throw error;
  }

  const result = data as AssignResult;
  if (result.status === "not_found") throw new HttpError(404, "Application not found");

  await notifyAssignment(result, `${SITE_URL}/tasks/${result.task_id}`);
  return { ok: true };
});
