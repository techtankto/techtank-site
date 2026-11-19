# Luma scraper

Fetches every past event from the TechTank Luma calendar and merges it into the
site's event archive, so the events page lists all meetups without anyone
hand-transcribing each one. The runtime fetch in `app/(site)/events/actions.tsx`
only reads the 10 most recent events on each request; this script walks the full
history once and commits the result.

## How it works

```
Luma API (all pages before now) → Zod validate → transform to LumaEvent
  → upsert by event id (never delete) → never-shrink guard
  → download missing covers to public/images/luma/
  → write luma-events.generated.ts
```

- **Split ownership.** The scraper only ever writes
  `constants/luma-events.generated.ts` and `public/images/luma/`. Human curation
  (pitch, sponsors, recap video, photo album) lives in `constants/events.ts`,
  which wins whenever both describe the same event (matched by Luma slug), so an
  automated run can never clobber editorial choices.
- **Luma is the source of truth for scraped fields.** A changed title or venue
  on Luma replaces the archived one on the next run. Events Luma stops returning
  are kept, and a run that would shrink the archive aborts without writing.
- **Covers are downloaded once.** An existing file under `public/images/luma/`
  is never re-fetched. To refresh a cover that changed on Luma, delete the file
  and re-run.
- **Skip-and-flag.** An event whose cover fails to download is archived with no
  cover and surfaced in the run summary; the next run retries it.
- **Tags are inferred at render time** by `utils/luma/tags.ts`, not stored, so
  a new title rule applies to the whole archive without a re-scrape.

## Files

One module per pipeline stage. Pure modules have no I/O (fast, tested directly);
shell modules isolate the network and filesystem behind injected deps.

| Module           | Responsibility                           | Kind  |
| ---------------- | ---------------------------------------- | ----- |
| `transform.ts`   | API event → `LumaEvent` + cover download | pure  |
| `merge.ts`       | Upsert by id + never-shrink guard        | pure  |
| `emit.ts`        | Render the generated `.ts` data file     | pure  |
| `report.ts`      | Format the run summary                   | pure  |
| `luma-api.ts`    | Fetch every page of past events          | shell |
| `media.ts`       | Download covers, sandboxed to `public/`  | shell |
| `scrape-luma.ts` | Orchestrate the run; CLI entry point     | shell |

The API schemas (`utils/luma/schema.ts`) and tag rules (`utils/luma/tags.ts`)
are shared with the runtime fetch so both validate and tag events the same way.

## Prerequisites

A Luma API key for the TechTank calendar (Luma Plus). Copy `.env.example` →
`.env.local` and fill in `LUMA_API_KEY`.

## Usage

```bash
# Preview what would change — fetches and prints a summary, writes nothing:
pnpm scrape:luma --dry-run

# Real run — downloads covers and updates luma-events.generated.ts:
pnpm scrape:luma
```

Review the resulting diff (new entries, downloaded covers under
`public/images/luma/`) and commit it.

## Tests

```bash
pnpm test
```

Each module has a colocated `*.test.ts`. Pure modules are tested directly; the
shell modules take injected dependencies, so tests never hit the network or
touch the filesystem.
