import { describe, expect, it } from "vitest";
import { formatEventDate, formatEventTime, toAppDateKey } from "./date";

describe("formatEventTime", () => {
  it("converts a UTC timestamp to Toronto time", () => {
    expect(formatEventTime("2026-10-15T22:00:00.000Z")).toBe("6:00 PM");
  });

  it.each([
    ["2026-10-09T19:45:00-05:00", "8:45 PM"],
    ["2026-10-09T19:45:00-03:30", "7:15 PM"],
    ["2026-10-09T19:45:00-00:01", "3:46 PM"],
    ["2026-10-09T19:45:00+01:00", "2:45 PM"],
    ["2026-10-09T19:45:00.123-05:00", "8:45 PM"],
    ["2026-10-09T19:45:00+0100", "2:45 PM"],
  ])("converts %s from its offset to Toronto time", (iso, expected) => {
    expect(formatEventTime(iso)).toBe(expected);
  });

  it.each([
    ["2026-03-07T23:00:00Z", "6:00 PM", "before spring forward (EST)"],
    ["2026-03-09T22:00:00Z", "6:00 PM", "after spring forward (EDT)"],
    ["2026-10-31T22:00:00Z", "6:00 PM", "before fall back (EDT)"],
    ["2026-11-02T23:00:00Z", "6:00 PM", "after fall back (EST)"],
  ])("follows daylight saving: %s is %s %s", (iso, expected) => {
    expect(formatEventTime(iso)).toBe(expected);
  });

  it("shows a curated Toronto time as written", () => {
    expect(formatEventTime("2026-07-08T18:00:00-04:00")).toBe("6:00 PM");
    expect(formatEventTime("2025-11-15T11:00:00-05:00")).toBe("11:00 AM");
  });
});

describe("formatEventDate", () => {
  it("formats the Toronto calendar date", () => {
    expect(formatEventDate("2026-10-16T01:30:00.000Z")).toBe("Oct 15, 2026");
  });
});

describe("toAppDateKey", () => {
  it("groups a late-evening UTC timestamp under its Toronto date", () => {
    expect(toAppDateKey("2026-10-16T00:30:00.000Z")).toBe("2026-10-15");
  });

  it("keeps a late-evening curated event on its own date", () => {
    expect(toAppDateKey("2026-07-08T23:30:00-04:00")).toBe("2026-07-08");
  });
});
