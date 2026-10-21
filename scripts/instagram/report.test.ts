import { describe, expect, test } from "vitest";
import { formatRunReport } from "./report";

describe("formatRunReport", () => {
  test("summarizes a clean run with new posts", () => {
    const out = formatRunReport({
      added: ["2024-05-14-A", "2024-05-15-B"],
      skippedExisting: ["2024-05-13-C"],
      downloaded: [],
      pruned: [],
      failed: [],
    });
    expect(out).toContain("Added 2 new post(s): 2024-05-14-A, 2024-05-15-B");
    expect(out).toContain("Skipped 1 existing post(s)");
    expect(out).not.toMatch(/failed/i);
  });

  test("flags failed posts with their reason", () => {
    const out = formatRunReport({
      added: [],
      skippedExisting: [],
      downloaded: [],
      pruned: [],
      failed: [
        { id: "17890", reason: "media 404" },
        { id: "17891", reason: "ffmpeg exit 1" },
      ],
    });
    expect(out).toContain("2 post(s) failed and retry next run");
    expect(out).toContain("17890: media 404");
    expect(out).toContain("17891: ffmpeg exit 1");
  });

  test("reports nothing-new explicitly", () => {
    const out = formatRunReport({ added: [], skippedExisting: ["a"], downloaded: [], pruned: [], failed: [] });
    expect(out).toContain("No new posts");
  });

  test("lists downloaded and pruned media", () => {
    const out = formatRunReport({
      added: [],
      skippedExisting: [],
      downloaded: ["2025-07-07-A"],
      pruned: ["2024-05-14-B", "2024-05-15-C"],
      failed: [],
    });
    expect(out).toContain("Downloaded media for 1 retained post(s): 2025-07-07-A");
    expect(out).toContain("Pruned media for 2 post(s) the site no longer renders: 2024-05-14-B, 2024-05-15-C");
  });
});
