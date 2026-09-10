# TechTank TO — Website Redesign

A Next.js (App Router) implementation of [techtankto.com](https://www.techtankto.com/),
Toronto's volunteer-run tech community website. The redesign moves away from a
flat "link-tree" layout toward a conversion-oriented onboarding hub that funnels
visitors into specific roles — attendee, speaker, host, sponsor, or organizer.

Specs live in [`docs/prd/`](./docs/prd/); application code lives in [`app/`](./app).
The initial UI scaffold was generated from the PRD via v0 —
[original prompt and generation](https://v0.app/chat/website-generation-from-prd-eLek8w4RJMh).

House standards (process, writing, nextjs, components, data, testing, performance,
accessibility, seo, git) are supplied by the [harness-skills](https://github.com/tkodev/harness-skills)
library, vendored at [`.agents/skills/`](./.agents/skills/) (`.claude/skills/` symlinks to
it) and loaded automatically by any skill-aware coding agent.

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

### Environment Variables

Some features require environment variables to function correctly. Copy `.env.example` to `.env.local` and populate the values:

| Variable           | What it is                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| `LUMA_CALENDAR_ID` | The Luma calendar ID (e.g. `cal-...`) used to fetch upcoming and past events on the `/events` page. |

See `scripts/instagram/README.md` for Instagram-specific environment variables.

### Scripts

| Command             | What it does                        |
| ------------------- | ----------------------------------- |
| `pnpm dev`          | Start the dev server with Turbopack |
| `pnpm build`        | Production build                    |
| `pnpm start`        | Serve the production build          |
| `pnpm lint`         | Run Next.js' linter                 |
| `pnpm format`       | Format the repo with oxfmt          |
| `pnpm format:check` | Check formatting without writing    |

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
│   │   ├── organizer/              #   /organizer         Organizer intake
│   │   └── donate/                 #   /donate            (via next.config rewrites) Interac e-transfer donation info
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
│   └── ui/                         # Reusable UI (buttons, cards, sections, etc.)
├── constants/                      # Structured data (events, sponsors, social links)
├── docs/prd/                       # Product requirements pipeline (01-brief → 06-plan)
├── .agents/skills/                 # Vendored house-standard skills (copied, portable)
├── .claude/skills/                 # Same skills (symlinked to .agents/skills/)
├── public/                         # Static assets (images, downloads, social media dumps)
├── next.config.ts
├── vercel.json                     # Vercel deployment config (noindex header)
└── tsconfig.json
```

See [`docs/prd/03-solution.md`](./docs/prd/03-solution.md) for the full route map and
shared-layout conventions, and the rest of [`docs/prd/`](./docs/prd/) for product intent,
design tokens, architecture, and the delivery plan.

## Deployment

The site deploys to [Vercel](https://vercel.com/). Search engine indexing is
enabled site-wide via the `robots` metadata in
[`app/layout.tsx`](./app/layout.tsx).

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for contribution guidelines, team
onboarding, and the roadmap.

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
