# TechTank TO — Website Redesign

A Next.js (App Router) implementation of [techtankto.com](https://www.techtankto.com/),
Toronto's volunteer-run tech community website. The redesign moves away from a
flat "link-tree" layout toward a conversion-oriented onboarding hub that funnels
visitors into specific roles — attendee, speaker, host, sponsor, or organizer.

Specs live in [`prd/`](./prd/PRD.md); application code lives in [`app/`](./app).
The initial UI scaffold was generated from the PRD via v0 —
[original prompt and generation](https://v0.app/chat/website-generation-from-prd-eLek8w4RJMh).

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) component pattern (`components.json` config)
- [class-variance-authority](https://cva.style/) (CVA) for type-safe component variants
- [Radix UI primitives](https://www.radix-ui.com/) (via `@radix-ui/react-slot`)
- [lucide-react](https://lucide.dev/) for icons
- Inter + Space Grotesk via `next/font`
- pnpm 10 for package management

## Getting started

Requirements: Node.js 20+ and [pnpm](https://pnpm.io/) 10.

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:3000>.

### Scripts

| Command                | What it does                        |
| ---------------------- | ----------------------------------- |
| `pnpm dev`             | Start the dev server with Turbopack |
| `pnpm build`           | Production build                    |
| `pnpm start`           | Serve the production build          |
| `pnpm lint`            | Lint with oxlint                    |
| `pnpm type:check`      | Type-check with tsc (no emit)       |
| `pnpm format`          | Format the repo with oxfmt          |
| `pnpm format:check`    | Check formatting without writing    |
| `pnpm db:start`        | Start the local Supabase stack      |
| `pnpm db:stop`         | Stop the local Supabase stack       |
| `pnpm db:reset`        | Reapply migrations + seed           |
| `pnpm functions:serve` | Serve the edge functions locally    |

### Pick a Task board (Supabase)

The [Pick a Task board](./prd/pages/tasks.md) (`/tasks`) and its admin back
office (`/admin/tasks`) are backed by Supabase (Postgres + two Deno
edge functions) under [`db/`](./db). Everything else on the site is
static and needs none of this.

Requires [Docker](https://www.docker.com/). The Supabase CLI is pinned
as a devDependency, so use the `pnpm db:*` scripts rather than a global
install (an older global CLI will silently ignore parts of
`config.toml`).

```bash
pnpm db:start                 # boots Postgres, Studio, etc.
cp .env.example .env.local    # then paste the anon key from db:start output
cp db/.env.example db/.env    # Slack credentials + function secrets
pnpm dev
```

The local stack runs on its own port block (`5452x`, `project_id =
"techtank"`) so it never collides with any other local Supabase stack.
Studio is at <http://localhost:54523>.

**Everything is browsable without signing in.** Applying for a task and
the admin back office both require Slack, so those need the setup below.

## Slack + Supabase setup

Slack is the only identity here — it's how applicants prove they're in the
community and how organizers sign in (no passwords, no email). One Slack
app ([api.slack.com/apps](https://api.slack.com/apps) → _Create New App_)
carries all of it; note its **Client ID / Secret** (_Basic Information_)
and your **workspace / team ID** (`T…`, from _About this workspace_). Then:

1. **Sign in with Slack** — enable it on the Slack app (scopes `openid`,
   `profile`, `email`). In Supabase (_Authentication → Providers → Slack
   (OIDC)_) enable it and paste the Client ID / Secret; locally put them in
   `db/.env`. Add your app callback (`…/auth/callback`) to
   _Authentication → URL Configuration_.
2. **OAuth redirect URL** — the Slack app and Supabase must agree on it
   exactly. Locally that needs HTTPS (Slack rejects `http://localhost`):
   run `ngrok http 54521` and set both the Slack app's _Redirect URLs_ and
   `SLACK_OIDC_REDIRECT_URI` in `db/.env` to
   `https://<tunnel>/auth/v1/callback` (a free ngrok URL changes on every
   restart). In production it's the hosted project's own
   `https://<ref>.supabase.co/auth/v1/callback` — no tunnel, no override.
3. **Bot** (_OAuth & Permissions → Bot Token Scopes_): `chat:write`,
   `im:write`, `mpim:write` — the 1:1 and group DMs open a channel before
   posting. Name it **Tanky**, install it, and copy the `xoxb-…` **Bot
   User OAuth Token**. Add an **Incoming Webhook** on the organizers'
   channel for the alert.
4. **Secrets** — `db/.env`: `SLACK_OIDC_CLIENT_ID/SECRET`,
   `SLACK_WEBHOOK_URL`, `SLACK_BOT_TOKEN`, `PUBLIC_SITE_URL`. `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY`, `NEXT_PUBLIC_SLACK_TEAM_ID`.
   Hosted: OIDC creds in the dashboard, function secrets via
   `supabase secrets set`, `NEXT_PUBLIC_*` in Vercel.
5. **Lock the workspace** — `NEXT_PUBLIC_SLACK_TEAM_ID` only pre-selects
   the workspace on the consent screen; the database is the real gate. Set
   it, or the check stays disabled (fails open):

   ```sql
   update public.app_settings set value = 'T…' where key = 'slack_team_id';
   ```

6. **Add yourself as an organizer** — allowlist by email (matched on first
   sign-in, so it must be your Slack email):

   ```sql
   insert into public.admins (email) values ('you@example.com');
   ```

See [`AGENTS.md`](./AGENTS.md) for the backend conventions.

## Project structure

The tree below doubles as a route map — each directory under `app/` is a
route, annotated with its purpose.

```
.
├── app/                            # Next.js App Router routes
│   ├── layout.tsx                  # Root layout (header, footer, fonts, SEO)
│   ├── page.tsx                    # /                    Social-proof-driven home
│   ├── about/                      # /about               Values & community manifesto
│   ├── events/                     # /events              Upcoming (Luma) + past event timeline
│   ├── get-involved/               # /get-involved        Onboarding hub (shared layout)
│   │   ├── speak-or-facilitate/    #   /speak-or-facilitate  Speaker/facilitator intake
│   │   ├── host/                   #   /host              Host intake
│   │   ├── sponsor/                #   /sponsor           Sponsor intake
│   │   └── organizer/              #   /organizer         Organizer intake
│   ├── tasks/                     # /tasks             Public board of tasks to pick up + apply
│   ├── admin/                      # /admin               Organizer back office (Supabase auth)
│   │   ├── login/                  #   /admin/login       Sign in with Slack
│   │   └── tasks/                 #   /admin/tasks     Manage tasks + applicants
│   ├── legal/                      # /legal               Legal documents (shared layout)
│   │   ├── terms-of-service/       #   /terms-of-service
│   │   ├── privacy-policy/         #   /privacy-policy
│   │   └── code-of-conduct/        #   /code-of-conduct
│   ├── resources/                  # /resources
│   │   ├── media-kit/              #   /resources/media-kit     Brand assets + fast facts
│   │   └── design-system/          #   /resources/design-system  Brand guidelines — design tokens & component reference
│   └── globals.css
├── components/
│   ├── layout/                     # Header, Footer
│   ├── ui/                         # Reusable UI (buttons, cards, sections, etc.)
│   ├── contribution/              # Public contribution-board UI
│   ├── admin/                      # Admin back-office UI
│   └── auth/                       # Admin login form
├── constants/                      # Structured data (events, sponsors, board vocabulary)
├── utils/                          # Helpers (theme, Supabase clients)
├── db/                             # Supabase — migrations, seed, edge functions
├── middleware.ts                   # Admin session refresh + route guard
├── prd/                            # Product requirements documents (specs)
├── public/                         # Static assets (images, downloads, social media dumps)
├── next.config.ts
└── tsconfig.json
```

See [`prd/PRD.md`](./prd/PRD.md) for the full route map, shared-layout
conventions, and per-page content requirements.

## Deployment

The site deploys to [Vercel](https://vercel.com/). Search engine indexing is
enabled site-wide via the `robots` metadata in
[`app/layout.tsx`](./app/layout.tsx).

### Deploying the Pick a Task backend

The marketing pages need only Vercel; the Pick a Task board also needs the
Supabase project deployed.

```bash
# 1. Push the schema
pnpm exec supabase link --project-ref <ref> --workdir db
pnpm exec supabase db push --workdir db

# 2. Deploy both edge functions + their secrets
pnpm exec supabase functions deploy apply-to-task --workdir db
pnpm exec supabase functions deploy assign-task  --workdir db
pnpm exec supabase secrets set --workdir db \
  SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..." \
  SLACK_BOT_TOKEN="xoxb-..." \
  PUBLIC_SITE_URL="https://www.techtankto.com"
```

Then finish the production wiring: configure Slack for prod (the redirect
URL is the hosted project's `https://<ref>.supabase.co/auth/v1/callback` —
no tunnel); set `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY` and
`NEXT_PUBLIC_SLACK_TEAM_ID` in Vercel (read at request time — if missing,
the task routes error rather than show an empty board); and set
`app_settings.slack_team_id` + seed the first organizer in the production
DB (steps 5–6 above). A missing notification secret degrades to a log
line: applications still record, but **nobody is told about them**.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for contribution guidelines.

1. Read [`prd/PRD.md`](./prd/PRD.md) before making structural changes — it
   defines the Info Architecture, brand, and content conventions.
   - **AI agents only:** also read [`AGENTS.md`](./AGENTS.md) for agent-specific
     working conventions and constraints. (`CLAUDE.md` is a stub that includes it.)
2. When adding or renaming a route, update both the route table in
   `prd/PRD.md` §2.1 and the corresponding spec in `prd/pages/`.
3. Keep one dominant CTA per page. Role pages under `/get-involved/*` must end
   in an intake action (email us).

## Contributors

This redesign was built by TechTank TO volunteers who gave their time to a
community they believe in. Thank you to everyone who shipped it 💙

- [Tony Ko](https://github.com/tkodev)
- [Rohan Villoth](https://github.com/RohanVilloth)
- [Justin Bento](https://github.com/Justin-Bento)
- [Jacky](https://github.com/jackytea)
- [John Malapit](https://github.com/johnmal-dev)
- [Danyal Imran](https://github.com/imRanDan)
- [Niki Fereidooni](https://github.com/nfereidooni)
- [Danny Kim](https://github.com/0916dhkim)
- [Batstone Christyanton](https://github.com/batstonechristyanton)
- [Miller Gonzalez](https://github.com/Millertaker)
- [Taehyeon Kim](https://github.com/1234tgk)
- [Jyle Vergara](https://github.com/jylevergara)

And a heartfelt thank you to everyone who built and stewarded earlier versions
of techtankto.com. This redesign stands on the foundation, inspiration, and
lessons you left behind.

## License

[MIT](./LICENSE.md) — see the file for details.
