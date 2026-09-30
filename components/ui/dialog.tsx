"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/theme";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}

/**
 * Modal dialog built on Radix, which owns the focus trap, focus restore,
 * scroll lock, Escape-to-close, and outside-click — so this only styles the
 * overlay and panel. Enter/leave animation is CSS-driven off Radix's
 * `data-state`; Radix keeps the panel mounted until the exit animation ends.
 *
 * Pass `DialogTitle` in `children` for the accessible name (Radix warns
 * without one). `onClose` is the single close path: Radix routes Escape,
 * the overlay, and the close button through it, and the component is
 * controlled, so a caller can block closing (e.g. mid-request) by ignoring it.
 */
export function Dialog({ open, onClose, className, children }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/70",
            "data-[state=open]:animate-[dialog-overlay-in_200ms_ease-out]",
            "data-[state=closed]:animate-[dialog-overlay-out_150ms_ease-in]",
            "motion-reduce:animate-none",
          )}
        />
        {/* A flex wrapper centers the panel so the animation can own `transform`
            outright — centering with a translate would fight the scale/slide. */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className={cn(
              "shadow-soft-lg relative flex max-h-[85dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-background text-foreground outline-none",
              "md:max-h-[80dvh] md:max-w-xl lg:max-w-2xl",
              "data-[state=open]:animate-[dialog-content-in_200ms_ease-out]",
              "data-[state=closed]:animate-[dialog-content-out_150ms_ease-in]",
              "motion-reduce:animate-none",
              className,
            )}
          >
            {/* The close button gets its own row so a long title never runs under it. */}
            <div className="flex shrink-0 items-center justify-end px-4 pt-4">
              <DialogPrimitive.Close asChild>
                <Button type="button" variant="ghost" size="icon" label="Close dialog" className="size-11">
                  <X className="size-5" aria-hidden="true" />
                </Button>
              </DialogPrimitive.Close>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 pb-6 md:px-8 lg:px-10">
              {children}
            </div>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/**
 * The dialog's title and accessible name. Renders an `<h2>` by default;
 * pass `asChild` to keep a caller's own element (e.g. a styled `<p>`).
 */
export function DialogTitle({ className, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title className={cn("font-display text-xl font-semibold text-foreground", className)} {...props} />
  );
}
