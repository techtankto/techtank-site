import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { loadConfig, run, transformNodes } from "./scrape-instagram";
import type { MediaNode, MediaResponse } from "./schema";
import type { InstagramPost } from "../../constants/instagram-posts";

const node = (over: Partial<MediaNode> = {}): MediaNode => ({
  id: "1",
  media_type: "IMAGE",
  media_url: "https://c/a.jpg",
  permalink: "https://www.instagram.com/p/C69JJh-R2qP/",
  timestamp: "2024-05-14T16:19:58+0000",
  ...over,
});

describe("loadConfig", () => {
  test("reads required vars and applies the version default", () => {
    const cfg = loadConfig({
      INSTAGRAM_USER_ID: "42",
      INSTAGRAM_ACCESS_TOKEN: "tok",
    });
    expect(cfg).toMatchObject({ userId: "42", accessToken: "tok", version: "v21.0" });
  });

  test("throws listing every missing required var", () => {
    expect(() => loadConfig({})).toThrow(/INSTAGRAM_USER_ID.*INSTAGRAM_ACCESS_TOKEN/);
  });
});

describe("transformNodes", () => {
  test("transforms every valid node", () => {
    const { results, failed } = transformNodes([
      node(),
      node({ id: "2", permalink: "https://www.instagram.com/p/DW9-vcgiPHx/", timestamp: "2025-04-10T10:00:00+0000" }),
    ]);
    expect(results.map((r) => r.key)).toEqual(["2024-05-14-C69JJhR2qP", "2025-04-10-DW9vcgiPHx"]);
    expect(failed).toEqual([]);
  });

  test("collects transform failures instead of throwing", () => {
    const { results, failed } = transformNodes([node({ id: "99", permalink: "https://example.com/broken" })]);
    expect(results).toEqual([]);
    expect(failed).toEqual([{ id: "99", reason: expect.stringContaining("permalink") }]);
  });
});

// Dry runs exercise the whole plan (merge, retention, history walk, prune)
// without ffmpeg or any filesystem write.
describe("run (dry run)", () => {
  // A real pinned key, so the retention step treats it as curated.
  const PINNED = "2025-07-07-DLz4I7KOww6";
  const withMedia = (createdAtRaw: number): InstagramPost => ({
    caption: "",
    createdAtRaw,
    media: [{ type: "image", path: "/media/instagram/x/a.webp" }],
  });
  const existing: Record<string, InstagramPost> = {
    "2020-01-01-OLD": withMedia(1_577_836_800),
    "2026-01-01-R1": withMedia(1_767_225_600),
    "2026-01-02-R2": withMedia(1_767_312_000),
    "2026-01-03-R3": withMedia(1_767_398_400),
    "2026-01-04-R4": withMedia(1_767_484_800),
    [PINNED]: { caption: "", createdAtRaw: 1_751_889_600, media: [] },
  };
  const fresh = node({
    id: "100",
    permalink: "https://www.instagram.com/p/NEWPOST1/",
    timestamp: "2026-10-01T12:00:00+0000",
  });
  const pinnedNode = node({
    id: "200",
    permalink: "https://www.instagram.com/p/DLz4I7KOww6/",
    timestamp: "2025-07-07T12:00:00+0000",
  });

  const fakeFetch = (pages: Record<string, MediaResponse>) =>
    vi.fn(async (url: string) => ({
      ok: true,
      json: async () => pages[url.startsWith("https://graph.instagram.com/") ? "first" : url],
    }));

  const runWith = (fetchImpl: ReturnType<typeof fakeFetch>) =>
    run({
      dryRun: true,
      publicDir: "/public",
      generatedPath: "/generated.ts",
      existing,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

  beforeEach(() => {
    vi.stubEnv("INSTAGRAM_USER_ID", "42");
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "tok");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("adds new posts, walks history for a pinned post, and prunes the rest", async () => {
    const fetchImpl = fakeFetch({
      first: { data: [fresh], paging: { next: "https://next/2" } },
      "https://next/2": { data: [pinnedNode] },
    });
    const report = await runWith(fetchImpl);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(report).toContain("Added 1 new post(s): 2026-10-01-NEWPOST1");
    expect(report).toContain(`Downloaded media for 2 retained post(s): ${PINNED}, 2026-10-01-NEWPOST1`);
    expect(report).toContain("Pruned media for 2 post(s) the site no longer renders: 2020-01-01-OLD, 2026-01-01-R1");
  });

  test("reports a pinned post missing from the whole history", async () => {
    const fetchImpl = fakeFetch({ first: { data: [fresh] } });
    const report = await runWith(fetchImpl);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(report).toContain(`${PINNED}: not found in the account's media history`);
  });

  test("stays at one request when every retained post is on the first page", async () => {
    const fetchImpl = fakeFetch({ first: { data: [fresh, pinnedNode], paging: { next: "https://next/2" } } });
    await runWith(fetchImpl);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
