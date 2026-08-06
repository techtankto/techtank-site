/** Shown when the board has no rows — either filters excluded everything,
 * or nothing is open at all. */
export function BoardEmptyState({ hasActiveFilters }: { hasActiveFilters: boolean }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-16 text-center">
      <p className="mb-2 font-display text-lg font-semibold text-foreground">
        {hasActiveFilters ? "No tasks match these filters" : "Every task is spoken for"}
      </p>
      <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
        {hasActiveFilters
          ? "Try clearing a filter or two. There may be more once you widen the search."
          : "Nothing is open right now, which honestly is a great problem to have. Check back soon, or take on another way to get involved."}
      </p>
    </div>
  );
}
