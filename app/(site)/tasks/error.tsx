"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Shown when the task board can't be loaded (Supabase unreachable,
 * misconfigured env). Distinct from the empty board, which is a real
 * and cheerful state — this one has to admit something is wrong.
 */
export default function TasksError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <h1 className="mb-3 font-display text-2xl font-semibold text-foreground">The task board didn&rsquo;t load</h1>
      <p className="mb-8 leading-relaxed text-muted-foreground">
        Something went wrong on our side, so we can&rsquo;t show the board right now. It&rsquo;s not you. Try again in a
        moment, and if it keeps happening let us know in Slack.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/get-involved">Other ways to get involved</Link>
        </Button>
      </div>
    </div>
  );
}
