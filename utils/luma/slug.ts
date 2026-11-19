const LUMA_HOSTS = new Set(["lu.ma", "www.lu.ma", "luma.com", "www.luma.com"]);

/**
 * The slug that identifies a Luma event across URL forms: hand-curated entries
 * use `https://lu.ma/<slug>`, the API reports `https://luma.com/<slug>`.
 * Returns null for anything that isn't a Luma event URL (Meetup, missing).
 */
export function getLumaSlug(url: string | null | undefined): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (!LUMA_HOSTS.has(parsed.hostname)) return null;
  return parsed.pathname.split("/").filter(Boolean).pop() ?? null;
}
