import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * OAuth landing point for Sign in with Slack: exchange the PKCE `code` for a
 * session cookie, then claim the admin membership.
 */

// Validate `next` as a same-origin path — it's URL-supplied, so trusting it would be an open redirect.
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

  // Slack sends an error back when the user cancels or the app isn't authorised.
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

  // Bind this account to its `admins` row; non-organizers no-op and the layout turns them away.
  await supabase.rpc("claim_admin_membership");

  return NextResponse.redirect(`${origin}${next}`);
}
