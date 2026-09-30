import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * A task-shaped 404. The global not-found is a full-screen interactive
 * fish canvas, which is a strange thing to land on when a task was
 * simply finished and removed.
 */
export default function TaskNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <h1 className="mb-3 font-display text-2xl font-semibold text-foreground">That task isn&rsquo;t on the board</h1>
      <p className="mb-8 leading-relaxed text-muted-foreground">
        It may have been finished and cleared, or the link might be wrong. There&rsquo;s plenty more to pick up.
      </p>
      <Button asChild>
        <Link href="/tasks">Back to the board</Link>
      </Button>
    </div>
  );
}
