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
  { pattern: /coffee chat/i, tags: ["Coffee Chat", "Social"] },
  { pattern: /code diversity/i, tags: ["CodeDiversity"] },
  { pattern: /workshop/i, tags: ["Workshop"] },
  { pattern: /panel/i, tags: ["Panel"] },
];

/**
 * Escape hatch for events whose title carries no keyword a rule can match
 * ("Touch Grass", "Mayday Mayday"). Keyed by the event URL as the Luma API
 * reports it. Prefer promoting an event to `constants/events.ts` when it needs
 * more than a tag.
 */
const TAG_OVERRIDE_BY_URL: Record<string, string[]> = {
  "https://luma.com/d114actf": ["Social"], // Touch Grass: Stretch in the Park x Creative Blocks
};

export function inferTags(title: string, url: string): string[] {
  const tags = [
    ...(TAG_OVERRIDE_BY_URL[url] ?? []),
    ...TITLE_TAG_RULES.filter(({ pattern }) => pattern.test(title)).flatMap(({ tags }) => tags),
  ];
  return [...new Set(tags)];
}
