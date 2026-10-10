/** Prefer a thrown error's own message; fall back to a friendly default. */
export function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}
