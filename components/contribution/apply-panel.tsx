"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SlackIcon } from "@/components/ui/icons";
import { createClient } from "@/utils/supabase/client";
import { useMutation } from "@/hooks/use-mutation";
import { applyToTask } from "@/app/(site)/tasks/[id]/actions";
import { isTakingApplications, type ContributionTask } from "@/constants/contribution-board";

interface ApplyPanelProps {
  task: ContributionTask;
}

// Only pre-selects the workspace on Slack's consent screen; SQL is the real gate.
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

function displayName(session: Session): string {
  const meta = session.user.user_metadata ?? {};
  const name = (meta.full_name ?? meta.name ?? meta.preferred_username) as string | undefined;
  return name?.trim() || (session.user.email ?? "").split("@")[0];
}

export function ApplyPanel({ task }: ApplyPanelProps) {
  // Defaults to the signed-out state (not a spinner) so the CTA server-renders;
  // a signed-in visitor swaps to the form on mount.
  const [session, setSession] = useState<Session | null>(null);
  const [message, setMessage] = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  // Resolves to the outcome so a server-side "closed" reads differently from an error.
  const apply = useMutation(async (msg: string) => {
    const result = await applyToTask(task.id, msg);
    if (result.status === "error") throw new Error(result.message);
    return result.status;
  });

  const connect = useMutation(async () => {
    const callback = new URL("/auth/callback", window.location.origin);
    callback.searchParams.set("next", `/tasks/${task.id}`);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "slack_oidc",
      options: {
        redirectTo: callback.toString(),
        queryParams: SLACK_TEAM_ID ? { team: SLACK_TEAM_ID } : undefined,
      },
    });
    if (error) throw new Error(error.message);
  });

  // Resolve the session, then ask the server whether this person already applied.
  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        if (!active) return;
        setSession(data.session);
        if (data.session) {
          const { data: applied } = await supabase.rpc("has_applied_to_contribution_task", { p_task_id: task.id });
          if (active && applied === true) setAlreadyApplied(true);
        }
      })
      .catch(() => {
        // A failed pre-check just leaves the apply form usable; the apply
        // RPC dedupes on submit, so a stale "already applied?" answer can
        // never create a duplicate.
      });
    return () => {
      active = false;
    };
  }, [task.id]);

  const isClosed = !isTakingApplications(task) || apply.data === "closed";
  const isApplied = alreadyApplied || apply.data === "applied";

  if (isClosed) {
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

  if (isApplied) {
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

  return (
    <aside className="glass rounded-2xl p-6">
      <h2 className="font-display text-lg font-semibold text-foreground">Want to take this on?</h2>

      {session ? (
        <>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Applying as <span className="font-medium text-foreground">{displayName(session)}</span>. Nothing starts
            until we confirm, so there&rsquo;s no pressure in raising your hand.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              apply.mutate(message);
            }}
            className="mt-5 space-y-3"
          >
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

            {apply.error && (
              <p role="alert" className="text-sm text-destructive">
                {apply.error}
              </p>
            )}

            <Button type="submit" size="sm" disabled={apply.isPending} className="w-full">
              {apply.isPending ? "Applying…" : "Apply for this task"}
            </Button>
          </form>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Tasks go to people in the TechTank Slack, so connect your account to apply. We&rsquo;ll only read your name
            and email, and Tanky will message you on Slack about the task.
          </p>

          {connect.error && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {connect.error}
            </p>
          )}

          <Button onClick={() => connect.mutate()} disabled={connect.isPending} className="mt-5 w-full">
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
