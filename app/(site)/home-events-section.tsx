import { getAllLumaEvents } from "./events/actions";
import { EventCard } from "@/components/ui/event-card";

export async function HomeEventsSection() {
  const { past: pastLumaEvents, upcoming: lumaEvents } = await getAllLumaEvents();

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
