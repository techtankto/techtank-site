---
name: accessibility
description: Web accessibility baseline (WCAG 2.0 AA / AODA) for document structure, accessible names, focus, contrast, motion, and media. Use when building or reviewing UI components, pages, navigation, overlays, cards, embeds, or any self-starting animation/motion in a web frontend.
---

# Accessibility

The floor, not a cleanup pass. Appearance is the design contract's concern, where content
lives is the data skill's, and component shape is the components skill's.

## The baseline

1. **WCAG 2.0 AA is the legal floor, 2.2 AA is the target.** AODA and the ACA both require
   AA. Cite the success criterion in every defect report and fix: the criterion decides
   whether a fix is sufficient.
2. **Automated checkers find the minority of it.** WAVE, axe, and the IBM Equal Access
   checker catch missing names, contrast, and malformed ARIA. They miss focus order, a ring
   lost against its background, a card nobody can tab to, and motion that never stops. No
   route counts as audited without a keyboard-only pass and a screen reader pass.
3. **A third-party embed caps conformance at its own.** An iframe's internals are not
   reachable or restyleable from the host page. Name the ceiling, keep the parts you own
   correct (an accurate `title`, a reachable fallback), and record the defect against the
   vendor. Never report a vendor's defect as fixed, and never fake a fix around it.

## Document structure

1. **One `main` per page.** The persistent shell owns it and routes render sections inside
   it; a nested layout never renders its own.
2. **Landmarks are semantic elements**, not `div`s with roles: `header`, `nav`, `main`,
   `footer`, `section`, `article`. Each landmark of a kind is named at the call site, never
   inside the component, because the name describes what that instance navigates: a site nav
   and a section sub-nav otherwise both announce as "navigation".
3. **Heading levels never skip.** An `h2` followed by an `h4` is a defect on its own.
4. **A list of title-and-description pairs is a description list.** `dl` with `dt` and `dd`
   models it exactly. Reach for it before inventing a heading level for a stepper, a
   glossary, or a spec table.
5. **Disclosures use `details` and `summary`.** The native element brings keyboard
   behaviour, state, and in-page find; a scripted accordion usually drops in-page find.

## Accessible names

1. **Names live in the DOM, not in attributes.** A visually hidden span (`.sr-only`) beats
   `aria-label`: browser translation rewrites text nodes and skips attributes, leaving an
   `aria-label` untranslated. Name a landmark with `aria-labelledby` pointing at a hidden
   heading for the same reason.
2. **An icon-only control carries a name; a decorative icon carries none.** Icons that
   restate adjacent text are `aria-hidden`. Assume every icon a library renders is exposed
   until you hide it.
3. **The visible label is part of the accessible name.** A differently worded `aria-label`
   breaks speech control, which speaks what it sees: add context to the visible words, never
   contradict them. A link like "Read more" keeps its short visible text and gets its
   referent in a hidden span.

## Focus

1. **Every interactive element has a visible focus ring that contrasts with its surface.**
   Non-text contrast is 3:1, so any surface that flips its background scopes its own ring
   colour: a light-theme ring token is invisible on an inverted footer or hero. An element
   that cannot be focused at all is the worse version of the same bug.
2. **The ring outlines the control the reader perceives.** For a clickable card that is the
   card: draw the ring on the card with `:has(:focus-visible)` or `:focus-within`, keep the
   real link in the heading so it owns the accessible name, and let that link cover the card
   with an absolutely positioned pseudo-element. Nested links sit above the pseudo-element as
   separate stops. Never nest one interactive element inside another.
3. **Never transition the ring.** Tailwind's `transition-colors` includes `outline-color`,
   so a ring under that utility animates in from an intermediate colour and reads as a
   blink. Transition the properties you mean.
4. **Focus order follows document order**, and focus stays inside a modal overlay while it
   is open.
5. **A full-viewport click-to-dismiss target is not a button.** Making it one puts a control
   ahead of the dialog in the tab order and announces it. The overlay takes a click handler,
   and Escape is the keyboard path.

## Contrast

1. **Text is 4.5:1, large text 3:1, and UI boundaries and focus rings 3:1.** Decorative art
   carries no contrast requirement: mark art decorative rather than lowering the bar on text.
2. **Never derive a text colour by hand.** Opacity modifiers are the most common defect: a
   muted token at 5.69:1 lands at 2.52:1 once it is set to 60% opacity. A warm brand hex
   routinely lands near 2:1 as small text on a light background. Text colours are semantic
   tokens resolved per theme, and a role that needs to recede further gets a new token, not
   an alpha.
3. **Every theme and every surface gets checked**, at the worst surface the token actually
   lands on: a token that passes on the page background fails on a glass card over a
   gradient, and one that passes in dark mode can fail in light.
4. **Colour is never the only signal.** Links in body copy carry an underline; state is
   never conveyed by hue alone.

## Motion and media

1. **Self-starting motion carries a keyboard-operable pause.** Anything that begins moving
   on its own and runs past a few seconds (a marquee drift, a carousel, a looping hero
   video) pairs with a real control. A hover pause is not one: it reaches neither keyboard
   nor touch, and the reduced-motion path only serves readers who set the preference.
2. **`prefers-reduced-motion` is honoured in the DOM, not only in CSS.** CSS cannot reach
   autoplay: read the media query, start paused, and subscribe to changes so flipping the
   setting takes effect without a reload.
3. **Focus inside a moving region stops the motion first, then reveals the item.** Pause,
   then bring the focused element into view on the next frame: scrolling a clipped viewport
   toward a child while the track keeps translating drags the item back out of view. An
   explicit pause by the reader outranks focus and survives blur.
4. **Video carries a text alternative, and that text is authored.** A muted, looping,
   control-free clip is video-only content and owes an equivalent in text; a clip with
   speech or on-screen text owes captions or a transcript. Build the mechanism (a `track`
   element the file drops into, a description prop) and record what a human still has to
   write: invented caption text looks handled, which is worse than an open gap.
5. **A scrollable region shows that it scrolls.** Overlay scrollbars are invisible until
   interaction, so the region carries its own affordance: an edge mask or a shadow that
   resolves as the content reaches its end.

## Verifying

1. **Every route, both themes, keyboard before checker.** A theme-scoped token can pass in
   one theme and fail in the other. Tab the whole page: every control reachable, every ring
   visible, order matching the page, nothing trapped outside a modal and nothing escaping
   one.
2. **Findings group by root cause, not by page.** A defect in a shared component gets one
   fix in the component and one issue listing the affected routes.
3. **Report what you verified, and only that.** Claiming a fix was checked in a browser is a
   claim about work done. If the pass did not happen, say which parts are reasoned rather
   than observed.
