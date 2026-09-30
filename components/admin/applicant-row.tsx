"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SlackIcon } from "@/components/ui/icons";
import { cn } from "@/utils/theme";
import type { ContributionTaskApplication } from "@/constants/contribution-board";

/** Needed to build the Slack DM deep link. */
const SLACK_TEAM_ID = process.env.NEXT_PUBLIC_SLACK_TEAM_ID;

interface ApplicantRowProps {
  app: ContributionTaskApplication;
  isAssignee: boolean;
  busy: boolean;
  onAssign: (app: ContributionTaskApplication) => void;
  onUnassign: () => void;
}

/** One applicant: their identity, an optional Slack deep link, and the
 * single control that assigns them or unassigns them once they're on it. */
export function ApplicantRow({ app, isAssignee, busy, onAssign, onUnassign }: ApplicantRowProps) {
  return (
    <li
      className={cn(
        "rounded-xl border p-3",
        isAssignee ? "border-success/40 bg-success/5" : "border-border bg-background/50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-foreground">
            {app.applicant_name}
            {isAssignee && (
              <Badge variant="success" size="sm" className="uppercase">
                <Check className="size-3" />
                On it
              </Badge>
            )}
          </p>
          {/* Slack is how organizers reach people, so it's the action. The
              email is identifying detail, not a channel: nothing sends mail. */}
          <p className="text-xs break-all text-muted-foreground">{app.applicant_email}</p>
          {app.message && <p className="mt-1.5 text-sm text-muted-foreground">{app.message}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {/* Slack has no web URL for DMing an arbitrary user, so this is
              the native-client deep link. */}
          {app.slack_user_id && SLACK_TEAM_ID && (
            <a
              href={`slack://user?team=${SLACK_TEAM_ID}&id=${app.slack_user_id}`}
              className="inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap text-ring hover:underline"
            >
              <SlackIcon className="size-3" />
              Message
            </a>
          )}
          {/* One control, two directions: assign this person, or unassign
              them once they're on it. */}
          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => (isAssignee ? onUnassign() : onAssign(app))}
          >
            {isAssignee ? "Unassign" : "Assign"}
          </Button>
        </div>
      </div>
    </li>
  );
}
