import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Users, Video, Mic, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import { FeatureCard } from "@/components/ui/feature-card";
import { CheckGrid } from "@/components/ui/check-grid";
import { ChecklistPanel } from "@/components/ui/checklist-panel";
import { ContactCard } from "@/components/ui/contact-card";

export const metadata: Metadata = {
  title: "Speak or Facilitate",
  description:
    "Got something to share? We're always looking for speakers, panelists, and workshop facilitators. You don't need to be a senior engineer or a public figure.",
  alternates: { canonical: "/get-involved/speak-or-facilitate" },
};

const whyParticipate = [
  {
    icon: Mic,
    title: "Any format, any level",
    description:
      "Talk, panel, or workshop — pick what fits. You don't need to be a senior engineer or a public figure. If you have a perspective worth hearing, we want to hear it.",
  },
  {
    icon: Video,
    title: "Your session on record",
    description:
      "Talks and panels are recorded and published to YouTube. Your session becomes a portfolio piece that reaches developers across Canada.",
  },
  {
    icon: Users,
    title: "Give back to the community",
    description:
      "The community runs on people sharing what they know. Your experience — at any level — is valuable to someone else.",
  },
];

const logistics = [
  { label: "Talk", value: "30-45 minutes + Q&A, solo or co-presented" },
  { label: "Panel", value: "45-60 minutes, 3-5 participants with a moderator" },
  { label: "Workshop", value: "60-90 minutes, hands-on and interactive" },
  { label: "Topics", value: "Anything related to tech" },
  { label: "Format", value: "In-person at a host venue in Toronto" },
  { label: "Audience", value: "40-120 attendees per event" },
];

const techTankHandles = [
  "Venue and catering (via a host company)",
  "Marketing (Slack, LinkedIn, Instagram)",
  "Run-of-show coordination and MCing",
  "Recording and post-production",
  "Coaching and prep support for first-timers",
];

const youProvide = [
  "A proposal (title, format, abstract, bio)",
  "Slides or workshop materials (templates available)",
  "Yourself, on event night",
];

const whatYouGet = [
  "Session recorded and published to YouTube",
  "Promotion across TechTank channels",
  "A welcoming, supportive audience",
  "Coaching and prep support if needed",
  "Networking with Toronto tech professionals",
  "The gratitude of an entire tech community",
];

export default function SpeakOrFacilitatePage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero texture-grain relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
              Share what you know
            </span>
            <h1 className="mb-6 font-display text-4xl font-semibold text-balance text-foreground md:text-5xl lg:text-6xl">
              Speak or Facilitate
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
              Got something to share? We&apos;re always looking for speakers, panelists, and workshop facilitators. You
              don&apos;t need to be a senior engineer or a public figure. If you have a perspective worth hearing, we
              want to hear it.
            </p>
            <Button variant="primary" size="lg" asChild>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdtei1QBJb45fF8Fw29yApWCJEiwHROrJEhPhI5X3eXcAnUjQ/viewform?usp=sf_link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Submit your proposal
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Participate */}
      <Section>
        <SectionHeader overline="Why speak or facilitate" title="What you get out of it" className="mb-12" />
        <div className="grid gap-8 lg:grid-cols-3">
          {whyParticipate.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
          ))}
        </div>
      </Section>

      {/* Logistics */}
      <Section background="white">
        <SectionHeader overline="Logistics" title="What to expect" className="mb-12" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {logistics.map((item) => (
            <div key={item.label} className="flex items-start gap-4 rounded-xl bg-background p-5">
              <Clock className="mt-0.5 size-5 shrink-0 text-ring" aria-hidden="true" />
              <div>
                <p className="font-semibold text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* What TechTank Handles vs What You Provide */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <ChecklistPanel tone="ring" title="What TechTank handles" items={techTankHandles} />

          <ChecklistPanel tone="amber" title="What you provide" items={youProvide} />
        </div>
      </Section>

      {/* What You Get */}
      <Section background="brand-soft">
        <div className="mx-auto max-w-3xl">
          <SectionHeader overline="What you get" title="What you get" align="center" className="mb-12" />
          <CheckGrid items={whatYouGet} />
        </div>
      </Section>

      {/* Speaker Resources */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">Resources</span>
          <h2 className="mb-4 font-display text-3xl font-semibold text-foreground">Speaker and facilitator toolkit</h2>
          <p className="mb-8 text-muted-foreground">
            Brand assets, slide templates, run-of-show guidance, and tips for first-time speakers and facilitators all
            live in our Media Kit.
          </p>
          <Button variant="outline" asChild>
            <Link href="/resources/media-kit">
              Open the Media Kit
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Intake Form CTA */}
      <Section background="brand-soft">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
            Ready to participate?
          </span>
          <h2 className="mb-4 font-display text-3xl font-semibold text-foreground">Submit your proposal</h2>
          <p className="mb-8 text-muted-foreground">
            Tell us about yourself and your idea — talk, panel, or workshop. We&apos;ll get back to you within a week.
          </p>
          <Button variant="primary" size="lg" asChild>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdtei1QBJb45fF8Fw29yApWCJEiwHROrJEhPhI5X3eXcAnUjQ/viewform?usp=sf_link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Submit your proposal
            </a>
          </Button>
        </div>
      </Section>

      {/* Contact */}
      <Section>
        <div className="mx-auto max-w-xl">
          <ContactCard context="Questions about speaking or facilitating? We're here to help." />
        </div>
      </Section>
    </>
  );
}
