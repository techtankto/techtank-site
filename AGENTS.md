# AGENTS.md

Guidance for any coding agent working in this repository, and the primary,
tool-agnostic context source for all of them (Claude Code, Cursor, Copilot,
Codex). Tool-specific files like `CLAUDE.md` defer to it.

## What this repo is

A Next.js (App Router) implementation of
[techtankto.com](https://www.techtankto.com/), Toronto's volunteer-run tech
community website. It funnels visitors into roles: attendee, speaker, host,
sponsor, or volunteer.

The PRD (`docs/prd/`) is a historic record of how the current structure came
to be. Read it for context on prior decisions (why a route was shaped that
way, what a design token replaced), not as a spec to keep in sync.

House standards live in the vendored skills and load via skill discovery; see
§House standards. Application code lives in `app/`, with shared pieces in
`components/`, `constants/`, and `public/`. The initial UI scaffold was
generated from the prior PRD via
[v0](https://v0.app/chat/website-generation-from-prd-eLek8w4RJMh).

For developer-facing setup (scripts, directory tree, route map), see
[`README.md`](./README.md).

## Repository layout

```
.
├── AGENTS.md              # Primary agent context
├── CLAUDE.md              # Claude Code stub that includes AGENTS.md
├── .agents/skills/        # vendored house-standard skills (copied, portable)
├── .claude/skills/        # same skills (symlinked to .agents/skills/)
└── docs/
    └── prd/               # 01-brief → 06-plan, the numbered pipeline
```

`docs/prd/06-plan.md` records the milestone list as it stood during the
redesign. `docs/prd/03-solution.md` records the original route map and
per-surface content requirements; `README.md` is the current route reference.

## How the information architecture works

A **conversion-oriented onboarding hub**, not a flat "link-tree" layout.
`README.md` carries the current route map; `docs/prd/03-solution.md` carries
the shared layouts and navigation as originally specified:

- `/`: social-proof-driven home (testimonials, event photos, logo cloud).
- `/about` (+ `/about/faq`, `/about/team`): values manifesto built on four
  pillars, **Community, Innovation, Teamwork, Respect**; FAQ; team roster.
- `/get-involved`: onboarding hub with four role sub-pages (Speaker, Host,
  Sponsor, Organizer Team), each ending in an intake action (email us at
  `techtankto@gmail.com`).
- `/events`: embedded Luma calendar.
- `/donate`: Stripe and Interac e-transfer donation info. It stays a
  top-level route rather than nesting under `/get-involved`, since it is not
  a role intake form, but the `/get-involved` sub-nav and the footer link it
  as part of that grouping.
- `/resources/media-kit`: standalone brand assets and fast facts for media.
- `/resources/design-system`: brand guidelines and design-token reference.
- `/legal`: grouped compliance documents.

The `/get-involved` and `/legal` sections use **Next.js shared layouts**
(sticky sub-nav, persistent CTA, consistent form/document styling).

Never re-introduce the old flat structure (separate `/speak`, `/host`,
`/mentors`, `/terms-conditions` pages); those were rolled into
`/get-involved/*` and `/legal/*` deliberately, and `/donate` is the one
exception, for the reason above.

## Working conventions

### House standards: read the whole group

House standards live in the vendored skills under `.claude/skills/` / `.agents/skills/`,
grouped by the kind of work they govern. **Read `Prose` and `Tooling` first on every task,
then every skill in the group matching the work**, not just the one closest to it.

| Group        | Read                                                                             | When                                                                                                      |
| ------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Prose**    | `writing`                                                                        | Always, first. Governs docs, standards, README, PR and commit bodies, and anything written into a file    |
| **Tooling**  | `claude`, `vscode`                                                               | Always, first. Governs agent configuration, repo hygiene, and the editor session                          |
| **Frontend** | `accessibility`, `components`, `data`, `nextjs`, `performance`, `seo`, `testing` | Any change under `app/` or `components/`, or to `app/globals.css`: a component, a route, a style, a token |
| **Delivery** | `git`, `process`, `writing`                                                      | Branches, commits, PR and issue bodies, reviews, planning, milestones                                     |

When a skill is added or removed, update this table in the same change.

### Referencing the PRD

- `docs/prd/` is frozen: don't edit it to reflect new IA or route changes.
  When the IA changes, update the route and nav documentation in `README.md`
  and the code under `app/` instead.
- Use the PRD to understand _why_ the current structure looks the way it
  does, not as a target to keep in sync.

### Tone in specs

- Concrete, not aspirational. If organizers haven't confirmed a number, quote,
  or tier detail, leave a "finalize with organizers" note instead of inventing
  one.
- Conversion-oriented: every page spec declares **one dominant CTA**, and
  `/get-involved/*` ends in an intake action (email us).
- Social proof first: testimonials, real event photography, and logo clouds
  are required patterns, not decoration.

### Theming

- `next-themes` handles light/dark/system detection. Always set `defaultTheme="system"` and `enableSystem` on `ThemeProvider`.
- Add `suppressHydrationWarning` to the `<html>` element to suppress the server/client hydration mismatch that `next-themes` causes.
- Theme-aware components render a placeholder until `useIsHydrated` (`hooks/use-is-hydrated.ts`) flips: rendering sooner makes the hydration render disagree with the server's, and a theme-dependent icon comes out wrong.
- The theme toggle cycles `system → light → dark` (not just light↔dark) so users can return to system preference without a page reload.
- Dark-mode overrides use `@custom-variant dark (&:where(.dark, .dark *))` in Tailwind v4. Dark tokens live in `.dark {}` in `globals.css`.
- `globals.css` is divided into four sections: Base Tokens (`@theme`), Light Tokens & Gradients (`.light`), Dark Tokens & Gradients (`.dark`), Helper Classes.

### Global state

- Use Zustand (`stores/app-state.ts`) for sitewide UI state (mobile menu, future modal/drawer state, etc.).
- Keep `next-themes` as the single source of truth for theme — do not duplicate theme state in Zustand.

### Backend / Supabase

The **task board** (`/tasks`, public) and its **admin back office**
(`/admin/tasks`, organizer-only) are backed by Supabase (Postgres + two
Deno edge functions), all under `db/`; the rest of the app doesn't touch
it. The code still uses "contribution" internally (`contribution_tasks`,
`components/contribution/*`, `/admin/tasks`); "Pick a Task" is the
user-facing name.

- **Local stack lives on a dedicated port block** so it never collides
  with any other local Supabase stack on the machine. TechTank is
  `project_id = "techtank"` on the `5452x` block — API `54521`,
  Studio `54523`. Run it with `pnpm db:start` / `db:stop` /
  `db:reset`; serve the edge functions with `pnpm functions:serve`.
  Multiple stacks can run at once.
- **Env:** copy `.env.example` → `.env.local` and fill the anon key
  from `pnpm db:start` output. Edge-function secrets come from
  `db/.env.example` → `db/supabase/functions/.env`
  (`SLACK_WEBHOOK_URL`, `SLACK_BOT_TOKEN`, `PUBLIC_SITE_URL`,
  `SLACK_OIDC_CLIENT_ID`, `SLACK_OIDC_SECRET`).
- **Everyone signs in with Slack; nobody gets a TechTank account.**
  Applying requires connecting Slack, so an applicant's name, email and
  Slack id come from the verified token rather than the request body.
  Organizers sign in at `/admin/login` **with Slack** (Supabase
  `slack_oidc`) — there is no password and no login code. Allowlist an
  organizer by inserting a row into `public.admins` with just their
  email; their first sign-in claims it via `claim_admin_membership()`
  and records their Slack user ID.
- **The Slack workspace is enforced in SQL, not the client.** The
  sign-in URL passes `team=<id>` so Slack pre-selects the right
  workspace, but that is only a hint. `caller_workspace_ok()` compares
  the caller's `team_id` claim against `app_settings.slack_team_id`, and
  `assert_caller_is_admin()` / `is_caller_admin()` both apply it. A NULL
  setting disables the check so a misconfigured environment can't lock
  everyone out.
- **Every admin write goes through a `SECURITY DEFINER` RPC gated by
  `assert_caller_is_admin()`** — the SQL boundary is the real gate, not
  the UI. Public reads use the anon `get_public_contribution_task(s)`
  RPCs.
- **This project sends no email at all.** Slack is the only channel:
  the `apply-to-task` function DMs the applicant their receipt (the bot
  is **Tanky**) and `assign-task` opens a group DM introducing an
  assignee to the assigning organizer (`SLACK_BOT_TOKEN`, needing
  `chat:write`, `im:write`, and `mpim:write` — a channel is opened
  before posting), then POSTs to `SLACK_WEBHOOK_URL` to alert
  organizers, @-mentioning the applicant.
  If the DM failed, that organizer message says so, so a missing scope
  or revoked token can't silently leave an applicant un-contacted.
  Neither call may throw: the row is already committed by then, so a
  notification hiccup must never turn a successful apply into a 500.
  The Supabase email provider is disabled; don't reintroduce a delivery
  dependency without a deliberate decision.
- **Slack OAuth locally needs an ngrok tunnel** (Slack rejects
  `http://localhost` redirect URLs). Point it at port `54521` and set
  `SLACK_OIDC_REDIRECT_URI` in `db/.env` to the tunnel's
  `/auth/v1/callback`. See the README's Slack + Supabase setup.
- **The Supabase CLI is a devDependency**, so always use the `pnpm db:*`
  scripts. An older global CLI silently drops the `slack_oidc` block
  from `config.toml` and the provider never turns on.
- **Homes:** Supabase clients in `utils/supabase/*`; board
  vocabulary/types/helpers in `constants/contribution-board.ts`; data
  access in `app/**/actions.ts` (server-first, no react-query). The
  Deno edge tree under `db/` is excluded from `tsconfig`, oxlint, and
  oxfmt — it has its own runtime.

### After making code changes

- Use `pnpm` (not npm or yarn) for all package operations in this repo.
- Run `pnpm format`, then `pnpm validate` (format check, lint, types), before
  reporting a task complete or opening a commit.

### Adding a new page

1. Decide where it belongs in the IA. A role goes under `/get-involved`,
   legal under `/legal`, a resource beside `/resources/media-kit`.
2. Add the route to the directory tree and route map in `README.md`.
3. Update the relevant nav, either the global header or the shared layout
   sub-nav.

### Removing or renaming a page

- Remove the route from `README.md`'s tree, its navigation entry, and any
  inbound links from other pages. Search for references before deleting.
