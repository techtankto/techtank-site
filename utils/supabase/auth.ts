import { createClient } from "./client";

// Only pre-selects the workspace on Slack's consent screen; the real check is server-side.
const SLACK_TEAM_ID = process.env.NEXT_PUBLIC_SLACK_TEAM_ID;

export async function signInWithEmail(options: { email: string; password: string; destination: URL }) {
  if (process.env.NODE_ENV !== "development" || !!SLACK_TEAM_ID) {
    throw new Error("Email login is for local dev server only when slack is not configured.");
  }
  const { error } = await createClient().auth.signInWithPassword({
    email: options.email,
    password: options.password,
  });

  if (error) {
    throw error;
  }

  window.location.href = options.destination.toString();
}

export async function signInWithSlack(options: { destination: URL }) {
  if (!SLACK_TEAM_ID) {
    throw new Error("Slack team ID is required for slack login.");
  }

  const redirectTo = new URL("/auth/callback", window.location.origin);
  redirectTo.searchParams.set("next", options.destination.toString());

  const { error } = await createClient().auth.signInWithOAuth({
    provider: "slack_oidc",
    options: {
      redirectTo: redirectTo.toString(),
      queryParams: SLACK_TEAM_ID ? { team: SLACK_TEAM_ID } : undefined,
    },
  });

  if (error) {
    throw error;
  }
}
