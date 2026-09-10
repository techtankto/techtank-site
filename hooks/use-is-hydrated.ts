import { useSyncExternalStore } from "react";

/**
 * Subscribe callback for the hydration store. Hydration happens once and the
 * value never changes after, so there is nothing to listen to and nothing to
 * tear down.
 *
 * @returns A no-op unsubscribe function.
 */
const subscribe = () => () => {};

/** Snapshot used once the client has hydrated. */
const getSnapshot = () => true;

/** Snapshot used for the server render and the hydration render that matches it. */
const getServerSnapshot = () => false;

/**
 * Reports whether the component has hydrated on the client.
 *
 * Returns `false` for the server render and for the hydration render that has
 * to match it, then `true` for every render after. Use it to gate output that
 * cannot be produced on the server — a resolved `next-themes` theme, a
 * `document`-backed portal — and render a placeholder until it flips.
 *
 * Backed by `useSyncExternalStore` rather than a `useState` + `useEffect`
 * mounted flag. Both give the same two-pass render, but this one does not call
 * `setState` inside an effect, which the `react/set-state-in-effect` lint rule
 * flags as a cascading render.
 *
 * @returns `true` once hydrated, `false` on the server and during hydration.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
