"use client";

import { Camera, Calendar, MapPin, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/app/events/actions";

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

  // The primary link: it carries the card's accessible name and grows a
  // pseudo-element that extends its hit area to cover the whole card, so
  // the card behaves as a block link without nesting an anchor around it.
  const TitleWrapper = event.eventUrl
    ? ({ children }: { children: React.ReactNode }) => (
        <a
          href={event.eventUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-card-link
          className="after:absolute after:inset-0 hover:underline focus-visible:outline-none"
        >
          {children}
        </a>
      )
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  if (variant === "featured") {
    return (
      <div className="group glass relative overflow-hidden rounded-2xl has-[[data-card-link]:focus-visible]:outline-2 has-[[data-card-link]:focus-visible]:outline-offset-2 has-[[data-card-link]:focus-visible]:outline-ring">
        <div className="p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant={isUpcoming ? "warning" : "secondary"}>{isUpcoming ? "Upcoming" : "Past"}</Badge>
            {event.tags[0] && <span className="ml-auto text-xs text-muted-foreground">{event.tags[0]}</span>}
          </div>

          <h3 className="mb-2 line-clamp-2 font-display text-xl font-bold text-foreground">
            <TitleWrapper>{event.title}</TitleWrapper>
          </h3>

          {event.pitch && <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{event.pitch}</p>}

          <div className="mb-1.5 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4 shrink-0" aria-hidden="true" />
            <span>{formattedDate}</span>
            {showTime && <span>· {formattedTime}</span>}
          </div>

          {locationText && (
            <div className="mb-1.5 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {locationUrl ? (
                <a
                  href={locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 hover:underline"
                >
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
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 hover:underline"
                >
                  {s.name}
                </a>
              ))}
            </div>
          )}

          {(event.albumUrl || event.youtubeUrl) && (
            <div className="flex flex-wrap items-center gap-2">
              {event.albumUrl && (
                <Badge variant="secondary" asChild className="relative z-10">
                  <a href={event.albumUrl} target="_blank" rel="noopener noreferrer">
                    <Camera className="size-3" aria-hidden="true" />
                    Photos<span className="sr-only"> from {event.title}</span>
                  </a>
                </Badge>
              )}
              {event.youtubeUrl && (
                <Badge variant="secondary" asChild className="relative z-10">
                  <a href={event.youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <Play className="size-3 fill-current" aria-hidden="true" />
                    Recap<span className="sr-only"> from {event.title}</span>
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
    <div className="group glass relative flex flex-col rounded-xl p-4 transition-all duration-300 has-[[data-card-link]:focus-visible]:outline-2 has-[[data-card-link]:focus-visible]:outline-offset-2 has-[[data-card-link]:focus-visible]:outline-ring">
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <Badge variant={isUpcoming ? "warning" : "secondary"} size="sm">
          {isUpcoming ? "Upcoming" : "Past"}
        </Badge>
        {event.tags[0] && <span className="ml-auto text-[10px] text-muted-foreground">{event.tags[0]}</span>}
      </div>

      <h3 className="mb-2 line-clamp-2 font-display text-sm font-bold text-foreground">
        <TitleWrapper>{event.title}</TitleWrapper>
      </h3>

      <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Calendar className="size-3 shrink-0" aria-hidden="true" />
        <span>{formattedDate}</span>
      </div>

      {locationText && (
        <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" aria-hidden="true" />
          {locationUrl ? (
            <a
              href={locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 line-clamp-1 hover:underline"
            >
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
              className="relative z-10 line-clamp-1 hover:underline"
            >
              {s.name}
            </a>
          ))}
        </div>
      )}

      {(event.albumUrl || event.youtubeUrl) && (
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          {event.albumUrl && (
            <Badge variant="secondary" size="sm" asChild className="relative z-10">
              <a href={event.albumUrl} target="_blank" rel="noopener noreferrer">
                <Camera className="size-2.5" aria-hidden="true" />
                Photos<span className="sr-only"> from {event.title}</span>
              </a>
            </Badge>
          )}
          {event.youtubeUrl && (
            <Badge variant="secondary" size="sm" asChild className="relative z-10">
              <a href={event.youtubeUrl} target="_blank" rel="noopener noreferrer">
                <Play className="size-2.5 fill-current" aria-hidden="true" />
                Recap<span className="sr-only"> from {event.title}</span>
              </a>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
