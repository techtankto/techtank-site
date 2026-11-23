/** An outbound link on an affiliation card. */
export interface AffiliationLink {
  label: string;
  href: string;
}

/** A community TechTank is affiliated with, shown on the About page. */
export interface Affiliation {
  id: string;
  name: string;
  description: string;
  links: AffiliationLink[];
}

/** Affiliated communities, in display order. */
export const affiliations: Affiliation[] = [
  {
    id: "supercollider",
    name: "Supercollider",
    description:
      "TechTank is a proud member of the Supercollider network, a community of communities bringing together Toronto's tech scene. Our events are listed on their Luma calendar so you can discover everything happening across the ecosystem.",
    links: [
      { label: "Supercollider website", href: "https://www.supercollider.ca/" },
      { label: "Supercollider events calendar", href: "https://luma.com/supercollider-tech-community" },
    ],
  },
  {
    id: "creative-blocks",
    name: "Creative Blocks Club",
    description:
      "Creative Blocks is a Toronto coworking community that brings remote workers, founders, creatives, and builders together for focused coworking sessions, workshops, and community events across the city. TechTank and Creative Blocks collaborate regularly on events designed to help people get things done, learn from each other, and build real relationships.",
    links: [
      { label: "Creative Blocks website", href: "https://www.creativeblocks.club/" },
      { label: "Creative Blocks events calendar", href: "https://www.creativeblocks.club/events" },
    ],
  },
  {
    id: "maple-code",
    name: "Maple Code",
    description:
      "Maple Code hosts a weekly mob programming session in Toronto, where small groups team up on one person's project. Bring a half-done side project to get unstuck, or join someone else's to learn by watching how others code and solve problems. We're proud to call Maple Code a friend and community partner of TechTank.",
    links: [
      { label: "Maple Code website", href: "https://maplecode.dev" },
      { label: "Maple Code events calendar", href: "https://luma.com/maplecode" },
    ],
  },
];
