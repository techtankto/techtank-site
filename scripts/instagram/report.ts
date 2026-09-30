export interface FailedPost {
  id: string;
  reason: string;
}

interface RunSummary {
  added: string[];
  skippedExisting: string[];
  failed: FailedPost[];
}

// Human-readable summary for the PR body and CI log. Failures are surfaced (never
// swallowed) so a post that always fails can't silently vanish from the feed.
export function formatRunReport(summary: RunSummary): string {
  const lines: string[] = [];

  if (summary.added.length > 0) {
    lines.push(`Added ${summary.added.length} new post(s): ${summary.added.join(", ")}`);
  } else {
    lines.push("No new posts.");
  }

  if (summary.skippedExisting.length > 0) {
    lines.push(`Skipped ${summary.skippedExisting.length} existing post(s).`);
  }

  if (summary.failed.length > 0) {
    lines.push(`\n${summary.failed.length} post(s) skipped due to errors:`);
    for (const { id, reason } of summary.failed) {
      lines.push(`  - ${id}: ${reason}`);
    }
  }

  return lines.join("\n");
}
