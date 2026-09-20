import type { InstagramPost } from "../../constants/instagram-posts";

interface IncomingPost {
  key: string;
  post: InstagramPost;
}

interface MergeResult {
  merged: Record<string, InstagramPost>;
  added: string[];
  skipped: string[];
}

// Incremental upsert keyed by the record key. Existing entries are never touched
// and never deleted, so an automated run can only ever add posts. We dedup on the
// key (a string) rather than pk because pk exceeds Number.MAX_SAFE_INTEGER.
export function upsertByKey(existing: Record<string, InstagramPost>, incoming: IncomingPost[]): MergeResult {
  const merged: Record<string, InstagramPost> = { ...existing };
  const added: string[] = [];
  const skipped: string[] = [];

  for (const { key, post } of incoming) {
    if (key in merged) {
      skipped.push(key);
      continue;
    }
    merged[key] = post;
    added.push(key);
  }

  return { merged, added, skipped };
}

// Safety backstop: a write must never reduce the entry count. Guards against a
// partial/empty fetch silently wiping the static data.
export function assertNoShrink(before: number, after: number): void {
  if (after < before) {
    throw new Error(`Refusing to write: result has fewer entries (${after}) than before (${before})`);
  }
}
