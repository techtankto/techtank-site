import type { generatedPosts } from "./instagram-posts.generated";

// Human-owned curation: posts hardcoded into individual pages. The scraper NEVER
// writes here, but reads pinnedKeys so a pinned post always keeps its media.
// Typed against the generated keys so a mistyped or stale key fails the build.
type PostKey = keyof typeof generatedPosts;

export const heroPostKeys = [
  "2026-06-09-DZWPNciI8eO", // Docebo Brainstation (Jun 2026)
  "2026-04-10-DW9vcgiPHx", // Code diversity (Apr 2026)
] as const satisfies readonly PostKey[];

export const aboutPostKey: PostKey = "2025-07-07-DLz4I7KOww6";

export const sponsorPostKey: PostKey = "2026-04-10-DW9vcgiPHx";

export const pinnedKeys: ReadonlySet<string> = new Set([...heroPostKeys, aboutPostKey, sponsorPostKey]);
