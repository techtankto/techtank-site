---
name: accessibility
description: Web accessibility baseline (WCAG 2.0 AA / AODA) for document structure, accessible names, focus, contrast, motion, and media. Use when building or reviewing UI components, pages, navigation, overlays, cards, embeds, or any self-starting animation/motion in a web frontend.
---

# Accessibility

The floor, not a cleanup pass.

This skill owns the accessibility baseline every surface meets: document structure,
accessible names, focus, contrast, motion, and media. What a component looks like is the
design contract's concern; where its content lives is the data skill's; how a component is
shaped is the components skill's.

## The baseline

1. **WCAG 2.0 AA is the legal floor, 2.2 AA is the target.** AODA and the ACA both require
   AA conformance; a site may fall outside their scope and still owes its readers the
   standard. Cite the success criterion when reporting or fixing a defect, since the
   criterion is what decides whether a fix is sufficient.
2. **Automated checkers find the minority of it.** WAVE, axe, and the IBM Equal Access
   checker catch missing names, contrast, and malformed ARIA; they cannot see focus order,
   a focus ring lost against its background, a card nobody can tab to, or motion that never
   stops. A keyboard-only pass and a screen reader pass find those, and no route counts as
   audited without them.
3. **Findings group by root cause, not by page.** One defect in a shared component surfaces
   on every route that renders it, so the fix belongs in the component and the report
   belongs in one issue listing the affected routes. Grouping by page multiplies the same
   fix by the number of surfaces.

## Document structure

1. **One `main` per page.** The persistent shell owns it and routes render sections inside
   it; a nested layout that renders its own `main` produces two, and a reader jumping to
   the main landmark then lands somewhere arbitrary.
2. **Landmarks are semantic elements**, not `div`s with roles: `header`, `nav`, `main`,
   `footer`, `section`, `article`.
3. **Each landmark of a kind is named.** A page with a site nav and a section sub-nav
   presents two identical "navigation" entries to a reader listing landmarks, which is no
   more useful than one. Name each at the call site, never inside the component, because
   the name describes what this instance navigates.
4. **Heading levels never skip.** An `h2` followed by an `h4` is a defect on its own: it
   tells a reader navigating by heading that a level went missing.
5. **A list of title-and-description pairs is a description list.** `dl` with `dt` and `dd`
   models it exactly and removes the heading-level question rather than renumbering it.
   Reach for it before inventing a heading level for a stepper, a glossary, or a spec table.
6. **Disclosures use `details` and `summary`.** The native element brings keyboard
   behaviour, state, and in-page find with it; a scripted accordion re-implements all three
   and usually drops the third.

## Accessible names

1. **Names live in the DOM, not in attributes.** A visually hidden span (`.sr-only`) beats
   `aria-label`, because browser translation tools rewrite text nodes and skip attributes:
   an `aria-label` leaves a translated page with an untranslated control. The same argument
   makes `aria-labelledby` pointing at a hidden heading the right way to name a landmark.
2. **An icon-only control carries a name; a decorative icon carries none.** Icons that
   restate adjacent text are `aria-hidden`, since exposing them adds noise without adding
   meaning. Icon libraries do not do this for you: assume every icon is exposed until you
   hide it.
3. **The visible label is part of the accessible name.** Replacing visible text with a
   differently worded `aria-label` breaks speech control, which speaks what it sees. Add
   context to the visible words; never contradict them.
4. **A link reads correctly out of context.** Readers navigate by link list, where "Read
   more" and "View all" say nothing. Keep the short visible text and append the referent in
   a hidden span.

## Focus

1. **Every interactive element has a visible focus ring.** A card that cannot be focused at
   all is the worse version of the same bug, and the one a mouse never reveals.
2. **The ring outlines the control the reader perceives.** For a clickable card, that is the
   card: draw the ring on the card with `:has(:focus-visible)` or `:focus-within`, keep the
   real link in the heading so it owns the accessible name, and let it cover the card with
   an absolutely positioned pseudo-element. Nested links sit above that pseudo-element and
   stay separate stops; never nest one interactive element inside another.
3. **The ring contrasts with the surface it is drawn on.** A ring token picked for the light
   theme is invisible on an inverted footer or hero, so any surface that flips its
   background scopes its own ring colour. Non-text contrast is 3:1.
4. **Never transition the ring.** Tailwind's `transition-colors` includes `outline-color`,
   so a ring on a link with that utility animates in from an intermediate colour and reads
   as a blink. Transition the properties you mean.
5. **Focus order follows document order**, and focus stays inside a modal overlay while it
   is open.
6. **A full-viewport click-to-dismiss target is not a button.** Making it one puts a control
   ahead of the dialog in the tab order and announces it; the overlay takes a click handler,
   and Escape is the keyboard path.

## Contrast

1. **Opacity modifiers are the most common contrast defect.** Dimming a token that passes
   is how it stops passing: a muted text token at 5.69:1 lands at 2.52:1 once it is set to
   60% opacity. If text needs to recede further than the muted token, the answer is another
   token, not an alpha.
2. **A brand hex is not a text colour.** Warm brand colours chosen as surfaces routinely
   land near 2:1 as small text on a light background. Text colours are semantic tokens
   resolved per theme, and a new role gets a new token.
3. **Every theme and every surface gets checked.** The same token passes on the page
   background and fails on a glass card over a gradient, and a value that passes in dark
   mode can fail in light. Check the worst surface the token actually lands on.
4. **Colour is never the only signal.** Links in body copy carry an underline; state is
   never conveyed by hue alone.
5. **Text is 4.5:1 and large text is 3:1; UI boundaries and focus rings are 3:1.**
   Decorative art carries no contrast requirement, which is a reason to mark it decorative
   rather than a reason to lower the bar on text.

## Motion and media

1. **Self-starting motion carries a keyboard-operable pause.** Anything that begins moving
   on its own and runs past a few seconds (a marquee drift, a carousel, a looping hero
   video) pairs with a real control. A hover pause is not one: it reaches neither keyboard
   nor touch, and the reduced-motion path only serves readers who set the preference.
2. **`prefers-reduced-motion` is honoured in the DOM, not only in CSS.** Autoplay is a
   property CSS cannot reach, so read the media query, start paused, and subscribe to
   changes so a reader who flips the setting is respected without a reload.
3. **Focus inside a moving region stops the motion first, then reveals the item.** Order is
   the whole fix: scrolling a clipped viewport toward a child while the track keeps
   translating drags the item back out of view. Pause, then bring the focused element into
   view on the next frame. An explicit pause by the reader outranks focus and survives blur.
4. **Video carries a text alternative.** A muted, looping, control-free clip is video-only
   content and owes an equivalent in text; a clip with speech or on-screen text owes
   captions or a transcript.
5. **Caption and transcript text is authored, never inferred.** Build the mechanism (a
   `track` element the file drops into, a description prop) and record what a human still
   has to write. Invented caption text is worse than an open gap, because it looks handled.
6. **A scrollable region shows that it scrolls.** Overlay scrollbars are invisible until
   interaction, so a region that scrolls carries its own affordance: an edge mask or a
   shadow that resolves as the content reaches its end.

## What you cannot fix

1. **A third-party embed caps conformance at its own.** An iframe's internals are not
   restyleable or reachable from the host page, so the honest response is to name the
   ceiling, keep the parts you do own correct (an accurate `title`, a reachable fallback),
   and record the defect against the vendor. Do not report a vendor's defect as fixed, and
   do not fake a fix around it.

## Verifying

1. **Every route, both themes.** Contrast results differ between light and dark, and a
   theme-scoped token can pass in one and fail in the other.
2. **Keyboard first, then a checker.** Tab the whole page: every control reachable, every
   ring visible, order matching the page, nothing trapped outside a modal and nothing
   escaping one.
3. **Report what you verified, and only that.** A claim that a fix was checked in a browser
   is a factual claim about work done; if the pass did not happen, say which parts are
   reasoned rather than observed.
