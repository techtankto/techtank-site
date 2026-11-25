"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SlackIcon } from "@/components/ui/icons";
import { signInWithSlack } from "@/utils/supabase/auth";
import { safeRedirect } from "@/utils/safe-redirect";
import { LoginLayout } from "./login-layout";

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
    <LoginLayout
      title="Sign in with Slack"
      description="The back office is for TechTank organizers. Sign in with the Slack account you use in our workspace."
      topIcon={<SlackIcon className="size-5" />}
      error={error}
    >
      <Button onClick={onSubmit} disabled={loading} className="mt-6 w-full">
        <SlackIcon className="mr-2 size-4" />
        {loading ? "Opening Slack…" : "Continue with Slack"}
      </Button>
    </LoginLayout>
  );
}
