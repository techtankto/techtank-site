import { generatedPosts } from "./instagram-posts.generated";
import { featuredKeys } from "./instagram-featured";

// --- Types ---

export interface InstagramPostMedia {
  type: "image" | "video";
  path: string;
}

export interface InstagramPost {
  caption: string;
  date?: string;
  shortcode?: string;
  // Instagram media id. Stored as a string: the real values exceed
  // Number.MAX_SAFE_INTEGER, so a numeric literal would silently lose precision.
  pk?: string;
  createdAtRaw?: number;
  featured?: boolean;
  /** Visual description for the post's cover video (WCAG 1.2.1). */
  videoDescription?: string;
  media: InstagramPostMedia[];
}

export interface InstagramPostWithId extends InstagramPost {
  id: string;
}

// --- Data ---

type PostKey = keyof typeof generatedPosts;

/**
 * Human-authored visual descriptions (WCAG 1.2.1) for posts whose cover media
 * includes a video. Keyed by post ID so scraper runs never overwrite them.
 */
export const videoDescriptions: Partial<Record<PostKey, string>> = {
  "2025-02-26-DGjOLKRNswM":
    "Flipping through a Telestrations drawing pad showing sketches and the guess 'Superman' at a Snakes and Lattes board game social, with an on-screen prompt to join #social-toronto on Slack for the next event.",
  "2025-04-24-DI1cmTyu5kg":
    "Montage of TechTank members riding stationary bikes and waving towels during a high-energy spin class in a dark studio as an instructor leads from the podium.",
  "2025-07-07-DLz4I7KOww6":
    "Close-up of hot dogs, sausages, burger patties, and buns grilling over open flames at a TechTank summer barbecue before a burger is plated on a toasted bun.",
  "2025-08-12-DNRVwWtPwky":
    "DJ See.A mixing music on a controller and laptop at a picnic table in a sunny park while TechTank community members chat and hang out around her.",
  "2025-08-20-DNmHtVwNshY":
    "Animated poster for the TechTank Mentorship Meetup for tech talent in their first 1 to 5 years, held September 13, 2025 from 11am to 1pm at Prema Coffee and Bar, 35 McCaul St #110.",
  "2026-04-10-DW9vcgiPHx":
    "Montage from a Code Diversity pottery workshop where women and non-binary folks in tech shape clay at a communal table, with captioned interviews about connecting over hands-on craft outside traditional tech events.",
  "2026-06-09-DZWPNciI8eO":
    "Montage from a TechTank event at Docebo with BrainStation showing attendees mingling and watching a panel discussion on AI featuring Docebo speakers Kyle Lacy (CMO), Nitin Chopra (CIO and CISO), and Scott Peacock (VP of Product).",
  "2026-06-23-DZ7zBUYBhUz":
    "Montage titled 'Code Diversity' showing attendees seated at cafe tables in Prema Coffee and Bar sharing stories on microphones during a discussion led by two hosts.",
  "2026-06-23-DZ8LYQPgY72":
    "Animated poster for the TechTank 5K Run Club featuring a running-track graphic and the tagline 'Run with community. Run with intention. Run with TechTank.'",
  "2026-06-29-DaLhcpahRRn":
    "Montage captioned 'Tech Tank Run Club' showing community members stretching, playing outdoor games on a park lawn, and running together through downtown Toronto.",
};

// Merge machine-owned scraped data with human-owned curation. The scraper only
// ever writes instagram-posts.generated.ts; featured/curation lives separately in
// instagram-featured.ts, so an automated run can never clobber editorial choices.
const instagramPosts: Record<string, InstagramPost> = Object.fromEntries(
  Object.entries(generatedPosts).map(([id, post]) => {
    const videoDescription = videoDescriptions[id as PostKey];
    return [
      id,
      {
        ...post,
        ...(featuredKeys.has(id) ? { featured: true } : {}),
        ...(videoDescription ? { videoDescription } : {}),
      },
    ];
  }),
);

// --- Queries ---

// Posts the home feed shows. The scraper keeps media for this many of the newest
// posts, so every post the feed can fall back to has media on disk.
export const FEED_POST_COUNT = 4;

// All posts, newest first. The base query the others build on.
function getInstagramPosts(): InstagramPostWithId[] {
  return Object.entries(instagramPosts)
    .map(([id, post]) => ({ id, ...post }))
    .sort((a, b) => (b.createdAtRaw ?? 0) - (a.createdAtRaw ?? 0));
}

export function getInstagramPostsByIds(ids: string[]): InstagramPostWithId[] {
  return getInstagramPosts().filter((p) => ids.includes(p.id));
}

// Featured posts first (each newest-first), then the rest as filler when a
// section wants more items than are featured.
export function getFeaturedInstagramPosts(limit?: number): InstagramPostWithId[] {
  const sorted = getInstagramPosts();
  const featured = sorted.filter((post) => post.featured);
  const rest = sorted.filter((post) => !post.featured);
  const ordered = [...featured, ...rest];
  return typeof limit === "number" ? ordered.slice(0, limit) : ordered;
}

// --- Per-post accessors ---

export function getCoverImage(post: InstagramPost): string | undefined {
  return post.media.find((m) => m.type === "image")?.path;
}

export function getCoverVideo(post: InstagramPost): string | undefined {
  return post.media.find((m) => m.type === "video")?.path;
}

/** Returns the authored visual description for a post's cover video, or a generic fallback. */
export function getCoverVideoDescription(post: InstagramPost): string {
  return post.videoDescription ?? "Video from this Instagram post";
}
