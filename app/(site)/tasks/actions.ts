import { cache } from "react";
import { createStaticClient } from "@/utils/supabase/static";
import { contributionTaskSchema, type ContributionTask } from "@/constants/contribution-board";

// Public task-board reads (anon key, no session). These THROW on failure
// rather than returning an empty list, so an outage surfaces via
// `app/tasks/error.tsx` instead of rendering as "every task is taken" (and
// 404-ing every task URL). `cache()` dedupes the detail read between
// `generateMetadata` and the page render.

export const getPublicContributionTasks = cache(async (): Promise<ContributionTask[]> => {
  const supabase = createStaticClient();
  const { data, error } = await supabase.rpc("get_public_contribution_tasks");

  if (error) {
    console.error("getPublicContributionTasks failed:", error.message);
    throw new Error("Could not load the task board.");
  }
  return contributionTaskSchema.array().parse(data ?? []);
});

export const getPublicContributionTask = cache(async (id: string): Promise<ContributionTask | null> => {
  const supabase = createStaticClient();
  const { data, error } = await supabase.rpc("get_public_contribution_task", { p_id: id });

  if (error) {
    // A malformed uuid is a bad URL, not an outage: 404, don't throw.
    if (error.code === "22P02") return null;
    console.error("getPublicContributionTask failed:", error.message);
    throw new Error("Could not load this task.");
  }
  return contributionTaskSchema.array().parse(data ?? [])[0] ?? null;
});
