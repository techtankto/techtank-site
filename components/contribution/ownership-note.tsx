/** The deal between a contributor and TechTank: pick up a task and it's
 * yours to run with. Set apart from the body so the trust reads as
 * intentional, not fine print. */
export function OwnershipNote() {
  return (
    <section className="mt-10 max-w-prose rounded-2xl border border-border bg-muted/40 p-6">
      <p className="mb-2 text-xs font-semibold tracking-widest text-ring uppercase">How we work together</p>
      <p className="leading-relaxed text-foreground">
        Once you pick up a task, it&rsquo;s yours to run with. We trust you to make the call, ask for feedback when you
        need it, and leave things better than you found them.
      </p>
    </section>
  );
}
