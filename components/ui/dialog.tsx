"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/theme";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, labelledBy, className, children }: DialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <>
      {/* The overlay dismisses on click but is not a control: as a button it would
          announce itself and take a tab stop ahead of the dialog. It is a mouse
          convenience only, so it stays out of the accessibility tree; Escape,
          wired above, is the keyboard path. */}
      <div aria-hidden="true" className="fixed inset-0 z-50 bg-black/70" onClick={onClose} />
      <dialog
        open
        className={cn(
          "shadow-soft-lg fixed z-50 flex flex-col overflow-hidden border border-border bg-background p-0 pb-6 text-foreground",
          "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "max-h-[85dvh] w-[calc(100%-2rem)] max-w-md rounded-2xl",
          "md:max-h-[80dvh] md:max-w-xl",
          "lg:max-w-2xl",
          className,
        )}
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        <div className="flex shrink-0 items-center justify-end px-4 pt-4">
          <Button type="button" variant="ghost" size="icon" onClick={onClose} label="Close dialog" className="size-11">
            <X className="size-5" aria-hidden="true" />
          </Button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 pb-4 md:px-8 lg:px-10">{children}</div>
      </dialog>
    </>,
    document.body,
  );
}
