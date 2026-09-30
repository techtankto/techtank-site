import { rename, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { generatedPosts } from "../../constants/instagram-posts.generated";
import type { InstagramPost } from "../../constants/instagram-posts";
import type { GraphConfig } from "./graph-api";
import { fetchRecentMedia } from "./graph-api";
import type { MediaNode } from "./schema";
import { transformNode, type TransformResult } from "./transform";
import { assertNoShrink, upsertByKey } from "./merge";
import { renderGeneratedFile } from "./emit";
import { formatRunReport, type FailedPost } from "./report";
import { isFfmpegAvailable, processPostDownloads } from "./media";

const DEFAULT_VERSION = "v21.0";
const DEFAULT_LIMIT = 25;

const toMessage = (error: unknown): string => (error instanceof Error ? error.message : String(error));

// Coerce-and-guard: a non-positive or non-integer env value falls back to the
// default rather than producing a "limit=NaN" request.
function parseLimit(raw: string | undefined): number {
  if (raw === undefined) return DEFAULT_LIMIT;
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : DEFAULT_LIMIT;
}

export function loadConfig(env: Record<string, string | undefined>): GraphConfig {
  const missing = ["INSTAGRAM_USER_ID", "INSTAGRAM_ACCESS_TOKEN"].filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}. See .env.example.`);
  }
  return {
    userId: env.INSTAGRAM_USER_ID!,
    accessToken: env.INSTAGRAM_ACCESS_TOKEN!,
    version: env.INSTAGRAM_GRAPH_VERSION ?? DEFAULT_VERSION,
    limit: parseLimit(env.INSTAGRAM_FETCH_LIMIT),
  };
}

interface Selection {
  fresh: TransformResult[];
  skippedExisting: string[];
  failed: FailedPost[];
}

// A single bad node collects into `failed` rather than throwing, so one
// malformed post can't abort the whole run.
export function selectNewPosts(existingKeys: Set<string>, nodes: MediaNode[]): Selection {
  const fresh: TransformResult[] = [];
  const skippedExisting: string[] = [];
  const failed: FailedPost[] = [];

  for (const node of nodes) {
    try {
      const result = transformNode(node);
      if (existingKeys.has(result.key)) {
        skippedExisting.push(result.key);
      } else {
        fresh.push(result);
      }
    } catch (error) {
      failed.push({ id: node.id, reason: (error as Error).message });
    }
  }

  return { fresh, skippedExisting, failed };
}

interface RunOptions {
  dryRun: boolean;
  publicDir: string;
  generatedPath: string;
  // The current dataset, passed in (not imported) so run() is reproducible and
  // the full merge -> emit -> write path is integration-testable.
  existing: Record<string, InstagramPost>;
}

export async function run({ dryRun, publicDir, generatedPath, existing }: RunOptions): Promise<string> {
  if (!dryRun && !isFfmpegAvailable()) {
    throw new Error("ffmpeg not found in PATH. Install it (macOS: `brew install ffmpeg`).");
  }

  const config = loadConfig(process.env);
  const response = await fetchRecentMedia(config);
  const existingKeys = new Set(Object.keys(existing));
  const selection = selectNewPosts(existingKeys, response.data);

  // Download + compress each fresh post's media; a media failure skips that
  // post and removes its partially-written files. Media within a post run
  // concurrently; posts stay sequential for ordered failure reporting.
  const toAdd = [];
  for (const result of selection.fresh) {
    try {
      if (!dryRun) {
        await processPostDownloads(result.downloads, publicDir);
      }
      toAdd.push({ key: result.key, post: result.post });
    } catch (error) {
      selection.failed.push({ id: result.key, reason: toMessage(error) });
    }
  }

  const before = Object.keys(existing).length;
  const { merged, added } = upsertByKey(existing, toAdd);
  assertNoShrink(before, Object.keys(merged).length);

  // Atomic write: render to a temp file then rename, so a crash mid-write can
  // never leave a truncated, unparseable data file that breaks the build.
  if (!dryRun && added.length > 0) {
    const tmp = `${generatedPath}.tmp`;
    await writeFile(tmp, renderGeneratedFile(merged));
    await rename(tmp, generatedPath);
  }

  return formatRunReport({
    added,
    skippedExisting: selection.skippedExisting,
    failed: selection.failed,
  });
}

async function main(): Promise<void> {
  const root = process.cwd();
  const dryRun = process.argv.includes("--dry-run");
  const report = await run({
    dryRun,
    publicDir: join(root, "public"),
    generatedPath: join(root, "constants", "instagram-posts.generated.ts"),
    existing: generatedPosts,
  });
  console.log(`${dryRun ? "[dry-run] " : ""}${report}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
