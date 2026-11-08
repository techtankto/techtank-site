import { describe, expect, it } from "vitest";
import { getGroupMembers, teamGroups, teamMembers, type TeamMemberId } from "./team";

const memberEntries = Object.entries(teamMembers) as [TeamMemberId, (typeof teamMembers)[TeamMemberId]][];

describe("teamMembers", () => {
  it("contains valid members", () => {
    expect(memberEntries.length).toBeGreaterThan(0);
    for (const [, member] of memberEntries) {
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
  });

  it("includes LinkedIn and GitHub URLs for members who provided them", () => {
    const memberWithSocials = memberEntries.find(([, m]) => m.linkedin && m.github);
    expect(memberWithSocials).toBeDefined();
  });

  it("places every member in at least one group", () => {
    const grouped = new Set(teamGroups.flatMap((g) => g.members.map((m) => m.id)));
    const ungrouped = memberEntries.map(([id]) => id).filter((id) => !grouped.has(id));
    expect(ungrouped).toEqual([]);
  });
});

describe("teamGroups", () => {
  it("contains valid groups", () => {
    expect(teamGroups.length).toBeGreaterThan(0);
    for (const group of teamGroups) {
      expect(group.title).toBeTruthy();
      expect(group.members.length).toBeGreaterThan(0);
    }
  });

  it("references only existing members", () => {
    for (const group of teamGroups) {
      for (const { id } of group.members) {
        expect(teamMembers[id]).toBeDefined();
      }
    }
  });

  it("lists each member at most once per group", () => {
    for (const group of teamGroups) {
      const ids = group.members.map((m) => m.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe("getGroupMembers", () => {
  it("returns members in the group's display order", () => {
    const group = teamGroups[0];
    expect(getGroupMembers(group).map((m) => m.id)).toEqual(group.members.map((m) => m.id));
  });

  it("applies the role from the group rather than from another group", () => {
    // Find someone listed in two groups with different roles, so the test doesn't depend on a named person.
    const roles = teamGroups.flatMap((group) => group.members.map((m) => ({ group, ...m })));
    const pair = roles
      .flatMap((a) => roles.map((b) => [a, b] as const))
      .find(([a, b]) => a.id === b.id && a.group !== b.group && a.role !== b.role);
    expect(pair).toBeDefined();

    const [a, b] = pair!;
    expect(getGroupMembers(a.group).find((m) => m.id === a.id)?.role).toBe(a.role);
    expect(getGroupMembers(b.group).find((m) => m.id === b.id)?.role).toBe(b.role);
  });
});
