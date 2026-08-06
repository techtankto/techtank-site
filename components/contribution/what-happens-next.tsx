// The path from applying to shipping, so raising your hand feels
// low-stakes: nothing starts until we confirm, and the work lands with
// credit at the end.
const NEXT_STEPS: readonly string[] = [
  "Apply for this task.",
  "We review it, and Tanky messages you on Slack with everything you need to get started.",
  "Pick it up whenever you're ready.",
  "Your work ships to the community.",
  "Your contribution gets credited.",
];

/** The five-step path from applying to shipping, shown under the apply
 * panel while a task is still taking applications. */
export function WhatHappensNext() {
  return (
    <aside className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-4 font-display text-lg font-semibold text-foreground">What happens next?</h2>
      <ol className="space-y-3">
        {NEXT_STEPS.map((step, index) => (
          <li key={step} className="flex items-start gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
              {index + 1}
            </span>
            <span className="text-sm leading-relaxed text-muted-foreground">{step}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
