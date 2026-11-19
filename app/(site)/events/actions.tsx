"use server";

import type { Event } from "@/types/event";

import {
  EVENT_LIST_ENDPOINT,
  GUEST_LIST_ENDPOINT,
  LUMA_API_BASE_URL,
  lumaEventListPageSchema,
  lumaGuestListPageSchema,
  type LumaApiEvent,
  type LumaApiGuest,
} from "@/utils/luma/schema";
import { inferTags } from "@/utils/luma/tags";
import { isListable, isLocationPublic } from "@/utils/luma/visibility";

const LUMA_CALENDAR_ID = process.env.LUMA_CALENDAR_ID;
const LUMA_API_KEY = process.env.LUMA_API_KEY;

const CACHE_DURATION_IN_SECONDS = 60; // 1 minute

function transformToEvent(rawEvent: LumaApiEvent, rawGuests: LumaApiGuest[]): Event {
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
    geo_address_info: isLocationPublic(rawEvent) ? rawEvent.geo_address_json : null,
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
  const guestListPage = lumaGuestListPageSchema.parse(json);
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
  const eventListPage = lumaEventListPageSchema.parse(json);
  const rawEvents = eventListPage.entries.filter((rawEvent) => isListable(rawEvent));
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
