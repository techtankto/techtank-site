import { describe, expect, test } from "vitest";
import { mergeEventSources, sortForDisplay } from "./events";
import type { Event } from "@/types/event";

const event = (id: string, eventUrl?: string): Event => ({
  id,
  title: id,
  start_at: "2026-01-01T18:00:00-05:00",
  tags: [],
  status: "past",
  guest_count: 0,
  eventUrl,
});

const dated = (id: string, start_at: string, status: Event["status"]): Event => ({
  ...event(id),
  start_at,
  status,
});

describe("sortForDisplay", () => {
  test("puts upcoming events first (soonest first), then past events (most recent first)", () => {
    const events = [
      dated("past-old", "2026-03-14T15:00:00Z", "past"),
      dated("upcoming-later", "2027-01-20T23:00:00Z", "upcoming"),
      dated("past-recent", "2026-11-21T16:00:00Z", "past"),
      dated("upcoming-soon", "2026-12-16T23:00:00Z", "upcoming"),
    ];
    expect(sortForDisplay(events).map((e) => e.id)).toEqual([
      "upcoming-soon",
      "upcoming-later",
      "past-recent",
      "past-old",
    ]);
  });

  test("does not mutate its input", () => {
    const events = [dated("a", "2026-01-01T00:00:00Z", "past"), dated("b", "2026-02-01T00:00:00Z", "past")];
    sortForDisplay(events);
    expect(events.map((e) => e.id)).toEqual(["a", "b"]);
  });
});

describe("mergeEventSources", () => {
  test("keeps earlier sources whole and drops later duplicates by Luma slug", () => {
    const curated = [event("curated", "https://lu.ma/abc")];
    const scraped = [event("scraped-dup", "https://luma.com/abc"), event("scraped-new", "https://luma.com/def")];
    const live = [event("live-dup", "https://luma.com/def"), event("live-new", "https://luma.com/ghi")];
    expect(mergeEventSources([curated, scraped, live]).map((e) => e.id)).toEqual([
      "curated",
      "scraped-new",
      "live-new",
    ]);
  });

  test("always keeps events without a Luma URL", () => {
    const meetup = event("meetup", "https://www.meetup.com/techtank-to/events/1/");
    const noUrl = event("no-url");
    expect(mergeEventSources([[meetup], [noUrl]])).toEqual([meetup, noUrl]);
  });

  test("does not dedupe within a single source", () => {
    const a = event("a", "https://lu.ma/same");
    const b = event("b", "https://lu.ma/same");
    expect(mergeEventSources([[a, b]])).toEqual([a, b]);
  });
});
