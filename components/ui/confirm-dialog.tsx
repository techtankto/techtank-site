"use client";

import type { ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Dialog, DialogTitle } from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  /** The explanatory body — plain text and inline markup. */
  children: ReactNode;
  confirmLabel: string;
  /** Confirm-button label while the action is in flight. */
  busyLabel: string;
  /** Omit for the primary style; pass `destructive` for irreversible actions. */
  confirmVariant?: ButtonProps["variant"];
  busy?: boolean;
  /** Failure message, shown inline so the dialog can be retried. */
  error?: string | null;
}

/** A yes/no confirmation modal owning the error line, busy state, and close-blocking. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel,
  busyLabel,
  confirmVariant,
  busy = false,
  error,
}: ConfirmDialogProps) {
  // Block close while a request is in flight.
  const close = () => {
    if (busy) return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={close} className="md:max-w-md">
      <DialogTitle>{title}</DialogTitle>
      <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex items-center gap-2">
        <Button variant={confirmVariant} size="sm" onClick={onConfirm} disabled={busy}>
          {busy ? busyLabel : confirmLabel}
        </Button>
        <Button variant="ghost" size="sm" onClick={close} disabled={busy}>
          Cancel
        </Button>
      </div>
    </Dialog>
  );
}
