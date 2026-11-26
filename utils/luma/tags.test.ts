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
      "CodeDiversity",
      "Social",
    ]);
  });

  test("types recurring series from their titles", () => {
    expect(inferTags("System Design and AI with Rob So", "https://luma.com/x")).toEqual([
      "Tech Talk",
      "AI",
      "Architecture",
    ]);
    expect(inferTags("Code Diversity: Pass The Mic!", "https://luma.com/x")).toEqual([
      "Coffee Chat",
      "CodeDiversity",
      "Social",
    ]);
    expect(inferTags("Code Diversity Monthly Coffee Chats", "https://luma.com/x")).toEqual([
      "Coffee Chat",
      "CodeDiversity",
      "Social",
    ]);
    expect(inferTags("Touch Grass: Stretch in the Park with TechTank x Creative Blocks", "https://luma.com/x")).toEqual(
      ["Social"],
    );
  });

  test("returns no tags when nothing matches", () => {
    expect(inferTags("Mayday Mayday: We're Running Again", "https://luma.com/x")).toEqual([]);
  });
});
