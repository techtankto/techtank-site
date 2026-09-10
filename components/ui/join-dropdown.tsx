"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlackIcon } from "@/components/ui/icons";
import { cn } from "@/utils/theme";

export function JoinDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <Button variant="primary" size="sm" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        Join us
        <ChevronDown className={cn("ml-1.5 size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </Button>

      {open && (
        <div
          role="menu"
          className="shadow-soft-lg absolute top-full right-0 mt-2 w-fit min-w-max rounded-md border border-border bg-background p-1"
        >
          <Link
            role="menuitem"
            href="/get-involved"
            onClick={() => setOpen(false)}
            className="flex items-center justify-end gap-2 rounded-sm px-3 py-2 text-sm font-medium whitespace-nowrap text-foreground transition-colors hover:bg-foreground/5"
          >
            Get Involved
          </Link>
          <a
            role="menuitem"
            href="/links/slack"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center justify-end gap-2 rounded-sm px-3 py-2 text-sm font-medium whitespace-nowrap text-foreground transition-colors hover:bg-amber/15"
          >
            <SlackIcon className="size-4 text-amber-dark" />
            Join Slack
          </a>
        </div>
      )}
    </div>
  );
}
