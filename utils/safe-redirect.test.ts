import { describe, expect, it } from "vitest";
import { safeRedirect } from "./safe-redirect";

describe("safeRedirect", () => {
  it.each([
    [null, "/admin/tasks"],
    ["", "/admin/tasks"],
    ["/admin/tasks/1", "/admin/tasks/1"],
    ["/admin/tasks?x=1", "/admin/tasks?x=1"],
  ])("%s -> %s", (input, expected) => {
    expect(safeRedirect(input)).toBe(expected);
  });

  // Open-redirect prevention: a login link must not carry the organizer off-site.
  it.each(["//evil.com", "https://evil.com", "javascript:alert(1)", "foo"])("rejects %s", (input) => {
    expect(safeRedirect(input)).toBe("/admin/tasks");
  });
});
