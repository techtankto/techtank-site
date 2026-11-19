import type { LumaEvent } from "../../constants/luma-events";

interface IncomingEvent {
  key: string;
  event: LumaEvent;
}

interface MergeResult {
  merged: Record<string, LumaEvent>;
  added: string[];
  updated: string[];
}

// Upsert keyed by Luma event id. Luma is the source of truth for every field
// in LumaEvent (curation lives in events.ts), so an incoming entry replaces the
// existing one. Entries missing from the API response are kept, so an event
// that Luma later hides never disappears from the archive.
export function upsertById(existing: Record<string, LumaEvent>, incoming: IncomingEvent[]): MergeResult {
  const merged: Record<string, LumaEvent> = { ...existing };
  const added: string[] = [];
  const updated: string[] = [];

  for (const { key, event } of incoming) {
    if (!(key in merged)) {
      added.push(key);
    } else if (JSON.stringify(merged[key]) !== JSON.stringify(event)) {
      updated.push(key);
    }
    merged[key] = event;
  }

  return { merged, added, updated };
}

// Safety backstop: a write must never reduce the entry count. Guards against a
// partial or empty fetch silently wiping the archive.
export function assertNoShrink(before: number, after: number): void {
  if (after < before) {
    throw new Error(`Refusing to write: result has fewer entries (${after}) than before (${before})`);
  }
}
