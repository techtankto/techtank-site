import { Marquee } from "@/components/ui/marquee";
import { stats } from "@/constants/stats";

const items = [
  { value: stats.events, label: "TechTank events" },
  { value: stats.avgAttendance, label: "Attendees per event" },
  { value: stats.cadence, label: "Cadence" },
  { value: `Since ${stats.since}`, label: "Serving Toronto tech" },
];

export function StatsMarquee({ className }: { className?: string }) {
  return (
    <Marquee
      speed="normal"
      pauseLabel="Pause scrolling TechTank stats"
      resumeLabel="Resume scrolling TechTank stats"
      className={className}
      gap="xl"
      copies={4}
    >
      {items.map((item) => (
        <div key={item.label} className="flex shrink-0 flex-col items-center text-center">
          <span className="font-display text-xl font-bold text-foreground lg:text-2xl">{item.value}</span>
          <span className="text-xs whitespace-nowrap text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </Marquee>
  );
}
