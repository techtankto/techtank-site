"use client";

import { useId, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { TeamAvatar } from "@/components/ui/team-avatar";
import { TeamProfileDialog } from "@/components/ui/team-profile-dialog";
import { TeamProfileHint } from "@/components/ui/team-profile-hint";
import { cn } from "@/utils/theme";
import type { TeamMember } from "@/constants/team";

const teamCardVariants = cva("group relative w-full text-left", {
  variants: {
    variant: {
      board:
        "poster-card gradient-brand shadow-soft-lg hover:shadow-soft-lg flex cursor-pointer flex-col gap-6 overflow-hidden p-8 transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
      core: "core-card shadow-soft hover:shadow-soft-lg flex cursor-pointer gap-4 rounded-2xl border border-border bg-card p-5 transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
      compact:
        "flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-ring/30 hover:bg-accent/30",
    },
  },
  defaultVariants: {
    variant: "core",
  },
});

const avatarSizes = { board: "lg", core: "md", compact: "sm" } as const;

export interface TeamCardProps extends VariantProps<typeof teamCardVariants> {
  member: TeamMember;
  className?: string;
}

function BoardBody({ name, pronouns, role, bio }: TeamMember) {
  return (
    <div>
      <p className="font-display text-2xl leading-tight font-bold text-foreground">{name}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{pronouns}</p>
      {role && <span className="tag mt-3 inline-block text-xs">{role}</span>}
      {bio ? (
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{bio}</p>
      ) : (
        <p className="mt-4 line-clamp-2 text-sm text-muted-foreground/40 italic">Bio coming soon</p>
      )}
      <TeamProfileHint />
    </div>
  );
}

function CoreBody({ name, pronouns, role, bio }: TeamMember) {
  return (
    <div className="min-w-0 flex-1">
      <p className="font-display text-lg leading-tight font-semibold text-foreground">{name}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{pronouns}</p>
      {role && <p className="mt-1 text-xs font-semibold tracking-wide text-ring uppercase">{role}</p>}
      {bio ? (
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{bio}</p>
      ) : (
        <p className="mt-4 line-clamp-2 text-sm text-muted-foreground/40 italic">Bio coming soon</p>
      )}
      <TeamProfileHint />
    </div>
  );
}

function CompactBody({ name, pronouns, role }: TeamMember) {
  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-foreground">{name}</p>
      <p className="text-xs text-muted-foreground">
        {pronouns}
        {role ? ` · ${role}` : ""}
      </p>
    </div>
  );
}

export function TeamCard({ member, variant = "core", className }: TeamCardProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const { name, avatar } = member;
  const avatarSize = avatarSizes[variant ?? "core"];

  if (variant === "compact") {
    return (
      <div className={cn(teamCardVariants({ variant }), className)}>
        <TeamAvatar name={name} avatar={avatar} size={avatarSize} />
        <CompactBody {...member} />
      </div>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cn(teamCardVariants({ variant }), className)}>
        {variant === "board" && (
          <>
            <div className="light pointer-events-none absolute -top-8 -right-8 size-40 rounded-full bg-background/10 dark:bg-background/5" />
            <div className="light pointer-events-none absolute -bottom-12 -left-6 size-32 rounded-full bg-background/10 dark:bg-background/5" />
          </>
        )}
        <TeamAvatar name={name} avatar={avatar} size={avatarSize} />
        {variant === "board" ? <BoardBody {...member} /> : <CoreBody {...member} />}
      </button>
      <TeamProfileDialog member={member} open={open} onClose={() => setOpen(false)} titleId={titleId} />
    </>
  );
}
