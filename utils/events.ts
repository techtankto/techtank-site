import type { Event } from "@/types/event";
import { getLumaSlug } from "./luma/slug";

/**
 * Combine event sources in priority order. A later source only contributes
 * events whose Luma slug no earlier source already has, so hand-curated
 * entries in `constants/events.ts` win over scraped and live Luma data, and
 * scraped data wins over the live fetch. Events without a Luma URL (Meetup
 * era) are always kept.
 */
export function mergeEventSources(sources: Event[][]): Event[] {
  const seen = new Set<string>();
  const merged: Event[] = [];
  for (const source of sources) {
    const kept = source.filter((event) => {
      const slug = getLumaSlug(event.eventUrl);
      return !(slug && seen.has(slug));
    });
    for (const event of kept) {
      const slug = getLumaSlug(event.eventUrl);
      if (slug) seen.add(slug);
    }
    merged.push(...kept);
  }
  return merged;
}

/**
 * Display order shared by the `/events` browser and the homepage: upcoming
 * events first, soonest first, then past events, most recent first. Returns
 * a new array.
 */
export function sortForDisplay(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    if (a.status !== b.status) return a.status === "upcoming" ? -1 : 1;
    const diff = new Date(a.start_at).getTime() - new Date(b.start_at).getTime();
    return a.status === "upcoming" ? diff : -diff;
  });
}
