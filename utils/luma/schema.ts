import { z } from "zod";
import { REMOTE_IMAGE_HOSTS } from "@/constants/remote-images";

// Luma public API (https://docs.luma.com/reference). Shared by the runtime
// fetch in app/(site)/events/actions.tsx and the archive scraper in
// scripts/luma/, so both validate the same payload shape.

export const LUMA_API_BASE_URL = "https://public-api.luma.com";
export const EVENT_LIST_ENDPOINT = "/v1/calendars/events/list";
export const GUEST_LIST_ENDPOINT = "/v1/events/guests/list";

const imageUrlSchema = z
  .url({ protocol: /^https$/ })
  .refine((url) => REMOTE_IMAGE_HOSTS.includes(new URL(url).hostname));

export const lumaEventSchema = z.object({
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
  /** "offline" for in-person events; the meeting platform (e.g. "meet", "zoom") for online ones. */
  location_type: z.string().nullish(),
  visibility: z.string().nullish(),
  location_visibility: z.string().nullish(),
  cover_url: imageUrlSchema.nullish(),
  url: z.url(),
  max_capacity: z.number().nullish(),
  spots_remaining: z.number().nullish(),
});

export const lumaGuestSchema = z.object({
  id: z.string(),
  user_name: z.string(),
});

export const lumaEventListPageSchema = z.object({
  entries: lumaEventSchema.array(),
  has_more: z.boolean(),
  next_cursor: z.string().nullish(),
});

export const lumaGuestListPageSchema = z.object({
  entries: lumaGuestSchema.array(),
  has_more: z.boolean(),
  next_cursor: z.string().nullish(),
});

export type LumaApiEvent = z.infer<typeof lumaEventSchema>;
export type LumaApiGuest = z.infer<typeof lumaGuestSchema>;
export type LumaEventListPage = z.infer<typeof lumaEventListPageSchema>;
