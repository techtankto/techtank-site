import { describe, expect, it } from "vitest";
import { extractGitHubUsername, extractLinkedInUsername } from "./team-social-links";

describe("extractLinkedInUsername", () => {
  it.each([
    ["https://www.linkedin.com/in/tkodev", "tkodev"],
    ["https://linkedin.com/in/tkodev/", "tkodev"],
    ["https://www.linkedin.com/in/tony-ko?trk=profile", "tony-ko"],
    ["linkedin.com/in/tonyko", "tonyko"],
  ])("extracts username from %s", (url, expected) => {
    expect(extractLinkedInUsername(url)).toBe(expected);
  });

  it("falls back to the last path segment for non-/in/ profile URLs", () => {
    expect(extractLinkedInUsername("https://www.linkedin.com/pub/jane-doe")).toBe("jane-doe");
  });

  it("returns an empty string when url is undefined or empty", () => {
    expect(extractLinkedInUsername()).toBe("");
    expect(extractLinkedInUsername("")).toBe("");
  });

  it("returns an empty string for non-HTTP(S) or unparseable URLs", () => {
    expect(extractLinkedInUsername("javascript:alert(1)")).toBe("");
    expect(extractLinkedInUsername("https://")).toBe("");
  });
});

describe("extractGitHubUsername", () => {
  it.each([
    ["https://github.com/tkodev", "tkodev"],
    ["https://www.github.com/tkodev/", "tkodev"],
    ["https://github.com/tkodev?tab=repositories", "tkodev"],
    ["github.com/tkodev", "tkodev"],
  ])("extracts username from %s", (url, expected) => {
    expect(extractGitHubUsername(url)).toBe(expected);
  });

  it("returns an empty string when url is undefined or empty", () => {
    expect(extractGitHubUsername()).toBe("");
    expect(extractGitHubUsername("")).toBe("");
  });

  it("returns an empty string for non-HTTP(S) or unparseable URLs", () => {
    expect(extractGitHubUsername("javascript:alert(1)")).toBe("");
    expect(extractGitHubUsername("https://")).toBe("");
  });
});
