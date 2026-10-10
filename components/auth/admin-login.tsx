"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SlackIcon } from "@/components/ui/icons";
import { createClient } from "@/utils/supabase/client";

// Only pre-selects the workspace on Slack's consent screen; the real check is server-side.
const SLACK_TEAM_ID = process.env.NEXT_PUBLIC_SLACK_TEAM_ID;

/**
 * Only follow a same-origin `?redirect=` path — otherwise an open redirect
 * (`https://evil.example`, `javascript:`, or protocol-relative `//host`)
 * could carry a freshly authenticated organizer off-site.
 */
function safeRedirect(value: string | null): string {
  const fallback = "/admin/tasks";
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

/** Organizer sign-in — Slack is the only route in (no password, no email). */
export function AdminLogin() {
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get("redirect"));

  // The OAuth callback bounces failures back here as ?error=.
  const [error, setError] = useState<string | null>(searchParams.get("error"));
  const [loading, setLoading] = useState(false);

  const signInWithSlack = async () => {
    setError(null);
    setLoading(true);

    const callback = new URL("/auth/callback", window.location.origin);
    callback.searchParams.set("next", redirectTo);

    const { error: oauthError } = await createClient().auth.signInWithOAuth({
      provider: "slack_oidc",
      options: {
        redirectTo: callback.toString(),
        queryParams: SLACK_TEAM_ID ? { team: SLACK_TEAM_ID } : undefined,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <span className="font-display text-2xl font-bold text-foreground">
          TechTank<span className="text-ring"> Admin</span>
        </span>
      </div>

      <div className="glass rounded-2xl p-8 text-center">
        <span className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <SlackIcon className="size-5" />
        </span>

        <h1 className="font-display text-xl font-semibold text-foreground">Sign in with Slack</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The back office is for TechTank organizers. Sign in with the Slack account you use in our workspace.
        </p>

        {error && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button onClick={signInWithSlack} disabled={loading} className="mt-6 w-full">
          <SlackIcon className="mr-2 size-4" />
          {loading ? "Opening Slack…" : "Continue with Slack"}
        </Button>

        <p className="mt-4 text-xs text-muted-foreground">
          Not an organizer?{" "}
          <a href="/tasks" className="text-ring underline">
            Browse tasks
          </a>{" "}
          instead.
        </p>
      </div>
    </div>
  );
}
