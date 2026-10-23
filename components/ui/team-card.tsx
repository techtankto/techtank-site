"use client";

import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { TeamAvatar } from "@/components/ui/team-avatar";
import { TeamProfileDialog } from "@/components/ui/team-profile-dialog";
import { TeamProfileHint } from "@/components/ui/team-profile-hint";
import { TeamSocialLinks } from "@/components/ui/team-social-links";
import { cn } from "@/utils/theme";
import type { TeamMember } from "@/constants/team";

const teamCardVariants = cva("group relative w-full text-left", {
  variants: {
    variant: {
      board:
        "poster-card gradient-brand shadow-soft-lg hover:shadow-soft-lg flex flex-col gap-6 overflow-hidden p-8 transition-shadow",
      core: "core-card shadow-soft hover:shadow-soft-lg flex gap-4 rounded-2xl border border-border bg-card p-5 transition-shadow",
      compact:
        "flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-ring/30 hover:bg-accent/30",
    },
    /** Applied to cards that open a profile dialog. */
    interactive: {
      true: "cursor-pointer has-[[data-card-action]:focus-visible]:ring-2 has-[[data-card-action]:focus-visible]:ring-ring has-[[data-card-action]:focus-visible]:ring-offset-2",
      false: "",
    },
  },
  defaultVariants: {
    variant: "core",
    interactive: false,
  },
});

const avatarSizes = { board: "lg", core: "md", compact: "sm" } as const;

export interface TeamCardProps extends VariantProps<typeof teamCardVariants> {
  member: TeamMember;
  className?: string;
}

function BoardBody({ name, pronouns, role, bio, linkedin, github }: TeamMember) {
  return (
    <div>
      <p className="font-display text-2xl leading-tight font-bold text-foreground">{name}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{pronouns}</p>
      {role && <span className="tag mt-3 inline-block text-xs">{role}</span>}
      {bio ? (
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{bio}</p>
      ) : (
        <p className="mt-4 line-clamp-2 text-sm text-muted-foreground italic">Bio coming soon</p>
      )}
      <TeamSocialLinks linkedin={linkedin} github={github} className="mt-4" />
      <TeamProfileHint />
    </div>
  );
}

function CoreBody({ name, pronouns, role, bio, linkedin, github }: TeamMember) {
  return (
    <div className="min-w-0 flex-1">
      <p className="font-display text-lg leading-tight font-semibold text-foreground">{name}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{pronouns}</p>
      {role && <p className="mt-1 text-xs font-semibold tracking-wide text-ring uppercase">{role}</p>}
      {bio ? (
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{bio}</p>
      ) : (
        <p className="mt-4 line-clamp-2 text-sm text-muted-foreground italic">Bio coming soon</p>
      )}
      <TeamSocialLinks linkedin={linkedin} github={github} className="mt-4" />
      <TeamProfileHint />
    </div>
  );
}

function CompactBody({ name, pronouns, role, linkedin, github }: TeamMember) {
  return (
    <>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">
          {pronouns}
          {role ? ` · ${role}` : ""}
        </p>
      </div>
      <TeamSocialLinks linkedin={linkedin} github={github} iconOnly className="shrink-0" />
    </>
  );
}

export function TeamCard({ member, variant = "core", className }: TeamCardProps) {
  const [open, setOpen] = useState(false);
  const { name, avatar, bio } = member;
  const avatarSize = avatarSizes[variant ?? "core"];
  const isCompact = variant === "compact";
  const interactive = !isCompact || Boolean(bio);

  return (
    <>
      <div className={cn(teamCardVariants({ variant, interactive }), className)}>
        {variant === "board" && (
          <>
            <div className="light pointer-events-none absolute -top-8 -right-8 size-40 rounded-full bg-background/10 dark:bg-background/5" />
            <div className="light pointer-events-none absolute -bottom-12 -left-6 size-32 rounded-full bg-background/10 dark:bg-background/5" />
          </>
        )}
        <TeamAvatar name={name} avatar={avatar} size={avatarSize} />
        {variant === "board" ? (
          <BoardBody {...member} />
        ) : isCompact ? (
          <CompactBody {...member} />
        ) : (
          <CoreBody {...member} />
        )}
        {interactive && (
          <button
            type="button"
            data-card-action
            onClick={() => setOpen(true)}
            className="absolute inset-0 size-full cursor-pointer rounded-[inherit] focus-visible:outline-none"
          >
            <span className="sr-only">{`View ${name}'s profile`}</span>
          </button>
        )}
      </div>
      {interactive && <TeamProfileDialog member={member} open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
