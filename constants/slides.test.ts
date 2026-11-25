import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getEventSlides } from "@/components/ui/event-media-badges";
import { toAppDateKey } from "@/utils/date";
import { events } from "./events";
import { lumaEvents } from "./luma-events";

// Guards the slides convention in CONTRIBUTING ("Curating events"):
// public/slides/<yyyy-mm-dd>-<talk-title>-<speaker-name>.pdf, dated in Toronto time.
const SLIDES_DIR = join(process.cwd(), "public", "slides");
const LOCAL_SLIDES = /^\/slides\/(\d{4}-\d{2}-\d{2})-[a-z0-9]+(?:-[a-z0-9]+)*\.pdf$/;

const decks = [...events, ...lumaEvents].flatMap((event) =>
  getEventSlides(event).map(({ url, speaker }) => ({ event, url, speaker })),
);
const localDecks = decks.filter(({ url }) => url.startsWith("/"));

describe("event slides", () => {
  it.each(localDecks.map((d) => [d.url, d]))("%s follows the naming convention and exists", (_, { url, event }) => {
    const match = url.match(LOCAL_SLIDES);
    expect(match, "expected /slides/<yyyy-mm-dd>-<kebab-case>.pdf").not.toBeNull();
    expect(match![1], "the date prefix should be the event's date in Toronto").toBe(toAppDateKey(event.start_at));
    expect(existsSync(join(SLIDES_DIR, url.replace(/^\/slides\//, "")))).toBe(true);
  });

  it("links every deck in public/slides from an event", () => {
    const linked = new Set(localDecks.map(({ url }) => url.replace(/^\/slides\//, "")));
    const files = existsSync(SLIDES_DIR) ? readdirSync(SLIDES_DIR) : [];
    expect(files.filter((file) => !linked.has(file))).toEqual([]);
  });

  it("uses https for external decks", () => {
    for (const { url } of decks.filter(({ url }) => !url.startsWith("/"))) {
      expect(url).toMatch(/^https:\/\//);
    }
  });
});
