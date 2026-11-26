// The Luma API returns every event on the calendar, including ones hidden from
// the public calendar page, and returns exact addresses even when the organizer
// limited them to registered guests. These rules keep the site from showing
// more than Luma itself shows the public.

interface VisibilityFields {
  start_at: string;
  /** "public" or "private"; private events are hidden from the public calendar. */
  visibility?: string | null;
  /** "public" or "guests-only"; guests-only addresses are shown to registered guests only. */
  location_visibility?: string | null;
}

/**
 * Private events stay hidden until they've happened. Once past, showing them
 * in the archive does no harm, and some (like anniversaries) are worth showing.
 * Anything other than an explicit "public" counts as private, so a new value
 * from Luma fails closed.
 */
export function isListable(event: VisibilityFields, now: Date = new Date()): boolean {
  const hasStarted = new Date(event.start_at).getTime() <= now.getTime();
  return hasStarted || event.visibility === "public";
}

/**
 * A guests-only address is never shown, past or upcoming: it may be someone's
 * home or a private office. Anything other than an explicit "public" counts as
 * guests-only.
 */
export function isLocationPublic(event: VisibilityFields): boolean {
  return event.location_visibility === "public";
}

/**
 * Whether an event happens online. Only this flag ever reaches the site: Luma
 * shows meeting links to registered guests only, and online series reuse one
 * standing link, so publishing it would let anyone join future sessions.
 */
export function isOnlineEvent(event: { location_type?: string | null; meeting_url?: string | null }): boolean {
  return event.location_type ? event.location_type !== "offline" : Boolean(event.meeting_url);
}
