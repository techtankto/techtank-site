import { describe, expect, test } from "vitest";
import { isListable, isLocationPublic } from "./visibility";

const now = new Date("2026-11-19T12:00:00Z");
const past = "2026-04-17T22:00:00Z";
const future = "2026-12-16T23:00:00Z";

describe("isListable", () => {
  test("lists public events whether past or upcoming", () => {
    expect(isListable({ start_at: past, visibility: "public" }, now)).toBe(true);
    expect(isListable({ start_at: future, visibility: "public" }, now)).toBe(true);
  });

  test("hides private events until they have started", () => {
    expect(isListable({ start_at: future, visibility: "private" }, now)).toBe(false);
    expect(isListable({ start_at: past, visibility: "private" }, now)).toBe(true);
  });

  test("treats a missing or unknown visibility on an upcoming event as private", () => {
    expect(isListable({ start_at: future }, now)).toBe(false);
    expect(isListable({ start_at: future, visibility: "members-only" }, now)).toBe(false);
  });
});

describe("isLocationPublic", () => {
  test("only an explicit public location is shown", () => {
    expect(isLocationPublic({ start_at: past, location_visibility: "public" })).toBe(true);
    expect(isLocationPublic({ start_at: past, location_visibility: "guests-only" })).toBe(false);
    expect(isLocationPublic({ start_at: past })).toBe(false);
  });
});
