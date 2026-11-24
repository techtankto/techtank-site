"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export interface CountUpProps {
  value: number;
  /** Appended after the number, e.g. "+" */
  suffix?: string;
  durationMs?: number;
  className?: string;
}

const format = (n: number, suffix: string) => `${n.toLocaleString("en-US")}${suffix}`;

/**
 * Counts from zero up to `value` the first time it scrolls into view.
 *
 * The animation writes each frame straight to the number's text node instead of
 * going through React state, so counting up causes no re-renders. The server
 * renders the final value, which is also what shows with reduced motion.
 */
export function CountUp({ value, suffix = "", durationMs = 1600, className }: CountUpProps) {
  // hooks
  const numberRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = numberRef.current;
    // Update React's own text node in place, so React's next render still finds it.
    const text = node?.firstChild;
    if (!node || !(text instanceof Text) || reducedMotion) return;

    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / durationMs);
        text.data = format(Math.round(value * (1 - Math.pow(1 - progress, 3))), suffix);
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      text.data = format(value, suffix);
    };
  }, [value, suffix, durationMs, reducedMotion]);

  // jsx
  return (
    <span className={className}>
      <span ref={numberRef} aria-hidden="true">
        {format(value, suffix)}
      </span>
      <span className="sr-only">{format(value, suffix)}</span>
    </span>
  );
}
