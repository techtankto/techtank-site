import { createClient } from "@/utils/supabase/client";

/**
 * Assign a specific applicant to their task.
 *
 * Unlike the other admin mutations (plain `"use server"` actions in
 * `actions.ts`), this one calls the `assign-task` edge function directly
 * from the browser, forwarding the organizer's own JWT. The function
 * needs that identity to open the Slack group DM that introduces the
 * applicant to the assigning organizer — a server action running as the
 * service role couldn't. Throws with a human-readable message on
 * failure so the caller can surface it inline.
 */
export async function assignApplication(applicationId: string): Promise<void> {
  const {
    data: { session },
  } = await createClient().auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error("Your session expired. Sign in again.");

  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/assign-task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ application_id: applicationId }),
  });

  const body = (await res.json()) as { ok?: boolean; error?: string };
  if (!res.ok || !body.ok) {
    throw new Error(body.error ?? "Couldn't assign that applicant.");
  }
}
