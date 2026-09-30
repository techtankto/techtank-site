"use client";

import { useCallback, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { useMutation } from "@/hooks/use-mutation";
import type { AdminContributionTask } from "@/constants/contribution-board";
import {
  assignApplication,
  assignContributionTask,
  deleteContributionTask,
  listContributionTasks,
  reorderContributionTasks,
  saveContributionTask,
  type SaveContributionTaskInput,
} from "@/app/admin/tasks/actions";

/**
 * All of the admin board's async state — the task list plus the save, delete,
 * reorder, and assign flows — so the component is left with rendering and dnd
 * wiring. Each flow is a `useMutation`, so its pending/error state comes for
 * free instead of a hand-rolled boolean pair.
 */
export function useContributionBoard(initialTasks: AdminContributionTask[]) {
  const [tasks, setTasks] = useState(initialTasks);
  const refetch = useCallback(async () => setTasks(await listContributionTasks()), []);

  // ── editor (create / edit) ──
  const [editingTask, setEditingTask] = useState<AdminContributionTask | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const save = useMutation(async (input: SaveContributionTaskInput) => {
    await saveContributionTask(input);
    await refetch();
    return true;
  }, "Couldn't save. You may not have admin access.");

  const openCreate = () => {
    setEditingTask(null);
    save.reset();
    setEditorOpen(true);
  };
  const openEdit = (task: AdminContributionTask) => {
    setEditingTask(task);
    save.reset();
    setEditorOpen(true);
  };
  const submitEditor = async (input: SaveContributionTaskInput) => {
    if (await save.mutate(input)) setEditorOpen(false);
  };

  // ── delete ──
  const [pendingDelete, setPendingDelete] = useState<AdminContributionTask | null>(null);
  const remove = useMutation(async (id: string) => {
    await deleteContributionTask(id);
    await refetch();
    return true;
  }, "Couldn't delete that task.");

  const requestDelete = (task: AdminContributionTask) => {
    remove.reset();
    setPendingDelete(task);
  };
  const cancelDelete = () => {
    setPendingDelete(null);
    remove.reset();
  };
  const confirmDelete = async () => {
    if (pendingDelete && (await remove.mutate(pendingDelete.id))) setPendingDelete(null);
  };

  // ── reorder (optimistic; rolls back on failure) ──
  const reorder = useMutation(async (orderedIds: string[]) => {
    await reorderContributionTasks(orderedIds);
    await refetch();
    return true;
  }, "Couldn't save the new order.");

  const moveTask = async (activeId: string, overId: string) => {
    const from = tasks.findIndex((t) => t.id === activeId);
    const to = tasks.findIndex((t) => t.id === overId);
    if (from === -1 || to === -1) return;

    const previous = tasks;
    const next = arrayMove(tasks, from, to);
    setTasks(next); // optimistic
    if (!(await reorder.mutate(next.map((t) => t.id)))) setTasks(previous); // roll back
  };

  // ── assign (throws to the caller so the panel shows the error inline) ──
  const assign = async (id: string, name: string | null) => {
    await assignContributionTask(id, name);
    await refetch();
  };
  const assignFromApplication = async (applicationId: string) => {
    const { error } = await assignApplication(applicationId);
    if (error) throw new Error(error);
    await refetch();
  };

  return {
    tasks,
    editor: {
      open: editorOpen,
      task: editingTask,
      saving: save.isPending,
      error: save.error,
      openCreate,
      openEdit,
      close: () => setEditorOpen(false),
      submit: submitEditor,
    },
    deletion: {
      task: pendingDelete,
      deleting: remove.isPending,
      error: remove.error,
      request: requestDelete,
      cancel: cancelDelete,
      confirm: confirmDelete,
    },
    reorder: {
      error: reorder.error,
      dismissError: reorder.reset,
      move: moveTask,
    },
    assign,
    assignFromApplication,
  };
}
