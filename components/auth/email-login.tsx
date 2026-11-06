"use client";

import { MailIcon } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signInWithEmail } from "@/utils/supabase/auth";
import { LoginLayout } from "./login-layout";
import { Input } from "../ui/input";

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

export function EmailLogin() {
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get("redirect"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(searchParams.get("error"));
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const destination = new URL(redirectTo, window.location.origin);
      await signInWithEmail({ email, password, destination });
    } catch (error) {
      setError(String(error));
    }
    setLoading(false);
  };

  return (
    <LoginLayout title="Sign in with Email" topIcon={<MailIcon className="size-5" />} error={error}>
      <Input
        className="mt-2"
        name="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        className="mt-2"
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={onSubmit} disabled={loading} className="mt-6 w-full">
        <MailIcon className="mr-2 size-4" />
        {loading ? "Loading…" : "Continue with Email"}
      </Button>
    </LoginLayout>
  );
}
