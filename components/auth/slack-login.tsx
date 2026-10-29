"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SlackIcon } from "@/components/ui/icons";
import { signInWithSlack } from "@/utils/supabase/auth";
import { LoginLayout } from "./login-layout";

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

export function SlackLogin() {
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get("redirect"));

  // The OAuth callback bounces failures back here as ?error=.
  const [error, setError] = useState<string | null>(searchParams.get("error"));
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const destination = new URL(redirectTo, window.location.origin);
      await signInWithSlack({ destination });
    } catch (error) {
      setError(String(error));
    }
    setLoading(false);
  };

  return (
    <LoginLayout title="Sign in with Slack" topIcon={<SlackIcon className="size-5" />} error={error}>
      <Button onClick={onSubmit} disabled={loading} className="mt-6 w-full">
        <SlackIcon className="mr-2 size-4" />
        {loading ? "Opening Slack…" : "Continue with Slack"}
      </Button>
    </LoginLayout>
  );
}
