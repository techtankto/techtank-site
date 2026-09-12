"use client";

import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { PauseIcon, PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, cva } from "@/utils/theme";

const styles = {
  root: cva("relative"),
  video: cva("size-full object-cover"),
  control: cva("absolute right-2 bottom-2 z-10"),
};

type AutoplayVideoRef = HTMLDivElement;
type AutoplayVideoProps = Omit<HTMLAttributes<AutoplayVideoRef>, "children"> & {
  /** Path to the mp4 source. A webm sibling is derived by swapping the extension. */
  src: string;
  /** Text alternative for the clip's content, rendered as adjacent DOM text (WCAG 1.2.1). */
  description: string;
  /** Poster image shown before playback starts. */
  poster?: string;
  /** WebVTT captions track, rendered only once a transcript exists for this clip. */
  captionsSrc?: string;
  /** Passed straight through to the `<video>` element's `preload`. */
  preload?: "auto" | "metadata" | "none";
  /** Visual treatment for the `<video>` element itself, separate from the root's layout `className`. */
  videoClassName?: string;
  /** Accessible label for the control while the video is playing. */
  pauseLabel?: string;
  /** Accessible label for the control while the video is paused. */
  resumeLabel?: string;
};

const AutoplayVideo = forwardRef<AutoplayVideoRef, AutoplayVideoProps>((props, ref) => {
  // props
  const {
    src,
    description,
    poster,
    captionsSrc,
    preload,
    videoClassName,
    pauseLabel = "Pause video",
    resumeLabel = "Play video",
    className,
    ...rest
  } = props;

  // hooks
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);

  // Playback is driven entirely by play()/pause() calls, never by a static
  // `autoPlay` attribute, so toggling the control never restarts the clip.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setPaused(false);
    const handlePause = () => setPaused(true);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncWithMotionPreference = () => {
      if (query.matches) {
        video.pause();
      } else {
        void video.play().catch(() => {
          // Autoplay can be blocked by the browser; the visible control still lets a
          // visitor start playback, so a rejected play() here is not an error state.
        });
      }
    };
    syncWithMotionPreference();
    query.addEventListener("change", syncWithMotionPreference);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      query.removeEventListener("change", syncWithMotionPreference);
    };
  }, []);

  // render vars
  const handleToggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const videoElement: ReactNode = (
    <video
      ref={videoRef}
      loop
      muted
      playsInline
      preload={preload}
      poster={poster}
      className={cn(styles.video(), videoClassName)}
    >
      <source src={src.replace(/\.mp4$/, ".webm")} type="video/webm" />
      <source src={src} type="video/mp4" />
      {captionsSrc && <track kind="captions" srcLang="en" src={captionsSrc} default />}
    </video>
  );

  // jsx
  return (
    <div ref={ref} className={cn(styles.root({ className }))} {...rest}>
      {videoElement}
      <p className="sr-only">{description}</p>
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
AutoplayVideo.displayName = "AutoplayVideo";

export { AutoplayVideo };
export type { AutoplayVideoProps, AutoplayVideoRef };
