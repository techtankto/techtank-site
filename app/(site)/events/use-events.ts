import { useEffect, useState } from "react";
import { events as curatedEvents } from "@/constants/events";
import { lumaEvents as scrapedLumaEvents } from "@/constants/luma-events";
import type { Event } from "@/types/event";
import { mergeEventSources } from "@/utils/events";

import { getAllLumaEvents } from "./actions";

/**
 * Every event the site knows about, shared by the `/events` page and the
 * homepage so they never disagree. Hand-curated entries win, then the scraped
 * archive, then the live Luma fetch. Curated and archived events are available
 * on the first render; live ones arrive once the server action returns.
 */
export function useEvents(): { upcoming: Event[]; all: Event[] } {
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [past, setPast] = useState<Event[]>([]);

  useEffect(() => {
    getAllLumaEvents().then((results) => {
      setUpcoming(results.upcoming);
      setPast(results.past);
    });
  }, []);

  const all = mergeEventSources([curatedEvents, scrapedLumaEvents, [...upcoming, ...past]]);
  return { upcoming, all };
}
