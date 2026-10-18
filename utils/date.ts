const APP_TIME_ZONE = "America/Toronto";

export function formatInAppTimeZone(iso: string, options: Intl.DateTimeFormatOptions, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: APP_TIME_ZONE }).format(new Date(iso));
}

export function formatEventDate(iso: string): string {
  return formatInAppTimeZone(iso, { month: "short", day: "numeric", year: "numeric" });
}

export function formatEventTime(iso: string): string {
  return formatInAppTimeZone(iso, { hour: "numeric", minute: "2-digit" });
}

export function toAppDateKey(iso: string): string {
  return formatInAppTimeZone(iso, { year: "numeric", month: "2-digit", day: "2-digit" }, "en-CA");
}
