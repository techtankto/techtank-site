---
name: data
description: Where content and state live in a typed frontend (constants/ as source of truth, state discipline, date and media handling). Use when adding site copy/content, deciding where data or state should live, or handling dates and media entries.
---

# Data and content

Where content lives, how it's typed, and how state is managed.

1. **All content in `constants/`.** No inline copy or data in components; no external content APIs. Copy is grounded in real facts, never invented.
2. **`constants/` is the source of truth.** It owns the site's content outright, typed by `types/`. Where an upstream source seeds it, that source stays a reference for facts not yet captured here; `constants/` still wins.
3. **State discipline.** Keep state local: `useState` and URL params for the ephemeral. No speculative global state. Sitewide UI state (a mobile menu, a dialog) goes in one Zustand store; theme is the exception, owned by `next-themes` and never mirrored in that store.
4. **Dates:** zone through `fromZonedTime(iso, appTimeZone)`, never bare `new Date()`; display-only dates are pre-formatted strings.
5. **Media:** every entry carries real dimensions and real `alt` text; `src` paths are site-absolute under `public/`.
6. **Licensed assets stay put.** Licensed fonts and imagery ship with the site but are never published to other repos or registries.
