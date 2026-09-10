import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, ExternalLink, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LumaIcon, MeetupIcon } from "@/components/ui/icons";
import { Section, SectionHeader } from "@/components/ui/section";
import { StatsMarquee } from "@/components/ui/stats-marquee";
import { SponsorsMarquee } from "@/components/ui/sponsors-marquee";
import { ToolsStrip } from "@/components/ui/tools-grid";
import { RoleCard } from "@/components/ui/role-card";
import { roleCardsData } from "@/constants/role-cards";
import { EventCard } from "@/components/ui/event-card";
import { SocialFeed } from "@/components/ui/social-feed";
import { getCoverImage, getCoverVideo, getInstagramPostsByIds } from "@/constants/instagram-posts";
import { getAllLumaEvents } from "./events/actions";

function captionToAlt(caption: string): string {
  const firstLine = caption.split("\n")[0] ?? "";
  const stripped = firstLine.replace(/#[^\s]+/g, "").trim();
  return stripped.length > 0 ? stripped : "TechTank Instagram post";
}

export default async function HomePage() {
  const { upcoming: featuredEvents, past: pastEvents } = await getAllLumaEvents();

  const heroPosts = getInstagramPostsByIds([
    "2026-06-09-DZWPNciI8eO", // Docebo Brainstation (Jun 2026)
    "2026-04-10-DW9vcgiPHx", // Code diversity (Apr 2026)
  ]).map((post) => ({
    id: post.id,
    imageSrc: getCoverImage(post),
    videoSrc: getCoverVideo(post),
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
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      className="absolute inset-0 size-full object-cover object-top"
                    >
                      <source src={heroPosts[0].videoSrc.replace(/\.mp4$/, ".webm")} type="video/webm" />
                      <source src={heroPosts[0].videoSrc} type="video/mp4" />
                    </video>
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
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      className="absolute inset-0 size-full object-cover object-top"
                    >
                      <source src={heroPosts[1].videoSrc.replace(/\.mp4$/, ".webm")} type="video/webm" />
                      <source src={heroPosts[1].videoSrc} type="video/mp4" />
                    </video>
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

          {/* Stats Marquee */}
          <StatsMarquee className="mt-8 py-8" />
        </div>
      </section>

      {/* Social Feed */}
      <Section id="community" background="muted">
        <SectionHeader overline="From the community" title="Real people, real moments" className="mb-8" />
        <SocialFeed />
      </Section>

      {/* Events Section - Upcoming (large) + Past (small) */}
      <Section>
        <SectionHeader overline="Events" title="Recent happenings" className="mb-6" />

        {/* Recent Events - Large featured + smaller cards */}
        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} variant="featured" />
          ))}
        </div>
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {pastEvents.map((event) => (
            <EventCard key={event.id} event={event} variant="compact" />
          ))}
        </div>

        {/* Sponsors */}
        <div className="mb-6">
          <p className="mb-4 text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Hosted and supported by
          </p>
          <SponsorsMarquee className="py-4" />
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" size="md" asChild>
            <a href="https://luma.com/techtank" target="_blank" rel="noopener noreferrer">
              <LumaIcon className="mr-2 size-4" />
              Luma
              <ExternalLink className="ml-2 size-4" />
            </a>
          </Button>
          <Button variant="outline" size="md" asChild>
            <a href="https://meetup.com/techtank-to" target="_blank" rel="noopener noreferrer">
              <MeetupIcon className="mr-2 size-4" />
              Meetup
              <ExternalLink className="ml-2 size-4" />
            </a>
          </Button>
          <Button variant="outline" size="md" asChild>
            <Link href="/events">
              View all
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
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

      {/* Tools (product sponsors) */}
      <Section background="white" className="py-8 lg:py-10">
        <p className="mb-4 text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Sponsored tools we run on
        </p>
        <ToolsStrip />
        <p className="mt-3 text-center text-sm text-muted-foreground">
          <Link href="/get-involved/sponsor#tools" className="underline underline-offset-4 hover:text-foreground">
            Learn about tool sponsorship
          </Link>
        </p>
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
            <Calendar className="absolute top-4 right-4 size-14 text-foreground/15" />
            <div className="relative">
              <span className="mb-2 inline-block text-xs font-semibold tracking-widest text-amber-dark uppercase">
                Show up
              </span>
              <h3 className="mb-2 font-display text-lg font-bold text-foreground lg:text-xl">Upcoming events</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                See what&apos;s coming up and RSVP to the next meetup.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-foreground transition-colors group-hover:text-amber-dark">
                See events
                <ArrowRight className="ml-2 size-4" />
              </span>
            </div>
          </Link>

          <Link
            href="/get-involved"
            className="group glass relative overflow-hidden rounded-xl p-5 transition-all hover:scale-[1.01] lg:p-6"
          >
            <Users className="absolute top-4 right-4 size-14 text-foreground/15" />
            <div className="relative">
              <span className="mb-2 inline-block text-xs font-semibold tracking-widest text-amber-dark uppercase">
                Contribute
              </span>
              <h3 className="mb-2 font-display text-lg font-bold text-foreground lg:text-xl">Get involved</h3>
              <p className="mb-4 text-sm text-muted-foreground">Speak, host, sponsor, or volunteer with the crew.</p>
              <span className="inline-flex items-center text-sm font-semibold text-foreground transition-colors group-hover:text-amber-dark">
                Pick your path
                <ArrowRight className="ml-2 size-4" />
              </span>
            </div>
          </Link>
        </div>
      </Section>
    </>
  );
}
