import type { Event } from "@/types/event";
import { inferTags } from "@/utils/luma/tags";
import { generatedLumaEvents } from "./luma-events.generated";
import { lumaEventExtras, type LumaEventExtras } from "./luma-event-extras";

// --- Types ---

/**
 * One past event as scraped from the Luma API by `pnpm scrape:luma`. Keyed by
 * Luma event id in `luma-events.generated.ts`. Only machine-owned fields live
 * here; pitch, speakers, recap links and the like are added by hand in
 * `luma-event-extras.ts`. Older curated entries in `events.ts` win over this
 * data entirely when both describe the same event.
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

// "| Online Event", "- Virtual", "(Online)" and the like at the end of a title.
const ONLINE_TITLE_SUFFIX = /\s*(?:[|–—-]\s*(?:online|virtual)(?:\s+event)?|\((?:online|virtual)(?:\s+event)?\))\s*$/i;

/**
 * An online event shows "Online" as its location, so a trailing online marker
 * in its title only repeats it. In-person titles are left alone.
 */
export function displayTitle(lumaEvent: LumaEvent): string {
  return lumaEvent.meeting_url ? lumaEvent.title.replace(ONLINE_TITLE_SUFFIX, "") : lumaEvent.title;
}

export function toEvent(id: string, lumaEvent: LumaEvent, extras: LumaEventExtras = {}): Event {
  const { tags: extraTags = [], ...rest } = extras;
  const isOnline = Boolean(lumaEvent.meeting_url) && !lumaEvent.location;
  return {
    id,
    title: displayTitle(lumaEvent),
    ...(isOnline ? { venue: "Online" } : {}),
    start_at: lumaEvent.start_at,
    tags: [...new Set([...inferTags(lumaEvent.title, lumaEvent.url), ...extraTags])],
    status: Date.now() > new Date(lumaEvent.start_at).valueOf() ? "past" : "upcoming",
    eventUrl: lumaEvent.url,
    cover_url: lumaEvent.cover,
    guest_count: 0,
    meeting_url: lumaEvent.meeting_url,
    geo_address_info: lumaEvent.location ? { address: lumaEvent.location } : null,
    ...rest,
  };
}

// Widen the generated literal (whose keys are the real event ids) to a plain
// record so the adapter below is typed the same whether the archive is empty
// or populated.
const archive: Record<string, LumaEvent> = generatedLumaEvents;
const extrasById: Record<string, LumaEventExtras | undefined> = lumaEventExtras;

/** Scraped Luma events in the site's `Event` shape, with their extras, newest first. */
export const lumaEvents: Event[] = Object.entries(archive)
  .map(([id, lumaEvent]) => toEvent(id, lumaEvent, extrasById[id]))
  .sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime());
