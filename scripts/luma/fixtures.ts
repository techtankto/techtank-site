import type { LumaApiEvent } from "../../utils/luma/schema";

// Shared test fixture. Lives outside the *.test.ts files because importing a
// test file from another one re-registers (and re-runs) its tests.
export const apiEvent = (id: string, over: Partial<LumaApiEvent> = {}): LumaApiEvent => ({
  id,
  name: `Event ${id}`,
  start_at: "2026-06-01T22:00:00.000Z",
  duration_interval: "PT2H",
  end_at: "2026-06-02T00:00:00.000Z",
  timezone: "America/Toronto",
  url: `https://luma.com/${id}`,
  ...over,
});
