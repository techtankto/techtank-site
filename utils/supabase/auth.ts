import { createClient } from "./client";

// Only pre-selects the workspace on Slack's consent screen; the real check is server-side.
const SLACK_TEAM_ID = process.env.NEXT_PUBLIC_SLACK_TEAM_ID;

export async function signInWithEmail(options: { email: string; password: string; destination: URL }) {
  if (process.env.NODE_ENV !== "development" || !!SLACK_TEAM_ID) {
    throw new Error("Email login is for local dev server only when slack is not configured.");
  }
  const client = createClient();
  const { error } = await client.auth.signInWithPassword({
    email: options.email,
    password: options.password,
  });

  if (error) {
    throw error;
  }

  // A Slack sign-in claims the `admins` row in the OAuth callback route.
  // A password sign-in never passes through it, so claim here instead,
  // or an allowlisted organizer lands on "Not authorized" forever.
  const { error: claimError } = await client.rpc("claim_admin_membership");
  if (claimError) {
    console.error("claim_admin_membership failed", claimError);
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
