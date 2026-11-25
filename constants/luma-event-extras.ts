import type { Event } from "@/types/event";
import type { generatedLumaEvents } from "./luma-events.generated";
import { sponsors } from "./sponsors";

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

// Every Build Night TO so far was hosted at TMU with PostHog. Luma keeps the
// exact location guests-only, so only the campus name is shown.
const buildNightAtTmu: LumaEventExtras = { venue: "TMU", sponsors: [sponsors.posthog] };

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
  // Candidate Pitch Day: A Recession Indicator Comedy Show (Nov 12, 2026)
  "evt-j9e6EHHFrD4wwH9": {
    tags: ["Social"],
  },
  // Blender to XR: An Introduction to 3D Development (Oct 8, 2026)
  "evt-fML4QflRLOMJvMH": {
    tags: ["Tech Talk"],
    youtubeUrl: "https://www.youtube.com/watch?v=CY17HAyKOUI",
  },
  // QueerTank: A Social for Queer & Trans Folks in Tech (Sep 13, 2026)
  "evt-vmuMGAAGWtr8XA8": {
    tags: ["Social"],
  },
  // Salsa at the Park: TechTank Fiesta (Aug 30, 2026)
  "evt-AFFUpzJW0ScYqpx": {
    tags: ["Social"],
  },
  // TechTank Sunset Soirée (Aug 30, 2026)
  "evt-5BWfRdpvXUyAQNA": {
    tags: ["Social"],
  },
  // Build Night TO by TechTank x PostHog (Aug 19, 2026)
  "evt-2myD0FRHosU6bz7": {
    ...buildNightAtTmu,
    youtubeUrl: "https://www.youtube.com/watch?v=hF45ou4RWiQ",
  },
  // Build Night TO by TechTank x PostHog (Aug 5, 2026)
  "evt-eO06MVCGT0GQeJK": {
    ...buildNightAtTmu,
    youtubeUrl: "https://www.youtube.com/watch?v=wEjd6TC7w1o",
  },
  // Build Night TO by TechTank x PostHog (Jul 22, 2026)
  "evt-7y2m144kvHjWTvJ": {
    ...buildNightAtTmu,
    youtubeUrl: "https://www.youtube.com/watch?v=fDqWlzuvv7w",
  },
};
