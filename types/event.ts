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
  cover_url?: string;
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
        avatar_url?: string | null;
      }[]
    | null;
  virtual_info?: {
    raw_join_url?: string | null;
  } | null;
  geo_address_info?: {
    sublocality?: string | null;
  } | null;
  sponsors?: Sponsor[];
  speakers?: {
    name: string;
    title: string;
    company?: string;
    talkTitle?: string;
    image?: string;
  }[];
}
