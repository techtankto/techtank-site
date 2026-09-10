import Link from "next/link";
import { Check, Mic, Building, Heart, Calendar, Star, HandCoins } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RoleCardProps {
  role: "attendee" | "speaker" | "host" | "sponsor" | "organizer" | "donate";
  overline: string;
  title: string;
  description: string;
  benefits: string[];
  href: string;
  ctaText?: string;
  external?: boolean;
  comingSoon?: boolean;
}

const icons = {
  attendee: Calendar,
  speaker: Mic,
  host: Building,
  sponsor: Heart,
  organizer: Star,
  donate: HandCoins,
};

export function RoleCard({
  role,
  overline,
  title,
  description,
  benefits,
  href,
  ctaText = "Learn more",
  external = false,
  comingSoon = false,
}: RoleCardProps) {
  const Icon = icons[role];

  return (
    <div className="group glass relative flex flex-col rounded-2xl p-6 transition-all duration-300 lg:p-8">
      {/* Icon */}
      <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <Icon className="size-6" />
      </div>

      {/* Overline */}
      <span className="mb-2 text-xs font-semibold tracking-widest text-amber-dark uppercase">{overline}</span>

      {/* Title */}
      <h3 className="mb-3 font-display text-xl font-bold text-foreground">{title}</h3>

      {/* Description */}
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{description}</p>

      {/* Benefits */}
      <ul className="mb-6 flex-1 space-y-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-mint" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {comingSoon ? (
        <Button variant="outline" size="sm" className="w-full text-center" disabled>
          Coming soon
        </Button>
      ) : (
        <Button variant="outline" size="sm" asChild className="w-full text-center">
          <Link href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {ctaText}
          </Link>
        </Button>
      )}
    </div>
  );
}

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
