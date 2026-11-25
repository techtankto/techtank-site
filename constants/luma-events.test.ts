import { describe, expect, it } from "vitest";
import { displayTitle, toEvent, type LumaEvent } from "./luma-events";

const archived: LumaEvent = {
  title: "Build Night TO by TechTank x PostHog",
  start_at: "2026-08-19T22:00:00.000Z",
  end_at: "2026-08-20T01:00:00.000Z",
  timezone: "America/Toronto",
  url: "https://luma.com/build-night-to-aug-19",
  cover: "/images/luma/evt-x.png",
  location: null,
  meeting_url: null,
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
    });
    expect(event.speakers).toBeUndefined();
  });

  it("shows online events as Online, unless extras say otherwise", () => {
    const online = { ...archived, meeting_url: "https://meet.example.com/x" };
    expect(toEvent("evt-x", online).venue).toBe("Online");
    expect(toEvent("evt-x", online, { venue: "Hybrid" }).venue).toBe("Hybrid");
    expect(toEvent("evt-x", archived).venue).toBeUndefined();
  });

  it("adds extra tags to the inferred ones without duplicates", () => {
    expect(toEvent("evt-x", archived, { tags: ["Build Night", "AI"] }).tags).toEqual(["Build Night", "AI"]);
  });

  it("uses the cleaned title for online events", () => {
    const online = {
      ...archived,
      title: "SolidJS: The Framework | Online Event",
      meeting_url: "https://meet.example.com/x",
    };
    expect(toEvent("evt-x", online).title).toBe("SolidJS: The Framework");
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

describe("displayTitle", () => {
  const online = (title: string): LumaEvent => ({ ...archived, title, meeting_url: "https://meet.example.com/x" });

  it.each([
    ["SolidJS: The Framework for the AI Era | Online Event", "SolidJS: The Framework for the AI Era"],
    ["Rust for Beginners - Virtual", "Rust for Beginners"],
    ["Design Systems — online event", "Design Systems"],
    ["AMA (Online)", "AMA"],
  ])("drops the online suffix from %j", (title, expected) => {
    expect(displayTitle(online(title))).toBe(expected);
  });

  it("leaves titles alone when online isn't a trailing marker", () => {
    expect(displayTitle(online("Online Safety for Startups"))).toBe("Online Safety for Startups");
    expect(displayTitle(online("System Design and AI with Rob So"))).toBe("System Design and AI with Rob So");
  });

  it("never touches in-person events", () => {
    expect(displayTitle({ ...archived, title: "Launch Party | Online Event" })).toBe("Launch Party | Online Event");
  });
});
