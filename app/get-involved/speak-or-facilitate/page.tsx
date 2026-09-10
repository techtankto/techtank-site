import type { Metadata } from "next";
import Link from "next/link";
import { Check, Clock, Users, Video, Mic, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import { ContactCard } from "@/components/ui/contact-card";

export const metadata: Metadata = {
  title: "Speak or Facilitate",
  description:
    "Got something to share? We're always looking for speakers, panelists, and workshop facilitators. You don't need to be a senior engineer or a public figure.",
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
          <div className="rounded-2xl border border-ring/30 bg-ring/8 p-6 lg:p-8">
            <h3 className="mb-6 font-display text-xl font-semibold text-foreground">What TechTank handles</h3>
            <ul className="space-y-3">
              {techTankHandles.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-ring" aria-hidden="true" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-amber/30 bg-amber/8 p-6 lg:p-8">
            <h3 className="mb-6 font-display text-xl font-semibold text-foreground">What you provide</h3>
            <ul className="space-y-3">
              {youProvide.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-amber" aria-hidden="true" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* What You Get */}
      <Section background="brand-soft">
        <div className="mx-auto max-w-3xl">
          <SectionHeader overline="What you get" title="What you get" align="center" className="mb-12" />
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
