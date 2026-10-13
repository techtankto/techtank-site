import { describe, expect, it } from "vitest";
import { events } from "./events";

describe("curated events", () => {
  it.each(events.map((event) => [event.id, event.start_at]))("%s has a start time with a UTC offset", (_, startAt) => {
    expect(startAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    expect(Number.isNaN(new Date(startAt).getTime())).toBe(false);
  });
});
