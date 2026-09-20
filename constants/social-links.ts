export interface SocialLink {
  id: string;
  name: string;
  url: string;
  type: "primary" | "secondary";
  category: "events" | "social" | "contribute";
}

export const socialLinks: Record<string, SocialLink> = {
  luma: {
    id: "luma",
    name: "Luma",
    url: "https://luma.com/techtank",
    type: "primary",
    category: "events",
  },
  meetup: {
    id: "meetup",
    name: "Meetup",
    url: "https://meetup.com/techtank-to",
    type: "primary",
    category: "events",
  },
  slack: {
    id: "slack",
    name: "Slack",
    url: "/links/slack",
    type: "secondary",
    category: "social",
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    url: "https://linkedin.com/company/techtank-to",
    type: "secondary",
    category: "social",
  },
  instagram: {
    id: "instagram",
    name: "Instagram",
    url: "https://instagram.com/techtankto",
    type: "secondary",
    category: "social",
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    url: "https://youtube.com/@TechTankTo",
    type: "secondary",
    category: "social",
  },
  github: {
    id: "github",
    name: "GitHub",
    url: "https://github.com/techtankto",
    type: "secondary",
    category: "contribute",
  },
};

export function getEventLinks(): SocialLink[] {
  return Object.values(socialLinks).filter((link) => link.category === "events");
}

export function getSocialLinks(): SocialLink[] {
  return Object.values(socialLinks).filter((link) => link.category === "social");
}

export function getContributeLinks(): SocialLink[] {
  return Object.values(socialLinks).filter((link) => link.category === "contribute");
}

export function getAllSocialLinks(): SocialLink[] {
  return Object.values(socialLinks);
}
