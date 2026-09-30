"use client";

import { useEffect, useState } from "react";
import { errorMessage } from "@/utils/error-message";
import { useMutation } from "@/hooks/use-mutation";
import { listTaskApplications } from "@/app/admin/tasks/actions";
import type { ContributionTaskApplication } from "@/constants/contribution-board";

// Assign and unassign are two directions of one control, so they share a confirm step.
export type PendingAction = { kind: "assign"; app: ContributionTaskApplication } | { kind: "unassign" };

interface Options {
  taskId: string;
  assignedApplicationId: string | null;
  expanded: boolean;
  onAssign: (name: string | null) => Promise<void>;
  onAssignApplication: (applicationId: string) => Promise<void>;
}

/**
 * Loads a task's applications and owns the assign/unassign flow: a manual
 * (hand-typed) assignment that runs immediately, and a confirmed one for a
 * listed applicant or an unassign. Manual and confirm are separate mutations
 * sharing one derived `busy`, so their errors stay on their own surfaces
 * (inline vs. the confirm dialog).
 */
export function useTaskApplications({
  taskId,
  assignedApplicationId,
  expanded,
  onAssign,
  onAssignApplication,
}: Options) {
  const [applications, setApplications] = useState<ContributionTaskApplication[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const manual = useMutation(async ({ name, message }: { name: string; message: string }) => {
    await onAssign(name);
    setNotice(message);
  }, "Couldn't update the assignee.");

  const confirm = useMutation(async (action: PendingAction) => {
    try {
      if (action.kind === "assign") {
        await onAssignApplication(action.app.id);
        setNotice(
          action.app.slack_user_id
            ? `Assigned to ${action.app.applicant_name}. They've been notified on Slack.`
            : `Assigned to ${action.app.applicant_name}.`,
        );
      } else {
        await onAssign(null);
        setNotice("Unassigned. The task is back on the board.");
      }
    } catch (err) {
      const fallback = action.kind === "assign" ? "Couldn't assign that applicant." : "Couldn't unassign that task.";
      throw new Error(errorMessage(err, fallback));
    }
    return true;
  });

  // Refetch on every expand — applications arrive while the page is open, so a
  // cached first result would go stale against the header count. Old rows stay
  // on screen during the refetch so reopening doesn't flash a spinner.
  // Clearing the last session's messages happens during render, on the
  // collapsed-to-expanded transition, rather than as setState in the effect.
  const [wasExpanded, setWasExpanded] = useState(expanded);
  if (expanded !== wasExpanded) {
    setWasExpanded(expanded);
    if (expanded) {
      setLoadError(null);
      setNotice(null);
      manual.reset();
    }
  }

  useEffect(() => {
    if (!expanded) return;
    let active = true;
    listTaskApplications(taskId)
      .then((rows) => {
        if (active) setApplications(rows);
      })
      .catch(() => {
        if (active) setLoadError("Couldn't load applicants.");
      });
    return () => {
      active = false;
    };
  }, [expanded, taskId]);

  const assignManual = (name: string, message: string) => {
    setNotice(null);
    manual.mutate({ name, message });
  };

  const requestAssign = (app: ContributionTaskApplication) => {
    setNotice(null);
    confirm.reset();
    setPendingAction({ kind: "assign", app });
  };
  const requestUnassign = () => {
    setNotice(null);
    manual.reset();
    confirm.reset();
    setPendingAction({ kind: "unassign" });
  };
  const closeConfirm = () => {
    setPendingAction(null);
    confirm.reset();
  };
  const runConfirm = async () => {
    if (pendingAction && (await confirm.mutate(pendingAction))) setPendingAction(null);
  };

  return {
    applications,
    loadError,
    notice,
    busy: manual.isPending || confirm.isPending,
    actionError: manual.error,
    confirmError: confirm.error,
    pendingAction,
    // The assignee is either a listed applicant (unassign on their row) or a
    // hand-typed name (unassign in the header) — one control either way.
    assigneeIsApplicant: applications?.some((app) => app.id === assignedApplicationId) ?? false,
    assignApp: pendingAction?.kind === "assign" ? pendingAction.app : null,
    assignManual,
    requestAssign,
    requestUnassign,
    closeConfirm,
    runConfirm,
  };
}
