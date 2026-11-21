import type { LumaEvent } from "../../constants/luma-events";
import type { LumaApiEvent } from "../../utils/luma/schema";
import { isLocationPublic } from "../../utils/luma/visibility";

// A cover the shell must fetch and write under public/.
export interface Download {
  sourceUrl: string;
  destPath: string;
}

export interface TransformResult {
  key: string;
  event: LumaEvent;
  download?: Download;
}

export const COVER_DIR = "/images/luma";
// Luma event ids look like `evt-AbC123xyz`. The id becomes a filename segment,
// so anything outside this set is rejected rather than risk a path escape.
const ID_PATTERN = /^[A-Za-z0-9_-]+$/;
const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

// Luma CDN URLs end in the original upload's filename (`.../<uuid>.png`), so
// keep that extension; fall back to jpg when it isn't a recognisable image.
export function coverExtension(url: string): string {
  const last = new URL(url).pathname.split("/").pop() ?? "";
  const ext = last.includes(".") ? last.split(".").pop()!.toLowerCase() : "";
  return IMAGE_EXTENSIONS.has(ext) ? ext : "jpg";
}

export function transformEvent(raw: LumaApiEvent): TransformResult {
  if (!ID_PATTERN.test(raw.id)) {
    throw new Error(`Unexpected event id (not a safe filename): ${raw.id}`);
  }
  const download: Download | undefined = raw.cover_url
    ? { sourceUrl: raw.cover_url, destPath: `${COVER_DIR}/${raw.id}.${coverExtension(raw.cover_url)}` }
    : undefined;

  const event: LumaEvent = {
    title: raw.name,
    start_at: raw.start_at,
    end_at: raw.end_at,
    timezone: raw.timezone,
    url: raw.url,
    cover: download?.destPath ?? null,
    // Never committed for guests-only events: the archive is public, and the
    // address may be someone's home or a private office.
    location: isLocationPublic(raw) ? (raw.geo_address_json?.address ?? null) : null,
    meeting_url: raw.meeting_url ?? null,
  };

  return { key: raw.id, event, download };
}
