import type { Event } from "@/types/event";
import { inferTags } from "@/utils/luma/tags";
import { generatedLumaEvents } from "./luma-events.generated";

// --- Types ---

/**
 * One past event as scraped from the Luma API by `pnpm scrape:luma`. Keyed by
 * Luma event id in `luma-events.generated.ts`. Only machine-owned fields live
 * here; pitch, sponsors, recap links and the like are curated by hand in
 * `events.ts`, which wins over this data when both describe the same event.
 */
export interface LumaEvent {
  title: string;
  start_at: string;
  end_at: string;
  timezone: string;
  /** Event URL as the API reports it, `https://luma.com/<slug>`. */
  url: string;
  /** Site-absolute path of the downloaded cover under `public/`, or null if the event had none. */
  cover: string | null;
  /** Venue line as Luma shows it, or null for online events and events with no address. */
  location: string | null;
  meeting_url: string | null;
}

// --- Data ---

export function toEvent(id: string, lumaEvent: LumaEvent): Event {
  return {
    id,
    title: lumaEvent.title,
    start_at: lumaEvent.start_at,
    tags: inferTags(lumaEvent.title, lumaEvent.url),
    status: Date.now() > new Date(lumaEvent.start_at).valueOf() ? "past" : "upcoming",
    eventUrl: lumaEvent.url,
    cover_url: lumaEvent.cover,
    guest_count: 0,
    meeting_url: lumaEvent.meeting_url,
    geo_address_info: lumaEvent.location ? { address: lumaEvent.location } : null,
  };
}

// Widen the generated literal (whose keys are the real event ids) to a plain
// record so the adapter below is typed the same whether the archive is empty
// or populated.
const archive: Record<string, LumaEvent> = generatedLumaEvents;

/** Scraped Luma events in the site's `Event` shape, newest first. */
export const lumaEvents: Event[] = Object.entries(archive)
  .map(([id, lumaEvent]) => toEvent(id, lumaEvent))
  .sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime());
