"use client";

import { useState, type CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, GripVertical, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/contribution/status-badge";
import { TaskMeta } from "@/components/contribution/task-meta";
import { ApplicationsPanel } from "@/components/admin/applications-panel";
import { cn } from "@/utils/theme";
import type { AdminContributionTask } from "@/constants/contribution-board";

interface TaskRowProps {
  task: AdminContributionTask;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAssign: (name: string | null) => Promise<void>;
  onAssignApplication: (applicationId: string) => Promise<void>;
}

export function TaskRow({ task, expanded, onToggle, onEdit, onDelete, onAssign, onAssignApplication }: TaskRowProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const panelId = `applications-${task.id}`;
  // Latches on first expand so the collapse animation has content, without
  // mounting every row's panel up front.
  const [hasOpened, setHasOpened] = useState(expanded);
  if (expanded && !hasOpened) setHasOpened(true);

  const style: CSSProperties = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-2xl border border-border bg-card",
        isDragging && "shadow-soft-lg relative z-10 border-ring/40",
      )}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Only the handle activates a drag; the negative margin keeps a finger-sized hit area. */}
        <button
          ref={setActivatorNodeRef}
          type="button"
          aria-label={`Reorder ${task.title}. Use the up and down arrow keys to move it.`}
          className="-m-2 flex size-9 shrink-0 cursor-grab touch-none items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-5" />
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          {/* Main */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display font-semibold wrap-break-word text-foreground">{task.title}</p>
              <StatusBadge task={task} />
              {task.assigned_name && (
                <span className="text-xs text-muted-foreground">
                  → <span className="font-medium text-foreground">{task.assigned_name}</span>
                </span>
              )}
            </div>
            {task.summary && <p className="mt-1 text-sm text-muted-foreground">{task.summary}</p>}
            <div className="mt-2">
              <TaskMeta task={task} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1 sm:justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              aria-expanded={expanded}
              aria-controls={panelId}
              aria-label={`${expanded ? "Hide" : "Show"} applicants (${task.application_count} ${task.application_count === 1 ? "application" : "applications"})`}
            >
              <Users className="mr-1 size-4" />
              {task.application_count}
              <ChevronDown
                className={cn("ml-1 size-4 transition-transform duration-200", expanded && "rotate-180")}
                aria-hidden
              />
            </Button>
            <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit task">
              <Pencil className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete task">
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        </div>
      </div>

      {/* Animates open/closed via a 0fr→1fr grid row. `overflow-hidden` only
          clips, so `inert` is what removes collapsed content from the tab order and a11y tree. */}
      <div
        id={panelId}
        inert={!expanded}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border p-4">
            {hasOpened && (
              <ApplicationsPanel
                taskId={task.id}
                taskTitle={task.title}
                assignedName={task.assigned_name}
                assignedApplicationId={task.assigned_application_id}
                expanded={expanded}
                onAssign={onAssign}
                onAssignApplication={onAssignApplication}
              />
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
