"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ApplicantRow } from "@/components/admin/applicant-row";
import { errorMessage } from "@/utils/error-message";
import { listTaskApplications } from "@/app/admin/tasks/actions";
import type { ContributionTaskApplication } from "@/constants/contribution-board";

/** A confirm step in flight. Assign and unassign are two directions of
 * one control, so they share it. */
type PendingAction = { kind: "assign"; app: ContributionTaskApplication } | { kind: "unassign" };

interface ApplicationsPanelProps {
  taskId: string;
  taskTitle: string;
  assignedName: string | null;
  expanded: boolean;
  onAssign: (name: string | null) => Promise<void>;
  onAssignApplication: (applicationId: string) => Promise<void>;
}

export function ApplicationsPanel({
  taskId,
  taskTitle,
  assignedName,
  expanded,
  onAssign,
  onAssignApplication,
}: ApplicationsPanelProps) {
  const [applications, setApplications] = useState<ContributionTaskApplication[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [manualName, setManualName] = useState("");

  // Assign / unassign / reassign feedback lives here, next to the task,
  // rather than in a page-top banner. `busy` blocks a second click while
  // a request is in flight; the notice confirms what happened.
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  // Assign and unassign are two directions of one control, so they share
  // a single confirm step. Assigning an applicant DMs them on Slack;
  // unassigning reopens the task — both warrant a confirm.
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  // Refetch on every expand: applications arrive while the page is
  // open, so caching the first result would leave the list stale
  // against the count in the header. Previous rows stay on screen
  // during the refetch so reopening doesn't flash a spinner. Reopening
  // also clears any stale action feedback.
  useEffect(() => {
    if (!expanded) return;
    let active = true;
    setLoadError(null);
    setActionError(null);
    setActionNotice(null);
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

  // Manual assign / reassign: a hand-typed name with no Slack identity,
  // so nothing is notified. Runs immediately.
  const runManualAssign = async (name: string, notice: string) => {
    setBusy(true);
    setActionError(null);
    setActionNotice(null);
    try {
      await onAssign(name);
      setActionNotice(notice);
    } catch (err) {
      setActionError(errorMessage(err, "Couldn't update the assignee."));
    } finally {
      setBusy(false);
    }
  };

  const requestAssign = (app: ContributionTaskApplication) => {
    setActionNotice(null);
    setConfirmError(null);
    setPendingAction({ kind: "assign", app });
  };

  const requestUnassign = () => {
    setActionNotice(null);
    setActionError(null);
    setConfirmError(null);
    setPendingAction({ kind: "unassign" });
  };

  const closeConfirm = () => {
    setPendingAction(null);
    setConfirmError(null);
  };

  // Carry out whichever confirm is open. Captures the action so a stale
  // `pendingAction` can't be read after the await.
  const runConfirm = async () => {
    if (!pendingAction) return;
    const action = pendingAction;
    setBusy(true);
    setConfirmError(null);
    try {
      if (action.kind === "assign") {
        await onAssignApplication(action.app.id);
        setActionNotice(
          action.app.slack_user_id
            ? `Assigned to ${action.app.applicant_name}. They've been notified on Slack.`
            : `Assigned to ${action.app.applicant_name}.`,
        );
      } else {
        await onAssign(null);
        setActionNotice("Unassigned. The task is back on the board.");
      }
      setPendingAction(null);
    } catch (err) {
      const fallback = action.kind === "assign" ? "Couldn't assign that applicant." : "Couldn't unassign that task.";
      setConfirmError(errorMessage(err, fallback));
    } finally {
      setBusy(false);
    }
  };

  // The assignee may be a listed applicant (unassign lives on their row)
  // or a name typed in by hand (unassign lives in the header). Either
  // way there's exactly one unassign control, where that person shows.
  const assigneeIsApplicant = applications?.some((app) => app.applicant_name === assignedName) ?? false;

  // The applicant a pending assign refers to (null when unassigning or
  // closed), so the assign dialog's copy can be written flatly.
  const assignApp = pendingAction?.kind === "assign" ? pendingAction.app : null;

  if (loadError !== null && applications === null) {
    return (
      <p role="alert" className="py-2 text-sm text-destructive">
        {loadError}
      </p>
    );
  }

  if (applications === null) {
    return (
      <div className="flex justify-center py-6">
        <Spinner size="sm" label="Loading applicants" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current assignment */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Assigned to:</span>
        {assignedName ? (
          <>
            <Badge variant="secondary">{assignedName}</Badge>
            {/* A hand-typed assignee has no applicant row, so their
                unassign lives here; a listed applicant unassigns from
                their own row. One unassign control either way. */}
            {!assigneeIsApplicant && (
              <Button variant="ghost" size="sm" disabled={busy} onClick={requestUnassign}>
                Unassign
              </Button>
            )}
          </>
        ) : (
          <span className="text-sm text-foreground">Nobody yet</span>
        )}
      </div>

      {/* Action feedback, kept with the task rather than at the page top. */}
      {actionError ? (
        <p role="alert" className="text-sm text-destructive">
          {actionError}
        </p>
      ) : (
        actionNotice && <output className="block text-sm text-success">{actionNotice}</output>
      )}

      {/* Applicants */}
      {applications.length === 0 ? (
        <p className="text-sm text-muted-foreground">No applications yet.</p>
      ) : (
        <ul className="space-y-2">
          {applications.map((app) => (
            <ApplicantRow
              key={app.id}
              app={app}
              isAssignee={assignedName === app.applicant_name}
              busy={busy}
              onAssign={requestAssign}
              onUnassign={requestUnassign}
            />
          ))}
        </ul>
      )}

      {/* Manual assign: it's a person's name and it shows publicly, so
          say both. Once someone is on the task this is a handover, not
          a first assignment, so the copy switches to match. */}
      <div className="space-y-1.5 border-t border-border pt-4">
        <label htmlFor={`assign-${taskId}`} className="text-sm font-medium text-foreground">
          {assignedName ? "Hand it to someone else" : "Hand it to someone not listed above"}
        </label>
        <p className="text-xs text-muted-foreground">
          {assignedName ? (
            <>
              Their name, as it should appear on the public board. This replaces{" "}
              <span className="font-medium text-foreground">{assignedName}</span>.
            </>
          ) : (
            "Their name, as it should appear on the public board. Assigning moves the task to In progress."
          )}
        </p>
        <div className="flex items-center gap-2">
          <Input
            id={`assign-${taskId}`}
            value={manualName}
            placeholder="e.g. Ada Lovelace"
            onChange={(e) => setManualName(e.target.value)}
          />
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            disabled={busy || manualName.trim() === ""}
            onClick={() => {
              const name = manualName.trim();
              runManualAssign(name, assignedName ? `Reassigned to ${name}.` : `Assigned to ${name}.`);
              setManualName("");
            }}
          >
            {assignedName ? "Reassign" : "Assign"}
          </Button>
        </div>
      </div>

      {/* Assigning an applicant DMs them on Slack, so confirm first and
          say what that will do. */}
      <ConfirmDialog
        open={pendingAction?.kind === "assign"}
        onClose={closeConfirm}
        onConfirm={runConfirm}
        title="Assign this task?"
        confirmLabel={assignApp?.slack_user_id ? "Assign & notify" : "Assign"}
        busyLabel="Assigning…"
        busy={busy}
        error={confirmError}
      >
        <span className="font-medium text-foreground">{assignApp?.applicant_name}</span> will be assigned to{" "}
        <span className="font-medium text-foreground">{taskTitle}</span>, which moves it to In progress.{" "}
        {assignApp?.slack_user_id
          ? "They'll get a Slack DM confirming it, and we'll open a group DM with you so you can get them started."
          : "We don't have a Slack ID for them, so no message will be sent."}
      </ConfirmDialog>

      {/* Unassigning is the inverse of assigning and just as consequential
          (it reopens the task), so it confirms the same way. */}
      <ConfirmDialog
        open={pendingAction?.kind === "unassign"}
        onClose={closeConfirm}
        onConfirm={runConfirm}
        title="Unassign this task?"
        confirmLabel="Unassign"
        busyLabel="Unassigning…"
        confirmVariant="destructive"
        busy={busy}
        error={confirmError}
      >
        This takes <span className="font-medium text-foreground">{assignedName}</span> off{" "}
        <span className="font-medium text-foreground">{taskTitle}</span>. It goes back on the board as Open, and they
        won&rsquo;t be notified.
      </ConfirmDialog>
    </div>
  );
}
