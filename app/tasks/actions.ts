import { cache } from "react";
import { createStaticClient } from "@/utils/supabase/static";
import type { ContributionTask } from "@/constants/contribution-board";

/**
 * Public task-board reads. Anonymous (anon key, no session) — the
 * SECURITY DEFINER read RPCs are granted to `anon`.
 *
 * These deliberately THROW on failure rather than returning an empty
 * list: swallowing the error made an outage render as "Every task is
 * spoken for", and made every task URL 404, which is a de-indexing
 * signal. Throwing hands control to `app/tasks/error.tsx`, which can
 * say something true. `null` from the single-task read means "no such
 * task" and nothing else, so `notFound()` stays accurate.
 *
 * Not a `"use server"` module: both are called only from Server
 * Components, so there's no reason to publish them as action
 * endpoints. `cache()` dedupes the detail read between
 * `generateMetadata` and the page render.
 */

export const getPublicContributionTasks = cache(async (): Promise<ContributionTask[]> => {
  const supabase = createStaticClient();
  const { data, error } = await supabase.rpc("get_public_contribution_tasks");

  if (error) {
    console.error("getPublicContributionTasks failed:", error.message);
    throw new Error("Could not load the task board.");
  }
  return (data ?? []) as ContributionTask[];
});

export const getPublicContributionTask = cache(async (id: string): Promise<ContributionTask | null> => {
  const supabase = createStaticClient();
  const { data, error } = await supabase.rpc("get_public_contribution_task", { p_id: id });

  if (error) {
    // A malformed uuid is a bad URL, not an outage: 404 rather than
    // blowing up the whole route.
    if (error.code === "22P02") return null;
    console.error("getPublicContributionTask failed:", error.message);
    throw new Error("Could not load this task.");
  }
  const rows = (data ?? []) as ContributionTask[];
  return rows[0] ?? null;
});
