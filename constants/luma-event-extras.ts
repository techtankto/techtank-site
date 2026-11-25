import type { Event } from "@/types/event";
import type { generatedLumaEvents } from "./luma-events.generated";

/**
 * Hand-curated additions to events in the scraped Luma archive. Luma stays the
 * source of truth for the title, date, cover, and location (the weekly scrape
 * keeps those current); these entries only add what Luma doesn't have.
 *
 * `tags` are added to the ones inferred from the title. Every other field
 * overrides. To curate an event the scraper hasn't archived (Meetup-era or
 * older), add it to `events.ts` instead.
 */
export type LumaEventExtras = Partial<
  Pick<Event, "pitch" | "tags" | "speakers" | "youtubeUrl" | "albumUrl" | "sponsors" | "host" | "venue">
>;

// Keyed by Luma event id, typed against the real archive keys so a typo or a
// stale id fails the type check.
type LumaEventId = keyof typeof generatedLumaEvents;

export const lumaEventExtras: Partial<Record<LumaEventId, LumaEventExtras>> = {
  // SolidJS: The Framework for the AI Era (online, Oct 22, 2026). Not recorded.
  "evt-OrkHChuAAJ9ZuYF": {
    pitch: "Why your UI framework still matters when AI writes the code",
    tags: ["Tech Talk"],
    speakers: [
      {
        name: "Brenley Dueck",
        title: "SolidStart team member",
        talkTitle: "SolidJS: The Framework for the AI Era",
        slidesUrl: "/slides/2026-10-22-solidjs-the-framework-for-the-ai-era-brenley-dueck.pdf",
      },
    ],
  },
};
