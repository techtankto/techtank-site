"use client";

import { useCallback, useState } from "react";
import { errorMessage } from "@/utils/error-message";

export type MutationStatus = "idle" | "pending" | "success" | "error";

interface Mutation<Args extends unknown[], Data> {
  status: MutationStatus;
  isPending: boolean;
  error: string | null;
  data: Data | undefined;
  mutate: (...args: Args) => Promise<Data | undefined>;
  reset: () => void;
}

/**
 * A tiny TanStack-Query-style mutation: one `status` (+ `error`, `data`) in
 * place of separate submitting/submitted/error booleans. `mutate` resolves
 * to the result, or `undefined` if `fn` threw. `fallbackError` is the message
 * shown when the thrown error carries none of its own.
 */
export function useMutation<Args extends unknown[], Data>(
  fn: (...args: Args) => Promise<Data>,
  fallbackError = "Something went wrong. Please try again.",
): Mutation<Args, Data> {
  const [status, setStatus] = useState<MutationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Data | undefined>(undefined);

  const mutate = useCallback(
    async (...args: Args) => {
      setStatus("pending");
      setError(null);
      try {
        const result = await fn(...args);
        setData(result);
        setStatus("success");
        return result;
      } catch (err) {
        setError(errorMessage(err, fallbackError));
        setStatus("error");
        return undefined;
      }
    },
    [fn, fallbackError],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setData(undefined);
  }, []);

  return { status, isPending: status === "pending", error, data, mutate, reset };
}
