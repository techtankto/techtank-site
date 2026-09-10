import posthog from "posthog-js";

export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (!posthog.__loaded) return;
  posthog.capture(name, properties);
}
