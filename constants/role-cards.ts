import type { RoleCardProps } from "@/components/ui/role-card";

export const roleCardsData: RoleCardProps[] = [
  {
    role: "attendee",
    overline: "Start here",
    title: "Attend an event",
    description:
      "The easiest way to start. All events are listed on our Luma calendar. Show up, meet people, see if it clicks.",
    benefits: ["No signup required", "Meet the community in person", "Keeps most events accessible"],
    href: "/events",
    ctaText: "Browse upcoming events",
  },
  {
    role: "speaker",
    overline: "Share what you know",
    title: "Speak or Facilitate",
    description:
      "Got something to share? We're always looking for speakers, panelists, and workshop facilitators. You don't need to be a senior engineer or a public figure.",
    benefits: ["30-45 min talk + Q&A", "Any tech topic welcome", "Recorded and published to YouTube"],
    href: "/get-involved/speak-or-facilitate",
    ctaText: "Apply to speak",
  },
  {
    role: "host",
    overline: "Your space, our community",
    title: "Host an event",
    description:
      "If your company has space and wants to support community-driven tech programming in Toronto, we'd love to talk.",
    benefits: ["40-120 attendees", "~6:00-8:30pm on weeknights", "Logo on event marketing"],
    href: "/get-involved/host",
    ctaText: "Host an event",
  },
  {
    role: "sponsor",
    overline: "Back the community",
    title: "Sponsor TechTank",
    description:
      "If your company has budget or resources and wants to support community-driven tech programming in Toronto, we'd love to talk.",
    benefits: ["Logo on website and marketing", "Speaker slot options", "Reach Toronto tech talent"],
    href: "/get-involved/sponsor",
    ctaText: "Sponsor TechTank",
  },
  {
    role: "organizer",
    overline: "Shape what TechTank becomes",
    title: "Join the Organizer Team",
    description:
      "We're building out a more structured volunteer leadership team with defined roles and a 6-month commitment. If you want to help shape what TechTank becomes, this is the path.",
    benefits: ["Defined leadership roles", "6-month commitment", "Shape TechTank's direction"],
    href: "/get-involved/organizer",
    ctaText: "Express interest in organizing",
  },
  {
    role: "donate",
    overline: "Support the mission",
    title: "Donate to TechTank",
    description:
      "TechTank is a registered nonprofit corporation in Ontario. We're volunteer-run and community-funded, and every dollar goes directly back into programming and operations.",
    benefits: [
      "Covers platform fees and event materials",
      "Keeps most events accessible",
      "Supports a registered nonprofit",
    ],
    href: "/donate",
    ctaText: "Donate",
  },
];
