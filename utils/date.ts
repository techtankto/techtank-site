const APP_TIME_ZONE = "America/Toronto";

const UTC_OFFSET_SUFFIX = /(?:Z|[+-]\d{2}:?\d{2})$/i;

export function formatInAppTimeZone(iso: string, options: Intl.DateTimeFormatOptions, locale = "en-US"): string {
  const hasOffset = UTC_OFFSET_SUFFIX.test(iso);
  const date = new Date(hasOffset || !iso.includes("T") ? iso : `${iso}Z`);
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: hasOffset ? APP_TIME_ZONE : "UTC" }).format(date);
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
