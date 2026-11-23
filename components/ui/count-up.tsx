"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export interface CountUpProps {
  value: number;
  /** Appended after the number, e.g. "+" */
  suffix?: string;
  durationMs?: number;
  className?: string;
}

/** Counts from zero up to `value` the first time it scrolls into view. */
export function CountUp({ value, suffix = "", durationMs = 1600, className }: CountUpProps) {
  // hooks
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reducedMotion) return;

    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / durationMs);
        setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, durationMs, reducedMotion]);

  // render vars
  const format = (n: number) => `${n.toLocaleString("en-US")}${suffix}`;

  // jsx
  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{format(display)}</span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}
