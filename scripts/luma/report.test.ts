import { describe, expect, test } from "vitest";
import { formatRunReport } from "./report";

describe("formatRunReport", () => {
  test("lists additions, updates, downloads, the total, and failures", () => {
    const out = formatRunReport({
      total: 12,
      added: ["evt-a"],
      updated: ["evt-b"],
      downloaded: ["evt-a"],
      failed: [{ id: "evt-c", reason: "Download failed (404)" }],
    });
    expect(out).toContain("Added 1 new event(s): evt-a");
    expect(out).toContain("Updated 1 existing event(s): evt-b");
    expect(out).toContain("Downloaded 1 cover(s): evt-a");
    expect(out).toContain("Archive now holds 12 event(s).");
    expect(out).toContain("1 event(s) failed and retry next run:\n  - evt-c: Download failed (404)");
  });

  test("says so when nothing changed", () => {
    const out = formatRunReport({ total: 3, added: [], updated: [], downloaded: [], failed: [] });
    expect(out).toBe("No new events.\nArchive now holds 3 event(s).");
  });
});
