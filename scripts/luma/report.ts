export interface FailedEvent {
  id: string;
  reason: string;
}

interface RunSummary {
  total: number;
  added: string[];
  updated: string[];
  downloaded: string[];
  failed: FailedEvent[];
}

// Human-readable summary for the terminal and a future PR body. Failures are
// surfaced (never swallowed) so an event whose cover always fails can't
// silently stay cover-less.
export function formatRunReport(summary: RunSummary): string {
  const lines: string[] = [];

  if (summary.added.length > 0) {
    lines.push(`Added ${summary.added.length} new event(s): ${summary.added.join(", ")}`);
  } else {
    lines.push("No new events.");
  }

  if (summary.updated.length > 0) {
    lines.push(`Updated ${summary.updated.length} existing event(s): ${summary.updated.join(", ")}`);
  }

  if (summary.downloaded.length > 0) {
    lines.push(`Downloaded ${summary.downloaded.length} cover(s): ${summary.downloaded.join(", ")}`);
  }

  lines.push(`Archive now holds ${summary.total} event(s).`);

  if (summary.failed.length > 0) {
    lines.push(`\n${summary.failed.length} event(s) failed and retry next run:`);
    for (const { id, reason } of summary.failed) {
      lines.push(`  - ${id}: ${reason}`);
    }
  }

  return lines.join("\n");
}
