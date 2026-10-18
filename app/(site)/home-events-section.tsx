"use client";

import { useEffect, useState } from "react";
import type { Event } from "@/types/event";
import { getAllLumaEvents } from "./events/actions";
import { EventCard } from "@/components/ui/event-card";

export function HomeEventsSection() {
  const [lumaEvents, setLumaEvents] = useState<Event[]>([]);
  const [pastLumaEvents, setPastLumaEvents] = useState<Event[]>([]);

  useEffect(() => {
    getAllLumaEvents().then((results) => {
      setLumaEvents(results.upcoming);
      setPastLumaEvents(results.past);
    });
  }, []);

  return (
    <>
      {/* Recent Events - Large featured + smaller cards */}
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        {lumaEvents.map((event) => (
          <EventCard key={event.id} event={event} variant="featured" />
        ))}
      </div>
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {pastLumaEvents.map((event) => (
          <EventCard key={event.id} event={event} variant="compact" />
        ))}
      </div>
    </>
  );
}
