import { Camera, FileText, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/types/event";

/** Every speaker deck on an event, in speaker order. */
export function getEventSlides(event: Event): { url: string; speaker: string }[] {
  return (event.speakers ?? []).flatMap((speaker) =>
    speaker.slidesUrl ? [{ url: speaker.slidesUrl, speaker: speaker.name }] : [],
  );
}

export function hasEventMedia(event: Event): boolean {
  return Boolean(event.albumUrl || event.youtubeUrl || getEventSlides(event).length > 0);
}

interface EventMediaBadgesProps {
  event: Event;
  size?: "md" | "sm";
  className?: string;
}

/**
 * Photos, Recap, and Slides links for an event card. Raised above the card's
 * full-card link (`relative z-10`) so each stays separately clickable. With
 * more than one deck, each Slides badge names its speaker.
 */
export function EventMediaBadges({ event, size = "md", className }: EventMediaBadgesProps) {
  if (!hasEventMedia(event)) return null;

  const slides = getEventSlides(event);
  const iconClass = size === "sm" ? "size-2.5" : "size-3";

  return (
    <div className={className}>
      {event.albumUrl && (
        <Badge variant="secondary" size={size} asChild className="relative z-10">
          <a href={event.albumUrl} target="_blank" rel="noopener noreferrer">
            <Camera className={iconClass} aria-hidden="true" />
            Photos<span className="sr-only"> from {event.title}</span>
          </a>
        </Badge>
      )}
      {event.youtubeUrl && (
        <Badge variant="secondary" size={size} asChild className="relative z-10">
          <a href={event.youtubeUrl} target="_blank" rel="noopener noreferrer">
            <Play className={`${iconClass} fill-current`} aria-hidden="true" />
            Recap<span className="sr-only"> from {event.title}</span>
          </a>
        </Badge>
      )}
      {slides.map(({ url, speaker }) => (
        <Badge key={url} variant="secondary" size={size} asChild className="relative z-10">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <FileText className={iconClass} aria-hidden="true" />
            {slides.length > 1 ? `Slides: ${speaker}` : "Slides"}
            <span className="sr-only">
              {slides.length > 1 ? "" : ` by ${speaker}`} from {event.title}
            </span>
          </a>
        </Badge>
      ))}
    </div>
  );
}
