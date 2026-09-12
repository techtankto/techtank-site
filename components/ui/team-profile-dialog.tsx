"use client";

import { Dialog } from "@/components/ui/dialog";
import { TeamAvatar } from "@/components/ui/team-avatar";
import type { TeamMember } from "@/constants/team";

interface TeamProfileDialogProps {
  member: TeamMember;
  open: boolean;
  onClose: () => void;
  titleId: string;
}

export function TeamProfileDialog({ member, open, onClose, titleId }: TeamProfileDialogProps) {
  const { name, pronouns, role, bio, avatar } = member;

  return (
    <Dialog open={open} onClose={onClose} labelledBy={titleId}>
      <div className="flex shrink-0 flex-col items-center gap-4 text-center">
        <TeamAvatar name={name} avatar={avatar} size="xl" />
        <div>
          <p id={titleId} className="font-display text-2xl leading-tight font-bold text-foreground">
            {name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{pronouns}</p>
          {role && <span className="tag mt-3 inline-block text-xs">{role}</span>}
        </div>
      </div>

      <div className="shrink-0 border-t border-border" />
      <div className="min-h-0 flex-1 overflow-y-auto pb-4">
        {bio ? (
          <div className="space-y-4">
            {bio
              .split(/\n+/)
              .filter(Boolean)
              .map((paragraph, i) => (
                <p key={i} className="text-sm leading-relaxed text-foreground md:text-base">
                  {paragraph.trim()}
                </p>
              ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">Bio coming soon</p>
        )}
      </div>
    </Dialog>
  );
}
