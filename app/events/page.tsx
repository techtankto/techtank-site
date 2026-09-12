import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LumaIcon, MeetupIcon } from "@/components/ui/icons";
import { Section, SectionHeader } from "@/components/ui/section";
import { EventBrowser } from "@/components/ui/event-browser";
import { LumaCalendarEmbed } from "@/components/ui/luma-calendar-embed";
import { DualCTA } from "@/components/ui/dual-cta";
import { ContactCard } from "@/components/ui/contact-card";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { events } from "@/constants/events";

import { getAllLumaEvents } from "./actions";

export const metadata: Metadata = {
  title: "Events",
  description:
    "All TechTank TO events — upcoming meetups and past recaps. Year-round in-person events in Toronto since 2023.",
};

export default async function EventsPage() {
  const LUMA_CALENDAR_ID = process.env.LUMA_CALENDAR_ID;
  const { upcoming: lumaEvents, past: pastLumaEvents } = await getAllLumaEvents();
  const allLumaEvents = [...lumaEvents, ...pastLumaEvents];

  const staticLumaSlugs = new Set(
    events
      .filter((e) => e.eventUrl?.includes("lu.ma/") || e.eventUrl?.includes("luma.com/"))
      .map((e) => {
        const url = e.eventUrl!;
        const parts = url.split("/");
        return parts[parts.length - 1].split("?")[0];
      }),
  );

  const mergedEvents = [...events];
  for (const lumaEvent of allLumaEvents) {
    if (!lumaEvent.eventUrl) continue;
    const parts = lumaEvent.eventUrl.split("/");
    const slug = parts[parts.length - 1].split("?")[0];

    if (!staticLumaSlugs.has(slug)) {
      mergedEvents.push(lumaEvent);
    }
  }

  // Sort descending by date
  mergedEvents.sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime());

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero texture-grain relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
                TechTank TO
              </span>
              <h1 className="mb-4 font-display text-4xl font-semibold text-balance text-foreground md:text-5xl lg:text-6xl">
                All Events
              </h1>
              <p className="text-xl text-muted-foreground">
                RSVP to what&apos;s next — and scroll back through the talks, photos, and recaps from every meetup
                we&apos;ve hosted since 2023.
              </p>
            </div>
            <div className="shrink-0">
              <p className="text-sm font-semibold text-foreground">{mergedEvents.length} EVENTS · SINCE 2023</p>
            </div>
          </div>
        </div>
      </section>

      {/* Luma Calendar Embed Section */}
      <Section className="bg-[#f7f8f9] text-center dark:bg-[#212325]">
        <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">Next Up</span>
        <h2 className="mb-6 font-display text-3xl font-semibold text-foreground">Subscribe on Luma</h2>
        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
          Subscribe on Luma to get notified when new events are announced.
        </p>
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          <Button variant="primary" asChild>
            <TrackedLink
              href="https://lu.ma/techtank"
              target="_blank"
              rel="noopener noreferrer"
              event="events_cta_click"
              properties={{ platform: "luma" }}
            >
              <LumaIcon className="mr-2 size-4" />
              Follow us on Luma
              <ExternalLink className="ml-2 size-4" />
            </TrackedLink>
          </Button>
          <Button variant="outline" asChild>
            <TrackedLink
              href="https://meetup.com/techtank-to"
              target="_blank"
              rel="noopener noreferrer"
              event="events_cta_click"
              properties={{ platform: "meetup" }}
            >
              <MeetupIcon className="mr-2 size-4" />
              Follow us on Meetup
              <ExternalLink className="ml-2 size-4" />
            </TrackedLink>
          </Button>
        </div>
        {LUMA_CALENDAR_ID ? (
          <div className="flex w-full justify-center">
            <LumaCalendarEmbed
              calendarId={LUMA_CALENDAR_ID}
              className="h-300 w-full overflow-hidden sm:h-250 md:h-225 md:w-3/4 lg:h-200"
            />
          </div>
        ) : (
          <div className="flex w-full justify-center">
            <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Luma calendar is unavailable (missing environment variables).
            </p>
          </div>
        )}
      </Section>

      {/* All Events */}
      <Section>
        <SectionHeader
          overline="All events"
          title="Event archive"
          description="Browse, filter, and search all TechTank meetups."
          className="mb-12"
        />
        <EventBrowser events={mergedEvents} />
      </Section>

      {/* Dual CTA */}
      <Section background="brand-soft">
        <DualCTA />
      </Section>

      {/* Contact */}
      <Section>
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
            Get in touch
          </span>
          <h2 className="mb-4 font-display text-3xl font-semibold text-foreground">Questions about events?</h2>
        </div>
        <div className="mx-auto max-w-xl">
          <ContactCard context="For hosting, sponsorship, and media inquiries." />
        </div>
      </Section>
    </>
  );
}
