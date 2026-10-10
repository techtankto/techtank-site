import { Badge } from "@/components/ui/badge";
import type { ContributionStatus, ContributionTask } from "@/constants/contribution-board";

// Status → Badge variant + label. Assigning a task moves it to
// `in_progress`, so status is the whole story.
const STATUS_BADGE: Record<ContributionStatus, { variant: "success" | "warning" | "outline"; label: string }> = {
  open: { variant: "success", label: "Open" },
  in_progress: { variant: "warning", label: "In progress" },
  done: { variant: "outline", label: "Done" },
};

export function StatusBadge({ task }: { task: Pick<ContributionTask, "status"> }) {
  const { variant, label } = STATUS_BADGE[task.status];
  return <Badge variant={variant}>{label}</Badge>;
}
