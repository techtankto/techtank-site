import Link from "next/link";
import { StatusBadge } from "@/components/contribution/status-badge";
import { TaskMeta } from "@/components/contribution/task-meta";
import type { ContributionTask } from "@/constants/contribution-board";

/** One task on the public board — links through to its detail page. */
export function BoardRow({ task }: { task: ContributionTask }) {
  return (
    <li>
      <Link
        href={`/tasks/${task.id}`}
        className="group glass block rounded-2xl p-5 transition-all duration-200 hover:scale-[1.01]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold text-foreground group-hover:underline">{task.title}</p>
            {task.summary && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{task.summary}</p>}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <StatusBadge task={task} />
            {task.assigned_name && (
              <span className="text-xs text-muted-foreground">
                Picked up by <span className="font-medium text-foreground">{task.assigned_name}</span>
              </span>
            )}
          </div>
        </div>
        <div className="mt-3">
          <TaskMeta task={task} />
        </div>
      </Link>
    </li>
  );
}
