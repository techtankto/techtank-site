import { describe, expect, test } from "vitest";
import { inferTags } from "./tags";

describe("inferTags", () => {
  test("matches title keywords case-insensitively", () => {
    expect(inferTags("Build Night TO by TechTank x PostHog", "https://luma.com/x")).toEqual(["Build Night"]);
    expect(inferTags("SUPERCOLLIDER Spring Fling", "https://luma.com/x")).toEqual([
      "Networking",
      "Social",
      "Multi-community",
    ]);
  });

  test("combines every matching rule without duplicates", () => {
    expect(inferTags("Code Diversity Coffee Chat", "https://luma.com/x")).toEqual([
      "Coffee Chat",
      "Social",
      "CodeDiversity",
    ]);
  });

  test("applies the per-URL override ahead of title rules", () => {
    expect(inferTags("Touch Grass", "https://luma.com/d114actf")).toEqual(["Social"]);
  });

  test("returns no tags when nothing matches", () => {
    expect(inferTags("Mayday Mayday: We're Running Again", "https://luma.com/x")).toEqual([]);
  });
});
