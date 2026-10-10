import { Skeleton } from "@/components/ui/skeleton";
import { MetaSkeleton } from "@/components/contribution/meta-skeleton";

/**
 * Loading placeholder for the public `ContributionBoard` — filter bar,
 * count, and rows, mirroring the real layout closely (same paddings,
 * radii, columns) so the page holds its shape while data streams in.
 * Rendered inside the page's `<Section>`, so there's no outer container.
 */
export function ContributionBoardSkeleton() {
  return (
    <div>
      <output className="sr-only">Loading tasks</output>

      {/* Filter bar */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 md:flex-row md:items-center">
        <Skeleton className="h-11 w-full md:w-64" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:flex-1">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>

      {/* Count */}
      <Skeleton className="mb-4 h-4 w-44" />

      {/* Rows */}
      <ul className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
            </div>
            <div className="mt-4">
              <MetaSkeleton />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
