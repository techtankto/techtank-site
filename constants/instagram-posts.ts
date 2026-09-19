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
  media: InstagramPostMedia[];
}

export interface InstagramPostWithId extends InstagramPost {
  id: string;
}

// --- Data ---

// Merge machine-owned scraped data with human-owned curation. The scraper only
// ever writes instagram-posts.generated.ts; featured/curation lives separately in
// instagram-featured.ts, so an automated run can never clobber editorial choices.
const instagramPosts: Record<string, InstagramPost> = Object.fromEntries(
  Object.entries(generatedPosts).map(([id, post]) => [id, featuredKeys.has(id) ? { ...post, featured: true } : post]),
);

// --- Queries ---

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
