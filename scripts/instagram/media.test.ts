import { sep } from "node:path";
import { describe, expect, test, vi } from "vitest";
import {
  buildImageArgs,
  buildVideoArgs,
  buildWebmArgs,
  isFfmpegAvailable,
  processDownload,
  processPostDownloads,
  removeMediaDirs,
} from "./media";
import type { Download } from "./transform";

// Output paths in these tests are asserted as POSIX literals, but join()
// returns platform-native separators (and a drive letter on Windows) — strip
// both so the assertions hold on every OS.
const normalizePath = (p: string) =>
  p
    .replace(/^[A-Za-z]:/, "")
    .split(sep)
    .join("/");

describe("ffmpeg arg builders", () => {
  test("video args encode h264 mp4 with faststart and a 1080 cap", () => {
    const args = buildVideoArgs("/in.mp4", "/out.mp4");
    expect(args).toContain("libx264");
    expect(args).toContain("-movflags");
    expect(args).toContain("+faststart");
    expect(args.join(" ")).toContain("min(1080,iw)");
    expect(args[0]).toBe("-y");
    expect(args).toContain("/in.mp4");
    expect(args.at(-1)).toBe("/out.mp4");
  });

  test("webm args encode VP9 with opus audio and a 1080 cap", () => {
    const args = buildWebmArgs("/in.mp4", "/out.webm");
    expect(args).toContain("libvpx-vp9");
    expect(args).toContain("libopus");
    expect(args.join(" ")).toContain("min(1080,iw)");
    expect(args[0]).toBe("-y");
    expect(args).toContain("/in.mp4");
    expect(args.at(-1)).toBe("/out.webm");
  });

  test("image args encode webp", () => {
    const args = buildImageArgs("/in.jpg", "/out.webp");
    expect(args).toContain("libwebp");
    expect(args.at(-1)).toBe("/out.webp");
  });
});

describe("isFfmpegAvailable", () => {
  test("true when the probe exits 0", () => {
    expect(isFfmpegAvailable(() => ({ status: 0 }))).toBe(true);
  });
  test("false when the probe errors or exits non-zero", () => {
    expect(isFfmpegAvailable(() => ({ status: 1 }))).toBe(false);
    expect(
      isFfmpegAvailable(() => {
        throw new Error("ENOENT");
      }),
    ).toBe(false);
  });
});

describe("processDownload", () => {
  const baseDeps = {
    fetchImpl: vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(4),
    }) as unknown as typeof fetch,
    writeTemp: vi.fn().mockResolvedValue("/tmp/raw"),
    ensureDir: vi.fn().mockResolvedValue(undefined),
    runFfmpeg: vi.fn().mockReturnValue({ status: 0 }),
    cleanup: vi.fn(),
    removeDir: vi.fn(),
  };

  test("routes a video through the video encoder to the right output path", async () => {
    const runFfmpeg = vi.fn().mockReturnValue({ status: 0 });
    const dl: Download = {
      sourceUrl: "https://c/v.mp4",
      destPath: "/media/instagram/k/techtankto_X_1.mp4",
      kind: "video",
    };
    await processDownload(dl, "/public", { ...baseDeps, runFfmpeg });
    expect(baseDeps.fetchImpl).toHaveBeenCalledWith(
      "https://c/v.mp4",
      expect.objectContaining({ signal: expect.anything() }),
    );
    const [, args] = runFfmpeg.mock.calls[0];
    expect(args).toContain("libx264");
    expect(normalizePath(args.at(-1))).toBe("/public/media/instagram/k/techtankto_X_1.mp4");
  });

  test("encodes a video to both mp4 and a webm sibling", async () => {
    const runFfmpeg = vi.fn().mockReturnValue({ status: 0 });
    const dl: Download = {
      sourceUrl: "https://c/v.mp4",
      destPath: "/media/instagram/k/techtankto_X_1.mp4",
      kind: "video",
    };
    await processDownload(dl, "/public", { ...baseDeps, runFfmpeg });
    expect(runFfmpeg).toHaveBeenCalledTimes(2);
    const outputs = runFfmpeg.mock.calls.map(([, args]) => normalizePath(args.at(-1)));
    expect(outputs).toEqual([
      "/public/media/instagram/k/techtankto_X_1.mp4",
      "/public/media/instagram/k/techtankto_X_1.webm",
    ]);
    const webmArgs = runFfmpeg.mock.calls[1][1];
    expect(webmArgs).toContain("libvpx-vp9");
  });

  test("images run a single encode (no webm)", async () => {
    const runFfmpeg = vi.fn().mockReturnValue({ status: 0 });
    const dl: Download = {
      sourceUrl: "https://c/a.jpg",
      destPath: "/media/instagram/k/a.webp",
      kind: "image",
    };
    await processDownload(dl, "/public", { ...baseDeps, runFfmpeg });
    expect(runFfmpeg).toHaveBeenCalledTimes(1);
  });

  test("throws and still cleans up the temp file when ffmpeg fails", async () => {
    const cleanup = vi.fn();
    const dl: Download = {
      sourceUrl: "https://c/a.jpg",
      destPath: "/media/instagram/k/a.webp",
      kind: "image",
    };
    await expect(
      processDownload(dl, "/public", {
        ...baseDeps,
        cleanup,
        runFfmpeg: vi.fn().mockReturnValue({ status: 1, stderr: "boom" }),
      }),
    ).rejects.toThrow(/ffmpeg/i);
    expect(cleanup).toHaveBeenCalledWith("/tmp/raw");
  });

  test("throws on a failed download without invoking ffmpeg", async () => {
    const runFfmpeg = vi.fn();
    const dl: Download = {
      sourceUrl: "https://c/missing.jpg",
      destPath: "/media/instagram/k/a.webp",
      kind: "image",
    };
    await expect(
      processDownload(dl, "/public", {
        ...baseDeps,
        runFfmpeg,
        fetchImpl: vi.fn().mockResolvedValue({ ok: false, status: 404 }) as unknown as typeof fetch,
      }),
    ).rejects.toThrow(/404/);
    expect(runFfmpeg).not.toHaveBeenCalled();
  });

  test("refuses a destPath that escapes the public dir", async () => {
    const dl: Download = {
      sourceUrl: "https://c/a.jpg",
      destPath: "/../../etc/evil.webp",
      kind: "image",
    };
    await expect(processDownload(dl, "/public", baseDeps)).rejects.toThrow(/outside public/i);
  });
});

describe("processPostDownloads", () => {
  const deps = () => ({
    fetchImpl: vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(4),
    }) as unknown as typeof fetch,
    writeTemp: vi.fn().mockResolvedValue("/tmp/raw"),
    ensureDir: vi.fn().mockResolvedValue(undefined),
    runFfmpeg: vi.fn().mockReturnValue({ status: 0 }),
    cleanup: vi.fn(),
    removeDir: vi.fn().mockResolvedValue(undefined),
  });

  const downloads: Download[] = [
    {
      sourceUrl: "https://c/a.webp",
      destPath: "/media/instagram/k/a.webp",
      kind: "image",
    },
    {
      sourceUrl: "https://c/v.mp4",
      destPath: "/media/instagram/k/v.mp4",
      kind: "video",
    },
  ];

  test("removes the post's media dir and rethrows when any download fails", async () => {
    const d = deps();
    d.fetchImpl = vi.fn((url: string) =>
      url === "https://c/v.mp4"
        ? Promise.resolve({ ok: false, status: 500 })
        : Promise.resolve({ ok: true, arrayBuffer: async () => new ArrayBuffer(4) }),
    ) as unknown as typeof fetch;
    await expect(processPostDownloads(downloads, "/public", d)).rejects.toThrow(/500/);
    expect(d.removeDir).toHaveBeenCalledTimes(1);
    expect(normalizePath(d.removeDir.mock.calls[0][0])).toBe("/public/media/instagram/k");
  });

  test("does not remove anything when every download succeeds", async () => {
    const d = deps();
    await processPostDownloads(downloads, "/public", d);
    expect(d.removeDir).not.toHaveBeenCalled();
    // One encode for the image, two for the video (mp4 + webm sibling).
    expect(d.runFfmpeg).toHaveBeenCalledTimes(3);
  });

  test("never removes a dir outside the public root", async () => {
    const d = deps();
    const evil: Download[] = [
      {
        sourceUrl: "https://c/a.jpg",
        destPath: "/../../etc/evil.webp",
        kind: "image",
      },
    ];
    await expect(processPostDownloads(evil, "/public", d)).rejects.toThrow(/outside public/i);
    expect(d.removeDir).not.toHaveBeenCalled();
  });
});

describe("removeMediaDirs", () => {
  test("removes each distinct dir once", async () => {
    const removeDir = vi.fn().mockResolvedValue(undefined);
    await removeMediaDirs(["/media/instagram/k/a.webp", "/media/instagram/k/v.mp4"], "/public", removeDir);
    expect(removeDir).toHaveBeenCalledTimes(1);
    expect(normalizePath(removeDir.mock.calls[0][0])).toBe("/public/media/instagram/k");
  });

  test("never removes a dir outside the public root", async () => {
    const removeDir = vi.fn().mockResolvedValue(undefined);
    await removeMediaDirs(["/../../etc/evil.webp"], "/public", removeDir);
    expect(removeDir).not.toHaveBeenCalled();
  });
});
