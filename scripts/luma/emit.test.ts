import { describe, expect, test } from "vitest";
import { renderGeneratedFile, sortByStart } from "./emit";
import type { LumaEvent } from "../../constants/luma-events";

const lumaEvent = (start_at: string, title = start_at): LumaEvent => ({
  title,
  start_at,
  end_at: start_at,
  timezone: "America/Toronto",
  url: "https://luma.com/x",
  cover: null,
  location: null,
  meeting_url: null,
});

const dataLiteral = (rendered: string) => {
  const start = rendered.indexOf("{", rendered.indexOf("generatedLumaEvents ="));
  return JSON.parse(rendered.slice(start, rendered.lastIndexOf("}") + 1));
};

describe("sortByStart", () => {
  test("orders newest first with the id as a tiebreak", () => {
    const sorted = sortByStart({
      b: lumaEvent("2026-01-01T00:00:00Z"),
      a: lumaEvent("2026-01-01T00:00:00Z"),
      c: lumaEvent("2026-06-01T00:00:00Z"),
    });
    expect(Object.keys(sorted)).toEqual(["c", "a", "b"]);
  });
});

describe("renderGeneratedFile", () => {
  test("emits the type import and a satisfies-typed export", () => {
    const out = renderGeneratedFile({ a: lumaEvent("2026-01-01T00:00:00Z") });
    expect(out).toContain('import type { LumaEvent } from "./luma-events";');
    expect(out).toContain("export const generatedLumaEvents = ");
    expect(out).toContain("} satisfies Record<string, LumaEvent>;");
    expect(out.endsWith("\n")).toBe(true);
  });

  test("round-trips data unchanged, including quotes and emoji in titles", () => {
    const events = {
      a: lumaEvent("2026-01-01T00:00:00Z", 'Mayday "Mayday" 🚨'),
      b: lumaEvent("2026-02-01T00:00:00Z"),
    };
    expect(dataLiteral(renderGeneratedFile(events))).toEqual(sortByStart(events));
  });

  test("renders an empty archive as an empty object", () => {
    expect(dataLiteral(renderGeneratedFile({}))).toEqual({});
  });
});
