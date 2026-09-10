"use client";

import { useState, useMemo, useEffect } from "react";
import { LayoutGrid, List, Columns2, Calendar, MapPin, Camera, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/ui/event-card";
import type { Event } from "@/app/events/actions";
import Image from "next/image";

type CategoryFilter = "all" | "tech-talks" | "build-nights" | "coffee-chats" | "socials" | "sports" | "other";
type DisplayMode = "cards" | "grid" | "list";

const CATEGORY_TAGS: Record<Exclude<CategoryFilter, "all" | "other">, string[]> = {
  "tech-talks": ["Tech Talk", "Panel", "Workshop"],
  "build-nights": ["Build Night"],
  "coffee-chats": ["Coffee Chat"],
  socials: ["Social"],
  sports: ["Sports"],
};

function matchesCategory(event: Event, cat: CategoryFilter): boolean {
  if (cat === "all") return true;
  if (cat === "other") {
    return !Object.values(CATEGORY_TAGS)
      .flat()
      .some((t) => event.tags.includes(t));
  }
  const required = CATEGORY_TAGS[cat];
  if (cat === "socials") {
    return event.tags.includes("Social") && !event.tags.includes("CodeDiversity") && !event.tags.includes("Sports");
  }
  return required.some((t) => event.tags.includes(t));
}

interface EventBrowserProps {
  events: Event[];
}

const PAGE_SIZE = 20;

export function EventBrowser({ events }: EventBrowserProps) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("cards");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let result = events.filter((e) => {
      if (!matchesCategory(e, category)) return false;
      return true;
    });

    result = result.sort((a, b) => {
      if (a.status !== b.status) return a.status === "upcoming" ? -1 : 1;
      const diff = new Date(a.start_at).getTime() - new Date(b.start_at).getTime();
      return a.status === "upcoming" ? diff : -diff;
    });

    return result;
  }, [events, category]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "tech-talks", label: "Tech Talks" },
    { id: "build-nights", label: "Build Nights" },
    { id: "coffee-chats", label: "Coffee Chats" },
    { id: "socials", label: "Socials" },
    { id: "sports", label: "Sports" },
    { id: "other", label: "Other" },
  ];

  return (
    <div>
      {/* Controls */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 md:flex-row md:rounded-full md:p-3">
        {/* Category filters */}
        <div className="flex flex-wrap items-center justify-center gap-1 md:justify-start">
          {categories.map((c) => (
            <Button
              key={c.id}
              variant="nav"
              size="sm"
              isActive={category === c.id}
              onClick={() => setCategory(c.id)}
              className="cursor-pointer"
            >
              {c.label}
            </Button>
          ))}
        </div>

        {/* Display mode */}
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="nav"
            size="icon"
            isActive={displayMode === "cards"}
            onClick={() => setDisplayMode("cards")}
            className="size-7 cursor-pointer"
            aria-label="Cards view"
            title="Cards view"
          >
            <Columns2 className="size-3.5" />
          </Button>
          <Button
            variant="nav"
            size="icon"
            isActive={displayMode === "grid"}
            onClick={() => setDisplayMode("grid")}
            className="size-7 cursor-pointer"
            aria-label="Grid view"
            title="Grid view"
          >
            <LayoutGrid className="size-3.5" />
          </Button>
          <Button
            variant="nav"
            size="icon"
            isActive={displayMode === "list"}
            onClick={() => setDisplayMode("list")}
            className="size-7 cursor-pointer"
            aria-label="List view"
            title="List view"
          >
            <List className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Result count */}
      <p className="mb-6 text-center text-xs text-muted-foreground">
        {filtered.length} event{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Events */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">No events match the current filters.</div>
      ) : displayMode === "cards" ? (
        <CardsView events={visible} />
      ) : displayMode === "grid" ? (
        <GridView events={visible} />
      ) : (
        <ListView events={visible} />
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => setVisibleCount((n) => n + PAGE_SIZE)} className="cursor-pointer">
            Load more ({filtered.length - visibleCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}

function CardsView({ events }: { events: Event[] }) {
  return (
    <>
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        {events.slice(0, 2).map((e) => (
          <EventCard key={e.id} event={e} variant="featured" />
        ))}
      </div>
      {events.length > 2 && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {events.slice(2).map((e) => (
            <EventCard key={e.id} event={e} variant="compact" />
          ))}
        </div>
      )}
    </>
  );
}

function GridView({ events }: { events: Event[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {events.map((event) => {
        const img = event.imagePath;
        const isUpcoming = event.status === "upcoming";
        const dateObj = new Date(event.start_at);
        const formattedDate = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "America/Toronto",
        });
        const locationText = event.host ? event.host.name : (event.venue ?? null);
        const locationUrl = event.host?.url ?? null;

        return (
          <div
            key={event.id}
            className="group relative aspect-square overflow-hidden rounded-xl bg-muted has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-ring"
          >
            {img ? (
              <Image
                src={img}
                alt={event.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="gradient-brand size-full" />
            )}

            {/* Always-visible overlay */}
            <div className="gradient-overlay-brand absolute inset-0 flex flex-col justify-end gap-1 p-3">
              <Badge variant={isUpcoming ? "warning" : "secondary"} size="sm" className="self-start">
                {isUpcoming ? "Upcoming" : "Past"}
              </Badge>
              {event.tags[0] && <span className="text-[10px] text-white">{event.tags[0]}</span>}

              {/* Primary link: grows a pseudo-element that covers the whole
                  card, so the card behaves as a block link. */}
              <p className="line-clamp-2 text-xs leading-snug font-semibold text-white">
                {event.eventUrl ? (
                  <a
                    href={event.eventUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="after:absolute after:inset-0 hover:underline focus-visible:outline-none"
                  >
                    {event.title}
                  </a>
                ) : (
                  event.title
                )}
              </p>

              <div className="flex items-center gap-1 text-[10px] text-white">
                <Calendar className="size-2.5 shrink-0" aria-hidden="true" />
                <span>{formattedDate}</span>
              </div>

              {locationText && (
                <div className="flex items-center gap-1 text-[10px] text-white">
                  <MapPin className="size-2.5 shrink-0" aria-hidden="true" />
                  {locationUrl ? (
                    <a
                      href={locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 truncate hover:underline"
                    >
                      {locationText}
                    </a>
                  ) : (
                    <span className="truncate">{locationText}</span>
                  )}
                </div>
              )}

              {(event.albumUrl || event.youtubeUrl) && (
                <div className="flex flex-wrap gap-1 pt-0.5">
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
          </div>
        );
      })}
    </div>
  );
}

function ListView({ events }: { events: Event[] }) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
      {events.map((event) => {
        const dateObj = new Date(event.start_at);
        const formattedDate = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "America/Toronto",
        });
        const location = event.host ? event.host.name : event.venue;

        return (
          <div key={event.id} className="flex items-center gap-4 bg-card px-4 py-3 transition-colors hover:bg-muted/50">
            <div className="w-20 shrink-0 text-xs text-muted-foreground">
              <Calendar className="mr-1 inline size-3" aria-hidden="true" />
              {formattedDate}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {event.eventUrl ? (
                  <a href={event.eventUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {event.title}
                  </a>
                ) : (
                  event.title
                )}
              </p>
              {location && (
                <p className="truncate text-xs text-muted-foreground">
                  <MapPin className="mr-0.5 inline size-2.5" aria-hidden="true" />
                  {event.host ? (
                    <a href={event.host.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {location}
                    </a>
                  ) : (
                    location
                  )}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {event.tags[0] && (
                <span className="hidden text-[10px] text-muted-foreground sm:inline">{event.tags[0]}</span>
              )}
              <Badge variant={event.status === "upcoming" ? "warning" : "secondary"} size="sm">
                {event.status === "upcoming" ? "Upcoming" : "Past"}
              </Badge>
              {event.albumUrl && (
                <a
                  href={event.albumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Camera className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">Photos from {event.title}</span>
                </a>
              )}
              {event.youtubeUrl && (
                <a
                  href={event.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Play className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">Recap from {event.title}</span>
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
