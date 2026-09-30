// Deterministic record-key derivation. Keys must exactly match the historical
// format `<YYYY-MM-DD>-<shortcode with non-alphanumerics stripped>` so that keys
// hardcoded in pages keep resolving after a scrape.

export function stripShortcode(shortcode: string): string {
  return shortcode.replace(/[^a-zA-Z0-9]/g, "");
}

export function shortcodeFromPermalink(permalink: string): string {
  const match = permalink.match(/\/(?:p|reel|tv)\/([^/?#]+)/);
  if (!match) {
    throw new Error(`Could not parse shortcode from permalink: ${permalink}`);
  }
  return match[1];
}

// Instagram timestamps are ISO 8601 with an explicit offset; the historical
// `date` field is the UTC calendar date, so derive it in UTC to stay stable
// regardless of the machine's timezone.
export function utcDateFromTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid timestamp: ${timestamp}`);
  }
  return date.toISOString().slice(0, 10);
}

export function unixSecondsFromTimestamp(timestamp: string): number {
  const ms = new Date(timestamp).getTime();
  if (Number.isNaN(ms)) {
    throw new Error(`Invalid timestamp: ${timestamp}`);
  }
  return Math.floor(ms / 1000);
}

export function deriveKey(timestamp: string, shortcode: string): string {
  return `${utcDateFromTimestamp(timestamp)}-${stripShortcode(shortcode)}`;
}
