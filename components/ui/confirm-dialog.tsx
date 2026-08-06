"use client";

import { useId, type ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

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
  /** Style of the confirm button; omit for the primary style, pass
   * `destructive` for irreversible actions. */
  confirmVariant?: ButtonProps["variant"];
  busy?: boolean;
  /** Failure message, shown inline so the dialog can be retried. */
  error?: string | null;
}

/**
 * A yes/no confirmation modal: title, a short explanation, and a
 * primary/cancel pair. Owns the shared wiring every confirm step needs —
 * the `role="alert"` error line, the busy label + disabled state, and
 * blocking close while a request is in flight — so callers only supply
 * copy and the confirm handler.
 */
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
  const titleId = useId();

  // Can't close (overlay, Escape, Cancel) mid-request, or the row could
  // commit while its dialog is already gone.
  const close = () => {
    if (busy) return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={close} labelledBy={titleId} className="md:max-w-md">
      <h2 id={titleId} className="font-display text-xl font-semibold text-foreground">
        {title}
      </h2>
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
