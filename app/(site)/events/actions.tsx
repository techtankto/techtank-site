"use server";

import type { Event } from "@/types/event";

import { z } from "zod";
import { REMOTE_IMAGE_HOSTS } from "@/constants/remote-images";

const LUMA_CALENDAR_ID = process.env.LUMA_CALENDAR_ID;
const LUMA_API_KEY = process.env.LUMA_API_KEY;

const LUMA_API_BASE_URL = "https://public-api.luma.com";
const EVENT_LIST_ENDPOINT = "/v1/calendars/events/list";
const GUEST_LIST_ENDPOINT = "/v1/events/guests/list";

const CACHE_DURATION_IN_SECONDS = 60; // 1 minute

const ImageUrlSchema = z
  .url({ protocol: /^https$/ })
  .refine((url) => REMOTE_IMAGE_HOSTS.includes(new URL(url).hostname));

const EventSchema = z.object({
  id: z.string(),
  name: z.string(),
  start_at: z.string(),
  duration_interval: z.string(),
  end_at: z.string(),
  timezone: z.string(),
  geo_address_json: z
    .object({
      address: z.string().nullish(),
      city: z.string().nullish(),
      region: z.string().nullish(),
      country: z.string().nullish(),
      city_state: z.string().nullish(),
      full_address: z.string().nullish(),
      google_maps_place_id: z.string().nullish(),
      apple_maps_place_id: z.string().nullish(),
      description: z.string().nullish(),
    })
    .nullish(),
  coordinate: z
    .object({
      longitude: z.number(),
      latitude: z.number(),
    })
    .nullish(),
  meeting_url: z.string().nullish(),
  cover_url: ImageUrlSchema.nullish(),
  url: z.url(),
  max_capacity: z.number().nullish(),
  spots_remaining: z.number().nullish(),
});

const GuestSchema = z.object({
  id: z.string(),
  user_name: z.string(),
});

const EventListPageSchema = z.object({
  entries: EventSchema.array(),
  has_more: z.boolean(),
  next_cursor: z.string().nullish(),
});

const GuestListPageSchema = z.object({
  entries: GuestSchema.array(),
  has_more: z.boolean(),
  next_cursor: z.string().nullish(),
});

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
const TAG_OVERRIDE_BY_URL: Record<string, string[]> = {
  "https://luma.com/d114actf": ["Social"], // Touch Grass: Stretch in the Park x Creative Blocks
};

function inferTags(title: string, url: string): string[] {
  const tags = [
    ...(TAG_OVERRIDE_BY_URL[url] ?? []),
    ...TITLE_TAG_RULES.filter(({ pattern }) => pattern.test(title)).flatMap(({ tags }) => tags),
  ];
  return [...new Set(tags)];
}

function transformToEvent(rawEvent: z.infer<typeof EventSchema>, rawGuests: z.infer<typeof GuestSchema>[]): Event {
  return {
    id: rawEvent.id,
    title: rawEvent.name,
    start_at: rawEvent.start_at,
    tags: inferTags(rawEvent.name, rawEvent.url),
    status: Date.now() > new Date(rawEvent.start_at).valueOf() ? "past" : "upcoming",
    eventUrl: rawEvent.url,
    cover_url: rawEvent.cover_url,
    guest_count: (rawEvent.max_capacity ?? 0) - (rawEvent.spots_remaining ?? 0),
    featured_guests: rawGuests.map((rawGuest) => ({ name: rawGuest.user_name })),
    meeting_url: rawEvent.meeting_url,
    geo_address_info: rawEvent.geo_address_json,
  };
}

async function fetchGuests(eventId: string) {
  if (!LUMA_CALENDAR_ID || !LUMA_API_KEY) return [];
  const search = new URLSearchParams();
  search.append("event_id", eventId);
  search.append("approval_status", "approved");
  search.append("pagination_limit", "10");
  const url = new URL(`${LUMA_API_BASE_URL}${GUEST_LIST_ENDPOINT}?${search}`);
  const res = await fetch(url, {
    cache: "force-cache",
    next: {
      revalidate: CACHE_DURATION_IN_SECONDS,
    },
    headers: {
      "x-luma-api-key": LUMA_API_KEY,
    },
  });
  if (!res.ok) {
    throw new Error(`Luma request to ${url.pathname} failed with HTTP ${res.status}`);
  }
  const json = await res.json();
  const guestListPage = GuestListPageSchema.parse(json);
  return guestListPage.entries;
}

async function fetchLumaEvents(status: "upcoming" | "past"): Promise<Event[]> {
  if (!LUMA_CALENDAR_ID || !LUMA_API_KEY) return [];
  const search = new URLSearchParams();
  search.append("pagination_limit", "10");
  switch (status) {
    case "upcoming":
      search.append("after", new Date().toISOString());
      break;
    case "past":
      search.append("before", new Date().toISOString());
      break;
  }
  const url = new URL(`${LUMA_API_BASE_URL}${EVENT_LIST_ENDPOINT}?${search}`);
  const res = await fetch(url, {
    cache: "force-cache",
    next: {
      revalidate: CACHE_DURATION_IN_SECONDS,
    },
    headers: {
      "x-luma-api-key": LUMA_API_KEY,
    },
  });
  if (!res.ok) {
    throw new Error(`Luma request to ${url.pathname} failed with HTTP ${res.status}`);
  }
  const json = await res.json();
  const eventListPage = EventListPageSchema.parse(json);
  const rawEvents = eventListPage.entries;
  return Promise.all(
    rawEvents.map(async (rawEvent) => {
      const rawGuests = await fetchGuests(rawEvent.id);
      return transformToEvent(rawEvent, rawGuests);
    }),
  );
}

export async function getAllLumaEvents(): Promise<{
  upcoming: Event[];
  past: Event[];
}> {
  const [upcoming, past] = await Promise.all([fetchLumaEvents("upcoming"), fetchLumaEvents("past")]);

  return { upcoming, past };
}
