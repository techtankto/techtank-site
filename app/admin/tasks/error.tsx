"use client";

import { Button } from "@/components/ui/button";

/** Keeps a failed admin load inside the admin chrome (with sign-out)
 * instead of falling through to Next's bare error page. */
export default function AdminTasksError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <h1 className="mb-3 font-display text-2xl font-semibold text-foreground">Couldn&rsquo;t load the board</h1>
      <p className="mb-8 leading-relaxed text-muted-foreground">
        The board failed to load. Your session may have expired, or the database is unreachable.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
