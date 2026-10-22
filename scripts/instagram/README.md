# Instagram scraper

Fetches recent posts from the [@techtankto](https://www.instagram.com/techtankto/)
Instagram account and merges genuinely new ones into the site's data, so the feed
stays current without hand-transcribing each post. It keeps metadata for every
post but commits media only for the posts the site renders.

## How it works

```
Graph API (1 page) → Zod validate → transform to InstagramPost
  → upsert metadata by key (never delete) → never-shrink guard
  → compute retained set → download media for retained posts missing it
  → prune media for the rest → write instagram-posts.generated.ts
```

- **Split ownership.** The scraper only ever writes
  `constants/instagram-posts.generated.ts` and `public/media/instagram/`. Human
  curation lives in `constants/instagram-featured.ts` (the feed's featured posts)
  and `constants/instagram-pins.ts` (posts hardcoded into pages), and is never
  touched. `instagram-posts.ts` merges them.
- **Media only for what renders.** The retained set is the featured keys, the
  pinned keys, and the newest `FEED_POST_COUNT` posts (enough to cover every post
  the feed falls back to). Every other post keeps its metadata with an empty
  `media` list, so `instagram-posts.generated.ts` stays the full catalogue to pick
  from, and its media directory is deleted.
- **Pinning any post works.** Add its key to `instagram-featured.ts` or
  `instagram-pins.ts` and run the scraper; it downloads the media. A post older
  than the first page is found by walking `paging.next`, capped at 20 pages.
- **Incremental + safe.** Posts are deduped by their record key
  (`YYYY-MM-DD-<shortcode>`); metadata is never overwritten or deleted, and a run
  that would shrink the file aborts without writing.
- **Skip-and-flag.** A post whose media 404s or fails to compress keeps empty
  media (no partial files) and is surfaced in the run summary; it retries next run.
- **Checked in CI.** `retention.test.ts` fails when the committed media drifts from
  the retained set, e.g. a key pinned by hand without a scrape run.

## Files

One module per pipeline stage. Pure modules have no I/O (fast, tested directly);
shell modules isolate the network, filesystem, and ffmpeg behind injected deps.

| Module                | Responsibility                                                 | Kind  |
| --------------------- | -------------------------------------------------------------- | ----- |
| `schema.ts`           | Zod schemas validating the Graph API payload                   | pure  |
| `keys.ts`             | Derive the `YYYY-MM-DD-<shortcode>` record key                 | pure  |
| `transform.ts`        | API node → `InstagramPost` + download list (expands carousels) | pure  |
| `merge.ts`            | Upsert by key + never-shrink guard                             | pure  |
| `retention.ts`        | Compute the retained set and what to download or prune         | pure  |
| `emit.ts`             | Render the generated `.ts` data file                           | pure  |
| `report.ts`           | Format the run summary                                         | pure  |
| `graph-api.ts`        | Fetch a page of media                                          | shell |
| `media.ts`            | Download, encode, and remove media, sandboxed to `public/`     | shell |
| `scrape-instagram.ts` | Orchestrate the run; CLI entry point                           | shell |

## Prerequisites

1. **ffmpeg with libwebp** on PATH — macOS: `brew install ffmpeg-full`. Plain
   `brew install ffmpeg` does **not** include the `libwebp` encoder and the
   media pipeline will fail on every post with `Unknown encoder 'libwebp'`.
   `ffmpeg-full` is keg-only (won't overwrite a plain `ffmpeg` install already
   on PATH), so put it first: `export PATH="/opt/homebrew/opt/ffmpeg-full/bin:$PATH"`.
2. **A Meta app + long-lived token** for the @techtankto account:
   - Convert @techtankto to an Instagram **Business/Creator** account and link it
     to a Facebook Page.
   - Create a Meta app, add the Instagram Graph API, and generate a **long-lived
     access token** (refresh roughly every 60 days).
   - Copy `.env.example` → `.env.local` and fill in `INSTAGRAM_USER_ID` and
     `INSTAGRAM_ACCESS_TOKEN`.

## Usage

```bash
# Preview what would change — fetches and prints a summary, writes nothing:
pnpm scrape:instagram --dry-run

# Real run — downloads media and updates instagram-posts.generated.ts:
pnpm scrape:instagram
```

Review the resulting diff (new entries, downloaded and pruned media under
`public/media/instagram/<key>/`) and commit it.

## Tests

```bash
pnpm test
```

Each module has a colocated `*.test.ts`. Pure modules are tested directly; the
shell modules take injected dependencies, so tests never hit the network or run
ffmpeg.
