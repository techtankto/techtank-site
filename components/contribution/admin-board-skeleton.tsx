import { Skeleton } from "@/components/ui/skeleton";
import { MetaSkeleton } from "@/components/contribution/meta-skeleton";

/**
 * Loading placeholder for the admin board — header + reorderable rows.
 * Includes the page container so `loading.tsx` lines up with the real
 * board exactly and nothing jumps when it renders.
 */
export function AdminContributionBoardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <output className="sr-only">Loading tasks</output>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-full rounded-xl sm:w-28" />
      </div>

      {/* Rows */}
      <ul className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="size-5 shrink-0 rounded" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-1">
                  <MetaSkeleton />
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="size-8 rounded-lg" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
