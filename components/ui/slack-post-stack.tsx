"use client";

import { useEffect, useRef, useState } from "react";
import { cn, cva } from "@/utils/theme";

const styles = {
  root: cva("relative flex flex-col px-2 py-4"),
  card: cva("shadow-soft relative rounded-xl border px-4 py-3.5", {
    variants: {
      tone: {
        light: "border-border bg-background text-foreground",
        loud: "border-transparent bg-primary text-primary-foreground dark:bg-card dark:text-card-foreground",
      },
      shown: {
        true: "animate-slack-pop",
        false: "opacity-0",
      },
    },
  }),
  yell: cva("", { variants: { shown: { true: "animate-slack-yell", false: "" } } }),
  channel: cva("mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold", {
    variants: {
      tone: {
        light: "bg-accent text-accent-foreground",
        loud: "bg-warning text-warning-foreground",
      },
    },
  }),
  author: cva("text-xs font-bold opacity-75"),
  text: cva("text-sm leading-relaxed", {
    variants: { tone: { light: "", loud: "font-bold" } },
  }),
};

// Each card sits a little off-centre and tilted, and overlaps the one above it.
const placements = [
  { rotate: "-2deg", x: "0%", overlap: "0" },
  { rotate: "1.5deg", x: "6%", overlap: "-0.75rem" },
  { rotate: "-1deg", x: "-3%", overlap: "-0.75rem" },
  { rotate: "2deg", x: "4%", overlap: "-0.75rem" },
];

export interface SlackPostStackProps {
  posts: { channel: string; author: string; text: string; tone: "light" | "loud" }[];
  className?: string;
}

/** A few Slack posts stacked and slightly overlapping, popping in one by one when scrolled into view. */
export function SlackPostStack({ posts, className }: SlackPostStackProps) {
  // hooks
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // jsx
  return (
    <div ref={ref} className={cn(styles.root(), className)}>
      {posts.map((post, index) => {
        const place = placements[index % placements.length] ?? placements[0];
        const delay = `${0.15 + index * 0.45}s`;
        return (
          <div
            key={post.channel}
            className={cn(styles.card({ tone: post.tone, shown }))}
            style={{
              zIndex: index + 1,
              marginTop: place?.overlap,
              rotate: place?.rotate,
              translate: `${place?.x} 0`,
              animationDelay: delay,
            }}
          >
            <div
              className={styles.yell({ shown: shown && post.tone === "loud" })}
              style={{ animationDelay: `${delay}, ${parseFloat(delay) + 0.4}s` }}
            >
              <span className={styles.channel({ tone: post.tone })}># {post.channel}</span>
              <p className={styles.author()}>{post.author}</p>
              <p className={styles.text({ tone: post.tone })}>{post.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
