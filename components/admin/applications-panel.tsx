"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ApplicantRow } from "@/components/admin/applicant-row";
import { useTaskApplications } from "@/hooks/use-task-applications";

interface ApplicationsPanelProps {
  taskId: string;
  taskTitle: string;
  assignedName: string | null;
  assignedApplicationId: string | null;
  expanded: boolean;
  onAssign: (name: string | null) => Promise<void>;
  onAssignApplication: (applicationId: string) => Promise<void>;
}

export function ApplicationsPanel({
  taskId,
  taskTitle,
  assignedName,
  assignedApplicationId,
  expanded,
  onAssign,
  onAssignApplication,
}: ApplicationsPanelProps) {
  const {
    applications,
    loadError,
    notice,
    busy,
    actionError,
    confirmError,
    pendingAction,
    assigneeIsApplicant,
    assignApp,
    assignManual,
    requestAssign,
    requestUnassign,
    closeConfirm,
    runConfirm,
  } = useTaskApplications({ taskId, assignedApplicationId, expanded, onAssign, onAssignApplication });

  const [manualName, setManualName] = useState("");

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
            {/* A hand-typed assignee has no applicant row, so unassign lives here. */}
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

      {actionError ? (
        <p role="alert" className="text-sm text-destructive">
          {actionError}
        </p>
      ) : (
        notice && <output className="block text-sm text-success">{notice}</output>
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
              isAssignee={assignedApplicationId === app.id}
              busy={busy}
              onAssign={requestAssign}
              onUnassign={requestUnassign}
            />
          ))}
        </ul>
      )}

      {/* Manual assign — copy switches to a handover once someone is on the task. */}
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
              assignManual(name, assignedName ? `Reassigned to ${name}.` : `Assigned to ${name}.`);
              setManualName("");
            }}
          >
            {assignedName ? "Reassign" : "Assign"}
          </Button>
        </div>
      </div>

      {/* Assigning an applicant DMs them on Slack, so confirm first. */}
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
        {assignedName && (
          <>
            This replaces <span className="font-medium text-foreground">{assignedName}</span>.{" "}
          </>
        )}
        {assignApp?.slack_user_id
          ? "They'll get a Slack DM confirming it, and we'll open a group DM with you so you can get them started."
          : "We don't have a Slack ID for them, so no message will be sent."}
      </ConfirmDialog>

      {/* Unassigning reopens the task, so it confirms the same way. */}
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
