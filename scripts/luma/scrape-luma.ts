import { rename, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { generatedLumaEvents } from "../../constants/luma-events.generated";
import type { LumaEvent } from "../../constants/luma-events";
import type { LumaApiEvent } from "../../utils/luma/schema";
import { fetchPastEvents, type LumaConfig } from "./luma-api";
import { transformEvent, type TransformResult } from "./transform";
import { assertNoShrink, upsertById } from "./merge";
import { renderGeneratedFile } from "./emit";
import { formatRunReport, type FailedEvent } from "./report";
import { defaultMediaDeps, downloadCover, type MediaDeps } from "./media";

const toMessage = (error: unknown): string => (error instanceof Error ? error.message : String(error));

// Only the API key is needed: the events list endpoint is scoped to the
// calendar the key belongs to.
export function loadConfig(env: Record<string, string | undefined>): LumaConfig {
  if (!env.LUMA_API_KEY) {
    throw new Error("Missing required env var: LUMA_API_KEY. See .env.example.");
  }
  return { apiKey: env.LUMA_API_KEY };
}

interface Transformed {
  results: TransformResult[];
  failed: FailedEvent[];
}

// A single bad event collects into `failed` rather than throwing, so one
// malformed entry can't abort the whole run.
export function transformEvents(rawEvents: LumaApiEvent[]): Transformed {
  const results: TransformResult[] = [];
  const failed: FailedEvent[] = [];
  for (const raw of rawEvents) {
    try {
      results.push(transformEvent(raw));
    } catch (error) {
      failed.push({ id: raw.id, reason: toMessage(error) });
    }
  }
  return { results, failed };
}

interface RunOptions {
  dryRun: boolean;
  publicDir: string;
  generatedPath: string;
  // The current archive, passed in (not imported) so run() is reproducible and
  // the full fetch -> merge -> emit -> write path is testable.
  existing: Record<string, LumaEvent>;
  now?: Date;
  fetchImpl?: typeof fetch;
  mediaDeps?: MediaDeps;
  writeGenerated?: (path: string, contents: string) => Promise<void>;
}

// Atomic write: render to a temp file then rename, so a crash mid-write can
// never leave a truncated, unparseable data file that breaks the build.
export async function writeAtomically(path: string, contents: string): Promise<void> {
  const tmp = `${path}.tmp`;
  await writeFile(tmp, contents);
  await rename(tmp, path);
}

export async function run({
  dryRun,
  publicDir,
  generatedPath,
  existing,
  now = new Date(),
  fetchImpl = fetch,
  mediaDeps = defaultMediaDeps,
  writeGenerated = writeAtomically,
}: RunOptions): Promise<string> {
  const config = loadConfig(process.env);
  const rawEvents = await fetchPastEvents(config, now, fetchImpl);
  const { results, failed } = transformEvents(rawEvents);

  const before = Object.keys(existing).length;
  const { merged, added, updated } = upsertById(
    existing,
    results.map(({ key, event }) => ({ key, event })),
  );
  assertNoShrink(before, Object.keys(merged).length);

  // Covers are fetched sequentially for ordered failure reporting. A failed
  // download leaves the entry with no cover so the site never links a missing
  // file, and the next run retries it.
  const downloaded: string[] = [];
  for (const { key, download } of results) {
    if (!download) continue;
    try {
      const outcome = dryRun
        ? (await mediaDeps.exists(join(publicDir, download.destPath)))
          ? "exists"
          : "downloaded"
        : await downloadCover(download, publicDir, { ...mediaDeps, fetchImpl });
      if (outcome === "downloaded") downloaded.push(key);
    } catch (error) {
      failed.push({ id: key, reason: toMessage(error) });
      merged[key] = { ...merged[key], cover: null };
    }
  }

  const changed = added.length + updated.length + downloaded.length > 0;
  if (!dryRun && changed) {
    await writeGenerated(generatedPath, renderGeneratedFile(merged));
  }

  return formatRunReport({ total: Object.keys(merged).length, added, updated, downloaded, failed });
}

async function main(): Promise<void> {
  const root = process.cwd();
  const dryRun = process.argv.includes("--dry-run");
  const report = await run({
    dryRun,
    publicDir: join(root, "public"),
    generatedPath: join(root, "constants", "luma-events.generated.ts"),
    existing: generatedLumaEvents,
  });
  console.log(`${dryRun ? "[dry-run] " : ""}${report}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
