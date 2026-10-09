"use client";

import { Mail, Copy, Check, MessageSquare } from "lucide-react";
import { CONTACT_EMAIL } from "@/constants/contact";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { trackEvent } from "@/utils/analytics";

interface ContactCardProps {
  context?: string;
}

export function ContactCard({
  context = "For hosting, sponsorship, speaking, and community inquiries.",
}: ContactCardProps) {
  const { copied, copy } = useCopyToClipboard();
  const email = CONTACT_EMAIL;
  const slackUrl = "/links/slack";

  return (
    <div className="glass space-y-4 rounded-2xl p-6 lg:p-8">
      <p className="text-sm text-muted-foreground">{context}</p>

      {/* Email */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <Mail className="size-5" aria-hidden="true" />
        </div>
        <div className="flex flex-1 items-center gap-3">
          <a
            href={`mailto:${email}`}
            onClick={() => trackEvent("intake_cta_click", { context })}
            className="font-display text-base font-semibold break-all text-foreground transition-colors hover:text-overline"
          >
            {email}
          </a>
          <button
            type="button"
            onClick={() => copy(email)}
            className="inline-flex size-7 items-center justify-center rounded-lg bg-card/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            <span className="sr-only">{copied ? "Copied" : "Copy email"}</span>
            {copied ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Slack */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <MessageSquare className="size-5" aria-hidden="true" />
        </div>
        <a
          href={slackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-display text-base font-semibold text-foreground transition-colors hover:text-overline"
        >
          Join our Slack community
        </a>
      </div>
    </div>
  );
}
