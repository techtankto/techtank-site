import { describe, expect, test } from "vitest";
import { coverExtension, transformEvent } from "./transform";
import { apiEvent } from "./fixtures";

const COVER = "https://images.lumacdn.com/cdn-cgi/image/format=auto,width=400/event-covers/ab/123e4567.png";

describe("coverExtension", () => {
  test("keeps a recognised image extension from the URL path", () => {
    expect(coverExtension(COVER)).toBe("png");
    expect(coverExtension("https://images.lumacdn.com/x/y.JPEG")).toBe("jpeg");
  });

  test("falls back to jpg for unknown or missing extensions", () => {
    expect(coverExtension("https://images.lumacdn.com/x/y.svg")).toBe("jpg");
    expect(coverExtension("https://images.lumacdn.com/x/y")).toBe("jpg");
  });
});

describe("transformEvent", () => {
  test("maps the API shape to a LumaEvent keyed by id, with a cover download", () => {
    const { key, event, download } = transformEvent(
      apiEvent("evt-abc", {
        cover_url: COVER,
        geo_address_json: { address: "2415 Yonge St", city: "Toronto" },
        location_visibility: "public",
        meeting_url: null,
      }),
    );
    expect(key).toBe("evt-abc");
    expect(event).toEqual({
      title: "Event evt-abc",
      start_at: "2026-06-01T22:00:00.000Z",
      end_at: "2026-06-02T00:00:00.000Z",
      timezone: "America/Toronto",
      url: "https://luma.com/evt-abc",
      cover: "/images/luma/evt-abc.png",
      location: "2415 Yonge St",
      online: false,
    });
    expect(download).toEqual({ sourceUrl: COVER, destPath: "/images/luma/evt-abc.png" });
  });

  test("leaves cover null and no download when the event has no cover", () => {
    const { event, download } = transformEvent(apiEvent("evt-nocover"));
    expect(event.cover).toBeNull();
    expect(download).toBeUndefined();
  });

  test("flags online events but never stores the meeting link", () => {
    const { event } = transformEvent(
      apiEvent("evt-online", { location_type: "meet", meeting_url: "https://meet.example.com/standing-room" }),
    );
    expect(event).toMatchObject({ online: true, location: null });
    expect(JSON.stringify(event)).not.toContain("meet.example.com");
  });

  test("never stores the address of a guests-only event", () => {
    const address = { address: "123 Private Ave", city: "Toronto" };
    expect(
      transformEvent(apiEvent("evt-guests", { geo_address_json: address, location_visibility: "guests-only" })).event
        .location,
    ).toBeNull();
    expect(transformEvent(apiEvent("evt-unset", { geo_address_json: address })).event.location).toBeNull();
  });

  test("keeps private past events in the archive", () => {
    const { event } = transformEvent(apiEvent("evt-private", { visibility: "private" }));
    expect(event.title).toBe("Event evt-private");
  });

  test("rejects an id that could escape the covers directory", () => {
    expect(() => transformEvent(apiEvent("../evil"))).toThrow(/Unexpected event id/);
  });
});
