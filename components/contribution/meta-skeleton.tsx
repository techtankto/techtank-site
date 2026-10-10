import { Skeleton } from "@/components/ui/skeleton";

/** A row of small chips standing in for the difficulty + tag meta line.
 * Shared by the public and admin board skeletons. */
export function MetaSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-24 rounded-full" />
    </div>
  );
}
