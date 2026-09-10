"use client";

import type { ReactNode } from "react";
import { Camera, Calendar, MapPin, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/app/events/actions";

interface EventTitleProps {
  href?: string;
  children: ReactNode;
}

/**
 * Links the title out to the event page when there is one, and renders the
 * title bare when there is not.
 */
function EventTitle({ href, children }: EventTitleProps) {
  if (!href) return <>{children}</>;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">
      {children}
    </a>
  );
}

interface EventCardProps {
  event: Event;
  variant?: "featured" | "compact";
}

export function EventCard({ event, variant = "compact" }: EventCardProps) {
  const isUpcoming = event.status === "upcoming";

  const dateObj = new Date(event.start_at);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Toronto",
  });
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Toronto",
  });
  const showTime = !event.start_at.includes("T12:00:00");

  const locationText = event.host ? event.host.name : (event.venue ?? null);
  const locationUrl = event.host?.url ?? null;

  if (variant === "featured") {
    return (
      <div className="group glass relative overflow-hidden rounded-2xl">
        <div className="p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant={isUpcoming ? "warning" : "secondary"}>{isUpcoming ? "Upcoming" : "Past"}</Badge>
            {event.tags[0] && <span className="ml-auto text-xs text-muted-foreground">{event.tags[0]}</span>}
          </div>

          <h3 className="mb-2 line-clamp-2 font-display text-xl font-bold text-foreground">
            <EventTitle href={event.eventUrl}>{event.title}</EventTitle>
          </h3>

          {event.pitch && <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{event.pitch}</p>}

          <div className="mb-1.5 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4 shrink-0" />
            <span>{formattedDate}</span>
            {showTime && <span className="text-muted-foreground/60">· {formattedTime}</span>}
          </div>

          {locationText && (
            <div className="mb-1.5 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              {locationUrl ? (
                <a href={locationUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {locationText}
                </a>
              ) : (
                <span>{locationText}</span>
              )}
            </div>
          )}

          {event.sponsors && event.sponsors.length > 0 && (
            <div className="mb-3 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              {event.sponsors.map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {s.name}
                </a>
              ))}
            </div>
          )}

          {(event.albumUrl || event.youtubeUrl) && (
            <div className="flex flex-wrap items-center gap-2">
              {event.albumUrl && (
                <Badge variant="secondary" asChild>
                  <a href={event.albumUrl} target="_blank" rel="noopener noreferrer" aria-label="View event photos">
                    <Camera className="size-3" />
                    Photos
                  </a>
                </Badge>
              )}
              {event.youtubeUrl && (
                <Badge variant="secondary" asChild>
                  <a
                    href={event.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Watch recap on YouTube"
                  >
                    <Play className="size-3 fill-current" />
                    Recap
                  </a>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group glass relative flex flex-col rounded-xl p-4 transition-all duration-300">
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <Badge variant={isUpcoming ? "warning" : "secondary"} size="sm">
          {isUpcoming ? "Upcoming" : "Past"}
        </Badge>
        {event.tags[0] && <span className="ml-auto text-[10px] text-muted-foreground">{event.tags[0]}</span>}
      </div>

      <h3 className="mb-2 line-clamp-2 font-display text-sm font-bold text-foreground">
        <EventTitle href={event.eventUrl}>{event.title}</EventTitle>
      </h3>

      <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Calendar className="size-3 shrink-0" />
        <span>{formattedDate}</span>
      </div>

      {locationText && (
        <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          {locationUrl ? (
            <a href={locationUrl} target="_blank" rel="noopener noreferrer" className="line-clamp-1 hover:underline">
              {locationText}
            </a>
          ) : (
            <span className="line-clamp-1">{locationText}</span>
          )}
        </div>
      )}

      {event.sponsors && event.sponsors.length > 0 && (
        <div className="mb-2 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          {event.sponsors.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="line-clamp-1 hover:underline"
            >
              {s.name}
            </a>
          ))}
        </div>
      )}

      {(event.albumUrl || event.youtubeUrl) && (
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          {event.albumUrl && (
            <Badge variant="secondary" size="sm" asChild>
              <a href={event.albumUrl} target="_blank" rel="noopener noreferrer" aria-label="View event photos">
                <Camera className="size-2.5" />
                Photos
              </a>
            </Badge>
          )}
          {event.youtubeUrl && (
            <Badge variant="secondary" size="sm" asChild>
              <a href={event.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="Watch recap on YouTube">
                <Play className="size-2.5 fill-current" />
                Recap
              </a>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
