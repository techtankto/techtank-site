import { mediaResponseSchema, type MediaResponse } from "./schema";

export interface GraphConfig {
  userId: string;
  accessToken: string;
  version: string;
  limit: number;
  baseUrl?: string;
}

const MEDIA_FIELDS =
  "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp," +
  "children{id,media_type,media_url,thumbnail_url}";

export function buildMediaUrl(config: GraphConfig): string {
  const base = config.baseUrl ?? "https://graph.instagram.com";
  const url = new URL(`${base}/${config.version}/${config.userId}/media`);
  url.searchParams.set("fields", MEDIA_FIELDS);
  url.searchParams.set("limit", String(config.limit));
  url.searchParams.set("access_token", config.accessToken);
  return url.toString();
}

// Fetches a single (most-recent) page of media. Deliberately not paginating all
// history: one page per run keeps us well within rate limits, and the merge step
// only ever adds genuinely new posts.
export async function fetchRecentMedia(config: GraphConfig, fetchImpl: typeof fetch = fetch): Promise<MediaResponse> {
  const res = await fetchImpl(buildMediaUrl(config), {
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Graph API request failed (${res.status}): ${body}`);
  }
  return mediaResponseSchema.parse(await res.json());
}
