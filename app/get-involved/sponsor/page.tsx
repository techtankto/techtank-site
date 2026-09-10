import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Heart, Users, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import { SponsorsMarquee } from "@/components/ui/sponsors-marquee";
import { ContactCard } from "@/components/ui/contact-card";
import { ToolsGrid } from "@/components/ui/tools-grid";
import { getCoverImage, getCoverVideo, getInstagramPostsByIds } from "@/constants/instagram-posts";
import { CONTACT_EMAIL } from "@/constants/contact";

export const metadata: Metadata = {
  title: "Sponsor TechTank",
  description:
    "Support Toronto's most inclusive tech community. Request sponsorship info and see how you can help the community thrive.",
};

const whySponsor = [
  {
    icon: Megaphone,
    title: "Brand alignment",
    description:
      "Align with Toronto's most inclusive tech community and build real credibility with developers, designers, and tech leaders who value authenticity.",
  },
  {
    icon: Users,
    title: "Hiring pipeline",
    description:
      "Sustained exposure to Toronto tech talent across all levels. Build relationships and recognition before you need to hire, at a fraction of the cost of job boards and recruiters.",
  },
  {
    icon: Heart,
    title: "Community impact",
    description:
      "Your support keeps events accessible and free. Help the next generation of Toronto tech talent thrive.",
  },
];

const whatSponsorshipSupports = [
  "Event operations when no host venue is available",
  "Community programs like Code Diversity for underrepresented voices",
  "Equipment, recording, and production costs",
  "Slack community and online resources",
];

const sponsorTiers = [
  {
    name: "Friend of the Community",
    description: "Logo on website, mentions in event communications",
    highlight: false,
  },
  {
    name: "Event Sponsor",
    description: "Logo + callouts tied to sponsored events",
    highlight: false,
  },
  {
    name: "Annual Partner",
    description: "Year-long placement and a speaker slot",
    highlight: true,
  },
];

const basePackage = [
  "Placement on techtankto.com logo cloud",
  "Mentions in event marketing",
  "Social shout-outs (LinkedIn, Instagram)",
  "Option to speak at an event",
];

export default function SponsorPage() {
  const featuredPost = getInstagramPostsByIds(["2026-04-10-DW9vcgiPHx"])[0];
  const featuredVideo = featuredPost ? getCoverVideo(featuredPost) : undefined;
  const featuredImage = featuredPost ? getCoverImage(featuredPost) : undefined;

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero texture-grain relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
              Support the community
            </span>
            <h1 className="mb-6 font-display text-4xl font-semibold text-balance text-foreground md:text-5xl lg:text-6xl">
              Sponsor the Toronto tech community
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
              Support the year-round events, speakers, and programs that bring the community together. Tasteful brand
              visibility, real impact.
            </p>
            <Button variant="primary" size="lg" asChild>
              <a href={`mailto:${CONTACT_EMAIL}?subject=Sponsorship%20Inquiry%20-%20TechTank`}>
                Request sponsorship info
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Sponsor */}
      <Section>
        <SectionHeader overline="Why sponsor" title="What you get out of it" className="mb-12" />
        <div className="grid gap-8 lg:grid-cols-3">
          {whySponsor.map((item) => (
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

      {/* What Sponsorship Supports */}
      <Section background="white">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
              Your impact
            </span>
            <h2 className="mb-6 font-display text-3xl font-semibold text-foreground">What sponsorship supports</h2>
            <ul className="space-y-4">
              {whatSponsorshipSupports.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-ring" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="via-lavender to-aqua relative aspect-4/3 overflow-hidden rounded-2xl bg-linear-to-br from-peach">
              {featuredVideo ? (
                <video autoPlay loop muted playsInline className="absolute inset-0 size-full object-cover">
                  <source src={featuredVideo.replace(/\.mp4$/, ".webm")} type="video/webm" />
                  <source src={featuredVideo} type="video/mp4" />
                </video>
              ) : featuredImage ? (
                <Image
                  src={featuredImage}
                  alt="TechTank community moment"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="px-8 text-center text-foreground/60">Community event photography</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Sponsor Tiers */}
      <Section>
        <SectionHeader
          overline="Sponsorship tiers"
          title="Ways to support"
          description="We offer flexible sponsorship options. Request our sponsorship info for full details."
          className="mb-12"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {sponsorTiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-6 lg:p-8 ${
                tier.highlight ? "border-amber bg-amber/10" : "border-border bg-card"
              }`}
            >
              {tier.highlight && (
                <span className="mb-2 inline-block text-xs font-semibold tracking-wider text-overline uppercase">
                  Most popular
                </span>
              )}
              <h3 className="mb-2 font-display text-xl font-semibold text-foreground">{tier.name}</h3>
              <p className="text-muted-foreground">{tier.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Exact pricing and benefits in our sponsorship info. Tiers are illustrative — we&apos;ll work with your budget.
        </p>
      </Section>

      {/* Base Package */}
      <Section background="brand-soft">
        <div className="mx-auto max-w-3xl">
          <SectionHeader overline="All sponsors get" title="Base sponsor package" align="center" className="mb-12" />
          <div className="grid gap-4 sm:grid-cols-2">
            {basePackage.map((item, index) => (
              <div key={index} className="flex items-center gap-3 rounded-lg bg-card p-4">
                <Check className="size-5 shrink-0 text-ring" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Past Sponsors */}
      <Section background="white">
        <SectionHeader
          overline="Our supporters"
          title="Companies that host and sponsor TechTank"
          description="These companies sponsor TechTank with funding for ongoing operations and programs. Some also host events with their venues and food."
          align="center"
          className="mb-8"
        />
        <SponsorsMarquee className="py-4" />
      </Section>

      {/* Tools Product Sponsors */}
      <Section id="tools" className="scroll-mt-24">
        <SectionHeader
          overline="Product sponsors"
          title="Tools that power TechTank"
          description="Some companies sponsor TechTank with their products. They keep our design, communication, and events running. Thank you."
          className="mb-12"
        />
        <ToolsGrid />
        <div className="mx-auto mt-12 max-w-2xl text-center">
          <h3 className="mb-3 font-display text-xl font-semibold text-foreground">Have a tool we should be using?</h3>
          <p className="mb-6 text-muted-foreground">
            Put your product in the hands of real professional users working across Toronto&apos;s tech companies.
            Sponsor TechTank with your product and we&apos;ll credit you here and use it in the open.
          </p>
          <Button variant="outline" asChild>
            <a href={`mailto:${CONTACT_EMAIL}?subject=Tool%20Sponsorship%20-%20TechTank`}>Offer your tool</a>
          </Button>
        </div>
      </Section>

      {/* Hosting vs Sponsoring */}
      <Section background="muted">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">Not sure?</span>
          <h2 className="mb-4 font-display text-3xl font-semibold text-foreground">Hosting vs. sponsoring</h2>
          <p className="mb-6 text-muted-foreground">
            <strong className="text-foreground">Hosting</strong> means providing your venue and food for one event.{" "}
            <strong className="text-foreground">Sponsoring</strong> means supporting TechTank with funding for ongoing
            operations, programs, or multiple events. It&apos;s the deepest, most sustained way to back the community.
          </p>
          <Button variant="outline" asChild>
            <Link href="/get-involved/host">Learn about hosting</Link>
          </Button>
        </div>
      </Section>

      {/* Intake Form CTA */}
      <Section background="brand-soft">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
            Ready to sponsor?
          </span>
          <h2 className="mb-4 font-display text-3xl font-semibold text-foreground">Get the sponsorship info</h2>
          <p className="mb-8 text-muted-foreground">
            Tell us about your company and goals. We&apos;ll send our full sponsorship details within a week.
          </p>
          <Button variant="primary" size="lg" asChild>
            <a href={`mailto:${CONTACT_EMAIL}?subject=Sponsorship%20Inquiry%20-%20TechTank`}>
              Request sponsorship package
            </a>
          </Button>
        </div>
      </Section>

      {/* Contact */}
      <Section>
        <div className="mx-auto max-w-xl">
          <ContactCard context="Questions about sponsorship? Let's talk." />
        </div>
      </Section>
    </>
  );
}
