import type { Metadata } from "next";
import { Suspense } from "react";
import { Section } from "@/components/ui/section";
import { ContributionBoard } from "@/components/contribution/contribution-board";
import { ContributionBoardSkeleton } from "@/components/contribution/contribution-board-skeleton";
import { getPublicContributionTasks } from "./actions";

export const metadata: Metadata = {
  title: "Pick a Task",
  description:
    "Concrete, bite-sized tasks the TechTank community needs a hand with, from photography and design to dev and logistics. Browse what's open and pick one up.",
};

// The board reflects live admin edits, so render on request.
export const dynamic = "force-dynamic";

/**
 * The board's data is streamed behind a Suspense boundary declared
 * *inside* this page rather than via a `loading.tsx`. A segment-level
 * `loading.tsx` would also wrap `[id]`, and streaming commits a 200
 * before `notFound()` can run — turning every missing task into a
 * soft-404. Scoping the boundary here keeps the hero instant and the
 * detail route's 404 honest.
 */
async function TaskBoard() {
  const tasks = await getPublicContributionTasks();
  return <ContributionBoard tasks={tasks} />;
}

export default function PickATaskPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero texture-grain relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
              Pick a task
            </span>
            <h1 className="mb-6 font-display text-4xl font-semibold text-balance text-foreground md:text-5xl lg:text-6xl">
              Grab something and help build TechTank
            </h1>
            <p className="text-xl leading-relaxed text-muted-foreground">
              Real, bite-sized tasks the community needs a hand with, from photographing a Build Night to shipping a
              small feature. Find one that fits, raise your hand, and we&rsquo;ll pair you with it.
            </p>
            <p className="mt-4 text-base text-muted-foreground">
              Tasks go to people in the TechTank Slack, so you&rsquo;ll connect your account to apply.{" "}
              <a href="/links/slack" className="font-medium text-ring underline">
                Not in Slack yet?
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Task board */}
      <Section>
        <Suspense fallback={<ContributionBoardSkeleton />}>
          <TaskBoard />
        </Suspense>
      </Section>
    </>
  );
}
