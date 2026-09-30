export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  /** Intrinsic pixel dimensions of the logo file, used to preserve aspect ratio */
  width: number;
  height: number;
  url: string;
  type: "host" | "sponsor" | "partner";
  scale?: number; // Multiplier on the base row height, to even out logos with lots of built-in padding (default 1)
}

export const sponsors: Record<string, Sponsor> = {
  intuit: {
    id: "intuit",
    name: "Intuit",
    logo: "/images/sponsors/intuit.svg",
    width: 260,
    height: 53,
    url: "https://intuit.com",
    type: "sponsor",
  },
  kobo: {
    id: "rakuten-kobo",
    name: "Rakuten Kobo",
    logo: "/images/sponsors/rakuten-kobo.svg",
    width: 150,
    height: 29,
    url: "https://kobo.com",
    type: "sponsor",
  },
  docebo: {
    id: "docebo",
    name: "Docebo",
    logo: "/images/sponsors/docebo.svg",
    width: 392,
    height: 80,
    url: "https://docebo.com",
    type: "sponsor",
    scale: 0.8,
  },
  microsoft: {
    id: "microsoft",
    name: "Microsoft",
    logo: "/images/sponsors/microsoft.svg",
    width: 338,
    height: 72,
    url: "https://microsoft.com",
    type: "sponsor",
    scale: 1.25,
  },
  points: {
    id: "points",
    name: "Points",
    logo: "/images/sponsors/points.png",
    width: 300,
    height: 200,
    url: "https://points.com",
    type: "sponsor",
    scale: 1.75,
  },
  "prema-coffee": {
    id: "prema-coffee",
    name: "Prema Coffee",
    logo: "/images/sponsors/prema.png",
    width: 2000,
    height: 700,
    url: "https://prematoronto.ca",
    type: "partner",
    scale: 1.75,
  },
  vena: {
    id: "vena",
    name: "Vena",
    logo: "/images/sponsors/vena.svg",
    width: 218,
    height: 72,
    url: "https://venasolutions.com",
    type: "sponsor",
    scale: 1.25,
  },
  "7shifts": {
    id: "7shifts",
    name: "7shifts",
    logo: "/images/sponsors/7shifts.svg",
    width: 99,
    height: 28,
    url: "https://7shifts.com",
    type: "sponsor",
    scale: 1.25,
  },
  cohere: {
    id: "cohere",
    name: "Cohere",
    logo: "/images/sponsors/cohere.svg",
    width: 118,
    height: 20,
    url: "https://cohere.com",
    type: "sponsor",
  },
  brainstation: {
    id: "brainstation",
    name: "BrainStation",
    logo: "/images/sponsors/brainstation.svg",
    width: 169,
    height: 28,
    url: "https://brainstation.io",
    type: "sponsor",
  },
  posthog: {
    id: "posthog",
    name: "PostHog",
    logo: "/images/sponsors/posthog.svg",
    width: 800,
    height: 140,
    url: "https://posthog.com",
    type: "sponsor",
  },
};

export function getAllSponsors(): Sponsor[] {
  return Object.values(sponsors);
}
