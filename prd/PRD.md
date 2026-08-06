# Product Requirements Document (PRD)

## TechTank TO — Website Redesign

**Source of truth:** https://www.techtankto.com/
**Document date:** 2026-04-18
**Status:** Redesign — approved IA, pending visual design
**Stack target:** Next.js (App Router) with shared layouts

---

## 1. Product Overview

TechTank TO (TechTank) is a volunteer-run, Toronto-based **Canadian** tech
community founded in 2023. The redesign moves the site away from a flat "link-tree"
layout toward a **conversion-oriented onboarding hub** that turns curious
visitors into active contributors — attendees, speakers, hosts, sponsors,
and organizers.

The site remains content-driven marketing: it does not own accounts or
ticketing. It funnels visitors to external platforms (Luma, Meetup, Slack,
LinkedIn, GitHub, YouTube, Instagram) and captures intake via email to
`techtankto@gmail.com`.

### 1.1 Mission

Foster a supportive and inclusive environment where people of all skill
levels can explore, create, and thrive in technology.

### 1.2 Core pillars (brand/values)

- **Community** — belonging, safety, inclusivity
- **Innovation** — curiosity, learning in public, experimentation
- **Teamwork** — collaboration over competition
- **Respect** — enforced via the Code of Conduct

### 1.3 Audience

- Software developers at all career levels (junior to senior)
- Designers, PMs, tech-adjacent roles
- Experienced professionals open to mentoring or speaking
- Companies wanting to host, sponsor, or recruit
- Media, partners, and sponsors looking for brand assets

### 1.4 Event types

- **Tech talks** — Lightning talks, deep dives, and technical presentations
- **Build nights** — Hands-on evenings where attendees build alongside
  each other, run in partnership with a sponsor (currently Build Night TO
  by TechTank x PostHog). Cadence and long-term format: finalize with
  organizers.
- **Socials** — Casual networking and community building
- **Sports** — Active events like volleyball and softball
- **Code Diversity** — Inclusive events for underrepresented groups in tech
- **Panels** — Multi-speaker discussions on industry topics
- **Workshops** — Hands-on learning sessions (planned)

Note: Most events are free, but some (workshops, special activities) may
have associated costs. Do not advertise all events as "free".

### 1.5 Product goals

1. Build social trust via **social proof** — testimonials, event
   photography, sponsor/host logo cloud.
2. Convert visitors into specific roles through a dedicated onboarding
   funnel (`/get-involved/*`).
3. Keep event discovery effortless (embedded Luma calendar).
4. Provide a professional, one-stop resource for press and sponsors.
5. Centralize legal / compliance docs cleanly.

### 1.5 Canadian context

TechTank TO is a **Canadian** tech community based in Toronto, Ontario.
All external links to sponsor/partner companies should use Canadian
variants where available (e.g., `.ca` domains, `/en-ca` paths). The
community serves the Greater Toronto Area tech ecosystem and operates
under Ontario/Canadian jurisdiction.

**Current sponsors and hosts:**

- 7shifts (Canadian HQ)
- Rakuten Canada
- Cohere (Canadian-founded)
- Docebo (Canadian HQ)
- Vena Solutions (Canadian HQ)
- Points / Plusgrade (Canadian HQ)
- Intuit Canada
- Microsoft Canada
- BrainStation
- Prema Coffee (Toronto local)

### 1.6 Success metrics

- Intake emails per role (speaker / host / sponsor / organizer)
- RSVP click-throughs to Luma
- Press Kit downloads
- Scroll depth and CTA click-through rate on `/` and `/about`
- Returning visitors and newsletter / Slack joins

---

## 2. Information Architecture

```
/
├── about
├── get-involved                 (onboarding hub — shared layout)
│   ├── speaker
│   ├── host
│   ├── sponsor
│   └── organizer
├── tasks                        (public board of tasks to pick up)
├── events                       (Luma calendar embed)
├── resources                    (grouped resource pages)
│   ├── media-kit                (brand assets, logos, fast facts)
│   └── design-system            (brand guidelines + design token reference)
└── legal                        (shared layout)
    ├── terms-of-service
    ├── privacy-policy
    └── code-of-conduct
```

### 2.1 Route map

| Path                                | Title               | Purpose                                                                        |
| ----------------------------------- | ------------------- | ------------------------------------------------------------------------------ |
| `/`                                 | Home                | Social-proof-driven overview and primary CTAs                                  |
| `/about`                            | About               | Values & community manifesto (the four pillars)                                |
| `/get-involved`                     | Get Involved        | Onboarding hub; routes visitors to a role                                      |
| `/get-involved/speak-or-facilitate` | Speak or Facilitate | Speaker logistics + intake action (email us)                                   |
| `/get-involved/host`                | Host                | Venue logistics (40–120 cap, 6–8:30pm) + intake action (email us)              |
| `/get-involved/sponsor`             | Sponsor             | Corporate partner pitch + intake action (email us)                             |
| `/get-involved/organizer`           | Organizer Team      | Crew onboarding + intake action (email us)                                     |
| `/tasks`                            | Pick a Task         | Public board of concrete tasks the community can pick up                       |
| `/tasks/[id]`                       | Task detail         | One task + Slack-verified apply flow                                           |
| `/admin/login`                      | Admin sign in       | Organizer login via Slack SSO (not indexed)                                    |
| `/admin/tasks`                      | Admin — Pick a Task | Back office to CRUD/assign/reorder tasks and review applicants (not indexed)   |
| `/events`                           | Events              | Upcoming events via Luma calendar                                              |
| `/resources/media-kit`              | Media Kit           | Brand assets, logos, and fast facts for press and partners                     |
| `/resources/design-system`          | Design System       | Brand guidelines — colours, typography, and component reference                |
| `/about/faq`                        | FAQ                 | Frequently asked questions about membership, events, sponsorship, and policies |
| `/legal/terms-of-service`           | Terms of Service    | —                                                                              |
| `/legal/privacy-policy`             | Privacy Policy      | —                                                                              |
| `/legal/code-of-conduct`            | Code of Conduct     | —                                                                              |

### 2.2 Shared layouts (Next.js)

- **Root layout** — global header, footer, theme, SEO defaults.
- **`/get-involved` layout** — sticky sub-nav (Speak or Facilitate / Host / Sponsor /
  Organizer Team), persistent "Join our Slack" CTA, shared "Why get involved" strip,
  a Pick a Task teaser section linking to `/tasks`, and consistent intake CTA styling
  (email us).
- **`/legal` layout** — document-style narrow column, table of contents
  sidebar, last-updated stamp.

### 2.3 Global navigation

- **Primary nav:** About, Get Involved, Pick a Task, Events, Code of Conduct
- **Header CTA:** "Join our Slack" (secondary: "RSVP on Luma")
- **Footer:**
  - Column 1 — Community: Luma, Meetup, Slack, LinkedIn, Instagram, GitHub, YouTube
  - Column 2 — Get Involved: Speak, Host, Sponsor, Organizer Team, Pick a Task
  - Column 3 — Resources: Press Kit, Events
  - Column 4 — Legal: Terms of Service, Privacy Policy, Code of Conduct
  - Contact: `techtankto@gmail.com` + Slack community link

### 2.4 External destinations

- Luma: https://luma.com/techtank
- Meetup: https://meetup.com/techtank-to
- Slack: https://techtankto.com/links/slack
- LinkedIn: https://linkedin.com/company/techtank-to
- Instagram: https://instagram.com/techtankto
- YouTube: https://youtube.com/@TechTankTo
- GitHub: https://github.com/tech-tankorg
- Google Photos albums (per-event)
- Email intake: `techtankto@gmail.com` (one inbox for all `/get-involved/*` roles)

---

## 3. Key User Journeys

1. **Curious newcomer** → `/` (sees event photos, testimonials, logo
   cloud) → `/about` (values) → `/events` (RSVPs on Luma) → joins Slack.
2. **Aspiring speaker** → `/` → `/get-involved/speak-or-facilitate` → emails
   `techtankto@gmail.com` with their talk proposal.
3. **Company host** → `/` or `/get-involved` → `/get-involved/host` →
   submits intake → receives sponsorship package via email.
4. **Corporate sponsor** → `/resources/media-kit` or `/get-involved/sponsor` →
   downloads brand assets → submits sponsor intake.
5. **Organizer Team** → Slack invite or `/` → `/get-involved/organizer` →
   submits intake.
6. **Journalist / partner** → `/resources/media-kit` → downloads logos + fast-facts
   → emails `techtankto@gmail.com`.
7. **Returning member** → `/events` or Slack.

---

## 4. Page-Level Requirements (Index)

Detailed requirements live in `prd/pages/` (relative paths below are
relative to this file, `prd/PRD.md`):

- [pages/home.md](pages/home.md)
- [pages/about.md](pages/about.md)
- [pages/events.md](pages/events.md)
- [pages/get-involved/index.md](pages/get-involved/index.md)
- [pages/get-involved/speak-or-facilitate.md](pages/get-involved/speak-or-facilitate.md)
- [pages/get-involved/host.md](pages/get-involved/host.md)
- [pages/get-involved/sponsor.md](pages/get-involved/sponsor.md)
- [pages/get-involved/organizer.md](pages/get-involved/organizer.md)
- [pages/tasks.md](pages/tasks.md)
- [pages/resources/media-kit.md](pages/resources/media-kit.md)
- [pages/resources/design-system.md](pages/resources/design-system.md)
- [pages/legal/terms-of-service.md](pages/legal/terms-of-service.md)
- [pages/legal/privacy-policy.md](pages/legal/privacy-policy.md)
- [pages/legal/code-of-conduct.md](pages/legal/code-of-conduct.md)

---

## 5. Design Direction

### 5.1 Visual tone

- **Professional and welcoming**, not corporate and not casual. The
  visual tone should be credible enough that a sponsor's marketing team
  feels comfortable associating their brand, while remaining open and
  approachable to a first-time attendee from any background. Confident
  use of whitespace and a clean type scale; avoid anything that reads
  as playful or youthful.
- Keep the aquatic motif (fish logo, "Tank" vocabulary) but treat it as a
  subtle mark rather than the dominant motif.
- Prefer **real event photography** over stock illustration.

### 5.2 Conversion orientation

Every page must have exactly **one dominant CTA** that moves the visitor
toward interacting (Join Slack / RSVP / Email us). Secondary
CTAs are fine; tertiary links belong in the footer.

### 5.3 Social proof patterns (required on `/` and relevant `/get-involved/*`)

- **Social feed over testimonials:** Embedded LinkedIn and Instagram posts
  from organizers showing real, organic community moments. No curated
  quotes—let the genuine reactions speak for themselves.
  - LinkedIn: https://linkedin.com/company/techtank-to
  - Instagram: https://instagram.com/techtankto
- Numeric facts: 40-120 attendees per event, 45+ events hosted (25+ main
  events + 20+ CodeDiversity events), monthly cadence since 2023
- Sponsor / host logo cloud
- Linked previews of recent Google Photos albums and Instagram posts
- YouTube links to recent talks

### 5.4 Accessibility

- WCAG 2.1 AA: color contrast, visible focus, alt text on all photos,
  semantic headings, keyboard-reachable forms, reduced-motion support.

### 5.5 Responsiveness

- Mobile-first. Break at 640 / 1024 / 1280. The sticky sub-nav on
  `/get-involved` must collapse into a single-line segmented control on
  mobile.

### 5.6 Event archive & recap pattern

`/events` and the home page treat each event as a recurring entry in
an ongoing series, not just a flat Luma embed. Every event record
carries:

- Event number and/or date badge (e.g. "Event 14 · April 2026")
- Title and one-line pitch
- Venue + time chips
- Tag chips (topic, track, "beginner-friendly", capacity note)
- Host / sponsor attribution (**Supported by** + logo)
- Status:
  - **Upcoming** — shows "Next Up" treatment and an **RSVP on Luma**
    CTA
  - **Past** — shows a **View Recap** CTA linking to the event's
    Google Photos album and YouTube recording
- A past-events timeline lives directly below the upcoming event,
  so visitors can scroll the full history as additional social proof.

For v1, a "recap" is a linked bundle (Google Photos URL + YouTube URL

- host/sponsor thanks surfaced inline). A dedicated `/events/<slug>`
  detail route is a v2 option only if organizers want editorial recaps
  and is explicitly out of scope for the initial launch.

### 5.7 Recurring UI patterns

- **Overline kicker.** Every major section opens with a short,
  all-caps kicker (e.g. `WAYS TO GET INVOLVED`, `NEXT UP`, `RECENT
EVENTS`, `LATEST HIGHLIGHTS`, `GET IN TOUCH`) above the headline.
  Establishes a clear scanning rhythm.
- **Role cards with checkmarks.** The four `/get-involved` role
  teasers share one shape on `/` and `/get-involved`: icon → overline
  → headline → one-paragraph pitch → three bulleted checkmarks of
  what the contributor gets. Reused verbatim so the four paths feel
  like siblings.
- **Supported-by strip.** A single-line host/sponsor acknowledgment
  ("Supported by <logos>") appears above the footer on `/` and
  `/events`, and on each past-event card. Distinct from, and
  complementary to, the logo cloud higher up the page.
- **Dual end-of-page CTA cards.** Long pages close with a two-up
  card block: one "stay in the loop" card (Luma / Slack) and one
  "collaborate with us" card (email / `/get-involved`). Used on `/`
  and `/events`.
- **Direct-email contact card.** `techtankto@gmail.com` appears as a
  prominent, copy-friendly contact card (not just a hyperlink) at the
  end of `/get-involved`, `/get-involved/*`, and `/resources/media-kit`. One
  line of context explains what we respond to.

---

## 6. Functional Requirements

### 6.1 Must-have

- Next.js App Router with shared layouts for `/get-involved` and `/legal`.
- Global header + footer on every route.
- `/events` renders an embedded Luma calendar (or API-backed list),
  **and** a hand-curated "Next Up" + "Past Events" timeline driven by
  structured event content (see below).
- Events are modeled as structured content (MDX or JSON). Each record
  carries: date, venue, title, tags, host/sponsor attribution, status
  (`upcoming` | `past`), RSVP URL, Google Photos album URL, YouTube
  recording URL. Powers both `/events` and the home-page preview.
- Prominent intake action on each `/get-involved/*` page — a
  `mailto:techtankto@gmail.com` CTA with a role-specific subject line
  and a suggested-details scaffold (copy-to-clipboard friendly).
- Press Kit exposes a downloadable ZIP of logos + a brand-guidelines PDF.
- Social share / Open Graph metadata on every page.
- Privacy-respecting analytics (Plausible or equivalent).
- SEO: sitemap, robots.txt, canonical URLs, per-page metadata.

### 6.2 Should-have

- Event `schema.org/Event` structured data (when eventing server-side).
- Newsletter / Slack invite capture block in footer.
- Google Photos album preview cards (Home and event detail).
- Branded slide deck template (Google Slides / PPTX) linked from
  `/get-involved/speak-or-facilitate` and `/resources/media-kit`.
- Speaker run-of-show and host checklist (linked PDFs).
- Per-event recap surface: Google Photos album + YouTube recording +
  host/sponsor acknowledgment, reached via "View Recap" from the
  past-events timeline.

### 6.3 Nice-to-have

- `.ics` calendar export for events.
- Embedded Instagram feed (light, cached, non-blocking).
- Embedded LinkedIn posts from the company page.
- Dark mode.
- i18n scaffold (EN default; FR optional).

---

## 7. Non-Functional Requirements

- **Performance:** LCP < 2.5s on 4G mobile; Core Web Vitals "Good".
- **SEO:** Per-page metadata, structured data, sitemap, clean slugs.
- **Reliability:** Static or ISR hosting with CDN (Vercel / Cloudflare).
- **Privacy:** No PII collected beyond intake emails sent to
  `techtankto@gmail.com`; cookie banner only if analytics or embeds
  require one.
- **Jurisdiction:** Governed by the laws of Ontario, Canada.
- **Security:** External links use `rel="noopener noreferrer"`; third-party
  embeds sandboxed where possible.

---

## 8. Content & Brand

- **Voice:** organic, welcoming, genuine—inspired by the warmth of events
  like the Code Diversity meetup. Professional yet approachable, never
  corporate or childish. Toronto-local, beginner-safe, confident.
- **Typography:** a strong, neutral display typeface (geometric or
  grotesque sans preferred — avoid decorative serifs or script faces);
  a legible humanist sans for body. The pairing should read as
  industry-conference-grade, not startup-blog or community-newsletter.
  Final pairing per visual design.
- **Color palette (refined from event posters):**
  - **Teal dark (primary):** deep navy-teal for headlines, buttons,
    and footer (`#1B4B5A`). This is the primary brand colour.
  - **Teal mid:** secondary text and headings (`#2A6B7C`).
  - **Seafoam:** light aqua for soft backgrounds and accents (`#A8D5D8`).
  - **Mint:** green accent for speaker circles and icons (`#5B9A8B`).
  - **Peach:** warm gradient tone (`#F5D4C1`).
  - **Coral (accent):** vibrant orange for CTAs and highlights (`#E87C4E`),
    inspired by CodeDiversity event branding.
  - **Blush:** soft pink accent (`#EABFBF`).
  - **Sand:** warm off-white background (`#F7EDE2`).
  - **Gradient:** seafoam → sand → peach (textured, organic feel matching
    event posters). Backgrounds use subtle grain texture overlay.
  - **Glassmorphism:** frosted-glass cards with `backdrop-blur`, rounded
    corners (`1.25rem+`), and soft shadows. Used for cards and overlays.
  - **Photo-forward:** event poster images are hero content; design
    prioritizes real photography over empty white space.
  - Do _not_ introduce hot pink, true blue, or colours outside this
    family without explicit organizer sign-off.
- **Imagery:** real event photography first; diverse, candid, well-lit.

---

## 9. Event Support (Organizer Tooling)

Not user-facing pages, but assets produced and surfaced via `/resources/media-kit`
and `/get-involved/speak-or-facilitate`:

- Branded Google Slides / Keynote / PPTX templates (speaker + title card)
- Host checklist PDF (AV, food, timing)
- Speaker run-of-show PDF (intro / talk / Q&A timing)
- Social post templates (LinkedIn, Instagram)
- Email templates for sponsor outreach

---

## 10. Out of Scope

- Member accounts / login
- Paid ticketing (RSVPs remain on Luma)
- Merchandise store
- Native mobile app
- On-site donation processing (individual donations de-prioritized;
  corporate support happens via `/get-involved/sponsor`)

---

## 11. Open Questions

- Do we keep a first-party blog, or continue relying on YouTube for
  long-form content?
- Should `/get-involved/organizer` gate behind Slack membership, or stay
  open?
- Is individual donation still a funded path, or fully replaced by
  corporate sponsorship?
- Do we want a public organizers / team page (possibly under `/about`)?
- Newsletter platform of choice (Substack vs. Buttondown vs. nothing)?
