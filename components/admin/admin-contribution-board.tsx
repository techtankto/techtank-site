"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TaskEditor } from "@/components/admin/task-editor";
import { TaskRow } from "@/components/admin/task-row";
import { useContributionBoard } from "@/hooks/use-contribution-board";
import type { AdminContributionTask } from "@/constants/contribution-board";

interface AdminContributionBoardProps {
  initialTasks: AdminContributionTask[];
}

export function AdminContributionBoard({ initialTasks }: AdminContributionBoardProps) {
  const { tasks, editor, deletion, reorder, assign, assignFromApplication } = useContributionBoard(initialTasks);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // The keyboard sensor + coordinate getter makes reordering accessible.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) reorder.move(String(active.id), String(over.id));
  };

  // Announce by task title rather than dnd-kit's default (the raw id).
  const titleFor = (id: string | number) => tasks.find((t) => t.id === id)?.title ?? "task";
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${titleFor(active.id)}.`,
    onDragOver: ({ active, over }) => (over ? `${titleFor(active.id)} is over ${titleFor(over.id)}.` : undefined),
    onDragEnd: ({ active, over }) => (over ? `Moved ${titleFor(active.id)}.` : "Reorder cancelled."),
    onDragCancel: ({ active }) => `Reorder of ${titleFor(active.id)} cancelled.`,
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Pick a Task</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag to reorder. Create tasks, review applicants, and hand them out.
          </p>
        </div>
        <Button size="sm" onClick={editor.openCreate} className="w-full shrink-0 whitespace-nowrap sm:w-auto">
          <Plus className="mr-1.5 size-4" />
          New task
        </Button>
      </div>

      {reorder.error && (
        <div
          role="alert"
          className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3"
        >
          <p className="text-sm text-destructive">{reorder.error}</p>
          <Button variant="ghost" size="sm" onClick={reorder.dismissError}>
            Dismiss
          </Button>
        </div>
      )}

      {/* List */}
      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-16 text-center text-muted-foreground">
          No tasks yet. Create the first one.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
          accessibility={{ announcements }}
        >
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-3">
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  expanded={expandedId === task.id}
                  onToggle={() => setExpandedId((cur) => (cur === task.id ? null : task.id))}
                  onEdit={() => editor.openEdit(task)}
                  onDelete={() => deletion.request(task)}
                  onAssign={(name) => assign(task.id, name)}
                  onAssignApplication={assignFromApplication}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      <Dialog open={editor.open} onClose={editor.close}>
        <TaskEditor
          task={editor.task}
          onSave={editor.submit}
          onCancel={editor.close}
          saving={editor.saving}
          error={editor.error}
        />
      </Dialog>

      <ConfirmDialog
        open={deletion.task !== null}
        onClose={deletion.cancel}
        onConfirm={deletion.confirm}
        title="Delete this task?"
        confirmLabel="Delete task"
        busyLabel="Deleting…"
        confirmVariant="destructive"
        busy={deletion.deleting}
        error={deletion.error}
      >
        This permanently removes the task <span className="font-medium text-foreground">{deletion.task?.title}</span>,
        along with all of its applications. It can&rsquo;t be undone.
      </ConfirmDialog>
    </div>
  );
}
