import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import { TeamCard } from "@/components/ui/team-card";
import { teamGroups } from "@/constants/team";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the volunteers, organizers, and board members who make TechTank TO happen.",
};

export default function TeamPage() {
  const board = teamGroups[0];
  const coreTeam = teamGroups[1];
  const websiteTeam = teamGroups[2];
  const socialMedia = teamGroups[3];
  const volunteers = teamGroups[4];

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero texture-grain relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
              Our team
            </span>
            <h1 className="mb-6 font-display text-4xl font-semibold text-balance text-foreground md:text-5xl lg:text-6xl">
              The people behind TechTank
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
              TechTank TO is powered entirely by volunteers — organizers, designers, developers, and community builders
              who give their time to make Toronto&apos;s tech community more inclusive and welcoming.
            </p>
            <Button variant="outline" size="lg" asChild>
              <Link href="/get-involved/organizer">Join the team</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <Section>
        <SectionHeader
          overline="Governance"
          title="Board of Directors"
          description="The board handles the governance side of TechTank: strategy, finances, and the legal responsibilities behind the organization. Most board members are active organizers as well."
          className="mb-12"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {board.members.map((m) => (
            <TeamCard key={m.name} variant="board" member={m} />
          ))}
        </div>
      </Section>

      {/* Core Team */}
      <Section background="white">
        <SectionHeader
          overline="Core team"
          title="Leads & organizers"
          description="The people who lead the work behind TechTank: events, programming, video, and everything in between."
          className="mb-10"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {coreTeam.members.map((m) => (
            <TeamCard key={m.name} variant="core" member={m} />
          ))}
        </div>
      </Section>

      {/* Website + Social side-by-side */}
      <Section background="brand-soft">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader overline="Website team" title="Developers & designers" className="mb-8" />
            <div className="grid gap-3">
              {websiteTeam.members.map((m) => (
                <TeamCard key={m.name} variant="compact" member={m} />
              ))}
            </div>
          </div>
          <div>
            <SectionHeader overline="Social media" title="Content & community" className="mb-8" />
            <div className="grid gap-3">
              {socialMedia.members.map((m) => (
                <TeamCard key={m.name} variant="compact" member={m} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Community Volunteers */}
      <Section background="white">
        <SectionHeader
          overline="Community"
          title="Volunteers"
          description="Our community volunteers show up at every event to make sure everyone feels welcome."
          className="mb-10"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {volunteers.members.map((m) => (
            <TeamCard key={m.name + (m.role ?? "")} variant="compact" member={m} />
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section background="brand-soft">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
            Get involved
          </span>
          <h2 className="mb-4 font-display text-3xl font-semibold text-foreground">Want to be part of the team?</h2>
          <p className="mb-8 text-muted-foreground">
            We&apos;re always looking for volunteers who want to help build Toronto&apos;s most inclusive tech
            community.
          </p>
          <Button variant="primary" size="lg" asChild>
            <Link href="/get-involved/organizer">Volunteer with us</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
