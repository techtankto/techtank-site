"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { SlackChannel, SlackMessage } from "@/constants/slack-preview";
import { cn, cva } from "@/utils/theme";

const styles = {
  root: cva(
    "shadow-soft-lg flex flex-wrap overflow-hidden rounded-2xl border border-border bg-background dark:border-foreground/25",
  ),
  sidebar: cva(
    "flex flex-[1_1_11rem] flex-wrap content-start gap-1 bg-primary p-3 text-primary-foreground dark:bg-secondary dark:text-secondary-foreground",
  ),
  logo: cva("mx-2.5 mt-1 mb-3 basis-full"),
  logoImage: cva("h-auto w-24"),
  tab: cva(
    "min-h-11 flex-[1_1_9rem] cursor-pointer truncate rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning",
    {
      variants: {
        active: {
          true: "bg-warning text-warning-foreground",
          false: "hover:bg-primary-foreground/10 dark:hover:bg-secondary-foreground/10",
        },
      },
    },
  ),
  pane: cva("flex h-110 min-w-0 flex-[999_1_18rem] flex-col", {
    variants: {
      tone: {
        light: "bg-background text-foreground",
        loud: "bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground",
      },
    },
  }),
  header: cva("flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3", {
    variants: {
      tone: { light: "border-border", loud: "border-primary-foreground/20 dark:border-accent-foreground/20" },
    },
  }),
  channelName: cva("font-display text-lg font-bold"),
  topic: cva("text-xs opacity-75"),
  track: cva("h-0.75", {
    variants: { tone: { light: "bg-foreground/8", loud: "bg-primary-foreground/15" } },
  }),
  bar: cva("h-full origin-left animate-slack-progress bg-warning"),
  messages: cva("flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-5 py-4"),
  post: cva("flex animate-slack-pop gap-3.5", {
    variants: {
      reply: { true: "pl-13", false: "" },
      highlight: { true: "rounded-xl border border-border bg-accent/40 p-3.5", false: "" },
    },
  }),
  avatar: cva("shrink-0", {
    variants: {
      size: { md: "size-9.5 rounded-xl", sm: "size-7.5 rounded-lg" },
      tint: { 0: "bg-secondary", 1: "bg-muted", 2: "bg-accent", 3: "bg-foreground/80" },
    },
  }),
  author: cva("text-xs font-bold text-muted-foreground"),
  text: cva("text-sm leading-relaxed"),
  link: cva(
    "mt-0.5 block truncate text-xs font-medium text-foreground/70 underline decoration-foreground/30 underline-offset-2",
  ),
  details: cva("mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 rounded-lg bg-muted/50 px-3 py-2 text-xs"),
  detailLabel: cva("font-semibold"),
  badge: cva("mt-1.5 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground"),
  eventCard: cva("mt-1.5 flex items-center gap-3 rounded-xl border border-border px-3.5 py-2.5"),
  eventLines: cva("flex min-w-0 flex-1 flex-col gap-1.5"),
  skeleton: cva("rounded-full", {
    variants: { line: { title: "h-3 bg-muted", meta: "h-2.5 bg-foreground/6" } },
  }),
  yell: cva("flex animate-slack-yell gap-3.5"),
  yellAvatar: cva("size-8.5 shrink-0 rounded-full bg-primary-foreground/15 dark:bg-accent-foreground/15"),
  yellLabel: cva("mb-1 text-xs font-semibold opacity-80"),
  yellText: cva("text-base leading-snug font-bold", {
    variants: { accent: { true: "text-warning", false: "" } },
  }),
  typing: cva("flex animate-slack-pop items-center gap-1.5 px-5 pt-2 pb-3 text-xs text-muted-foreground"),
  dot: cva("inline-block size-1.5 animate-typing-dot rounded-full bg-muted-foreground"),
};

// Seconds after a channel opens that each message pops in.
const POP_DELAYS = [0.2, 0.8, 1.35, 1.9, 2.45];
const TYPING_DELAY = 2.9;
const skeletonWidths = [
  ["70%", "45%"],
  ["60%", "52%"],
  ["76%", null],
];

export interface SlackPreviewProps {
  channels: SlackChannel[];
  /** Seconds each channel shows before rotating to the next */
  rotateSeconds?: number;
  /** Wordmark shown at the top of the channel list */
  logo?: { src: string; alt: string; width: number; height: number };
  className?: string;
}

function Message({ message, index }: { message: SlackMessage; index: number }) {
  // render vars
  const delay = `${POP_DELAYS[index] ?? POP_DELAYS.at(-1)}s`;
  const tint = (index % 4) as 0 | 1 | 2 | 3;

  // jsx
  if (message.kind === "yell") {
    return (
      <div className={styles.yell()} style={{ animationDelay: `${delay}, ${parseFloat(delay) + 0.4}s` }}>
        <div className={styles.yellAvatar()} />
        <div className="min-w-0">
          <p className={styles.yellLabel()}>anonymous</p>
          <p className={styles.yellText({ accent: Boolean(message.accent) })}>{message.text}</p>
        </div>
      </div>
    );
  }

  if (message.kind === "event") {
    const [title, meta] = skeletonWidths[index % skeletonWidths.length] ?? [];
    return (
      <div className={styles.post({ reply: false, highlight: false })} style={{ animationDelay: delay }}>
        <div className={styles.avatar({ size: "md", tint })} />
        <div className="min-w-0 flex-1">
          <p className={styles.author()}>{message.author}</p>
          <div className={styles.eventCard()}>
            <div className={styles.eventLines()}>
              {title && <div className={styles.skeleton({ line: "title" })} style={{ width: title }} />}
              {meta && <div className={styles.skeleton({ line: "meta" })} style={{ width: meta }} />}
            </div>
            <span className={cn(message.tag === "Free" ? "tag" : "tag-outline", "shrink-0")}>{message.tag}</span>
          </div>
        </div>
      </div>
    );
  }

  const reply = Boolean(message.reply);
  return (
    <div className={styles.post({ reply, highlight: Boolean(message.highlight) })} style={{ animationDelay: delay }}>
      <div className={styles.avatar({ size: reply ? "sm" : "md", tint })} />
      <div className="min-w-0">
        <p className={styles.author()}>{message.author}</p>
        <p className={styles.text()}>
          {message.label && <strong>{message.label} </strong>}
          {message.text}
        </p>
        {message.link && <span className={styles.link()}>{message.link}</span>}
        {message.details && (
          <dl className={styles.details()}>
            {message.details.map((detail) => (
              <div key={detail.label} className="contents">
                <dt className={styles.detailLabel()}>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {message.badge && <span className={styles.badge()}>{message.badge}</span>}
      </div>
    </div>
  );
}

/**
 * A small animated Slack window that cycles through channels, popping each
 * message in. Clicking a channel jumps to it and the rotation carries on from there.
 */
export function SlackPreview({ channels, rotateSeconds = 5, logo, className }: SlackPreviewProps) {
  // hooks
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Start rotating only once the window is on screen, so readers see it from the first channel.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      threshold: 0.4,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reducedMotion || channels.length < 2) return;
    // A fresh timer per channel, so clicking a tab gives that channel its full time before moving on.
    const id = setTimeout(() => setActive((current) => (current + 1) % channels.length), rotateSeconds * 1000);
    return () => clearTimeout(id);
  }, [active, inView, reducedMotion, channels.length, rotateSeconds]);

  // render vars
  const channel = channels[active];
  if (!channel) return null;
  const tone = channel.tone;
  const showProgress = inView && !reducedMotion;

  // jsx
  return (
    <div ref={rootRef} className={cn(styles.root(), className)}>
      <nav aria-label="Slack channels" className={styles.sidebar()}>
        {logo && (
          <div className={styles.logo()}>
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className={styles.logoImage()}
            />
          </div>
        )}
        {channels.map((item, index) => (
          <button
            key={item.name}
            type="button"
            aria-pressed={index === active}
            className={styles.tab({ active: index === active })}
            onClick={() => setActive(index)}
          >
            # {item.name}
          </button>
        ))}
      </nav>

      {/* Keyed on the channel and visibility so messages pop in when it opens or scrolls into view */}
      <div key={`${channel.name}-${inView}`} className={styles.pane({ tone })}>
        <div className={styles.header({ tone })}>
          <span className={styles.channelName()}># {channel.name}</span>
          <span className={styles.topic()}>{channel.topic}</span>
        </div>
        <div className={styles.track({ tone })}>
          {showProgress && <div className={styles.bar()} style={{ animationDuration: `${rotateSeconds}s` }} />}
        </div>
        <div className={styles.messages()}>
          {channel.messages.map((message, index) => (
            <Message key={index} message={message} index={index} />
          ))}
        </div>
        {channel.typing && (
          <div className={styles.typing()} style={{ animationDelay: `${TYPING_DELAY}s` }}>
            {[0, 0.15, 0.3].map((dotDelay) => (
              <span key={dotDelay} className={styles.dot()} style={{ animationDelay: `${dotDelay}s` }} />
            ))}
            <span className="ml-1">{channel.typing}</span>
          </div>
        )}
      </div>
    </div>
  );
}
