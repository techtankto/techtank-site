"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCardsView } from "@/components/ui/event-browser";
import { SectionHeader } from "@/components/ui/section";
import { sortForDisplay } from "@/utils/events";

import { useEvents } from "./events/use-events";

// Two rows of the /events Cards layout: 2 large cards, then 4 small ones.
const HOME_EVENT_COUNT = 6;

export function HomeEventsSection() {
  const { all } = useEvents();
  // Upcoming first, so the large cards go to what's next, topped up with the
  // most recent past events.
  const events = sortForDisplay(all).slice(0, HOME_EVENT_COUNT);

  if (events.length === 0) return null;

  return (
    <>
      <SectionHeader overline="Events" title="Recent happenings" className="mb-6" />
      <EventCardsView events={events} />
      <div className="mt-8 flex justify-center">
        <Button variant="outline" size="md" asChild>
          <Link href="/events">
            View all events
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </>
  );
}
