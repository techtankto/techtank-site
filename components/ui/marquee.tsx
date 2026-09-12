"use client";

import { forwardRef, useRef, useState, type CSSProperties, type FocusEvent, type HTMLAttributes } from "react";
import { PauseIcon, PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, cva, type VariantProps } from "@/utils/theme";

/** One group on screen plus one drifting in; the floor for a seamless loop. */
const MIN_COPIES = 2;

const styles = {
  root: cva("relative w-full"),
  viewport: cva([
    "marquee-viewport w-full overflow-hidden",
    "motion-reduce:overflow-x-auto motion-reduce:overscroll-x-contain",
  ]),
  track: cva(["marquee-track flex w-max", "hover:paused data-[paused=true]:paused"], {
    variants: {
      speed: {
        slow: "duration-[40s]",
        normal: "duration-[25s]",
        fast: "duration-[15s]",
      },
    },
    defaultVariants: {
      speed: "normal",
    },
  }),
  // Sized by its content so the gap is the only thing setting spacing. The
  // trailing pad matches the gap, which keeps the seam even across the loop.
  group: cva("flex shrink-0 items-center", {
    variants: {
      gap: {
        sm: "gap-8 pr-8",
        md: "gap-16 pr-16",
        lg: "gap-24 pr-24",
        xl: "gap-36 pr-36",
      },
    },
    defaultVariants: {
      gap: "md",
    },
  }),
  duplicate: cva("motion-reduce:hidden"),
  control: cva(["absolute top-1/2 right-2 z-10 -translate-y-1/2", "motion-reduce:hidden"]),
};

type MarqueeRef = HTMLDivElement;
type MarqueeProps = HTMLAttributes<MarqueeRef> &
  VariantProps<typeof styles.track> &
  VariantProps<typeof styles.group> & {
    /** How many times the children repeat. Raise it until a short list fills the width. */
    copies?: number;
    /** Accessible label for the control that stops the drift. */
    pauseLabel?: string;
    /** Accessible label for the control once the drift is stopped. */
    resumeLabel?: string;
  };

const Marquee = forwardRef<MarqueeRef, MarqueeProps>((props, ref) => {
  // props
  const {
    speed,
    gap,
    copies = MIN_COPIES,
    pauseLabel = "Pause scrolling",
    resumeLabel = "Resume scrolling",
    children,
    className,
    ...rest
  } = props;

  // hooks
  const [paused, setPaused] = useState(false);
  // Tracked separately from `paused` since focus and the pause button are independent
  // reasons to hold the drift still; the attribute below renders their union.
  const [focusPaused, setFocusPaused] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // render vars
  const handleToggle = () => setPaused((prev) => !prev);

  // Focus entering the track pauses the drift immediately (before the scroll,
  // so the target doesn't keep moving while it comes into view) and reveals
  // the focused item without depending on hover. The imperative write lands
  // before the next render; `setFocusPaused` makes sure that render agrees.
  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (track) track.dataset.paused = "true";
    setFocusPaused(true);
    const target = event.target;
    requestAnimationFrame(() => {
      target.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  };

  // Only resume when focus leaves the group entirely (relatedTarget outside
  // the track), and never override an explicit pause-button press.
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    const nextTarget = event.relatedTarget as Node | null;
    if (nextTarget && track.contains(nextTarget)) return;
    setFocusPaused(false);
    if (paused) return;
    track.dataset.paused = "false";
    const viewport = viewportRef.current;
    if (viewport) viewport.scrollLeft = 0;
  };

  // jsx
  return (
    <div ref={ref} className={cn(styles.root({ className }))} {...rest}>
      <div ref={viewportRef} className={cn(styles.viewport())}>
        <div
          ref={trackRef}
          className={cn(styles.track({ speed }))}
          style={{ "--marquee-copies": copies } as CSSProperties}
          data-paused={paused || focusPaused}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {Array.from({ length: copies }, (_, index) => (
            <div
              key={index}
              className={cn(styles.group({ gap }), index > 0 && styles.duplicate())}
              aria-hidden={index > 0 || undefined}
              inert={index > 0}
            >
              {children}
            </div>
          ))}
        </div>
      </div>
      <Button
        type="button"
        className={cn(styles.control())}
        aria-label={paused ? resumeLabel : pauseLabel}
        size="icon"
        variant="primary"
        onClick={handleToggle}
      >
        {paused ? (
          <PlayIcon className="size-4" aria-hidden="true" />
        ) : (
          <PauseIcon className="size-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
});
Marquee.displayName = "Marquee";

export { Marquee };
