import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Mail, ArrowRight, Download, ExternalLink, Users, Star, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Design System",
  description: "TechTank TO design system — colors, typography, components, and patterns.",
  robots: { index: true, follow: true },
};

const brandColors = [
  { name: "teal", cls: "bg-teal", label: "Teal", hex: "#2A6B7C", usage: "Ring / focus, kicker labels" },
  { name: "teal-dark", cls: "bg-teal-dark", label: "Teal Dark", hex: "#1B4B5A", usage: "Primary (light mode)" },
  { name: "amber", cls: "bg-amber", label: "Amber", hex: "#FFBC55", usage: "Warning / secondary CTA" },
  {
    name: "amber-dark",
    cls: "bg-amber-dark",
    label: "Amber Dark",
    hex: "#EFA020",
    usage: "Amber surfaces, dark-mode accent text",
  },
];

const accentTokens = [
  { name: "coral", cls: "bg-coral", label: "Coral", hex: "#E87C4E", usage: "Destructive / orange accent" },
  { name: "mint", cls: "bg-mint", label: "Mint", hex: "#5B9A8B", usage: "Check icons, accent green" },
  { name: "seafoam", cls: "bg-seafoam", label: "Seafoam", hex: "#A8D5D8", usage: "Secondary (light mode)" },
  { name: "sand", cls: "bg-sand", label: "Sand", hex: "#F7EDE2", usage: "Warm off-white, gradients" },
  { name: "peach", cls: "bg-peach", label: "Peach", hex: "#F5D4C1", usage: "Warm gradient base" },
  { name: "blush", cls: "bg-blush", label: "Blush", hex: "#EABFBF", usage: "Pink accent" },
];

const semanticPairs = [
  {
    bg: "background",
    bgCls: "bg-background",
    bgAlias: "#F9F6F2",
    darkBgAlias: "#0D2B35",
    fg: "foreground",
    fgCls: "bg-[var(--color-foreground)]",
    fgAlias: "teal-dark",
    darkFgAlias: "#E8F4F5",
  },
  {
    bg: "muted",
    bgCls: "bg-muted",
    bgAlias: "#EBF3F4",
    darkBgAlias: "#1A3D4A",
    fg: "muted-foreground",
    fgCls: "bg-[var(--color-muted-foreground)]",
    fgAlias: "#4A6670",
    darkFgAlias: "#8BBEC6",
  },
  {
    bg: "card",
    bgCls: "bg-card",
    bgAlias: "white / 70%",
    darkBgAlias: "teal-dark / 50%",
    fg: "card-foreground",
    fgCls: "bg-[var(--color-card-foreground)]",
    fgAlias: "teal-dark",
    darkFgAlias: "#E8F4F5",
  },
  {
    bg: "primary",
    bgCls: "bg-primary",
    bgAlias: "teal-dark",
    darkBgAlias: "seafoam",
    fg: "primary-foreground",
    fgCls: "bg-[var(--color-primary-foreground)]",
    fgAlias: "white",
    darkFgAlias: "#0D2B35",
  },
  {
    bg: "secondary",
    bgCls: "bg-secondary",
    bgAlias: "seafoam",
    darkBgAlias: "teal-dark",
    fg: "secondary-foreground",
    fgCls: "bg-[var(--color-secondary-foreground)]",
    fgAlias: "teal-dark",
    darkFgAlias: "seafoam",
  },
  {
    bg: "accent",
    bgCls: "bg-accent",
    bgAlias: "seafoam / 20%",
    darkBgAlias: "#1E4A58",
    fg: "accent-foreground",
    fgCls: "bg-[var(--color-accent-foreground)]",
    fgAlias: "teal-dark",
    darkFgAlias: "seafoam",
  },
  {
    bg: "destructive",
    bgCls: "bg-destructive",
    bgAlias: "coral",
    darkBgAlias: "coral",
    fg: "destructive-foreground",
    fgCls: "bg-[var(--color-destructive-foreground)]",
    fgAlias: "white",
    darkFgAlias: "white",
  },
  {
    bg: "warning",
    bgCls: "bg-warning",
    bgAlias: "amber",
    darkBgAlias: "amber",
    fg: "warning-foreground",
    fgCls: "bg-[var(--color-warning-foreground)]",
    fgAlias: "teal-dark",
    darkFgAlias: "teal-dark",
  },
];

const semanticUtilities = [
  { token: "border", bgCls: "bg-border", lightAlias: "teal-dark / 12%", darkAlias: "seafoam / 15%" },
  { token: "ring", bgCls: "bg-ring", lightAlias: "teal", darkAlias: "seafoam" },
  { token: "input", bgCls: "bg-input", lightAlias: "teal-dark / 18%", darkAlias: "seafoam / 20%" },
  { token: "overline", bgCls: "bg-overline", lightAlias: "#8A5200", darkAlias: "amber" },
];

const gradients = [
  { cls: "gradient-brand texture-grain", label: ".gradient-brand", desc: "135° — seafoam → sand → peach" },
  {
    cls: "gradient-brand-vertical texture-grain",
    label: ".gradient-brand-vertical",
    desc: "180° vertical — seafoam → sand → peach",
  },
  { cls: "gradient-hero texture-grain", label: ".gradient-hero", desc: "160° — aqua → warm off-white → peach" },
  { cls: "gradient-hero-soft", label: ".gradient-hero-soft", desc: "Soft brand gradient for CTA sections" },
];

export default function DesignSystemPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero texture-grain relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
              Brand Guidelines
            </span>
            <h1 className="mb-6 font-display text-4xl font-semibold text-balance text-foreground md:text-5xl lg:text-6xl">
              Design System
            </h1>
            <p className="text-xl leading-relaxed text-muted-foreground">
              Colors, typography, gradients, and components used across the TechTank TO website.
            </p>
          </div>
        </div>
      </section>

      {/* Color palette */}
      <Section>
        <SectionHeader overline="Colors" title="Color palette" className="mb-8" />

        <div className="space-y-6">
          {/* Brand */}
          <div>
            <p className="mb-2 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">Brand</p>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
              {brandColors.map((color) => (
                <div key={color.name} className="bg-background">
                  <div className={`h-14 ${color.cls}`} />
                  <div className="px-3 py-2.5">
                    <p className="text-xs font-medium text-foreground">{color.label}</p>
                    <code className="text-[10px] text-muted-foreground">{color.hex}</code>
                    <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accent */}
          <div>
            <p className="mb-2 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">Accent</p>
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-6">
              {accentTokens.map((color) => (
                <div key={color.name} className="bg-background">
                  <div className={`h-14 ${color.cls}`} />
                  <div className="px-3 py-2.5">
                    <p className="text-xs font-medium text-foreground">{color.label}</p>
                    <code className="text-[10px] text-muted-foreground">{color.hex}</code>
                    <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Semantic tokens */}
      <Section background="muted">
        <SectionHeader overline="Theming" title="Semantic tokens" className="mb-4" />
        <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
          Every token resolves differently in light and dark mode. Never use raw brand hex values for text, surfaces, or
          borders in components — always use the semantic name.
        </p>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Light panel */}
          <div className="light overflow-hidden rounded-xl border border-border bg-background">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="size-2.5 rounded-full border border-foreground/30 bg-background" />
              <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Light mode
              </span>
            </div>
            {semanticPairs.map((pair) => (
              <div key={pair.bg} className="border-b border-border/60 px-4 py-2.5">
                <div className="mb-1.5 flex items-center gap-2.5">
                  <div className={`size-4 shrink-0 rounded-[3px] border border-foreground/20 ${pair.bgCls}`} />
                  <code className="flex-1 text-[11px] font-semibold text-foreground">bg-{pair.bg}</code>
                  <span className="font-mono text-[10px] text-muted-foreground">{pair.bgAlias}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className={`size-4 shrink-0 rounded-[3px] border border-foreground/20 ${pair.fgCls}`} />
                  <code className="flex-1 text-[11px] text-muted-foreground">text-{pair.fg}</code>
                  <span className="font-mono text-[10px] text-muted-foreground">{pair.fgAlias}</span>
                </div>
              </div>
            ))}
            <div className="border-t border-border px-4 pt-3 pb-1">
              <p className="mb-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Utilities
              </p>
            </div>
            {semanticUtilities.map((u, i) => (
              <div
                key={u.token}
                className={`flex items-center gap-2.5 px-4 py-2${i === semanticUtilities.length - 1 ? " pb-4" : ""}`}
              >
                <div className={`size-4 shrink-0 rounded-[3px] border border-foreground/20 ${u.bgCls}`} />
                <code className="flex-1 text-[11px] font-semibold text-foreground">{u.token}</code>
                <span className="font-mono text-[10px] text-muted-foreground">{u.lightAlias}</span>
              </div>
            ))}
          </div>

          {/* Dark panel */}
          <div className="dark overflow-hidden rounded-xl border border-border bg-background">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="size-2.5 rounded-full border border-foreground/30 bg-background" />
              <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Dark mode
              </span>
            </div>
            {semanticPairs.map((pair) => (
              <div key={pair.bg} className="border-b border-border/60 px-4 py-2.5">
                <div className="mb-1.5 flex items-center gap-2.5">
                  <div className={`size-4 shrink-0 rounded-[3px] border border-foreground/20 ${pair.bgCls}`} />
                  <code className="flex-1 text-[11px] font-semibold text-foreground">bg-{pair.bg}</code>
                  <span className="font-mono text-[10px] text-muted-foreground">{pair.darkBgAlias}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className={`size-4 shrink-0 rounded-[3px] border border-foreground/20 ${pair.fgCls}`} />
                  <code className="flex-1 text-[11px] text-muted-foreground">text-{pair.fg}</code>
                  <span className="font-mono text-[10px] text-muted-foreground">{pair.darkFgAlias}</span>
                </div>
              </div>
            ))}
            <div className="border-t border-border px-4 pt-3 pb-1">
              <p className="mb-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Utilities
              </p>
            </div>
            {semanticUtilities.map((u, i) => (
              <div
                key={u.token}
                className={`flex items-center gap-2.5 px-4 py-2${i === semanticUtilities.length - 1 ? " pb-4" : ""}`}
              >
                <div className={`size-4 shrink-0 rounded-[3px] border border-foreground/20 ${u.bgCls}`} />
                <code className="flex-1 text-[11px] font-semibold text-foreground">{u.token}</code>
                <span className="font-mono text-[10px] text-muted-foreground">{u.darkAlias}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Gradient utilities */}
      <Section>
        <SectionHeader overline="Theming" title="Gradient utilities" className="mb-4" />
        <p className="mb-8 max-w-xl text-sm text-muted-foreground">
          Each gradient has a paired dark variant in CSS — same class name, palette flips automatically.
        </p>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Light panel */}
          <div className="light overflow-hidden rounded-xl border border-border">
            <div className="flex items-center gap-2 border-b border-border bg-background px-4 py-3">
              <div className="size-2.5 rounded-full border border-foreground/30 bg-background" />
              <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Light mode
              </span>
            </div>
            <div className="grid grid-cols-2">
              {gradients.map((g, i) => (
                <div
                  key={g.label}
                  className={`bg-background${i % 2 === 0 ? " border-r border-border" : ""}${i < 2 ? " border-b border-border" : ""}`}
                >
                  <div className={`h-28 w-full ${g.cls}`} />
                  <div className="px-3 py-2.5">
                    <code className="block text-[11px] font-semibold text-foreground">{g.label}</code>
                    <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dark panel */}
          <div className="dark overflow-hidden rounded-xl border border-border">
            <div className="flex items-center gap-2 border-b border-border bg-background px-4 py-3">
              <div className="size-2.5 rounded-full border border-foreground/30 bg-background" />
              <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Dark mode
              </span>
            </div>
            <div className="grid grid-cols-2">
              {gradients.map((g, i) => (
                <div
                  key={g.label}
                  className={`bg-background${i % 2 === 0 ? " border-r border-border" : ""}${i < 2 ? " border-b border-border" : ""}`}
                >
                  <div className={`h-28 w-full ${g.cls}`} />
                  <div className="px-3 py-2.5">
                    <code className="block text-[11px] font-semibold text-foreground">{g.label}</code>
                    <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Typography */}
      <Section background="muted">
        <SectionHeader overline="Typography" title="Type scale" className="mb-12" />
        <div className="max-w-3xl space-y-8">
          <div className="border-b border-border pb-6">
            <p className="mb-3 text-xs tracking-wider text-muted-foreground uppercase">
              Display — Space Grotesk (.font-display)
            </p>
            <p className="font-display text-6xl leading-tight font-semibold text-foreground">Aa Display 6xl</p>
            <p className="mt-2 font-display text-5xl leading-tight font-semibold text-foreground">Aa Display 5xl</p>
            <p className="mt-2 font-display text-4xl leading-tight font-semibold text-foreground">Aa Display 4xl</p>
            <p className="mt-2 font-display text-3xl font-semibold text-foreground">Aa Display 3xl</p>
            <p className="mt-2 font-display text-2xl font-semibold text-foreground">Aa Display 2xl</p>
            <p className="mt-2 font-display text-xl font-semibold text-foreground">Aa Display xl</p>
          </div>
          <div className="border-b border-border pb-6">
            <p className="mb-3 text-xs tracking-wider text-muted-foreground uppercase">Body — Inter (.font-sans)</p>
            <p className="text-xl text-foreground">Text xl — lead paragraphs</p>
            <p className="mt-2 text-base text-foreground">Text base — body copy, default size</p>
            <p className="mt-2 text-sm text-muted-foreground">Text sm — secondary copy, captions</p>
            <p className="mt-2 text-xs text-muted-foreground">Text xs — labels, overlines, metadata</p>
          </div>
          <div>
            <p className="mb-3 text-xs tracking-wider text-muted-foreground uppercase">Special — Overlines</p>
            <span className="inline-block text-xs font-semibold tracking-widest text-ring uppercase">
              Section overline pattern
            </span>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section>
        <SectionHeader overline="Components" title="Buttons" className="mb-12" />
        <div className="space-y-8">
          <div>
            <p className="mb-4 text-sm tracking-wider text-muted-foreground uppercase">Variants</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm tracking-wider text-muted-foreground uppercase">Sizes</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="lg">
                Large
              </Button>
              <Button variant="primary" size="md">
                Medium (default)
              </Button>
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="icon" aria-label="Favorite">
                <Star className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm tracking-wider text-muted-foreground uppercase">With icons</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">
                <Mail className="mr-2 size-4" />
                Email us
              </Button>
              <Button variant="outline">
                Open Media Kit
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button variant="secondary">
                <Download className="mr-2 size-4" />
                Download
              </Button>
              <Button variant="ghost">
                Learn more
                <ExternalLink className="ml-2 size-4" />
              </Button>
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm tracking-wider text-muted-foreground uppercase">States</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" disabled>
                Disabled primary
              </Button>
              <Button variant="outline" disabled>
                Disabled outline
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Tags */}
      <Section background="muted">
        <SectionHeader overline="Components" title="Tags &amp; Badges" className="mb-12" />
        <div className="space-y-6">
          <div>
            <p className="mb-3 text-sm tracking-wider text-muted-foreground uppercase">Variants</p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm tracking-wider text-muted-foreground uppercase">Sizes</p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="default" size="md">
                Medium (default)
              </Badge>
              <Badge variant="default" size="sm">
                Small
              </Badge>
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm tracking-wider text-muted-foreground uppercase">CSS tag utilities</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="tag">tag filled</span>
              <span className="tag-outline">tag outline</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Cards */}
      <Section>
        <SectionHeader overline="Components" title="Cards" className="mb-12" />
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Icon card */}
          <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-ring/10 text-ring">
              <Users className="size-6" />
            </div>
            <h3 className="mb-3 font-display text-xl font-semibold text-foreground">Icon card</h3>
            <p className="leading-relaxed text-muted-foreground">
              Used for feature lists and benefit sections throughout the site.
            </p>
          </div>

          {/* Checklist card — ring tint */}
          <div className="rounded-2xl border border-ring/30 bg-ring/8 p-6 lg:p-8">
            <h3 className="mb-6 font-display text-xl font-semibold text-foreground">Checklist — ring tint</h3>
            <ul className="space-y-3">
              {["Speaker sourcing", "Marketing", "Recording"].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-ring" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Checklist card — amber */}
          <div className="rounded-2xl border border-amber/30 bg-amber/8 p-6 lg:p-8">
            <h3 className="mb-6 font-display text-xl font-semibold text-foreground">Checklist — amber tint</h3>
            <ul className="space-y-3">
              {["Venue", "Food & drinks", "Optional: your speaker"].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-amber-dark" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Stat card */}
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="mb-1 text-sm text-muted-foreground">Stat label</p>
            <p className="font-display text-3xl font-semibold text-foreground">40–120</p>
            <p className="mt-1 text-sm text-muted-foreground">Attendees per event</p>
          </div>

          {/* Hover-link card */}
          <a
            href="/resources/media-kit"
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-ring/50"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-ring/10">
              <Star className="size-6 text-ring" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground transition-colors group-hover:text-ring">Hover-link card</p>
              <p className="text-sm text-muted-foreground">Used for downloadable resources and media kit assets.</p>
            </div>
            <Download className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-ring" />
          </a>
        </div>
      </Section>

      {/* Surfaces */}
      <Section background="muted">
        <SectionHeader overline="Components" title="Surfaces &amp; effects" className="mb-12" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="glass rounded-2xl p-8">
            <Zap className="mb-4 size-8 text-ring" />
            <p className="mb-1 font-semibold text-foreground">.glass</p>
            <p className="text-sm text-muted-foreground">White 55%, blur 20px, saturate 180%</p>
          </div>
          <div className="glass-subtle rounded-2xl p-8">
            <Zap className="mb-4 size-8 text-ring" />
            <p className="mb-1 font-semibold text-foreground">.glass-subtle</p>
            <p className="text-sm text-muted-foreground">White 35%, blur 16px, saturate 150%</p>
          </div>
          <div className="glass-dark rounded-2xl p-8">
            <Zap className="mb-4 size-8 text-seafoam" />
            <p className="mb-1 font-semibold text-white">.glass-dark</p>
            <p className="text-sm text-seafoam/70">Teal-dark 80%, blur 20px, saturate 180%</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="shadow-soft rounded-2xl bg-card p-8">
            <p className="mb-1 font-semibold text-foreground">.shadow-soft</p>
            <p className="text-sm text-muted-foreground">Layered drop shadows, default cards</p>
          </div>
          <div className="shadow-soft-lg rounded-2xl bg-card p-8">
            <p className="mb-1 font-semibold text-foreground">.shadow-soft-lg</p>
            <p className="text-sm text-muted-foreground">Deeper layered shadow for elevated panels</p>
          </div>
        </div>
      </Section>

      {/* Process / Stepper */}
      <Section>
        <SectionHeader overline="Components" title="Process stepper" className="mb-12" />
        <div className="grid gap-6 lg:grid-cols-5">
          {["Initial contact", "Scoping call", "Confirm details", "Marketing kickoff", "Event day"].map((title, i) => (
            <div key={title} className="relative">
              <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-ring font-semibold text-primary-foreground">
                {i + 1}
              </div>
              <h4 className="mb-1 font-semibold text-foreground">{title}</h4>
              <p className="text-sm text-muted-foreground">Step description goes here.</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA section pattern */}
      <Section background="brand-soft">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
            CTA section pattern
          </span>
          <h2 className="mb-4 font-display text-3xl font-semibold text-foreground">Gradient CTA section</h2>
          <p className="mb-8 text-muted-foreground">
            Used at the bottom of every get-involved sub-page. Always ends with a primary action.
          </p>
          <Button variant="primary" size="lg">
            Primary action
          </Button>
        </div>
      </Section>
    </>
  );
}
