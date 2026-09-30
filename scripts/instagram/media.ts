import { spawnSync } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import type { Download } from "./transform";

const FETCH_TIMEOUT_MS = 30_000;

interface FfmpegResult {
  status: number | null;
  stderr?: string;
}
type FfmpegRunner = (cmd: string, args: string[]) => FfmpegResult;

const SCALE = "scale='w=min(1080,iw):h=min(1080,ih):force_original_aspect_ratio=decrease'";

// Ported from scripts/compress-media.sh — h264 mp4, downscaled, faststart for
// progressive playback. Every video is also encoded to a webm sibling
// (buildWebmArgs); the <video> elements list the webm <source> first and fall
// back to this mp4.
export function buildVideoArgs(input: string, output: string): string[] {
  return [
    "-y",
    "-i",
    input,
    "-vf",
    SCALE,
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "28",
    "-c:a",
    "aac",
    "-movflags",
    "+faststart",
    output,
  ];
}

// Ported from scripts/compress-media.sh — VP9/opus webm, the preferred <source>
// for browsers that support it (smaller than the h264 mp4 at equal quality).
export function buildWebmArgs(input: string, output: string): string[] {
  return ["-y", "-i", input, "-vf", SCALE, "-c:v", "libvpx-vp9", "-crf", "40", "-b:v", "0", "-c:a", "libopus", output];
}

// Images are served as webp across the dataset.
export function buildImageArgs(input: string, output: string): string[] {
  return ["-y", "-i", input, "-vf", SCALE, "-c:v", "libwebp", "-quality", "80", output];
}

const defaultRunner: FfmpegRunner = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  return { status: r.status, stderr: r.stderr };
};

export function isFfmpegAvailable(probe: FfmpegRunner = defaultRunner): boolean {
  try {
    return probe("ffmpeg", ["-version"]).status === 0;
  } catch {
    return false;
  }
}

interface ProcessDeps {
  fetchImpl: typeof fetch;
  writeTemp: (bytes: Uint8Array, suffix: string) => Promise<string>;
  ensureDir: (dir: string) => Promise<void>;
  runFfmpeg: FfmpegRunner;
  cleanup: (path: string) => void | Promise<void>;
  removeDir: (dir: string) => Promise<void>;
}

const defaultWriteTemp = async (bytes: Uint8Array, suffix: string) => {
  const path = join(tmpdir(), `ig-${suffix}`);
  await writeFile(path, bytes);
  return path;
};

const defaultProcessDeps: ProcessDeps = {
  fetchImpl: fetch,
  writeTemp: defaultWriteTemp,
  ensureDir: async (dir) => {
    await mkdir(dir, { recursive: true });
  },
  runFfmpeg: defaultRunner,
  cleanup: (path) => rm(path, { force: true }),
  removeDir: (dir) => rm(dir, { recursive: true, force: true }),
};

// Throws on any failure so the caller can skip-and-flag the whole post.
export async function processDownload(
  download: Download,
  publicDir: string,
  deps: ProcessDeps = defaultProcessDeps,
): Promise<void> {
  // Defense in depth: even though transform.ts sanitizes filename segments,
  // re-check that the resolved output never escapes publicDir before any write.
  const output = join(publicDir, download.destPath);
  const root = resolve(publicDir) + sep;
  if (!resolve(output).startsWith(root)) {
    throw new Error(`Refusing to write outside public dir: ${download.destPath}`);
  }

  const res = await deps.fetchImpl(download.sourceUrl, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Download failed (${res.status}) for ${download.sourceUrl}`);
  }
  const bytes = new Uint8Array(await res.arrayBuffer());
  const suffix = download.destPath.split("/").pop() ?? "asset";
  const temp = await deps.writeTemp(bytes, suffix);

  await deps.ensureDir(dirname(output));
  const encodes =
    download.kind === "video"
      ? [buildVideoArgs(temp, output), buildWebmArgs(temp, output.replace(/\.mp4$/, ".webm"))]
      : [buildImageArgs(temp, output)];

  try {
    for (const args of encodes) {
      const result = deps.runFfmpeg("ffmpeg", args);
      if (result.status !== 0) {
        throw new Error(`ffmpeg failed (${result.status}): ${result.stderr ?? ""}`);
      }
    }
  } finally {
    await deps.cleanup(temp);
  }
}

// Download every asset for one post; on any failure remove the post's media
// dir(s) so a partial failure never leaves orphan files that the next scrape
// commit would pick up. Rethrows so the caller can skip-and-flag the post.
export async function processPostDownloads(
  downloads: Download[],
  publicDir: string,
  deps: ProcessDeps = defaultProcessDeps,
): Promise<void> {
  try {
    // allSettled, not all: `all` rejects on the first failure while siblings are
    // still mid-download/mid-encode, so the catch below could rm the dir out from
    // under a download that finishes late and recreates an orphan file in it.
    const results = await Promise.allSettled(downloads.map((d) => processDownload(d, publicDir, deps)));
    const failure = results.find((r): r is PromiseRejectedResult => r.status === "rejected");
    if (failure) {
      throw failure.reason;
    }
  } catch (error) {
    // Same root guard as processDownload: never rm outside publicDir, even if
    // a sibling download in the batch carried a traversal path.
    const root = resolve(publicDir) + sep;
    const dirs = new Set(
      downloads.map((d) => dirname(resolve(join(publicDir, d.destPath)))).filter((dir) => dir.startsWith(root)),
    );
    await Promise.all([...dirs].map((dir) => deps.removeDir(dir)));
    throw error;
  }
}
