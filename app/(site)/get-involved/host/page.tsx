import type { Metadata } from "next";
import Link from "next/link";
import { Check, Clock, Users, Building, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import { Stepper, type Step } from "@/components/ui/stepper";
import { SponsorsMarquee } from "@/components/ui/sponsors-marquee";
import { CONTACT_EMAIL } from "@/constants/contact";
import { ContactCard } from "@/components/ui/contact-card";

export const metadata: Metadata = {
  title: "Host a TechTank Event",
  description:
    "Bring Toronto's tech community to your office. Great for recruiting, brand visibility, and giving back.",
};

const whyHost = [
  {
    icon: Users,
    title: "Recruiting",
    description:
      "Meet Toronto tech talent in a genuine, non-salesy environment. Build relationships before you need to hire.",
  },
  {
    icon: Building,
    title: "Back to the office",
    description: "Give your team a reason to come in. Hosting an event creates energy and shows off your space.",
  },
  {
    icon: Users,
    title: "Karma",
    description:
      "The tech community is interrelated. Supporting it means supporting your future colleagues, partners, and hires.",
  },
];

const logistics = [
  { label: "Capacity", value: "40-120 attendees", icon: Users },
  { label: "Timing", value: "6:00pm - 8:30pm weeknight", icon: Clock },
  { label: "Location", value: "TTC accessible (subway or streetcar)", icon: MapPin },
  { label: "AV", value: "Projector + screen required; microphone nice-to-have", icon: Building },
  { label: "Food", value: "Pizza + non-alcoholic drinks (baseline)", icon: Building },
  { label: "Recording", value: "TechTank records and posts to YouTube", icon: Building },
];

const techTankHandles = [
  "Speaker sourcing (unless you want to bring your own)",
  "Marketing (Slack, LinkedIn, Instagram)",
  "Registration and attendee tracking",
  "Event coordination and MCing",
  "Recording and publishing to YouTube",
];

const youProvide = [
  "Venue with seating and AV",
  "Food and drinks",
  "Optional: your own speaker",
  "Optional: your marketing materials",
];

const whatYouGet = [
  "Logo on event marketing across all channels",
  "Attendee list (post-event)",
  "Brand visibility on YouTube and social",
  "Photos from the event (for your channels)",
  "A memorable team experience",
  "Karma in the Toronto tech community",
];

const process: Step[] = [
  { title: "Initial contact", description: "Fill out the form or email us" },
  { title: "Scoping call", description: "We'll discuss venue, capacity, and timing" },
  { title: "Confirm details", description: "Date, speaker, and logistics locked in" },
  { title: "Marketing kickoff", description: "We promote the event across channels" },
  { title: "Event day", description: "We run the show; you enjoy the night" },
];

export default function HostPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero texture-grain relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
              Bring us to your space
            </span>
            <h1 className="mb-6 font-display text-4xl font-semibold text-balance text-foreground md:text-5xl lg:text-6xl">
              Host a TechTank event
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
              Bring the Toronto tech community to your office. Great for recruiting, brand visibility, and giving back
              to the community.
            </p>
            <Button variant="primary" size="lg" asChild>
              <a href={`mailto:${CONTACT_EMAIL}?subject=Host%20Inquiry%20-%20TechTank`}>Contact us to host</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Host */}
      <Section>
        <SectionHeader overline="Why host" title="What you get out of it" className="mb-12" />
        <div className="grid gap-8 lg:grid-cols-3">
          {whyHost.map((item) => (
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

      {/* Event Logistics */}
      <Section background="white">
        <SectionHeader overline="Event logistics" title="What we need from your space" className="mb-12" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {logistics.map((item) => (
            <div key={item.label} className="flex items-start gap-4 rounded-xl bg-background p-5">
              <item.icon className="mt-0.5 size-5 shrink-0 text-ring" />
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
          <SectionHeader overline="What you get" title="Host perks" align="center" className="mb-12" />
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

      {/* Process */}
      <Section>
        <SectionHeader overline="The process" title="How it works" className="mb-12" />
        <Stepper steps={process} className="lg:grid-cols-5" />
      </Section>

      {/* Past Hosts Logo Cloud */}
      <Section background="white">
        <SectionHeader overline="Past hosts" title="Companies that have hosted" align="center" className="mb-8" />
        <SponsorsMarquee className="py-4" />
      </Section>

      {/* Host Resources */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">Resources</span>
          <h2 className="mb-4 font-display text-3xl font-semibold text-foreground">Host toolkit in the Media Kit</h2>
          <p className="mb-8 text-muted-foreground">
            Run-of-show guides, host checklists, brand assets, and event templates all live in our Media Kit.
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
            Ready to host?
          </span>
          <h2 className="mb-4 font-display text-3xl font-semibold text-foreground">
            Let&apos;s bring TechTank to your space
          </h2>
          <p className="mb-8 text-muted-foreground">
            Tell us about your venue and when you&apos;d like to host. We&apos;ll get back to you within a week.
          </p>
          <Button variant="primary" size="lg" asChild>
            <a href={`mailto:${CONTACT_EMAIL}?subject=Host%20Inquiry%20-%20TechTank`}>Contact us to host</a>
          </Button>
        </div>
      </Section>

      {/* Contact */}
      <Section>
        <div className="mx-auto max-w-xl">
          <ContactCard context="Questions about hosting? We're here to help." />
        </div>
      </Section>
    </>
  );
}
