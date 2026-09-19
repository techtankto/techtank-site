export interface Tool {
  id: string;
  name: string;
  url: string;
  /** What the tool does and how TechTank volunteers use it */
  description: string;
  /** Wordmark in public/images/tools/ */
  logo: string;
  /** Intrinsic pixel dimensions of the logo file, used to preserve aspect ratio */
  width: number;
  height: number;
  scale?: number; // Multiplier on the base row height, to even out logos with lots of built-in padding (default 1)
}

const tools: Record<string, Tool> = {
  slack: {
    id: "slack",
    name: "Slack",
    url: "https://slack.com",
    description: "Messaging home of the TechTank community, where members and organizers connect between events.",
    logo: "/images/tools/slack.svg",
    width: 498,
    height: 127,
  },
  tightknit: {
    id: "tightknit",
    name: "Tightknit",
    url: "https://tightknit.ai",
    description: "Slack-native community platform powering our member hub and event experience.",
    logo: "/images/tools/tightknit.webp",
    width: 600,
    height: 120,
  },
  ideogram: {
    id: "ideogram",
    name: "Ideogram",
    url: "https://ideogram.ai",
    description: "AI image generation and editing our volunteers use for event visuals and creative assets.",
    logo: "/images/tools/ideogram.svg",
    width: 119,
    height: 24,
  },
  canva: {
    id: "canva",
    name: "Canva",
    url: "https://canva.com",
    description: "Design platform our volunteers use for event graphics, slides, and social posts.",
    logo: "/images/tools/canva.svg",
    width: 80,
    height: 30,
  },
};

export function getAllTools(): Tool[] {
  return Object.values(tools);
}
