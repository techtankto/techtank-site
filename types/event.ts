import type { Sponsor } from "@/constants/sponsors";

export interface Event {
  id: string;
  title: string;
  pitch?: string;
  start_at: string;
  venue?: string;
  capacity?: number;
  tags: string[];
  status: "upcoming" | "past";
  /** Event URL — prefers Luma when available, falls back to Meetup */
  eventUrl?: string;
  cover_url?: string | null | undefined;
  albumUrl?: string;
  youtubeUrl?: string;
  host?: Sponsor;
  hosts?:
    | {
        first_name?: string | null;
        last_name?: string | null;
        avatar_url?: string | null;
      }[]
    | null;
  guest_count: number;
  featured_guests?:
    | {
        name?: string | null;
      }[]
    | null;
  /** True for online events. The meeting link itself is never sent to the site (see `isOnlineEvent`). */
  online?: boolean;
  geo_address_info?: {
    address?: string | null;
  } | null;
  sponsors?: Sponsor[];
  speakers?: {
    name: string;
    title: string;
    company?: string;
    talkTitle?: string;
    image?: string;
    /**
     * The talk's slides: a site path under `public/slides/` (see CONTRIBUTING,
     * "Curating events") or an external URL such as a hosted deck.
     */
    slidesUrl?: string;
  }[];
}
