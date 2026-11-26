import { describe, expect, it } from "vitest";
import type { Event } from "@/types/event";
import { getEventSlides, hasEventMedia } from "./event-media-badges";

const event = (over: Partial<Event> = {}): Event => ({
  id: "e",
  title: "Panel night",
  start_at: "2026-06-01T18:00:00-04:00",
  tags: [],
  status: "past",
  guest_count: 0,
  ...over,
});

describe("getEventSlides", () => {
  it("collects every speaker deck, in speaker order, skipping speakers without one", () => {
    const e = event({
      speakers: [
        { name: "Ada", title: "Engineer", slidesUrl: "/slides/a.pdf" },
        { name: "Grace", title: "Admiral" },
        { name: "Linus", title: "Maintainer", slidesUrl: "https://example.com/deck" },
      ],
    });
    expect(getEventSlides(e)).toEqual([
      { url: "/slides/a.pdf", speaker: "Ada" },
      { url: "https://example.com/deck", speaker: "Linus" },
    ]);
  });

  it("returns nothing for an event without speakers", () => {
    expect(getEventSlides(event())).toEqual([]);
  });
});

describe("hasEventMedia", () => {
  it("is true for photos, a recap, or slides, and false otherwise", () => {
    expect(hasEventMedia(event())).toBe(false);
    expect(hasEventMedia(event({ albumUrl: "https://photos.example" }))).toBe(true);
    expect(hasEventMedia(event({ youtubeUrl: "https://youtube.example" }))).toBe(true);
    expect(hasEventMedia(event({ speakers: [{ name: "Ada", title: "x", slidesUrl: "/slides/a.pdf" }] }))).toBe(true);
  });
});
