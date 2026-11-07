-- Sample contribution tasks so the board isn't empty on a fresh
-- `supabase db reset`. Safe to edit freely.
--
-- Admins are NOT seeded here (they need a real auth.users row). To
-- create one locally: open Studio (http://localhost:54523) →
-- Authentication → Add user (email + password or "auto confirm"),
-- copy the new user's UUID, then run:
--   INSERT INTO public.admins (auth_user_id, email)
--   VALUES ('<uuid>', 'organizer@example.com');

INSERT INTO public.contribution_tasks
  (title, summary, body_markdown, status, difficulty, tags, sort_order)
VALUES
  (
    'Photograph the next Build Night',
    'Capture candid shots we can share on socials and the events page.',
    E'We need someone with a camera (phone is fine) to grab **candid photos** at the next Build Night.\n\n- Wide shots of the room, close-ups of people building\n- Aim for 20-30 keepers\n- Hand them off within a few days so we can post while it''s fresh',
    'open',
    'two_hours',
    ARRAY['photography', 'social_media_strategy'],
    0
  ),
  (
    'Design a reusable event slide template',
    'A clean title/agenda/thanks deck organizers can drop content into.',
    E'Build a simple, on-brand **slide template** (Google Slides or Figma) organizers reuse each event.\n\nSections: title, agenda, speaker intro, thank-you / call-to-action. Use the TechTank palette.',
    'open',
    'a_few_hours',
    ARRAY['design', 'branding'],
    1
  ),
  (
    'Add an RSS feed to the events page',
    'Small frontend task: expose upcoming events as a feed.',
    E'Add an `/events/feed.xml` route that serialises upcoming events.\n\nGood first task if you want to poke at the Next.js app. We can pair on it.',
    'open',
    'quick_win',
    ARRAY['frontend', 'web_dev'],
    2
  ),
  (
    'Edit the recap video from last month',
    'Cut a 60-90s highlight reel from the raw footage.',
    E'We have raw clips from last month''s talk night. Cut a **60-90 second** recap for YouTube/Instagram.\n\nFootage and a rough shot list will be shared with whoever picks this up.',
    'in_progress',
    'bigger_project',
    ARRAY['video_editing', 'videography'],
    3
  ),
  (
    'Write a welcome guide for first-time attendees',
    'A short, friendly page that tells newcomers what to expect and how to jump in.',
    E'First-timers often show up not knowing what a TechTank night actually looks like. Write a warm, plain-spoken **welcome guide** we can link from the events page and drop into Slack.\n\n## What to cover\n\n- What a typical evening looks like, start to finish\n- How to introduce yourself when you don''t know anyone yet\n- The ways to get involved, from just attending to speaking, hosting, or sponsoring\n- Where to ask questions before you arrive\n\n## What good looks like\n\n- Friendly and human, not corporate\n- Skimmable: short paragraphs, clear headings, no wall of text\n- One page is plenty\n\nDraft it in a Google Doc and we''ll review together before it ships. No design work needed, just clear words.',
    'open',
    'two_hours',
    ARRAY['copywriting', 'documentation'],
    4
  ),
  (
    'Set up automated event reminders in Slack',
    'A small scheduled job that nudges the announcements channel before each event.',
    E'Reminders go out by hand right now, which means they sometimes don''t go out at all. Set up a small **scheduled job** that posts a reminder to our announcements channel the day before each event.\n\n## What we need\n\n- Read upcoming events from the existing Luma calendar\n- Post a tidy reminder (title, time, place, RSVP link) to Slack the day before\n- Quietly skip weeks with no event\n\n## Nice to have\n\n- A second nudge an hour before doors open\n- Timing that''s easy to tweak without a redeploy\n\nWe''ll point you at the calendar source and the Slack webhook. Happy to pair if scheduled jobs are new to you.',
    'open',
    'a_few_hours',
    ARRAY['backend', 'devops'],
    5
  );

-- ────────────────────────────────────────────────────────────
-- A local organizer, so `/admin/tasks` is reachable on a dev server
-- that has no Slack app. Seeds only ever run against the CLI's local
-- stack (`pnpm db:start` / `db:reset`), never the hosted project, so
-- this account cannot exist in production.
--
--   organizer@localhost / localdev
--
-- `auth_user_id` is bound here rather than left to
-- claim_admin_membership(), so the first sign-in needs no round trip.
-- `slack_user_id` and `slack_team_id` stay null, which the CHECK
-- constraints in migration 007 allow and caller_workspace_ok() treats
-- as "no workspace to enforce".
-- ────────────────────────────────────────────────────────────

-- The token columns are empty strings rather than NULL: GoTrue scans
-- them into Go strings, and a NULL there fails every request with
-- "Database error querying schema".
INSERT INTO auth.users
  (id, instance_id, aud, role, email, encrypted_password,
   email_confirmed_at, created_at, updated_at,
   raw_app_meta_data, raw_user_meta_data,
   confirmation_token, recovery_token, email_change,
   email_change_token_new, email_change_token_current,
   phone_change, phone_change_token, reauthentication_token)
VALUES
  ('00000000-0000-4000-8000-000000000001',
   '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated',
   'organizer@localhost',
   extensions.crypt('localdev', extensions.gen_salt('bf')),
   now(), now(), now(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"full_name":"Local Organizer","email_verified":true}'::jsonb,
   '', '', '', '', '', '', '', '')
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities
  (user_id, provider, provider_id, identity_data,
   last_sign_in_at, created_at, updated_at)
VALUES
  ('00000000-0000-4000-8000-000000000001',
   'email',
   '00000000-0000-4000-8000-000000000001',
   '{"sub":"00000000-0000-4000-8000-000000000001","email":"organizer@localhost","email_verified":true}'::jsonb,
   now(), now(), now())
ON CONFLICT (provider_id, provider) DO NOTHING;

INSERT INTO public.admins (email, auth_user_id)
VALUES ('organizer@localhost', '00000000-0000-4000-8000-000000000001')
ON CONFLICT DO NOTHING;
