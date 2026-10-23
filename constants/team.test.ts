import { describe, expect, it } from "vitest";
import { teamGroups } from "./team";

describe("teamGroups", () => {
  it("contains valid groups and members", () => {
    expect(teamGroups.length).toBeGreaterThan(0);
    for (const group of teamGroups) {
      expect(group.title).toBeTruthy();
      expect(group.members.length).toBeGreaterThan(0);
      for (const member of group.members) {
        expect(member.name).toBeTruthy();
        expect(member.pronouns).toBeTruthy();

        if (member.linkedin !== undefined) {
          const url = new URL(member.linkedin);
          expect(url.protocol).toBe("https:");
          expect(["linkedin.com", "www.linkedin.com"]).toContain(url.hostname);
        }
        if (member.github !== undefined) {
          const url = new URL(member.github);
          expect(url.protocol).toBe("https:");
          expect(["github.com", "www.github.com"]).toContain(url.hostname);
        }
      }
    }
  });

  it("includes LinkedIn and GitHub URLs for members who provided them", () => {
    const allMembers = teamGroups.flatMap((g) => g.members);
    const memberWithSocials = allMembers.find((m) => m.linkedin && m.github);
    expect(memberWithSocials).toBeDefined();
  });
});
