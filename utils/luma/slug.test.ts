import { describe, expect, test } from "vitest";
import { getLumaSlug } from "./slug";

describe("getLumaSlug", () => {
  test("reads the slug from both Luma URL forms", () => {
    expect(getLumaSlug("https://lu.ma/7mgyw1r2")).toBe("7mgyw1r2");
    expect(getLumaSlug("https://luma.com/7mgyw1r2")).toBe("7mgyw1r2");
  });

  test("ignores trailing slashes and query strings", () => {
    expect(getLumaSlug("https://luma.com/d114actf/")).toBe("d114actf");
    expect(getLumaSlug("https://lu.ma/d114actf?utm_source=x")).toBe("d114actf");
  });

  test("returns null for non-Luma, malformed, or missing URLs", () => {
    expect(getLumaSlug("https://www.meetup.com/techtank-to/events/295750233/")).toBeNull();
    expect(getLumaSlug("not a url")).toBeNull();
    expect(getLumaSlug("https://luma.com/")).toBeNull();
    expect(getLumaSlug(undefined)).toBeNull();
  });
});
