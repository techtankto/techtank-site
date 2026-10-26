"use client";

import { Dialog, DialogTitle } from "@/components/ui/dialog";
import { TeamAvatar } from "@/components/ui/team-avatar";
import { TeamSocialLinks } from "@/components/ui/team-social-links";
import type { TeamMember } from "@/constants/team";
import { cva } from "@/utils/theme";

const styles = {
  header: cva("flex shrink-0 flex-col items-center gap-4 text-center"),
  name: cva("text-2xl leading-tight font-bold"),
  pronouns: cva("mt-1 text-sm text-muted-foreground"),
  role: cva("tag mt-3 inline-block text-xs"),
  socialLinks: cva("mt-3"),
  divider: cva("shrink-0 border-t border-border"),
  bioScroll: cva("min-h-0 flex-1 overflow-y-auto pb-4"),
  bio: cva("space-y-4"),
  paragraph: cva("text-sm leading-relaxed text-foreground md:text-base"),
  placeholder: cva("text-sm text-muted-foreground italic"),
};

interface TeamProfileDialogProps {
  member: TeamMember;
  open: boolean;
  onClose: () => void;
}

export function TeamProfileDialog({ member, open, onClose }: TeamProfileDialogProps) {
  const { name, pronouns, role, bio, avatar, linkedin, github } = member;

  return (
    <Dialog open={open} onClose={onClose}>
      <div className={styles.header()}>
        <TeamAvatar name={name} avatar={avatar} size="xl" />
        <div>
          <DialogTitle asChild>
            <p className={styles.name()}>{name}</p>
          </DialogTitle>
          <p className={styles.pronouns()}>{pronouns}</p>
          {role && <span className={styles.role()}>{role}</span>}
          <TeamSocialLinks linkedin={linkedin} github={github} align="center" className={styles.socialLinks()} />
        </div>
      </div>

      <div className={styles.divider()} />
      <div className={styles.bioScroll()}>
        {bio ? (
          <div className={styles.bio()}>
            {bio
              .split(/\n+/)
              .filter(Boolean)
              .map((paragraph, i) => (
                <p key={i} className={styles.paragraph()}>
                  {paragraph.trim()}
                </p>
              ))}
          </div>
        ) : (
          <p className={styles.placeholder()}>Bio coming soon</p>
        )}
      </div>
    </Dialog>
  );
}
