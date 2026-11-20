import { access, mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import type { Download } from "./transform";

const FETCH_TIMEOUT_MS = 30_000;

export interface MediaDeps {
  fetchImpl: typeof fetch;
  exists: (path: string) => Promise<boolean>;
  ensureDir: (dir: string) => Promise<void>;
  write: (path: string, bytes: Uint8Array) => Promise<void>;
}

export const defaultMediaDeps: MediaDeps = {
  fetchImpl: fetch,
  exists: async (path) => {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  },
  ensureDir: async (dir) => {
    await mkdir(dir, { recursive: true });
  },
  write: (path, bytes) => writeFile(path, bytes),
};

// Resolve a site-absolute path under publicDir, refusing anything that would
// land outside it. transform.ts already restricts the id, but this is the last
// check before a filesystem write.
export function resolveUnderPublic(destPath: string, publicDir: string): string {
  const output = resolve(join(publicDir, destPath));
  if (!output.startsWith(resolve(publicDir) + sep)) {
    throw new Error(`Refusing to write outside public dir: ${destPath}`);
  }
  return output;
}

// Covers are immutable once downloaded: an existing file is kept as-is, so
// repeat runs are cheap and a changed cover on Luma needs the file deleted by
// hand to refresh. Throws on failure so the caller can skip-and-flag the event.
export async function downloadCover(
  download: Download,
  publicDir: string,
  deps: MediaDeps = defaultMediaDeps,
): Promise<"downloaded" | "exists"> {
  const output = resolveUnderPublic(download.destPath, publicDir);
  if (await deps.exists(output)) return "exists";

  const res = await deps.fetchImpl(download.sourceUrl, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) {
    throw new Error(`Download failed (${res.status}) for ${download.sourceUrl}`);
  }
  const bytes = new Uint8Array(await res.arrayBuffer());
  await deps.ensureDir(dirname(output));
  await deps.write(output, bytes);
  return "downloaded";
}
