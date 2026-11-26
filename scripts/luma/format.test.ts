import { describe, expect, test } from "vitest";
import { formatGeneratedFile, loadFormatOptions } from "./format";
import { renderGeneratedFile } from "./emit";
import type { LumaEvent } from "../../constants/luma-events";

// Runs against the real repo config, so a change to .oxfmtrc.json is picked up.
const root = process.cwd();

const lumaEvent: LumaEvent = {
  title: 'A "quoted" title 🎉',
  start_at: "2026-06-01T22:00:00.000Z",
  end_at: "2026-06-02T00:00:00.000Z",
  timezone: "America/Toronto",
  url: "https://luma.com/x",
  cover: null,
  location: null,
  online: false,
};

describe("loadFormatOptions", () => {
  test("passes formatting options through and drops CLI-only keys", async () => {
    const options = await loadFormatOptions(root);
    expect(options).toMatchObject({ printWidth: 120 });
    expect(options).not.toHaveProperty("$schema");
    expect(options).not.toHaveProperty("ignorePatterns");
  });
});

describe("formatGeneratedFile", () => {
  test("produces output that is already formatted (formatting twice changes nothing)", async () => {
    const once = await formatGeneratedFile("gen.ts", renderGeneratedFile({ "evt-a": lumaEvent }), root);
    const twice = await formatGeneratedFile("gen.ts", once, root);
    expect(twice).toBe(once);
    // Like Prettier, oxfmt switches to single quotes to avoid escaping.
    expect(once).toContain(`title: 'A "quoted" title 🎉'`);
  });

  test("throws on source oxfmt cannot parse", async () => {
    await expect(formatGeneratedFile("gen.ts", "export const x = {", root)).rejects.toThrow(/could not format/);
  });
});
