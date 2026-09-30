import type { InstagramPost, InstagramPostMedia } from "../../constants/instagram-posts";
import type { MediaNode } from "./schema";
import {
  deriveKey,
  shortcodeFromPermalink,
  stripShortcode,
  unixSecondsFromTimestamp,
  utcDateFromTimestamp,
} from "./keys";

// A file the shell must fetch and write. kind drives the compression step:
// images are re-encoded to webp, videos to mp4.
export interface Download {
  sourceUrl: string;
  destPath: string;
  kind: "image" | "video";
}

export interface TransformResult {
  key: string;
  post: InstagramPost;
  downloads: Download[];
}

// A carousel parent is always expanded to its children before reaching here, so
// at runtime a source is only ever IMAGE or VIDEO; the wide type keeps both a
// MediaNode and a MediaChild assignable.
interface MediaSource {
  id: string;
  media_type: MediaNode["media_type"];
  media_url?: string;
  thumbnail_url?: string;
}

function expandSource(
  source: MediaSource,
  dir: string,
  shortcode: string,
): { media: InstagramPostMedia[]; downloads: Download[] } {
  if (!source.media_url) {
    throw new Error(`Media ${source.id} has no media_url`);
  }
  // Filenames flow into a filesystem path, so derive every segment from
  // sanitized values: the stripped shortcode (alphanumeric) and a digits-only id.
  // This prevents `..`/`/` in API-derived fields from escaping public/.
  if (!/^\d+$/.test(source.id)) {
    throw new Error(`Unexpected media id (not numeric): ${source.id}`);
  }
  const base = `${dir}/techtankto_${stripShortcode(shortcode)}_${source.id}`;

  if (source.media_type === "VIDEO") {
    const video: InstagramPostMedia = { type: "video", path: `${base}.mp4` };
    const downloads: Download[] = [{ sourceUrl: source.media_url, destPath: video.path, kind: "video" }];
    const media: InstagramPostMedia[] = [video];
    // Videos historically carry a poster image; keep that so getCoverImage works.
    if (source.thumbnail_url) {
      const poster: InstagramPostMedia = {
        type: "image",
        path: `${base}_poster.webp`,
      };
      media.push(poster);
      downloads.push({
        sourceUrl: source.thumbnail_url,
        destPath: poster.path,
        kind: "image",
      });
    }
    return { media, downloads };
  }

  const image: InstagramPostMedia = { type: "image", path: `${base}.webp` };
  return {
    media: [image],
    downloads: [{ sourceUrl: source.media_url, destPath: image.path, kind: "image" }],
  };
}

export function transformNode(node: MediaNode): TransformResult {
  const shortcode = shortcodeFromPermalink(node.permalink);
  const key = deriveKey(node.timestamp, shortcode);
  const dir = `/media/instagram/${key}`;

  const sources: MediaSource[] = node.media_type === "CAROUSEL_ALBUM" ? (node.children?.data ?? []) : [node];

  const media: InstagramPostMedia[] = [];
  const downloads: Download[] = [];
  for (const source of sources) {
    const expanded = expandSource(source, dir, shortcode);
    media.push(...expanded.media);
    downloads.push(...expanded.downloads);
  }

  const post: InstagramPost = {
    caption: node.caption ?? "",
    date: utcDateFromTimestamp(node.timestamp),
    shortcode,
    pk: node.id,
    createdAtRaw: unixSecondsFromTimestamp(node.timestamp),
    media,
  };

  return { key, post, downloads };
}
