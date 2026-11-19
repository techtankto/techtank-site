import { describe, expect, test, vi } from "vitest";
import { join, resolve } from "node:path";
import { downloadCover, resolveUnderPublic, type MediaDeps } from "./media";

const publicDir = resolve("/site/public");
const download = { sourceUrl: "https://images.lumacdn.com/c.png", destPath: "/images/luma/evt-1.png" };

const deps = (over: Partial<MediaDeps> = {}) => {
  const d = {
    fetchImpl: vi.fn(async () => ({ ok: true, arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer })),
    exists: vi.fn(async () => false),
    ensureDir: vi.fn(async () => {}),
    write: vi.fn(async () => {}),
    ...over,
  };
  return d as unknown as MediaDeps & typeof d;
};

describe("resolveUnderPublic", () => {
  test("joins a site-absolute path under the public dir", () => {
    expect(resolveUnderPublic("/images/luma/a.png", publicDir)).toBe(join(publicDir, "images", "luma", "a.png"));
  });

  test("refuses paths that escape the public dir", () => {
    expect(() => resolveUnderPublic("/../secrets.txt", publicDir)).toThrow(/outside public dir/);
  });
});

describe("downloadCover", () => {
  test("fetches, creates the directory, and writes the bytes", async () => {
    const d = deps();
    await expect(downloadCover(download, publicDir, d)).resolves.toBe("downloaded");
    expect(d.fetchImpl).toHaveBeenCalledWith(download.sourceUrl, expect.anything());
    expect(d.ensureDir).toHaveBeenCalledWith(join(publicDir, "images", "luma"));
    expect(d.write).toHaveBeenCalledWith(join(publicDir, "images", "luma", "evt-1.png"), new Uint8Array([1, 2, 3]));
  });

  test("skips the download when the file already exists", async () => {
    const d = deps({ exists: vi.fn(async () => true) });
    await expect(downloadCover(download, publicDir, d)).resolves.toBe("exists");
    expect(d.fetchImpl).not.toHaveBeenCalled();
  });

  test("throws on an HTTP failure without writing", async () => {
    const d = deps({ fetchImpl: vi.fn(async () => ({ ok: false, status: 404 })) as unknown as typeof fetch });
    await expect(downloadCover(download, publicDir, d)).rejects.toThrow("Download failed (404)");
    expect(d.write).not.toHaveBeenCalled();
  });
});
