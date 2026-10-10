import { describe, expect, it } from "vitest";
import { formatEventDate, formatEventTime, toAppDateKey } from "./date";

describe("formatEventTime", () => {
  it("converts a UTC timestamp to Toronto time", () => {
    expect(formatEventTime("2026-10-15T22:00:00.000Z")).toBe("6:00 PM");
  });

  it("keeps a naive timestamp as Toronto wall time", () => {
    expect(formatEventTime("2026-07-08T18:00:00")).toBe("6:00 PM");
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

  it("keeps a naive timestamp with milliseconds as Toronto wall time", () => {
    expect(formatEventTime("2026-07-08T18:00:00.000")).toBe("6:00 PM");
  });
});

describe("formatEventDate", () => {
  it("formats the Toronto calendar date", () => {
    expect(formatEventDate("2026-10-16T01:30:00.000Z")).toBe("Oct 15, 2026");
  });

  it("keeps a date-only value on its calendar date", () => {
    expect(formatEventDate("2026-07-08")).toBe("Jul 8, 2026");
  });
});

describe("toAppDateKey", () => {
  it("groups a late-evening UTC timestamp under its Toronto date", () => {
    expect(toAppDateKey("2026-10-16T00:30:00.000Z")).toBe("2026-10-15");
  });

  it("keeps a naive timestamp on its own date", () => {
    expect(toAppDateKey("2026-07-08T23:30:00")).toBe("2026-07-08");
  });
});
