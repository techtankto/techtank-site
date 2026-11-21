import {
  EVENT_LIST_ENDPOINT,
  LUMA_API_BASE_URL,
  lumaEventListPageSchema,
  type LumaApiEvent,
  type LumaEventListPage,
} from "../../utils/luma/schema";

export interface LumaConfig {
  apiKey: string;
  baseUrl?: string;
  pageSize?: number;
}

const DEFAULT_PAGE_SIZE = 50;
// Hard stop on the cursor walk. 100 pages of 50 is thousands of events, far
// beyond the calendar's history, so hitting it means the API is misbehaving.
const MAX_PAGES = 100;
const FETCH_TIMEOUT_MS = 30_000;

export function buildEventListUrl(config: LumaConfig, params: { before: Date; cursor?: string | null }): string {
  const url = new URL(`${config.baseUrl ?? LUMA_API_BASE_URL}${EVENT_LIST_ENDPOINT}`);
  url.searchParams.set("pagination_limit", String(config.pageSize ?? DEFAULT_PAGE_SIZE));
  url.searchParams.set("before", params.before.toISOString());
  if (params.cursor) url.searchParams.set("pagination_cursor", params.cursor);
  return url.toString();
}

export async function fetchEventListPage(
  url: string,
  apiKey: string,
  fetchImpl: typeof fetch = fetch,
): Promise<LumaEventListPage> {
  const res = await fetchImpl(url, {
    headers: { "x-luma-api-key": apiKey },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Luma API request failed (${res.status}): ${body}`);
  }
  return lumaEventListPageSchema.parse(await res.json());
}

// Walks every page of events that started before `before`. Unlike the runtime
// fetch (which reads one page of 10 on every request), the archive wants the
// full history, so it follows next_cursor until has_more is false.
export async function fetchPastEvents(
  config: LumaConfig,
  before: Date,
  fetchImpl: typeof fetch = fetch,
): Promise<LumaApiEvent[]> {
  const events: LumaApiEvent[] = [];
  let cursor: string | null | undefined;
  for (let pages = 0; pages < MAX_PAGES; pages++) {
    const page = await fetchEventListPage(buildEventListUrl(config, { before, cursor }), config.apiKey, fetchImpl);
    events.push(...page.entries);
    if (!page.has_more || !page.next_cursor) return events;
    cursor = page.next_cursor;
  }
  throw new Error(`Gave up after ${MAX_PAGES} pages; the Luma API kept reporting has_more`);
}
