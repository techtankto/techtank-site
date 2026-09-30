import type { Metadata } from "next";
import Link from "next/link";
import { Check, Star, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import { ContactCard } from "@/components/ui/contact-card";
import { CONTACT_EMAIL } from "@/constants/contact";

export const metadata: Metadata = {
  title: "Join the Organizer Team",
  description:
    "Help shape what TechTank becomes. We're building a structured volunteer leadership team with defined roles and a 6-month commitment.",
};

const whyOrganize = [
  {
    icon: Star,
    title: "Shape the direction",
    description:
      "Organizers make the calls that determine what TechTank becomes — what we build, who we serve, and how we grow.",
  },
  {
    icon: Users,
    title: "Build with a team",
    description:
      "Work alongside a small, committed group of people who care about Toronto's tech community as much as you do.",
  },
  {
    icon: Clock,
    title: "Real responsibility",
    description:
      "This isn't a casual role. You'll own something meaningful — a function, a relationship, or a program — for 6 months.",
  },
];

const whatYouGet = [
  "Defined role with real ownership",
  "Direct input on TechTank's strategy and programming",
  "Access to our speaker, host, and sponsor network",
  "Organizer credits on the website and at events",
  "Letters of recommendation for dedicated organizers",
  "Networking with Toronto tech leaders",
];

export default function OrganizerPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero texture-grain relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
              Shape what TechTank becomes
            </span>
            <h1 className="mb-6 font-display text-4xl font-semibold text-balance text-foreground md:text-5xl lg:text-6xl">
              Join the Organizer Team
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
              We&apos;re building out a more structured volunteer leadership team with defined roles and a 6-month
              commitment. If you want to help shape what TechTank becomes, this is the path.
            </p>
            <Button variant="primary" size="lg" asChild>
              <a href={`mailto:${CONTACT_EMAIL}?subject=Organizer%20Team%20Inquiry%20-%20TechTank`}>Get in touch</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Organize */}
      <Section>
        <SectionHeader overline="Why organize" title="What this role is about" className="mb-12" />
        <div className="grid gap-8 lg:grid-cols-3">
          {whyOrganize.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-6 lg:p-8">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-ring/10 text-ring">
                <item.icon className="size-6" />
              </div>
              <h3 className="mb-3 font-display text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* What You Get */}
      <Section background="brand-soft">
        <div className="mx-auto max-w-3xl">
          <SectionHeader overline="What you get" title="Organizer perks" align="center" className="mb-12" />
          <div className="grid gap-4 sm:grid-cols-2">
            {whatYouGet.map((item, index) => (
              <div key={index} className="flex items-center gap-3 rounded-lg bg-card p-4">
                <Check className="size-5 shrink-0 text-ring" aria-hidden="true" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Get Started */}
      <Section>
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
            Get started
          </span>
          <h2 className="mb-4 font-display text-3xl font-semibold text-foreground">Ready to get involved?</h2>
          <p className="mb-8 text-muted-foreground">
            Send us a note introducing yourself. Tell us what you&apos;d want to own and why TechTank matters to you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" size="sm" asChild>
              <a href={`mailto:${CONTACT_EMAIL}?subject=Organizer%20Team%20Inquiry%20-%20TechTank`}>Get in touch</a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/events">Attend an event first</Link>
            </Button>
          </div>
        </div>
        <div className="mx-auto max-w-xl">
          <ContactCard context="Interested in joining the organizer team? Tell us about yourself." />
        </div>
      </Section>
    </>
  );
}
