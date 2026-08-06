# Pick a Task — `/tasks`

**URL:** https://techtankto.com/tasks
**Page title:** Pick a Task — TechTank TO
**Role:** Turn "I'd like to help" into a concrete, bite-sized action.
A public, GitHub-issues-style board of real tasks the community can
pick up, with a low-friction apply flow. Surfaced as a top-level nav
item ("Pick a Task").

---

## 1. Purpose

Give people a menu of specific, scoped ways to help run TechTank
(photography, design, dev, logistics, content, and more) so
contributing doesn't require a big commitment or a conversation first.
Applying is one form; an organizer follows up.

## 2. Primary audience

- Community members who want to give back but don't know where to start
- People with a specific skill looking for a scoped, portfolio-worthy task
- Early-career folks who want a small, real contribution to point to

## 3. Key messages

- Helping can be small and specific: grab one task, not a role.
- Nothing starts until an organizer confirms; raising your hand is
  pressure-free.
- No TechTank account needed, but you do need to be in our Slack:
  applying connects your existing Slack account.

## 4. Content sections

1. **Hero**
   - Overline: "Pick a task".
   - Headline: "Grab something and help build TechTank."
   - Sub-headline: everything the community is building, laid out as
     bite-sized tasks you can pick up.

2. **Board**
   - Filterable list (search + status + discipline + effort), each row
     linking to a task detail page.
   - Each row: title, one-line summary, status badge (Open / In
     progress / Done), difficulty + expected effort, discipline tags,
     and the assignee's name once someone has picked it up.
   - Empty states differentiate "no matches for these filters" from
     "every task is spoken for".

3. **Task detail — `/tasks/[id]`**
   - Title, status, summary, markdown body (full description).
   - Difficulty + effort + discipline tags.
   - **Apply panel** (dominant CTA): "Continue with Slack", then an
     optional message. Name and email come from the verified Slack
     identity, so the form asks for neither. Only open, unassigned
     tasks accept applications; taken or
     finished tasks show a closed note and a link back to the board.
   - **What happens next** stepper and a **task-ownership note** set
     expectations: applying is low-stakes, and once you pick up a task
     it's yours to run with.

## 5. Discovery

- Top-level **Pick a Task** item in the global header nav.
- A **Pick a Task teaser section on `/get-involved`** that explains the
  idea and links here ("Browse tasks").

## 6. CTAs

- **Dominant CTA:** Apply for a task (via Slack) on the detail page.
- Secondary: back to the board; other ways to get involved.

## 7. Functional requirements

- Board and detail are public (no auth). Data is served from Supabase
  via public, read-only RPCs.
- Applying requires a Slack-verified session. The `apply-to-task` edge
  function forwards the caller's JWT to `apply_to_contribution_task`,
  which enforces identity, TechTank-workspace membership, the
  open/unassigned rule and de-duplication in SQL. The function then
  notifies organizers in Slack (@-mentioning the applicant) and DMs the
  applicant their receipt. Slack is the only channel; the project sends
  no email. Neither notification can fail the request; a repeat apply is
  a no-op and does not re-notify.
- Applicants who aren't in the Slack workspace are told so up front, on
  the Pick a Task hero and in the apply panel, with a join link.
- A task stops accepting applications once its status leaves `open` or
  someone is assigned, enforced server-side (409), not just in the UI.
- Admins manage tasks and applicants from `/admin/tasks` (organizer
  login only). There is no separate "taken" state: assigning a task
  moves it to `in_progress` and shows the assignee's name.

## 8. Acceptance criteria

- The board lists seeded tasks, filters/search work, and rows link to
  detail pages.
- The detail page renders the markdown body and the apply form.
- Connecting Slack and submitting shows a success state; the applicant
  appears in the admin board with a Slack DM link; applying twice
  doesn't create a second row.
- Applying to a taken/finished task is rejected with a clear message.
- Browsing the board and task pages works fully logged out. Applying
  requires a Slack session, and an unauthenticated call to the apply
  endpoint is rejected (401) rather than recorded.
