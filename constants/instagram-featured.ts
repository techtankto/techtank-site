import { generatedPosts } from "./instagram-posts.generated";

// Human-owned curation. The scraper NEVER writes here.
// Typing the array as PostKey[] makes a mistyped or stale key a compile error
// instead of a silent no-op at merge time; the exported Set stays string-keyed
// so callers can `.has(id)` with an ordinary string.
type PostKey = keyof typeof generatedPosts;

const keys: PostKey[] = [
  "2025-02-26-DGjOLKRNswM",
  "2025-04-24-DI1cmTyu5kg",
  "2025-07-07-DLz4I7KOww6",
  "2025-08-12-DNRVwWtPwky",
  "2025-08-20-DNmHtVwNshY",
  "2026-04-10-DW9vcgiPHx",
];

export const featuredKeys: ReadonlySet<string> = new Set(keys);
