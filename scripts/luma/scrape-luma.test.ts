import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { loadConfig, run, transformEvents } from "./scrape-luma";
import { apiEvent } from "./luma-api.test";
import type { MediaDeps } from "./media";
import type { LumaEvent } from "../../constants/luma-events";

const COVER = "https://images.lumacdn.com/event-covers/ab/cover.png";

describe("loadConfig", () => {
  test("reads the API key", () => {
    expect(loadConfig({ LUMA_API_KEY: "key" })).toEqual({ apiKey: "key" });
  });

  test("throws when the key is missing", () => {
    expect(() => loadConfig({})).toThrow(/LUMA_API_KEY/);
  });
});

describe("transformEvents", () => {
  test("collects transform failures instead of throwing", () => {
    const { results, failed } = transformEvents([apiEvent("evt-ok"), apiEvent("bad/id")]);
    expect(results.map((r) => r.key)).toEqual(["evt-ok"]);
    expect(failed).toEqual([{ id: "bad/id", reason: expect.stringContaining("Unexpected event id") }]);
  });
});

describe("run", () => {
  const existing: Record<string, LumaEvent> = {
    "evt-old": {
      title: "Already archived",
      start_at: "2025-01-01T00:00:00.000Z",
      end_at: "2025-01-01T02:00:00.000Z",
      timezone: "America/Toronto",
      url: "https://luma.com/evt-old",
      cover: "/images/luma/evt-old.jpg",
      location: null,
      meeting_url: null,
    },
  };

  const fakeFetch = (entries: unknown[]) =>
    vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      if (url.includes("images.lumacdn.com")) {
        return { ok: true, arrayBuffer: async () => new Uint8Array([1]).buffer };
      }
      return { ok: true, json: async () => ({ entries, has_more: false, next_cursor: null }) };
    });

  const mediaDeps = (exists: boolean) => {
    const d = {
      fetchImpl: fetch,
      exists: vi.fn(async () => exists),
      ensureDir: vi.fn(async () => {}),
      write: vi.fn(async () => {}),
    };
    return d as unknown as MediaDeps & typeof d;
  };

  beforeEach(() => {
    vi.stubEnv("LUMA_API_KEY", "key");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("dry run reports what would change without downloading or writing", async () => {
    const fetchImpl = fakeFetch([apiEvent("evt-new", { cover_url: COVER })]);
    const deps = mediaDeps(false);
    const report = await run({
      dryRun: true,
      publicDir: "/public",
      generatedPath: "/generated.ts",
      existing,
      fetchImpl: fetchImpl as unknown as typeof fetch,
      mediaDeps: deps,
    });
    expect(report).toContain("Added 1 new event(s): evt-new");
    expect(report).toContain("Downloaded 1 cover(s): evt-new");
    expect(report).toContain("Archive now holds 2 event(s).");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(deps.write).not.toHaveBeenCalled();
  });

  test("keeps archived events the API no longer returns", async () => {
    const report = await run({
      dryRun: true,
      publicDir: "/public",
      generatedPath: "/generated.ts",
      existing,
      fetchImpl: fakeFetch([]) as unknown as typeof fetch,
      mediaDeps: mediaDeps(true),
    });
    expect(report).toContain("No new events.");
    expect(report).toContain("Archive now holds 1 event(s).");
  });

  test("a failed cover download is reported and leaves the event without a cover", async () => {
    const fetchImpl = vi.fn(async (input: string | URL | Request) =>
      String(input).includes("images.lumacdn.com")
        ? { ok: false, status: 404 }
        : {
            ok: true,
            json: async () => ({ entries: [apiEvent("evt-new", { cover_url: COVER })], has_more: false }),
          },
    );
    const report = await run({
      dryRun: false,
      publicDir: "/public",
      generatedPath: "/generated.ts",
      existing: {},
      fetchImpl: fetchImpl as unknown as typeof fetch,
      mediaDeps: mediaDeps(false),
    });
    expect(report).toContain("evt-new: Download failed (404)");
  });
});
