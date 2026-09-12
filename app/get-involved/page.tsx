import type { Metadata } from "next";
import { Megaphone, Users, Building2 } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { RoleCard } from "@/components/ui/role-card";
import { roleCardsData } from "@/constants/role-cards";
import { ContactCard } from "@/components/ui/contact-card";
import { BRAND_ICONS } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Get involved with TechTank TO. Speak, host, sponsor, or volunteer — there are multiple ways to contribute to Toronto's tech community.",
};

const communityLinks = [
  {
    name: "Slack",
    href: "/links/slack",
    iconId: "slack",
  },
  {
    name: "Luma",
    href: "https://luma.com/techtank",
    iconId: "luma",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/techtank-to",
    iconId: "linkedin",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/techtankto",
    iconId: "instagram",
  },
  {
    name: "GitHub",
    href: "https://github.com/techtankto",
    iconId: "github",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@TechTankTo",
    iconId: "youtube",
  },
  {
    name: "Meetup",
    href: "https://meetup.com/techtank-to",
    iconId: "meetup",
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
              {communityLinks.map((link) => {
                const Icon = BRAND_ICONS[link.iconId];
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group glass relative w-26 overflow-hidden rounded-2xl transition-transform hover:scale-[1.03]"
                  >
                    <div className="flex flex-col items-center justify-center gap-1 p-5">
                      {Icon && <Icon className="size-10 text-foreground" />}
                      <h2 className="text-sm font-medium text-foreground">{link.name}</h2>
                    </div>
                  </a>
                );
              })}
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
