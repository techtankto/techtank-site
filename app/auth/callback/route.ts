import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * OAuth landing point for Sign in with Slack.
 *
 * Supabase's browser client uses PKCE, so the provider redirects back
 * here with a `code` that has to be exchanged for a session before any
 * cookie exists. Only then can the admin layout ask the database
 * whether this person is an organizer.
 *
 * `next` is validated as a same-origin path: it arrives in the URL, so
 * treating it as trusted would be an open redirect on a page the user
 * has just authenticated against.
 */
function safeNext(value: string | null): string {
  const fallback = "/admin/tasks";
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  // Slack sends the user back with an error when they cancel or the
  // app isn't authorised for the workspace.
  const providerError = searchParams.get("error_description") ?? searchParams.get("error");
  if (providerError) {
    return NextResponse.redirect(`${origin}/admin/login?error=${encodeURIComponent(providerError)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=${encodeURIComponent("Sign-in was interrupted.")}`);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  // Bind this account to its `admins` row (and record the Slack ids).
  // Non-organizers simply get `false` and the layout turns them away.
  await supabase.rpc("claim_admin_membership");

  return NextResponse.redirect(`${origin}${next}`);
}
