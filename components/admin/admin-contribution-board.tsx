"use client";

import { useCallback, useState } from "react";
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
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TaskEditor } from "@/components/admin/task-editor";
import { TaskRow } from "@/components/admin/task-row";
import { errorMessage } from "@/utils/error-message";
import type { AdminContributionTask } from "@/constants/contribution-board";
import {
  assignContributionTask,
  deleteContributionTask,
  listContributionTasks,
  reorderContributionTasks,
  saveContributionTask,
  type SaveContributionTaskInput,
} from "@/app/admin/tasks/actions";
import { assignApplication } from "@/app/admin/tasks/assign-application";

interface AdminContributionBoardProps {
  initialTasks: AdminContributionTask[];
}

export function AdminContributionBoard({ initialTasks }: AdminContributionBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<AdminContributionTask | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminContributionTask | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  // Reorder is a whole-list action, so its failure surfaces at the top of
  // the list. Assign and delete failures land next to the task they
  // belong to (the panel and the delete dialog) rather than up here.
  const [mutationError, setMutationError] = useState<string | null>(null);

  const refetch = useCallback(async () => setTasks(await listContributionTasks()), []);

  // Drag by pointer or keyboard; the keyboard sensor + sortable coordinate
  // getter is what makes reordering accessible without any custom code.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const openCreate = () => {
    setEditingTask(null);
    setSaveError(null);
    setEditorOpen(true);
  };

  const openEdit = (task: AdminContributionTask) => {
    setEditingTask(task);
    setSaveError(null);
    setEditorOpen(true);
  };

  const handleSave = async (input: SaveContributionTaskInput) => {
    setSaving(true);
    setSaveError(null);
    try {
      await saveContributionTask(input);
      setEditorOpen(false);
      await refetch();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Couldn't save. You may not have admin access.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteContributionTask(pendingDelete.id);
      setPendingDelete(null);
      await refetch();
    } catch (err) {
      // Keep the dialog open with the error in view so it can be retried.
      setDeleteError(errorMessage(err, "Couldn't delete that task."));
    } finally {
      setDeleting(false);
    }
  };

  // Free-text assign / unassign: a bare name, no Slack identity, so no
  // notification is possible. Throws on failure so the panel can show the
  // error next to the task rather than at the page top.
  const handleAssign = async (id: string, name: string | null) => {
    await assignContributionTask(id, name);
    await refetch();
  };

  // Assigning a specific applicant goes through the edge function (which
  // opens the Slack group DM). Throws on failure; the panel surfaces it.
  const handleAssignApplication = async (applicationId: string) => {
    await assignApplication(applicationId);
    await refetch();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = tasks.findIndex((t) => t.id === active.id);
    const to = tasks.findIndex((t) => t.id === over.id);
    if (from === -1 || to === -1) return;

    const previous = tasks;
    const next = arrayMove(tasks, from, to);
    setTasks(next); // optimistic
    setMutationError(null);
    try {
      await reorderContributionTasks(next.map((t) => t.id));
      await refetch();
    } catch (err) {
      // Put the old order back rather than leaving the optimistic one on
      // screen looking saved.
      setTasks(previous);
      setMutationError(errorMessage(err, "Couldn't save the new order."));
    }
  };

  // Screen-reader announcements by task title rather than dnd-kit's
  // default (which reads the raw id).
  const titleFor = (id: string | number) => tasks.find((t) => t.id === id)?.title ?? "task";
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${titleFor(active.id)}.`,
    onDragOver: ({ active, over }) => (over ? `${titleFor(active.id)} is over ${titleFor(over.id)}.` : undefined),
    onDragEnd: ({ active, over }) => (over ? `Moved ${titleFor(active.id)}.` : "Reorder cancelled."),
    onDragCancel: ({ active }) => `Reorder of ${titleFor(active.id)} cancelled.`,
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      {/* Header: stacks on mobile so the button keeps its own line instead
          of being squeezed into two. */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Pick a Task</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag to reorder. Create tasks, review applicants, and hand them out.
          </p>
        </div>
        <Button size="sm" onClick={openCreate} className="w-full shrink-0 whitespace-nowrap sm:w-auto">
          <Plus className="mr-1.5 size-4" />
          New task
        </Button>
      </div>

      {/* A failed reorder lands here, above the list it affects. */}
      {mutationError && (
        <div
          role="alert"
          className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3"
        >
          <p className="text-sm text-destructive">{mutationError}</p>
          <Button variant="ghost" size="sm" onClick={() => setMutationError(null)}>
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
                  onEdit={() => openEdit(task)}
                  onDelete={() => {
                    setDeleteError(null);
                    setPendingDelete(task);
                  }}
                  onAssign={(name) => handleAssign(task.id, name)}
                  onAssignApplication={handleAssignApplication}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      <Dialog open={editorOpen} onClose={() => setEditorOpen(false)} labelledBy="task-editor-title">
        <TaskEditor
          task={editingTask}
          onSave={handleSave}
          onCancel={() => setEditorOpen(false)}
          saving={saving}
          error={saveError}
        />
      </Dialog>

      <ConfirmDialog
        open={pendingDelete !== null}
        onClose={() => {
          setPendingDelete(null);
          setDeleteError(null);
        }}
        onConfirm={confirmDelete}
        title="Delete this task?"
        confirmLabel="Delete task"
        busyLabel="Deleting…"
        confirmVariant="destructive"
        busy={deleting}
        error={deleteError}
      >
        This permanently removes the task <span className="font-medium text-foreground">{pendingDelete?.title}</span>,
        along with all of its applications. It can&rsquo;t be undone.
      </ConfirmDialog>
    </div>
  );
}
