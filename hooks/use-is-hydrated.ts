import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Returns `false` for the server render and the hydration render that must
 * match it, then `true` after. Uses `useSyncExternalStore` instead of a
 * `setState` in an effect, which the `react/set-state-in-effect` lint rule
 * flags.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
