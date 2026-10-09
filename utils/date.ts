export const APP_TIME_ZONE = "America/Toronto";

const HAS_UTC_OFFSET = /(Z|[+-]\d{2}:?\d{2})$/i;

export function formatInAppTimeZone(iso: string, options: Intl.DateTimeFormatOptions, locale = "en-US"): string {
  if (HAS_UTC_OFFSET.test(iso)) {
    return new Date(iso).toLocaleString(locale, { ...options, timeZone: APP_TIME_ZONE });
  }
  return new Date(`${iso}Z`).toLocaleString(locale, { ...options, timeZone: "UTC" });
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
