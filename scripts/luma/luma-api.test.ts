import { describe, expect, test, vi } from "vitest";
import { buildEventListUrl, fetchPastEvents, type LumaConfig } from "./luma-api";
import type { LumaApiEvent } from "../../utils/luma/schema";

const config: LumaConfig = { apiKey: "key", pageSize: 2 };
const before = new Date("2026-11-16T00:00:00Z");

export const apiEvent = (id: string, over: Partial<LumaApiEvent> = {}): LumaApiEvent => ({
  id,
  name: `Event ${id}`,
  start_at: "2026-06-01T22:00:00.000Z",
  duration_interval: "PT2H",
  end_at: "2026-06-02T00:00:00.000Z",
  timezone: "America/Toronto",
  url: `https://luma.com/${id}`,
  ...over,
});

const fakeFetch = (pages: Record<string, unknown>) =>
  vi.fn(async (input: string | URL | Request, _init?: RequestInit) => {
    const url = new URL(String(input));
    const cursor = url.searchParams.get("pagination_cursor") ?? "first";
    return { ok: true, json: async () => pages[cursor] };
  });

describe("buildEventListUrl", () => {
  test("sets the page size, the before bound, and the cursor when given", () => {
    const url = new URL(buildEventListUrl(config, { before, cursor: "c2" }));
    expect(url.origin + url.pathname).toBe("https://public-api.luma.com/v1/calendars/events/list");
    expect(url.searchParams.get("pagination_limit")).toBe("2");
    expect(url.searchParams.get("before")).toBe("2026-11-16T00:00:00.000Z");
    expect(url.searchParams.get("pagination_cursor")).toBe("c2");
  });

  test("omits the cursor on the first page", () => {
    expect(buildEventListUrl(config, { before })).not.toContain("pagination_cursor");
  });
});

describe("fetchPastEvents", () => {
  test("follows next_cursor until has_more is false and sends the API key", async () => {
    const fetchImpl = fakeFetch({
      first: { entries: [apiEvent("a"), apiEvent("b")], has_more: true, next_cursor: "c2" },
      c2: { entries: [apiEvent("c")], has_more: false, next_cursor: null },
    });
    const events = await fetchPastEvents(config, before, fetchImpl as unknown as typeof fetch);
    expect(events.map((e) => e.id)).toEqual(["a", "b", "c"]);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(fetchImpl.mock.calls[0][1]).toMatchObject({ headers: { "x-luma-api-key": "key" } });
  });

  test("surfaces an HTTP failure with its status and body", async () => {
    const fetchImpl = vi.fn(async () => ({ ok: false, status: 401, text: async () => "bad key" }));
    await expect(fetchPastEvents(config, before, fetchImpl as unknown as typeof fetch)).rejects.toThrow(
      "Luma API request failed (401): bad key",
    );
  });

  test("rejects a payload that does not match the schema", async () => {
    const fetchImpl = fakeFetch({ first: { entries: [{ id: 1 }], has_more: false } });
    await expect(fetchPastEvents(config, before, fetchImpl as unknown as typeof fetch)).rejects.toThrow();
  });
});
