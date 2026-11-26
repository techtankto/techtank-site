/**
 * Luma has no tag field, so events that come from Luma (live or scraped)
 * arrive untyped and would fall into the "Other" filter. Infer type tags from
 * the title instead. Events curated in `constants/events.ts` are tagged by
 * hand and never reach this path.
 */
const TITLE_TAG_RULES: { pattern: RegExp; tags: string[] }[] = [
  { pattern: /build night/i, tags: ["Build Night"] },
  // SUPERCOLLIDER is always a multi-community networking night.
  { pattern: /supercollider/i, tags: ["Networking", "Social", "Multi-community"] },
  // Code Diversity's Pass The Mic is run like its monthly coffee chats. The
  // coffee-chat rule is split around the Code Diversity one so tags come out
  // as Coffee Chat, CodeDiversity, Social: the same order as the curated
  // entries, and the first tag is the card's label.
  { pattern: /coffee chat|pass the mic/i, tags: ["Coffee Chat"] },
  { pattern: /code diversity/i, tags: ["CodeDiversity"] },
  { pattern: /coffee chat|pass the mic/i, tags: ["Social"] },
  { pattern: /workshop/i, tags: ["Workshop"] },
  { pattern: /panel/i, tags: ["Panel"] },
  // Recurring series, so each new edition is typed without hand-tagging.
  // Weekly online sessions on system design for AI-era products.
  { pattern: /system design and ai/i, tags: ["Tech Talk", "AI", "Architecture"] },
  // Stretch in the park with Creative Blocks; an outdoor social like the run clubs.
  { pattern: /touch grass/i, tags: ["Social"] },
];

/**
 * Escape hatch for a live (not yet archived) event whose title carries no
 * keyword a rule can match. Keyed by the event URL as the Luma API reports it.
 * Archived events are better tagged in `constants/luma-event-extras.ts`, and
 * recurring series with a title rule above.
 */
const TAG_OVERRIDE_BY_URL: Record<string, string[]> = {};

export function inferTags(title: string, url: string): string[] {
  const tags = [
    ...(TAG_OVERRIDE_BY_URL[url] ?? []),
    ...TITLE_TAG_RULES.filter(({ pattern }) => pattern.test(title)).flatMap(({ tags }) => tags),
  ];
  return [...new Set(tags)];
}
