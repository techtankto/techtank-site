import { describe, expect, it } from "vitest";
import { toEvent, type LumaEvent } from "./luma-events";

const archived: LumaEvent = {
  title: "Build Night TO by TechTank x PostHog",
  start_at: "2026-08-19T22:00:00.000Z",
  end_at: "2026-08-20T01:00:00.000Z",
  timezone: "America/Toronto",
  url: "https://luma.com/build-night-to-aug-19",
  cover: "/images/luma/evt-x.png",
  location: null,
  online: false,
};

describe("toEvent", () => {
  it("maps an archived event with tags inferred from the title", () => {
    const event = toEvent("evt-x", archived);
    expect(event).toMatchObject({
      id: "evt-x",
      title: archived.title,
      eventUrl: archived.url,
      cover_url: archived.cover,
      tags: ["Build Night"],
      online: false,
    });
    expect(event.speakers).toBeUndefined();
  });

  it("shows online events as Online, unless extras say otherwise", () => {
    const online = { ...archived, online: true };
    expect(toEvent("evt-x", online)).toMatchObject({ venue: "Online", online: true });
    expect(toEvent("evt-x", online, { venue: "Hybrid" }).venue).toBe("Hybrid");
    expect(toEvent("evt-x", archived).venue).toBeUndefined();
  });

  it("adds extra tags to the inferred ones without duplicates", () => {
    expect(toEvent("evt-x", archived, { tags: ["Build Night", "AI"] }).tags).toEqual(["Build Night", "AI"]);
  });

  it("lets extras override the displayed title while tags still come from Luma's", () => {
    const event = toEvent("evt-x", archived, { title: "Build Night TO" });
    expect(event.title).toBe("Build Night TO");
    expect(event.tags).toEqual(["Build Night"]);
  });

  it("layers curated extras on top while keeping Luma's fields", () => {
    const speakers = [{ name: "Ada", title: "Engineer", slidesUrl: "/slides/2026-08-19-talk-ada.pdf" }];
    const event = toEvent("evt-x", archived, { pitch: "Ship it", venue: "Online", speakers });
    expect(event).toMatchObject({
      title: archived.title,
      start_at: archived.start_at,
      pitch: "Ship it",
      venue: "Online",
    });
    expect(event.speakers).toEqual(speakers);
  });
});
