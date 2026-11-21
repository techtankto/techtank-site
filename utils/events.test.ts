import { describe, expect, test } from "vitest";
import { mergeEventSources } from "./events";
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
