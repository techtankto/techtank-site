import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { computeRetainedKeys, planRetention } from "./retention";
import type { InstagramPost } from "../../constants/instagram-posts";
import { FEED_POST_COUNT } from "../../constants/instagram-posts";
import { generatedPosts } from "../../constants/instagram-posts.generated";
import { featuredKeys } from "../../constants/instagram-featured";
import { pinnedKeys } from "../../constants/instagram-pins";

const post = (createdAtRaw: number, withMedia = true): InstagramPost => ({
  caption: "",
  createdAtRaw,
  media: withMedia ? [{ type: "image", path: "/x.webp" }] : [],
});

describe("computeRetainedKeys", () => {
  const posts = { a: post(1), b: post(2), c: post(3), d: post(4) };

  test("keeps the newest posts by creation time", () => {
    expect([...computeRetainedKeys(posts, new Set(), 2)].sort()).toEqual(["c", "d"]);
  });

  test("adds curated keys on top of the newest posts", () => {
    expect([...computeRetainedKeys(posts, new Set(["a"]), 1)].sort()).toEqual(["a", "d"]);
  });

  test("ignores curated keys with no matching post", () => {
    expect([...computeRetainedKeys(posts, new Set(["gone"]), 0)]).toEqual([]);
  });
});

describe("planRetention", () => {
  test("fetches retained posts without media and prunes unretained posts with media", () => {
    const posts = { kept: post(1), missing: post(2, false), stale: post(3), bare: post(4, false) };
    expect(planRetention(posts, new Set(["kept", "missing"]))).toEqual({ fetch: ["missing"], prune: ["stale"] });
  });
});

// Guards the committed data: a pin or featured key added by hand without a
// scrape run fails here, naming the post that still needs its media.
describe("committed Instagram data", () => {
  const posts: Record<string, InstagramPost> = generatedPosts;
  const retained = computeRetainedKeys(posts, new Set([...featuredKeys, ...pinnedKeys]), FEED_POST_COUNT);

  test("carries media for exactly the retained posts (run `pnpm scrape:instagram` if not)", () => {
    expect(planRetention(posts, retained)).toEqual({ fetch: [], prune: [] });
  });

  test("every referenced media file exists under public/", () => {
    const publicDir = join(import.meta.dirname, "..", "..", "public");
    const missing = Object.values(posts)
      .flatMap((p) => p.media.map((m) => m.path))
      .filter((path) => !existsSync(join(publicDir, path)));
    expect(missing).toEqual([]);
  });
});
