import { describe, expect, test } from "vitest";
import { assertNoShrink, upsertById } from "./merge";
import type { LumaEvent } from "../../constants/luma-events";

const lumaEvent = (title: string): LumaEvent => ({
  title,
  start_at: "2026-06-01T22:00:00.000Z",
  end_at: "2026-06-02T00:00:00.000Z",
  timezone: "America/Toronto",
  url: "https://luma.com/x",
  cover: null,
  location: null,
  meeting_url: null,
});

describe("upsertById", () => {
  test("adds new keys, replaces changed ones, and keeps keys absent from the response", () => {
    const existing = { a: lumaEvent("old title"), gone: lumaEvent("hidden on Luma") };
    const { merged, added, updated } = upsertById(existing, [
      { key: "a", event: lumaEvent("new title") },
      { key: "b", event: lumaEvent("brand new") },
    ]);
    expect(added).toEqual(["b"]);
    expect(updated).toEqual(["a"]);
    expect(merged.a.title).toBe("new title");
    expect(merged.gone).toEqual(existing.gone);
    expect(existing.a.title).toBe("old title");
  });

  test("does not report an identical entry as updated", () => {
    const { updated } = upsertById({ a: lumaEvent("same") }, [{ key: "a", event: lumaEvent("same") }]);
    expect(updated).toEqual([]);
  });
});

describe("assertNoShrink", () => {
  test("throws when the entry count would drop", () => {
    expect(() => assertNoShrink(5, 4)).toThrow(/fewer entries/);
    expect(() => assertNoShrink(5, 5)).not.toThrow();
  });
});
