"use client";

import { useState } from "react";
import { Mail, Copy, Check, MessageSquare } from "lucide-react";
import { CONTACT_EMAIL } from "@/constants/contact";
import { trackEvent } from "@/utils/analytics";
import { cva } from "@/utils/theme";

const styles = {
  root: cva("glass space-y-4 rounded-2xl p-6 lg:p-8"),
  row: cva("flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4"),
  badge: cva("flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground"),
  link: cva("font-display text-base font-semibold text-foreground transition-colors hover:text-overline", {
    variants: {
      breakAll: { true: "break-all", false: "" },
    },
    defaultVariants: { breakAll: false },
  }),
  copyButton: cva(
    "inline-flex size-7 items-center justify-center rounded-lg bg-card/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground",
  ),
  icon: cva("", {
    variants: {
      size: { sm: "size-3.5", md: "size-5" },
    },
    defaultVariants: { size: "md" },
  }),
};

interface ContactCardProps {
  context?: string;
}

export function ContactCard({
  context = "For hosting, sponsorship, speaking, and community inquiries.",
}: ContactCardProps) {
  const [copied, setCopied] = useState(false);
  const email = CONTACT_EMAIL;
  const slackUrl = "/links/slack";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.root()}>
      <p className="text-sm text-muted-foreground">{context}</p>

      {/* Email */}
      <div className={styles.row()}>
        <div className={styles.badge()}>
          <Mail className={styles.icon({ size: "md" })} aria-hidden="true" />
        </div>
        <div className="flex flex-1 items-center gap-3">
          <a
            href={`mailto:${email}`}
            onClick={() => trackEvent("intake_cta_click", { context })}
            className={styles.link({ breakAll: true })}
          >
            {email}
          </a>
          <button type="button" onClick={handleCopy} className={styles.copyButton()}>
            <span className="sr-only">{copied ? "Copied" : "Copy email"}</span>
            {copied ? (
              <Check className={styles.icon({ size: "sm" })} aria-hidden="true" />
            ) : (
              <Copy className={styles.icon({ size: "sm" })} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Slack */}
      <div className={styles.row()}>
        <div className={styles.badge()}>
          <MessageSquare className={styles.icon({ size: "md" })} aria-hidden="true" />
        </div>
        <a href={slackUrl} target="_blank" rel="noopener noreferrer" className={styles.link()}>
          Join our Slack community
        </a>
      </div>
    </div>
  );
}
