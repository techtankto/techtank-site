import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import { StatsRow } from "@/components/ui/stats-row";
import { SponsorsMarquee } from "@/components/ui/sponsors-marquee";
import { ToolsStrip } from "@/components/ui/tools-grid";
import { RoleCard } from "@/components/ui/role-card";
import { roleCardsData } from "@/constants/role-cards";
import { SocialFeed } from "@/components/ui/social-feed";
import { SlackJoinSection } from "@/components/ui/slack-join-section";
import { slackChannels, slackHighlights, slackSection } from "@/constants/slack-preview";
import { AutoplayVideo } from "@/components/ui/autoplay-video";
import {
  getCoverImage,
  getCoverVideo,
  getCoverVideoDescription,
  getInstagramPostsByIds,
} from "@/constants/instagram-posts";
import { heroPostKeys } from "@/constants/instagram-pins";
import { HomeEventsSection } from "./home-events-section";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

function captionToAlt(caption: string): string {
  const firstLine = caption.split("\n")[0] ?? "";
  const stripped = firstLine.replace(/#[^\s]+/g, "").trim();
  return stripped.length > 0 ? stripped : "TechTank Instagram post";
}

export default async function HomePage() {
  const heroPosts = getInstagramPostsByIds([...heroPostKeys]).map((post) => ({
    id: post.id,
    imageSrc: getCoverImage(post),
    videoSrc: getCoverVideo(post),
    videoDescription: getCoverVideoDescription(post),
    alt: captionToAlt(post.caption),
  }));

  return (
    <>
      {/* Hero Section - Left aligned text, stacked overlapping photos right */}
      <section className="gradient-hero texture-grain relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-8 py-12 lg:px-8 lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-6">
            {/* Left: Text content */}
            <div className="py-8 lg:max-w-xl lg:py-12">
              <span className="tag mb-4">Toronto &middot; Year-round &middot; Inclusive</span>
              <h1 className="mb-6 font-display text-4xl font-semibold text-balance text-foreground md:text-5xl lg:text-6xl">
                Toronto&apos;s home for tech community
              </h1>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground lg:max-w-md">
                Tech talks, build nights, panels, socials, sports, and more—hosted at companies across the city.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="md" asChild>
                  <Link href="/events">See events</Link>
                </Button>
                <Button variant="outline" size="md" asChild>
                  <Link href="/get-involved">Get involved</Link>
                </Button>
              </div>
            </div>

            {/* Staggered overlapping portrait cards (inline, transform-based) */}
            <div className="flex items-start justify-center pb-8">
              {/* First card — tilted CCW, nudged down */}
              {heroPosts[0] && (
                <div className="photo-frame relative aspect-4/5 w-[45%] translate-y-6 -rotate-2 overflow-hidden shadow-xl transition-transform duration-300 hover:scale-[1.02] lg:w-[55%]">
                  {heroPosts[0].videoSrc ? (
                    <AutoplayVideo
                      src={heroPosts[0].videoSrc}
                      poster={heroPosts[0].imageSrc}
                      description={heroPosts[0].videoDescription}
                      preload="auto"
                      className="absolute inset-0"
                      videoClassName="object-top"
                    />
                  ) : heroPosts[0].imageSrc ? (
                    <Image
                      src={heroPosts[0].imageSrc}
                      alt={heroPosts[0].alt}
                      fill
                      priority
                      sizes="(min-width: 1024px) 28vw, (min-width: 640px) 44vw, 50vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
              )}
              {/* Second card — overlaps via negative margin, tilted CW */}
              {heroPosts[1] && (
                <div className="photo-frame relative z-10 ml-[-10%] aspect-4/5 w-[45%] rotate-2 overflow-hidden shadow-xl transition-transform duration-300 hover:scale-[1.02] lg:w-[55%]">
                  {heroPosts[1].videoSrc ? (
                    <AutoplayVideo
                      src={heroPosts[1].videoSrc}
                      poster={heroPosts[1].imageSrc}
                      description={heroPosts[1].videoDescription}
                      preload="auto"
                      className="absolute inset-0"
                      videoClassName="object-top"
                    />
                  ) : heroPosts[1].imageSrc ? (
                    <Image
                      src={heroPosts[1].imageSrc}
                      alt={heroPosts[1].alt}
                      fill
                      sizes="(min-width: 1024px) 28vw, (min-width: 640px) 44vw, 50vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <StatsRow className="mt-8 py-8" />
        </div>
      </section>

      {/* Sponsors and sponsored tools */}
      <Section background="white" className="py-8 lg:py-10">
        <p className="mb-4 text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Hosted and supported by
        </p>
        <SponsorsMarquee className="py-4" />

        <p className="mt-8 mb-4 text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Sponsored tools we run on
        </p>
        <ToolsStrip />
        <p className="mt-3 text-center text-sm text-muted-foreground">
          <Link href="/get-involved/sponsor#tools" className="underline underline-offset-4 hover:text-foreground">
            Learn about tool sponsorship
          </Link>
        </p>
      </Section>

      {/* Social Feed */}
      <Section id="community" background="muted">
        <SectionHeader overline="From the community" title="Real people, real moments" className="mb-8" />
        <SocialFeed />
      </Section>

      {/* Slack community */}
      <Section id="slack" background="white">
        <SlackJoinSection
          {...slackSection}
          channels={slackChannels}
          highlights={slackHighlights}
          logo={{ src: "/images/logos/dark.svg", alt: "TechTank TO", width: 691, height: 157 }}
        />
      </Section>

      {/* Events: 2 large + 4 small, the /events Cards layout */}
      <Section id="events">
        <HomeEventsSection />
      </Section>

      {/* Ways to Get Involved */}
      <Section background="brand">
        <SectionHeader
          overline="There's a spot for you"
          title="Jump in"
          description="TechTank runs on people who show up."
          className="mb-8"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roleCardsData.map((role) => (
            <RoleCard key={role.role} {...role} />
          ))}
        </div>
      </Section>

      {/* Values Teaser */}
      <Section>
        <div className="glass mx-auto max-w-2xl rounded-2xl p-6 text-center lg:p-10">
          <span className="tag-outline mb-4 inline-block text-sm">What we&apos;re about</span>
          <h2 className="mb-4 font-display text-2xl font-bold text-foreground lg:text-3xl">Community first. Always.</h2>
          <p className="mb-6 text-muted-foreground">
            No gatekeeping—just people who genuinely want to learn, share, and lift each other up.
          </p>
          <Button variant="primary" asChild>
            <Link href="/about">More about us</Link>
          </Button>
        </div>
      </Section>

      {/* Two-flow CTA */}
      <Section id="join-us" background="brand-vertical" className="py-8 lg:py-12">
        <SectionHeader
          overline="Take the next step"
          title="Where to next?"
          description="Two ways to plug in right now."
          className="mb-8"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/events"
            className="group glass relative overflow-hidden rounded-xl p-5 transition-all hover:scale-[1.01] lg:p-6"
          >
            <Calendar className="absolute top-4 right-4 size-14 text-foreground opacity-15" aria-hidden="true" />
            <div className="relative">
              <span className="mb-2 inline-block text-xs font-semibold tracking-widest text-overline uppercase">
                Show up
              </span>
              <h3 className="mb-2 font-display text-lg font-bold text-foreground lg:text-xl">Upcoming events</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                See what&apos;s coming up and RSVP to the next meetup.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-foreground transition-colors group-hover:text-overline">
                See events
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </span>
            </div>
          </Link>

          <Link
            href="/get-involved"
            className="group glass relative overflow-hidden rounded-xl p-5 transition-all hover:scale-[1.01] lg:p-6"
          >
            <Users className="absolute top-4 right-4 size-14 text-foreground opacity-15" aria-hidden="true" />
            <div className="relative">
              <span className="mb-2 inline-block text-xs font-semibold tracking-widest text-overline uppercase">
                Contribute
              </span>
              <h3 className="mb-2 font-display text-lg font-bold text-foreground lg:text-xl">Get involved</h3>
              <p className="mb-4 text-sm text-muted-foreground">Speak, host, sponsor, or volunteer with the crew.</p>
              <span className="inline-flex items-center text-sm font-semibold text-foreground transition-colors group-hover:text-overline">
                Pick your path
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>
      </Section>
    </>
  );
}
