"use server";

import type { Sponsor } from "@/constants/sponsors";

import { z } from "zod";

export interface Event {
  id: string;
  title: string;
  pitch?: string;
  start_at: string;
  venue?: string;
  capacity?: number;
  tags: string[];
  status: "upcoming" | "past";
  /** Event URL — prefers Luma when available, falls back to Meetup */
  eventUrl?: string;
  cover_url?: string;
  albumUrl?: string;
  youtubeUrl?: string;
  host?: Sponsor;
  hosts?:
    | {
        first_name?: string | null;
        last_name?: string | null;
        avatar_url?: string | null;
      }[]
    | null;
  guest_count: number;
  featured_guests?:
    | {
        name?: string | null;
        avatar_url?: string | null;
      }[]
    | null;
  virtual_info?: {
    raw_join_url?: string | null;
  } | null;
  geo_address_info?: {
    sublocality?: string | null;
  } | null;
  sponsors?: Sponsor[];
  speakers?: {
    name: string;
    title: string;
    company?: string;
    talkTitle?: string;
    image?: string;
  }[];
}

const LUMA_CALENDAR_ID = process.env.LUMA_CALENDAR_ID;

if (!LUMA_CALENDAR_ID) {
  console.warn("LUMA_CALENDAR_ID is not set in environment variables. Luma events will not be fetched.");
}

const LUMA_EVENT_API = new URL("https://api2.luma.com/calendar/get");
LUMA_EVENT_API.search = new URLSearchParams({
  api_id: LUMA_CALENDAR_ID || "",
}).toString();

const LUMA_EVENT_API_PAST = new URL("https://api2.luma.com/calendar/get-items");
LUMA_EVENT_API_PAST.search = new URLSearchParams({
  calendar_api_id: LUMA_CALENDAR_ID || "",
  pagination_limit: "20",
  period: "past",
}).toString();

const SIX_HOURS_IN_SECONDS = 6 * 60 * 60;

const EventSchema = z.object({
  api_id: z.string(),
  hosts: z
    .object({
      first_name: z.string().nullish(),
      last_name: z.string().nullish(),
      avatar_url: z.string().nullish(),
    })
    .array()
    .nullish(),
  guest_count: z.number(),
  featured_guests: z
    .object({
      name: z.string().nullish(),
      avatar_url: z.string().nullish(),
    })
    .array()
    .nullish(),
  event: z.object({
    api_id: z.string(),
    name: z.string(),
    start_at: z.string(),
    end_at: z.string(),
    timezone: z.string(),
    url: z.string(),
    cover_url: z.string().optional(),
    virtual_info: z
      .object({
        raw_join_url: z.string().nullish(),
      })
      .nullish(),
    geo_address_info: z
      .object({
        sublocality: z.string().nullish(),
      })
      .nullish(),
  }),
});

const LumaEventApiResponseSchema = z.object({
  featured_items: EventSchema.array(),
});

const LumaPastEventApiResponseSchema = z.object({
  entries: EventSchema.array(),
});

type LumaEventResponse = z.infer<typeof EventSchema>;

/**
 * Luma has no tag field, so scraped events arrive untyped and fall into the
 * "Other" filter. Infer type tags from the title instead. Events curated in
 * `constants/events.ts` are tagged by hand and never reach this path.
 */
const TITLE_TAG_RULES: { pattern: RegExp; tags: string[] }[] = [
  { pattern: /build night/i, tags: ["Build Night"] },
  // SUPERCOLLIDER is always a multi-community networking night.
  { pattern: /supercollider/i, tags: ["Networking", "Social", "Multi-community"] },
  { pattern: /coffee chat/i, tags: ["Coffee Chat", "Social"] },
  { pattern: /code diversity/i, tags: ["CodeDiversity"] },
  { pattern: /workshop/i, tags: ["Workshop"] },
  { pattern: /panel/i, tags: ["Panel"] },
];

/**
 * Escape hatch for events whose title carries no keyword a rule can match
 * ("Touch Grass", "Mayday Mayday"). Keyed by Luma slug. Prefer promoting an
 * event to `constants/events.ts` when it needs more than a tag.
 */
const SLUG_TAGS: Record<string, string[]> = {
  d114actf: ["Social"], // Touch Grass: Stretch in the Park x Creative Blocks
};

function inferTags(title: string, slug: string): string[] {
  const tags = [
    ...(SLUG_TAGS[slug] ?? []),
    ...TITLE_TAG_RULES.filter(({ pattern }) => pattern.test(title)).flatMap(({ tags }) => tags),
  ];
  return [...new Set(tags)];
}

function lumaCalendarResponseToEvents(parsed: LumaEventResponse[]): Event[] {
  return parsed.map(({ event, hosts, featured_guests, guest_count }) => ({
    id: event.api_id,
    title: event.name,
    start_at: event.start_at,
    tags: inferTags(event.name, event.url),
    status: Date.now() > new Date(event.start_at).valueOf() ? "past" : "upcoming",
    eventUrl: `https://luma.com/${event.url}`,
    cover_url: event.cover_url,
    hosts: hosts,
    guest_count,
    featured_guests,
    virtual_info: event.virtual_info,
    geo_address_info: event.geo_address_info,
  }));
}

async function getLumaEvents(): Promise<Event[]> {
  if (!LUMA_CALENDAR_ID) return [];
  const res = await fetch(LUMA_EVENT_API, {
    next: {
      // @ts-expect-error this is next cache policy
      cache: "force-cache",
      revalidate: SIX_HOURS_IN_SECONDS,
    },
  });
  const json = await res.json();
  const parsed = LumaEventApiResponseSchema.parse(json);
  return lumaCalendarResponseToEvents(parsed.featured_items);
}

async function getPastLumaEvents(): Promise<Event[]> {
  if (!LUMA_CALENDAR_ID) return [];
  const res = await fetch(LUMA_EVENT_API_PAST, {
    next: {
      // @ts-expect-error this is next cache policy
      cache: "force-cache",
      revalidate: SIX_HOURS_IN_SECONDS,
    },
  });
  const json = await res.json();
  const parsed = LumaPastEventApiResponseSchema.parse(json);
  return lumaCalendarResponseToEvents(parsed.entries);
}

export async function getAllLumaEvents(): Promise<{
  upcoming: Event[];
  past: Event[];
}> {
  const [upcoming, past] = await Promise.all([getLumaEvents(), getPastLumaEvents()]);

  return { upcoming, past };
}
