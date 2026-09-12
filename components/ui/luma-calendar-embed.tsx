"use client";

import { useTheme } from "next-themes";
import { THEMES } from "@/constants/theme";
import { useIsHydrated } from "@/hooks/use-is-hydrated";

type LumaCalendarEmbedProps = {
  calendarId: string;
  className?: string;
};

export function LumaCalendarEmbed({ calendarId, className }: LumaCalendarEmbedProps) {
  const { resolvedTheme } = useTheme();
  const hydrated = useIsHydrated();

  if (!hydrated) {
    return <div className={className} />;
  }

  const lt = resolvedTheme === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT;

  return (
    <iframe
      key={lt}
      allowFullScreen
      className={className}
      title="TechTank TO events calendar"
      src={`https://lu.ma/embed/calendar/${calendarId}/events?lt=${lt}`}
    />
  );
}
