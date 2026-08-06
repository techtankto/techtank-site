# AGENTS.md

Guidance for any coding agent working in this repository. This is the
primary, tool-agnostic context source for AI agents (Claude Code, Cursor,
Copilot, Codex, etc.); tool-specific files like `CLAUDE.md` defer to it.

## What this repo is

A Next.js (App Router) implementation of
[techtankto.com](https://www.techtankto.com/), Toronto's volunteer-run
tech community website. The redesign moves away from a flat "link-tree"
layout toward a conversion-oriented onboarding hub that funnels
visitors into specific roles — attendee, speaker, host, sponsor, or
volunteer.

Specs live in `prd/` (see `prd/PRD.md`); application code lives in
`app/`, with shared pieces in `components/`, `constants/`, and
`public/`. The initial UI scaffold was generated from the PRD via v0 —
[original prompt and generation](https://v0.app/chat/website-generation-from-prd-eLek8w4RJMh).

For developer-facing setup (scripts, directory tree, route map), see
[`README.md`](./README.md).

## Repository layout

```
.
├── AGENTS.md              # This file — primary agent context
├── CLAUDE.md              # Claude Code stub that includes AGENTS.md
└── prd/
    ├── PRD.md             # Top-level product requirements document
    └── pages/             # One spec per route
        ├── home.md                # /
        ├── about.md               # /about
        ├── events.md              # /events
        ├── press-kit.md           # /press-kit
        ├── get-involved/          # Onboarding hub (shared layout)
        │   ├── index.md           # /get-involved
        │   ├── speak-or-facilitate.md         # /get-involved/speak-or-facilitate
        │   ├── host.md            # /get-involved/host
        │   ├── sponsor.md         # /get-involved/sponsor
        │   └── organizer.md       # /get-involved/organizer
        ├── resources/             # Resources folder
        │   ├── media-kit.md       # /resources/media-kit
        │   └── design-system.md   # /resources/design-system (brand guidelines + design token reference)
        └── legal/                 # Legal folder (shared layout)
            ├── terms-of-service.md
            ├── privacy-policy.md
            └── code-of-conduct.md
```

`prd/PRD.md` is the top-level document. Each file in `prd/pages/` fully
describes one route. The file tree under `prd/pages/` mirrors the final
URL structure.

## How the information architecture works

The redesign replaces a flat "link-tree" layout with a
**conversion-oriented onboarding hub**:

- `/` — social-proof-driven home (testimonials, event photos, logo cloud).
- `/about` — values manifesto built on four pillars: **Community,
  Innovation, Teamwork, Respect**.
- `/get-involved` — onboarding hub with four role sub-pages (Speaker,
  Host, Sponsor, Organizer Team), each ending in an intake action (email us
  at `techtankto@gmail.com`).
- `/events` — embedded Luma calendar.
- `/press-kit` — standalone brand assets and fast facts for media.
- `/legal` — grouped compliance documents.

The `/get-involved` and `/legal` sections are designed for **Next.js
shared layouts** (sticky sub-nav, persistent CTA, consistent form/
document styling).

## Working conventions

### Editing specs

- Keep the per-page structure consistent: Purpose, Primary audience,
  Key messages, Content sections, CTAs, Functional requirements,
  Acceptance criteria.
- Internal links between PRD documents are relative (e.g.
  `pages/home.md` from `prd/PRD.md`; `../about.md` from a
  `prd/pages/legal/*.md` file).
- When the IA changes, update **both** `prd/PRD.md` §2 (Route map /
  shared layouts / navigation) **and** the affected per-page files.
  Keeping these in sync is the single most important maintenance task.
- Never introduce a URL in a page spec that isn't reflected in the
  Route map in `prd/PRD.md`.

### Tone in specs

- Concrete, not aspirational. If organizers haven't confirmed a number
  (attendance, tier, timing), flag it instead of inventing one.
- Conversion-oriented: every page spec must declare **one dominant
  CTA**, and `/get-involved/*` must end in an intake action (email us).
- Social proof first: testimonials, real event photography, and
  logo clouds are required patterns, not decoration.

### Components

How components are added, shaped, styled, and organized. This section
owns the authoring and styling rules; what components exist and what
they look like is the design contract's concern, not this section's.

#### The flow: shadcn first

1. **Check shadcn before writing anything.** Primitives use
   [shadcn/ui](https://ui.shadcn.com/), which uses Radix primitives
   underneath. Adding a new component starts with a check of the shadcn
   library: if it exists there, import it with the CLI
   (`pnpm dlx shadcn@latest add <name>`), then **reformat it to the
   house shape below and re-theme it with the v5 tokens**.
2. **Custom components use the identical shape.** If shadcn doesn't have
   it (or the design calls for something bespoke), author it from
   scratch in exactly the same format; the only difference is there's
   nothing to import.

#### The file shape

1. **Every component follows the skeleton in
   [`components/ui/example.tsx`](./components/ui/example.tsx).**

   Order within the file: **CVA styles/constants on top → types
   (`XxxRef`, `XxxProps`) → component.** Order within the function body,
   each under its comment: **props** destructure → **hooks** → **render
   vars** → **jsx** (composed with `cn()`).

2. **Named exports only**: the component plus its `Props` and `Ref`
   types; `displayName` set on `forwardRef` components. No default
   exports.

#### Styling rules

- Define visual variants (color, size, style) as CVA `variants` — never
  as ad-hoc `className` overrides at the call site. Multi-element
  components get one `cva` per element in the `styles` object, keyed by
  element name (`root`, `viewport`, …).
- Use `cn()` and `cva` from [`utils/theme.ts`](./utils/theme.ts) (which
  re-exports `cva`/`VariantProps`) for all className composition.
- Expose `asChild` via Radix `Slot` when a component needs to delegate
  rendering to its child (e.g. `<Button asChild><Link …>`).
- Keep layout utilities (`w-full`, `mt-4`, etc.) at the call site via
  `className`; keep visual styles inside the CVA definition.
- New primitives go in `components/ui/`; page-specific compositions
  stay in the relevant `app/` directory. Files are kebab-case
  (`previous-button.tsx`), even though the component they export is
  PascalCase.

### Theming

- `next-themes` handles light/dark/system detection. Always set `defaultTheme="system"` and `enableSystem` on `ThemeProvider`.
- Add `suppressHydrationWarning` to the `<html>` element to suppress the server/client hydration mismatch that `next-themes` causes.
- Theme-aware components must `useEffect` + `useState(mounted)` and return a placeholder until mounted — otherwise icons and states will SSR incorrectly.
- The theme toggle cycles `system → light → dark` (not just light↔dark) so users can return to system preference without a page reload.
- Dark-mode overrides use `@custom-variant dark (&:where(.dark, .dark *))` in Tailwind v4. Dark tokens live in `.dark {}` in `globals.css`.
- `globals.css` is divided into four sections: Base Tokens (`@theme`), Light Tokens & Gradients (`.light`), Dark Tokens & Gradients (`.dark`), Helper Classes.

### Global state

- Use Zustand (`lib/store.ts`) for sitewide UI state (mobile menu, future modal/drawer state, etc.).
- Keep `next-themes` as the single source of truth for theme — do not duplicate theme state in Zustand.
- Use `pnpm` (not npm or yarn) for all package operations in this repo.

### Backend / Supabase

Most of the site is static marketing content, but the **Pick a Task** board
(`/tasks`, public, a board of tasks to pick up) and its **admin back
office** (`/admin/tasks`, organizer-only) are backed by Supabase
(Postgres + one Deno edge function), all under `db/`. The code still
uses "contribution" internally (`contribution_tasks`, `components/
contribution/*`, `/admin/tasks`); "Pick a Task" is the user-facing name.

- **Local stack lives on a dedicated port block** so it never collides
  with any other local Supabase stack on the machine. TechTank is
  `project_id = "techtank"` on the `5452x` block — API `54521`,
  Studio `54523`. Run it with `pnpm db:start` / `db:stop` /
  `db:reset`; serve the edge function with `pnpm functions:serve`.
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
  the `apply-to-task` function DMs the applicant their receipt (the bot is **Tanky**)
  (`SLACK_BOT_TOKEN`, needing `chat:write` **and** `im:write` — a DM
  channel must be opened before posting), then POSTs to
  `SLACK_WEBHOOK_URL` to alert organizers, @-mentioning the applicant.
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

### Semantic colour tokens

- Never use brand-named colour utilities (e.g. `text-teal-dark`, `bg-seafoam`) in components or pages. Use semantic tokens (`text-foreground`, `bg-primary`, `bg-secondary`, `text-muted-foreground`, etc.) so dark mode works without per-component overrides.
- Pair every background token with its matching foreground: `bg-primary → text-primary-foreground`, `bg-secondary → text-secondary-foreground`, `bg-success → text-success-foreground`.
- Gradients are defined as CSS utility classes (`.gradient-brand`, `.gradient-hero`, etc.) with `.dark` overrides in `globals.css`; use the class name in JSX, never inline `background:` values.

### After making code changes

- Run `pnpm type:check` to catch type errors.
- Run `pnpm format` to keep the codebase oxfmt-clean.

Do both before reporting a task complete or opening a commit.

### Adding a new page

1. Decide where it belongs in the IA. If it's a role, it goes under
   `/get-involved`; if it's legal, under `/legal`; if it's a resource,
   it's probably a sibling of `/press-kit`.
2. Create `prd/pages/<path>.md` following the existing section
   structure.
3. Add the route to the Route map table in `prd/PRD.md` §2.1.
4. Add a link to it in `prd/PRD.md` §4 (Page-Level Requirements Index).
5. Update the relevant nav (global header or shared layout sub-nav)
   description in `prd/PRD.md` §2.3.

### Removing or renaming a page

- Remove the file, its Route map row, its index entry, and any inbound
  links from other page specs. Use Grep to find references before
  deleting.

## Things to avoid

- Don't let the implementation drift from the PRD. When behaviour or
  IA changes, update both the relevant `prd/pages/*.md` spec and the
  matching code under `app/` in the same change.
- Don't add numbers, quotes, or tier details that organizers haven't
  confirmed. It's better to leave a "finalize with organizers" note
  than to publish fiction.
- Don't re-introduce the old flat structure (separate `/speak`,
  `/host`, `/mentors`, `/donate`, `/terms-conditions` pages) — those
  were intentionally rolled into `/get-involved/*` and `/legal/*`.
- Don't touch settings or hooks without being asked.
- Never use agent memory (e.g. Claude Code's persistent memory directory,
  `MEMORY.md`, or any equivalent tool-specific store). Conventions and
  project facts must live in this repository — in `AGENTS.md`, the
  `prd/` specs, or the code itself — so they are reviewable, versioned,
  and available to every contributor and agent. Memory that only one
  tool can read is invisible to code review and drifts out of date.
  If something is worth remembering, commit it.

## Git workflow

- Feature work happens on the branch specified in the session brief
  (currently `claude/techtank-toronto-prd-kuQxt`).
- Create new commits rather than amending. Use HEREDOC commit messages.
- Never force-push to any branch, especially `main`. No exceptions.
- Never skip hooks without explicit permission.
- Do not open a pull request unless explicitly asked.
- Do not sign commits or PRs as an AI agent, and do not include
  session links, `Co-Authored-By` agent trailers, or any other
  "Generated with …" markers in commit messages or PR bodies.

### Conventional commits

- Use [Conventional Commits](https://www.conventionalcommits.org/)
  for every commit subject:
  `<type>(<optional scope>): <imperative summary>`
- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`,
  `test`, `build`, `ci`, `chore`, `revert`.
- Pick a scope that matches the page or area (`about`, `events`,
  `get-involved/sponsor`, `prd`, `legal`, etc.) when one is obvious;
  omit it when the change is global.
- Keep the subject under ~72 characters, lowercase, no trailing
  period; explain the _why_ in the body if the diff alone doesn't.
- Use `!` (e.g. `feat(get-involved)!: …`) and a `BREAKING CHANGE:`
  footer for changes that move URLs, rename routes, or alter
  documented behavior.

### Branch naming

- Branches follow `<type>/<short-kebab-summary>` using the same
  type vocabulary as commits — e.g. `feat/sponsor-intake-form`,
  `fix/events-luma-fallback`, `docs/prd-route-map`,
  `refactor/get-involved-layout`.
- Session-managed agent branches keep the `claude/<slug>` prefix
  given in the session brief; treat the slug as the conventional
  summary and don't rename it.
- Keep slugs short (≤40 chars), lowercase, hyphen-separated, and
  reference the affected area rather than the ticket number.
