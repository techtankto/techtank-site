import { rename, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { generatedPosts } from "../../constants/instagram-posts.generated";
import { FEED_POST_COUNT, type InstagramPost } from "../../constants/instagram-posts";
import { featuredKeys } from "../../constants/instagram-featured";
import { pinnedKeys } from "../../constants/instagram-pins";
import type { GraphConfig } from "./graph-api";
import { fetchMediaPage, fetchRecentMedia } from "./graph-api";
import type { MediaNode, MediaResponse } from "./schema";
import { transformNode, type TransformResult } from "./transform";
import { assertNoShrink, upsertByKey } from "./merge";
import { computeRetainedKeys, planRetention } from "./retention";
import { renderGeneratedFile } from "./emit";
import { formatRunReport, type FailedPost } from "./report";
import { isFfmpegAvailable, processPostDownloads, removeMediaDirs } from "./media";

const DEFAULT_VERSION = "v21.0";
const DEFAULT_LIMIT = 25;
// Caps the history walk for a pinned older post: 20 pages of 25 covers about
// 500 posts, several times the account's history today.
const MAX_HISTORY_PAGES = 20;

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

interface Transformed {
  results: TransformResult[];
  failed: FailedPost[];
}

// A single bad node collects into `failed` rather than throwing, so one
// malformed post can't abort the whole run.
export function transformNodes(nodes: MediaNode[]): Transformed {
  const results: TransformResult[] = [];
  const failed: FailedPost[] = [];
  for (const node of nodes) {
    try {
      results.push(transformNode(node));
    } catch (error) {
      failed.push({ id: node.id, reason: toMessage(error) });
    }
  }
  return { results, failed };
}

// Walks older pages until every wanted key has a source or history runs out.
// Only reached when a retained post has no media, e.g. a newly pinned older
// post, so routine runs stay at one request.
async function findInHistory(
  first: MediaResponse,
  wanted: string[],
  sources: Map<string, TransformResult>,
  fetchImpl: typeof fetch,
): Promise<void> {
  let page = first;
  for (let pages = 1; pages < MAX_HISTORY_PAGES && page.paging?.next; pages++) {
    if (wanted.every((key) => sources.has(key))) return;
    page = await fetchMediaPage(page.paging.next, fetchImpl);
    for (const result of transformNodes(page.data).results) {
      if (!sources.has(result.key)) sources.set(result.key, result);
    }
  }
}

interface RunOptions {
  dryRun: boolean;
  publicDir: string;
  generatedPath: string;
  // The current dataset, passed in (not imported) so run() is reproducible and
  // the full merge -> emit -> write path is integration-testable.
  existing: Record<string, InstagramPost>;
  fetchImpl?: typeof fetch;
}

export async function run({
  dryRun,
  publicDir,
  generatedPath,
  existing,
  fetchImpl = fetch,
}: RunOptions): Promise<string> {
  if (!dryRun && !isFfmpegAvailable()) {
    throw new Error("ffmpeg not found in PATH. Install it (macOS: `brew install ffmpeg`).");
  }

  const config = loadConfig(process.env);
  const response = await fetchRecentMedia(config, fetchImpl);
  const { results, failed } = transformNodes(response.data);
  const sources = new Map(results.map((result) => [result.key, result]));

  // Every new post's metadata is kept; its media starts empty and is filled
  // below only if the post is retained.
  const fresh = results.filter((result) => !(result.key in existing));
  const skippedExisting = results.filter((result) => result.key in existing).map((result) => result.key);
  const before = Object.keys(existing).length;
  const { merged, added } = upsertByKey(
    existing,
    fresh.map(({ key, post }) => ({ key, post: { ...post, media: [] } })),
  );
  assertNoShrink(before, Object.keys(merged).length);

  const curatedKeys = new Set([...featuredKeys, ...pinnedKeys]);
  const retained = computeRetainedKeys(merged, curatedKeys, FEED_POST_COUNT);
  const plan = planRetention(merged, retained);
  if (plan.fetch.some((key) => !sources.has(key))) {
    await findInHistory(response, plan.fetch, sources, fetchImpl);
  }

  // Download + compress each retained post's media; a media failure leaves that
  // post's media empty (so the next run retries) and removes its
  // partially-written files. Posts stay sequential for ordered failure reporting.
  const downloaded: string[] = [];
  for (const key of plan.fetch) {
    const source = sources.get(key);
    if (!source) {
      failed.push({ id: key, reason: "not found in the account's media history" });
      continue;
    }
    try {
      if (!dryRun) {
        await processPostDownloads(source.downloads, publicDir);
      }
      merged[key] = { ...merged[key], media: source.post.media };
      downloaded.push(key);
    } catch (error) {
      failed.push({ id: key, reason: toMessage(error) });
    }
  }

  for (const key of plan.prune) {
    if (!dryRun) {
      await removeMediaDirs(
        merged[key].media.map((media) => media.path),
        publicDir,
      );
    }
    merged[key] = { ...merged[key], media: [] };
  }

  // Atomic write: render to a temp file then rename, so a crash mid-write can
  // never leave a truncated, unparseable data file that breaks the build.
  const changed = added.length + downloaded.length + plan.prune.length > 0;
  if (!dryRun && changed) {
    const tmp = `${generatedPath}.tmp`;
    await writeFile(tmp, renderGeneratedFile(merged));
    await rename(tmp, generatedPath);
  }

  return formatRunReport({ added, skippedExisting, downloaded, pruned: plan.prune, failed });
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
