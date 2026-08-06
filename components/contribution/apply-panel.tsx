"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SlackIcon } from "@/components/ui/icons";
import { createClient } from "@/utils/supabase/client";
import { isTakingApplications, type ContributionTask } from "@/constants/contribution-board";

interface ApplyPanelProps {
  task: ContributionTask;
}

/** Workspace to pre-select on Slack's consent screen. The real check
 * runs in SQL against the team_id claim. */
const SLACK_TEAM_ID = process.env.NEXT_PUBLIC_SLACK_TEAM_ID;

function closedCopy(task: ContributionTask): string {
  if (task.status === "done") {
    return "This one is finished. Thanks to everyone who pitched in. There's plenty more on the board.";
  }
  if (task.assigned_name) {
    return `${task.assigned_name} is on this one. Browse the board for another task, or reach out with an idea of your own.`;
  }
  return "Someone is already on this one. Browse the board for another task, or reach out with an idea of your own.";
}

/** Best display name Slack gave us, falling back to the email local part. */
function displayName(session: Session): string {
  const meta = session.user.user_metadata ?? {};
  const name = (meta.full_name ?? meta.name ?? meta.preferred_username) as string | undefined;
  return name?.trim() || (session.user.email ?? "").split("@")[0];
}

/**
 * The apply affordance on a task detail page.
 *
 * Applying requires connecting Slack, which is what proves the person
 * is part of the community. It also means we never ask for a name or
 * an email: both come from the verified token, so nobody can apply as
 * someone else, and the form is one field shorter than it used to be.
 */
export function ApplyPanel({ task }: ApplyPanelProps) {
  // Defaults to the signed-out state rather than a spinner: that's the
  // common case, it puts the page's dominant CTA in the server-rendered
  // HTML, and a signed-in visitor simply swaps to the form on mount.
  const [session, setSession] = useState<Session | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [closedByServer, setClosedByServer] = useState(false);

  // Resolve the session, then ask the server whether this person has
  // already applied — authoritative, unlike the old localStorage flag
  // which was per-browser rather than per-person.
  useEffect(() => {
    let active = true;
    const supabase = createClient();

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session) {
        const { data: applied } = await supabase.rpc("has_applied_to_contribution_task", {
          p_task_id: task.id,
        });
        if (active && applied === true) setSubmitted(true);
      }
    });

    return () => {
      active = false;
    };
  }, [task.id]);

  const connectSlack = useCallback(async () => {
    setError(null);
    const callback = new URL("/auth/callback", window.location.origin);
    callback.searchParams.set("next", `/tasks/${task.id}`);

    const { error: oauthError } = await createClient().auth.signInWithOAuth({
      provider: "slack_oidc",
      options: {
        redirectTo: callback.toString(),
        queryParams: SLACK_TEAM_ID ? { team: SLACK_TEAM_ID } : undefined,
      },
    });
    if (oauthError) setError(oauthError.message);
  }, [task.id]);

  if (!isTakingApplications(task) || closedByServer) {
    return (
      <aside className="glass rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">
          {task.status === "done" ? "This one is done" : "Already claimed"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{closedCopy(task)}</p>
        <Button variant="outline" size="sm" asChild className="mt-4">
          <Link href="/tasks">Back to the board</Link>
        </Button>
      </aside>
    );
  }

  if (submitted) {
    return (
      <aside className="glass rounded-2xl p-6 text-center">
        <span className="mx-auto mb-3 inline-flex size-11 items-center justify-center rounded-full bg-success text-success-foreground">
          <Check className="size-5" />
        </span>
        <h2 className="font-display text-lg font-semibold text-foreground">Thank you for stepping up.</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This is exactly how TechTank gets built. Our bot, Tanky, will message you on Slack to get you started. Nothing
          begins until then, so there&rsquo;s nothing you need to do right now.
        </p>
      </aside>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { data } = await createClient().auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Your session expired. Connect Slack again to apply.");

      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/apply-to-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ task_id: task.id, message }),
      });

      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (res.status === 409) {
        setClosedByServer(true);
        return;
      }
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="glass rounded-2xl p-6">
      <h2 className="font-display text-lg font-semibold text-foreground">Want to take this on?</h2>

      {session ? (
        <>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Applying as <span className="font-medium text-foreground">{displayName(session)}</span>. Nothing starts
            until we confirm, so there&rsquo;s no pressure in raising your hand.
          </p>
          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="apply-message" className="text-sm font-medium text-foreground">
                Anything we should know? <span className="text-muted-foreground">(optional)</span>
              </label>
              <Textarea
                id="apply-message"
                value={message}
                rows={3}
                placeholder="Relevant work, availability, questions…"
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" size="sm" disabled={submitting} className="w-full">
              {submitting ? "Applying…" : "Apply for this task"}
            </Button>
          </form>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Tasks go to people in the TechTank Slack, so connect your account to apply. We&rsquo;ll only read your name
            and email, and Tanky will message you on Slack about the task.
          </p>

          {error && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button onClick={connectSlack} className="mt-5 w-full">
            <SlackIcon className="mr-2 size-4" />
            Continue with Slack
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Not in our Slack yet?{" "}
            <a href="/links/slack" className="text-ring underline">
              Join here
            </a>
            , then come back.
          </p>
        </>
      )}
    </aside>
  );
}
