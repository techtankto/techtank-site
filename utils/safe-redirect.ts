const FALLBACK = "/admin/tasks";

/**
 * Only follow a same-origin `?redirect=` path — otherwise an open redirect
 * (`https://evil.example`, `javascript:`, or protocol-relative `//host`)
 * could carry a freshly authenticated organizer off-site.
 */
export function safeRedirect(value: string | null): string {
  if (!value) return FALLBACK;
  if (!value.startsWith("/") || value.startsWith("//")) return FALLBACK;
  return value;
}
