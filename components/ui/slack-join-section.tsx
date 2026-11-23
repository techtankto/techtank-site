import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { SlackIcon } from "@/components/ui/icons";
import { SlackPostStack, type SlackPostStackProps } from "@/components/ui/slack-post-stack";
import { SlackPreview, type SlackPreviewProps } from "@/components/ui/slack-preview";
import type { Tool } from "@/constants/tools";
import { cn, cva } from "@/utils/theme";

const styles = {
  root: cva("grid items-center gap-10 lg:grid-cols-5 lg:gap-16"),
  copy: cva("flex max-w-md min-w-0 flex-col items-start gap-4 lg:col-span-2"),
  overline: cva("text-xs font-semibold tracking-widest text-foreground uppercase dark:text-overline"),
  title: cva("font-display text-2xl font-bold text-balance text-foreground lg:text-3xl"),
  description: cva("text-base leading-relaxed text-muted-foreground"),
  stat: cva("my-1 flex flex-col"),
  statValue: cva("font-display text-3xl font-bold text-foreground tabular-nums lg:text-4xl"),
  statLabel: cva("text-xs text-muted-foreground"),
  poweredBy: cva("flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground"),
  poweredByLogo: cva("object-contain opacity-80 dark:brightness-0 dark:invert"),
  preview: cva("hidden min-w-0 md:flex lg:col-span-3"),
  stack: cva("md:hidden"),
};

export interface SlackJoinSectionProps {
  overline: string;
  title: string;
  description: string;
  members: number;
  membersLabel: string;
  ctaLabel: string;
  ctaHref: string;
  poweredByLabel?: string;
  poweredBy?: Tool[];
  channels: SlackPreviewProps["channels"];
  /** Single posts shown as an overlapping stack on phones, in place of the channel window */
  highlights: SlackPostStackProps["posts"];
  logo?: SlackPreviewProps["logo"];
  className?: string;
}

/** Homepage pitch for the Slack community: short copy and a join button beside a live channel preview. */
export function SlackJoinSection({
  overline,
  title,
  description,
  members,
  membersLabel,
  ctaLabel,
  ctaHref,
  poweredByLabel,
  poweredBy = [],
  channels,
  highlights,
  logo,
  className,
}: SlackJoinSectionProps) {
  return (
    <div className={cn(styles.root(), className)}>
      <div className={styles.copy()}>
        <span className={styles.overline()}>{overline}</span>
        <h2 className={styles.title()}>{title}</h2>
        <p className={styles.description()}>{description}</p>
        <p className={styles.stat()}>
          <CountUp value={members} suffix="+" className={styles.statValue()} />
          <span className={styles.statLabel()}>{membersLabel}</span>
        </p>
        <Button variant="primary" size="md" asChild>
          <a href={ctaHref} target="_blank" rel="noopener noreferrer">
            <SlackIcon className="mr-2 size-4" />
            {ctaLabel}
          </a>
        </Button>
        {poweredBy.length > 0 && (
          <div className={styles.poweredBy()}>
            {poweredByLabel && <span>{poweredByLabel}</span>}
            {poweredBy.map((tool, index) => (
              <span key={tool.id} className="flex items-center gap-2.5">
                {index > 0 && <span aria-hidden="true">+</span>}
                <Image
                  src={tool.logo}
                  alt={tool.name}
                  width={tool.width}
                  height={tool.height}
                  className={styles.poweredByLogo()}
                  style={{ width: "auto", height: "1rem" }}
                />
              </span>
            ))}
          </div>
        )}
      </div>
      <SlackPreview channels={channels} logo={logo} className={styles.preview()} />
      <SlackPostStack posts={highlights} className={styles.stack()} />
    </div>
  );
}
