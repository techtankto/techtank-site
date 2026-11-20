import { stats } from "@/constants/stats";
import { cn } from "@/utils/theme";

const items = [
  { value: stats.events, label: "TechTank events" },
  { value: stats.avgAttendance, label: "Attendees per event" },
  { value: stats.cadence, label: "Cadence" },
  { value: `Since ${stats.since}`, label: "Serving Toronto tech" },
];

export function StatsRow({ className }: { className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-6 sm:grid-cols-4", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center text-center">
          <dt className="order-2 text-xs text-muted-foreground">{item.label}</dt>
          <dd className="order-1 font-display text-xl font-bold text-foreground lg:text-2xl">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
