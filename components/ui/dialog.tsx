"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/theme";

/** Enter/leave duration. Keep in sync with the `duration-200` classes. */
const TRANSITION_MS = 200;

/** Tabbable elements, for the focus trap. */
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, labelledBy, className, children }: DialogProps) {
  const [mounted, setMounted] = useState(false);
  // Stays true through the exit transition so the close animation plays
  // before the dialog leaves the tree.
  const [rendered, setRendered] = useState(open);
  // Flips one frame after mount (and off before unmount) to drive the
  // enter/leave transition between the two class sets.
  const [entered, setEntered] = useState(false);

  const panelRef = useRef<HTMLDialogElement>(null);
  // The element focus returns to when the dialog closes.
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  // Mount on open; on close, play the exit transition, then unmount.
  useEffect(() => {
    if (open) {
      setRendered(true);
      return;
    }
    setEntered(false);
    const timer = setTimeout(() => setRendered(false), TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [open]);

  // Two frames after mounting in the "from" state, switch to "to" so the
  // browser has a frame to paint the start of the transition.
  useEffect(() => {
    if (!rendered) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setEntered(true));
    });
    // rAF is paused in background tabs; a timer still fires there, so the
    // dialog can never get stuck in its invisible "from" state.
    const fallback = setTimeout(() => setEntered(true), 80);
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      clearTimeout(fallback);
    };
  }, [rendered]);

  // Scroll lock + focus management. Depends only on `open` so a parent
  // re-render (new `onClose` identity) can't retrigger focus restore.
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
      // Hand focus back to whatever opened the dialog.
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);

  // Move focus into the panel once it's actually in the DOM. Keyed on
  // `rendered`, not `open`: on the render where `open` flips true the
  // portal hasn't mounted yet, so the panel ref would still be null.
  useEffect(() => {
    if (!rendered) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
  }, [rendered]);

  // Escape to close and a Tab focus trap, so keyboard focus can't wander
  // out of the modal to the page behind it.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted || !rendered) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className={cn(
          "absolute inset-0 cursor-default bg-black/70 transition-opacity duration-200 ease-out motion-reduce:transition-none",
          entered ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Panel */}
      <dialog
        ref={panelRef}
        open
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={cn(
          "shadow-soft-lg relative z-10 m-0 flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-background p-0 text-foreground outline-none",
          "md:max-w-xl lg:max-w-2xl",
          "origin-center transition duration-200 ease-out motion-reduce:transition-none",
          entered ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.97] opacity-0",
          className,
        )}
      >
        {/* Close — floats in the corner so it never opens up an empty band
            above the title. The title sits to its left, so short titles
            (all of them here) never collide with it. */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-10 size-9"
        >
          <X className="size-5" />
        </Button>

        {/* Content. Even padding all around; the editor scrolls itself, so
            this stays `overflow-hidden`. */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-6 md:p-8">{children}</div>
      </dialog>
    </div>,
    document.body,
  );
}
