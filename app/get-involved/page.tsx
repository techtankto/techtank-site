import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Megaphone, Users, Building2, ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { RoleCard, roleCardsData } from "@/components/ui/role-card";
import { ContactCard } from "@/components/ui/contact-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Get involved with TechTank TO. Speak, host, sponsor, or volunteer — there are multiple ways to contribute to Toronto's tech community.",
};

const communityLinks = [
  {
    name: "Luma",
    href: "https://luma.com/techtank",
    icon: "/images/platforms/Luma_Logo.png",
  },
  {
    name: "Meetup",
    href: "https://meetup.com/techtank-to",
    icon: "/images/platforms/Meetup_Logo.png",
  },
  {
    name: "Slack",
    href: "/links/slack",
    icon: "/images/platforms/slack-cropped.png",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/techtank-to",
    icon: "/images/platforms/LinkedIn.png",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/techtankto",
    icon: "/images/platforms/Instagram.svg",
  },
  {
    name: "GitHub",
    href: "https://github.com/tech-tankorg",
    icon: "/images/platforms/GitHub_Invertocat_Logo.svg",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@TechTankTo",
    icon: "/images/platforms/youtube-logo.png",
  },
];

const whyGetInvolved = [
  {
    icon: Megaphone,
    title: "Marketing & Brand",
    description:
      "Reach Toronto tech in a genuine, non-salesy way. Your brand gets visibility among developers, designers, and tech leaders who value community.",
  },
  {
    icon: Users,
    title: "Recruiting",
    description:
      "Meet talent at all levels — from junior developers to senior engineers. Build relationships before you need to hire.",
  },
  {
    icon: Building2,
    title: "Karma",
    description:
      "The tech community thrives because people give back. Your contribution helps the next generation of Toronto tech talent.",
  },
];

export default function GetInvolvedPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero texture-grain relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
              Get involved
            </span>
            <h1 className="mb-6 font-display text-4xl font-semibold text-balance text-foreground md:text-5xl lg:text-6xl">
              Let&apos;s build TechTank together
            </h1>
            <p className="text-xl leading-relaxed text-muted-foreground">
              TechTank runs because of people who show up and help make things happen. There are a few ways to get
              involved depending on where you&apos;re at and what you want to put in.
            </p>
          </div>

          {/* Community platforms */}
          <div className="mt-10">
            <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
              Join the community
            </span>
            <div className="flex flex-wrap gap-4">
              {communityLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group glass relative overflow-hidden rounded-2xl transition-transform hover:scale-[1.03]"
                >
                  <div className="flex flex-col items-center justify-center gap-1 p-5">
                    <Image src={link.icon} alt="" width={40} height={40} className="size-10" />
                    <h2 className="text-sm font-medium text-foreground">{link.name}</h2>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <Section>
        <SectionHeader overline="Ways to get involved" title="Choose your path" className="mb-12" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roleCardsData.map((role) => (
            <RoleCard key={role.role} {...role} />
          ))}
        </div>
      </Section>

      {/* Pick a Task teaser */}
      <Section>
        <div className="shadow-soft overflow-hidden rounded-3xl border border-border bg-card lg:grid lg:grid-cols-2">
          {/* Left: gradient panel with the pitch */}
          <div className="gradient-hero-soft texture-grain flex flex-col justify-center p-8 lg:p-12">
            <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
              Roll up your sleeves
            </span>
            <h2 className="mb-4 font-display text-2xl font-semibold text-balance text-foreground lg:text-3xl">
              Pick something to work on
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Pick a Task is our running list of concrete, bite-sized ways to help, from photography and design to dev
              and logistics. No big commitment, no application essay. Find a task that fits, raise your hand, and
              we&rsquo;ll pair you with it. Tasks go to people in our Slack, so you&rsquo;ll connect your account to
              apply.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Photography", "Design", "Frontend", "Content", "Logistics"].map((pill) => (
                <Badge key={pill} variant="secondary">
                  {pill}
                </Badge>
              ))}
            </div>
            <div className="mt-8">
              <Button asChild>
                <Link href="/tasks">
                  Browse tasks
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: how it works */}
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <h3 className="mb-6 font-display text-lg font-semibold text-foreground">How it works</h3>
            <ol className="space-y-5">
              {[
                "Find a task that fits your skills and the time you've got.",
                "Connect Slack and raise your hand. No application essay.",
                "We message you on Slack, send what you need, and your work ships to the community.",
              ].map((step, index) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-sm font-bold text-secondary-foreground">
                    {index + 1}
                  </span>
                  <p className="leading-relaxed text-muted-foreground">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* Why Get Involved */}
      <Section background="brand-soft">
        <SectionHeader overline="Why get involved" title="What you get out of it" className="mb-12" />
        <div className="grid gap-8 lg:grid-cols-3">
          {whyGetInvolved.map((item) => (
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

      {/* Contact Strip */}
      <Section>
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
            Ready to connect?
          </span>
          <h2 className="mb-4 font-display text-3xl font-semibold text-foreground">Drop us a line</h2>
          <p className="text-muted-foreground">
            We respond to every message — hosts, sponsors, speakers, and volunteers. Whichever role fits, we&apos;d love
            to hear from you.
          </p>
        </div>
        <div className="mx-auto max-w-xl">
          <ContactCard context="For hosting, sponsorship, speaking, and community inquiries." />
        </div>
      </Section>
    </>
  );
}
