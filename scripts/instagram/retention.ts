import type { InstagramPost } from "../../constants/instagram-posts";

interface RetentionPlan {
  // Retained posts with no media yet: the scraper must (re)download these.
  fetch: string[];
  // Unretained posts that still carry media: the scraper must drop these.
  prune: string[];
}

// Media is committed only for posts the site can render: the curated keys
// (featured and page pins) plus the newest `latestCount`. With `latestCount` set
// to the feed size this covers every filler post the feed can pick, since the
// feed fills with the newest non-featured posts. Metadata is kept for every post,
// so a curator can pin any post and the next scrape restores its media.
export function computeRetainedKeys(
  posts: Record<string, InstagramPost>,
  curatedKeys: ReadonlySet<string>,
  latestCount: number,
): Set<string> {
  const latest = Object.entries(posts)
    .sort(([, a], [, b]) => (b.createdAtRaw ?? 0) - (a.createdAtRaw ?? 0))
    .slice(0, latestCount)
    .map(([key]) => key);
  return new Set([...latest, ...[...curatedKeys].filter((key) => key in posts)]);
}

export function planRetention(posts: Record<string, InstagramPost>, retained: ReadonlySet<string>): RetentionPlan {
  const fetch: string[] = [];
  const prune: string[] = [];
  for (const [key, post] of Object.entries(posts)) {
    const hasMedia = post.media.length > 0;
    if (retained.has(key) && !hasMedia) fetch.push(key);
    if (!retained.has(key) && hasMedia) prune.push(key);
  }
  return { fetch: fetch.sort(), prune: prune.sort() };
}
