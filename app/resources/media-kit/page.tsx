import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Download, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import { BRAND_ICONS } from "@/components/ui/icons";
import { ContactCard } from "@/components/ui/contact-card";
import { CopyButton } from "@/components/ui/copy-button";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { getAllSocialLinks } from "@/constants/social-links";
import { CONTACT_EMAIL } from "@/constants/contact";

export const metadata: Metadata = {
  title: "Media Kit",
  description: "TechTank TO media kit — logos, brand guidelines, and fast facts for press, sponsors, and partners.",
};

const fastFacts = [
  { label: "Founded", value: "2023" },
  { label: "Location", value: "Toronto, Canada" },
  { label: "Cadence", value: "Year-round, in-person events via Luma + ongoing Slack community" },
  { label: "Typical attendance", value: "40-120 per event" },
  { label: "Structure", value: "Volunteer-run, non-commercial" },
  { label: "Contact", value: CONTACT_EMAIL },
];

const brandColors = [
  { name: "Teal", hex: "#2A6B7C", usage: "Secondary headings, accents" },
  { name: "Teal Dark", hex: "#1B4B5A", usage: "Primary headings, footer, CTAs" },
  { name: "Amber", hex: "#FFBC55", usage: "Brand amber" },
  { name: "Amber Dark", hex: "#EFA020", usage: "Brand amber dark" },
  { name: "Coral", hex: "#E87C4E", usage: "Orange accent" },
  { name: "Mint", hex: "#5B9A8B", usage: "Accent green" },
  { name: "Seafoam", hex: "#A8D5D8", usage: "Light backgrounds, accents" },
  { name: "Sand", hex: "#F7EDE2", usage: "Warm off-white" },
  { name: "Peach", hex: "#F5D4C1", usage: "Warm gradient base" },
  { name: "Blush", hex: "#EABFBF", usage: "Pink accent" },
];

const logoDownload = {
  name: "TechTank Logos",
  href: "/downloads/techtank-media-kit.zip",
  description: "SVG + PNG — light and dark variants",
};

const resources = [
  {
    name: "Brand Guidelines",
    href: "/resources/design-system",
    description: "Colors, typography, usage rules",
    internal: true,
  },
  {
    name: "Speaker Slide Template",
    href: "/downloads/coming-soon.txt",
    description: "Google Slides / PPTX template",
    internal: false,
  },
  {
    name: "Speaker Checklist",
    href: "/downloads/coming-soon.txt",
    description: "Preparation guide for first-time speakers",
    internal: false,
  },
  {
    name: "Host Checklist",
    href: "/downloads/coming-soon.txt",
    description: "Event-day preparation guide",
    internal: false,
  },
];

export default function PressKitPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero texture-grain relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
              Media Kit
            </span>
            <h1 className="mb-6 font-display text-4xl font-semibold text-balance text-foreground md:text-5xl lg:text-6xl">
              TechTank Media Kit
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
              Logos, guidelines, and fast facts for press, sponsors, and partners. All assets are free to use with
              attribution.
            </p>
            <Button variant="primary" size="lg" asChild>
              <TrackedLink
                href="/downloads/techtank-media-kit.zip"
                download
                event="asset_download"
                properties={{ asset: "media-kit-zip" }}
              >
                <Download className="mr-2 size-5" />
                Download all assets (ZIP)
              </TrackedLink>
            </Button>
          </div>
        </div>
      </section>

      {/* Fast Facts */}
      <Section>
        <SectionHeader overline="Fast facts" title="About TechTank TO" className="mb-12" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fastFacts.map((fact) => (
            <div key={fact.label} className="rounded-xl border border-border bg-card p-5">
              <p className="mb-1 text-sm text-muted-foreground">{fact.label}</p>
              <p className="font-semibold text-foreground">{fact.value}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Boilerplate */}
      <Section background="white">
        <SectionHeader overline="Boilerplate" title="About TechTank (for press)" className="mb-8" />
        <div className="max-w-3xl space-y-6">
          <div className="rounded-xl border border-border bg-background p-6">
            <p className="mb-4 leading-relaxed text-foreground">
              <strong>Full paragraph: </strong>TechTank TO is Toronto&apos;s volunteer-run tech community, hosting
              year-round in-person events since 2023. Each event brings together 40-120 attendees, including developers,
              designers, and tech professionals for technical talks and networking. TechTank is committed to fostering a
              supportive and inclusive environment where people of all skill levels can explore, create, and thrive in
              technology.
            </p>
            <CopyButton text="TechTank TO is Toronto's volunteer-run tech community, hosting year-round in-person events since 2023. Each event brings together 40-120 attendees, including developers, designers, and tech professionals for technical talks and networking. TechTank is committed to fostering a supportive and inclusive environment where people of all skill levels can explore, create, and thrive in technology." />
          </div>
          <div className="rounded-xl border border-border bg-background p-6">
            <p className="mb-4 leading-relaxed text-foreground">
              <strong>One-liner: </strong>TechTank TO is Toronto&apos;s volunteer-run tech community, hosting year-round
              events for developers, designers, and tech professionals since 2023.
            </p>
            <CopyButton text="TechTank TO is Toronto's volunteer-run tech community, hosting year-round events for developers, designers, and tech professionals since 2023." />
          </div>
          <div className="rounded-xl border border-border bg-background p-6">
            <p className="mb-4 leading-relaxed text-foreground">
              <strong>Mission statement: </strong>TechTank strengthens Toronto&apos;s tech ecosystem by creating
              engaging, community-driven spaces that bring people together through social events and career-focused
              programming, helping them build meaningful connections and grow in their careers.
            </p>
            <CopyButton text="TechTank strengthens Toronto's tech ecosystem by creating engaging, community-driven spaces that bring people together through social events and career-focused programming, helping them build meaningful connections and grow in their careers." />
          </div>
        </div>
      </Section>

      {/* Logos */}
      <Section>
        <SectionHeader
          overline="Logos"
          title="Logo downloads"
          description="Download our logos in various formats. Please maintain clear space and minimum size as outlined in the brand guidelines."
          className="mb-12"
        />

        {/* Logo Preview */}
        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          <div className="light flex items-center justify-center rounded-xl border border-border bg-background/70 p-8 backdrop-blur-md">
            <Image
              src="/images/logos/light.svg"
              alt="TechTank TO Logo (light)"
              width={240}
              height={80}
              className="h-16 w-auto"
              style={{ width: "auto" }}
            />
          </div>
          <div className="glass-dark flex items-center justify-center rounded-xl p-8">
            <Image
              src="/images/logos/dark.svg"
              alt="TechTank TO Logo (dark)"
              width={240}
              height={80}
              className="h-16 w-auto"
              style={{ width: "auto" }}
            />
          </div>
        </div>

        {/* Logo Download */}
        <TrackedLink
          href={logoDownload.href}
          download
          event="asset_download"
          properties={{ asset: "logos" }}
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-ring/50"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-background">
            <FileText className="size-6 text-ring" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground transition-colors group-hover:text-ring">{logoDownload.name}</p>
            <p className="text-sm text-muted-foreground">{logoDownload.description}</p>
          </div>
          <Download className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-ring" />
        </TrackedLink>
      </Section>

      {/* Brand Colors */}
      <Section background="white">
        <SectionHeader overline="Brand colors" title="Color palette" className="mb-12" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brandColors.map((color) => (
            <div key={color.name} className="overflow-hidden rounded-xl border border-border bg-background">
              <div className="h-20" style={{ backgroundColor: color.hex }} />
              <div className="p-4">
                <div className="mb-1 flex items-center justify-between">
                  <p className="font-semibold text-foreground">{color.name}</p>
                  <code className="text-sm text-muted-foreground">{color.hex}</code>
                </div>
                <p className="text-sm text-muted-foreground">{color.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Typography */}
      <Section>
        <SectionHeader overline="Typography" title="Font pairing" className="mb-12" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="mb-2 text-sm text-muted-foreground">Display / Headlines</p>
            <p className="mb-4 font-display text-4xl font-semibold text-foreground">Space Grotesk</p>
            <p className="text-muted-foreground">
              Used for headings, titles, and display text. Geometric sans-serif with a modern, technical feel.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="mb-2 text-sm text-muted-foreground">Body / UI</p>
            <p className="mb-4 font-sans text-4xl font-semibold text-foreground">Inter</p>
            <p className="text-muted-foreground">
              Used for body text, UI elements, and long-form content. Humanist sans-serif optimized for screens.
            </p>
          </div>
        </div>
      </Section>

      {/* Resources */}
      <Section>
        <SectionHeader overline="Resources" title="Additional assets" className="mb-12" />
        <div className="grid gap-4 sm:grid-cols-2">
          {resources.map((resource) => {
            const Wrapper = resource.internal ? Link : "a";
            const wrapperProps = resource.internal ? { href: resource.href } : { href: resource.href };
            return (
              <Wrapper
                key={resource.name}
                {...wrapperProps}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-ring/50"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-ring/10">
                  <FileText className="size-6 text-ring" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground transition-colors group-hover:text-ring">
                    {resource.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </div>
                {resource.internal ? (
                  <ExternalLink className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-ring" />
                ) : (
                  <Download className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-ring" />
                )}
              </Wrapper>
            );
          })}
        </div>
      </Section>

      {/* Social Links */}
      <Section background="brand-soft">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
            Connect with us
          </span>
          <h2 className="mb-8 font-display text-3xl font-semibold text-foreground">Official channels</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {getAllSocialLinks()
              .filter((link) => ["linkedin", "instagram", "youtube", "github"].includes(link.id))
              .map((link) => {
                const Icon = BRAND_ICONS[link.id];
                return (
                  <Button key={link.id} variant="outline" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {Icon && <Icon className="mr-2 size-4" />}
                      {link.name}
                      <ExternalLink className="ml-2 size-4" />
                    </a>
                  </Button>
                );
              })}
          </div>
        </div>
      </Section>

      {/* Usage Terms */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <SectionHeader overline="Usage terms" title="How to use our assets" className="mb-8" />
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <p className="text-foreground">
              <strong>Permitted:</strong> Use our logos and assets to reference TechTank TO in press coverage, event
              listings, partnership announcements, and sponsor materials with proper attribution.
            </p>
            <p className="text-foreground">
              <strong>Not permitted:</strong> Modifying logo colors, proportions, or elements; using assets to imply
              endorsement without written permission; using assets in ways that could damage TechTank&apos;s reputation.
            </p>
            <p className="text-sm text-muted-foreground">
              For questions about asset usage or to request permission for special use cases, please contact us at
              {CONTACT_EMAIL}.
            </p>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section>
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
            Media contact
          </span>
          <h2 className="mb-4 font-display text-3xl font-semibold text-foreground">Get in touch</h2>
          <p className="text-muted-foreground">For press inquiries, interviews, and partnership discussions.</p>
        </div>
        <div className="mx-auto max-w-xl">
          <ContactCard context="For press inquiries, interviews, and partnership requests." />
        </div>
      </Section>
    </>
  );
}
