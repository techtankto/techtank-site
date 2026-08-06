import { AdminContributionBoardSkeleton } from "@/components/contribution/admin-board-skeleton";

/** Safe as a segment-level boundary: nothing under `/admin/tasks`
 * calls `notFound()`, so streaming can't produce a soft-404 here. The
 * skeleton mirrors the real board so the layout doesn't jump. */
export default function AdminTasksLoading() {
  return <AdminContributionBoardSkeleton />;
}
