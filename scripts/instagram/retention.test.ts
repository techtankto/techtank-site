import { describe, expect, test } from "vitest";
import { computeRetainedKeys, planRetention } from "./retention";
import type { InstagramPost } from "../../constants/instagram-posts";

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
