import { Badge } from "@/components/ui/badge";
import {
  CONTRIBUTION_DIFFICULTY_DURATION,
  CONTRIBUTION_DIFFICULTY_LABEL,
  contributionTagLabel,
  type ContributionTask,
} from "@/constants/contribution-board";

/** Difficulty (with expected duration) + discipline tags. */
export function TaskMeta({ task }: { task: Pick<ContributionTask, "difficulty" | "tags"> }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge variant="secondary" size="sm">
        {CONTRIBUTION_DIFFICULTY_LABEL[task.difficulty]} · {CONTRIBUTION_DIFFICULTY_DURATION[task.difficulty]}
      </Badge>
      {task.tags.map((tag) => (
        <Badge key={tag} variant="outline" size="sm">
          {contributionTagLabel(tag)}
        </Badge>
      ))}
    </div>
  );
}
