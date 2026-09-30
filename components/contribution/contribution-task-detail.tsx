import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/components/contribution/status-badge";
import { TaskMeta } from "@/components/contribution/task-meta";
import { ContributionMarkdown } from "@/components/contribution/contribution-markdown";
import { ApplyPanel } from "@/components/contribution/apply-panel";
import { OwnershipNote } from "@/components/contribution/ownership-note";
import { WhatHappensNext } from "@/components/contribution/what-happens-next";
import { isTakingApplications, type ContributionTask } from "@/constants/contribution-board";

interface ContributionTaskDetailProps {
  task: ContributionTask;
}

export function ContributionTaskDetail({ task }: ContributionTaskDetailProps) {
  return (
    // Same container as the header and <Section>: max-w-7xl px-6 lg:px-8,
    // so the page edges line up with the navbar.
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <Link
        href="/tasks"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to the board
      </Link>

      {/* minmax(0,1fr) so long words/code can't blow the column out. */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
        {/* Main */}
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <StatusBadge task={task} />
            {task.assigned_name && (
              <span className="text-sm text-muted-foreground">
                Picked up by <span className="font-medium text-foreground">{task.assigned_name}</span>
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl font-semibold text-balance text-foreground md:text-4xl">{task.title}</h1>

          {/* The column spans the full container width, so prose is capped
              at a readable measure rather than running to ~90 characters. */}
          {task.summary && (
            <p className="mt-3 max-w-prose text-lg leading-relaxed text-muted-foreground">{task.summary}</p>
          )}

          <div className="mt-5">
            <TaskMeta task={task} />
          </div>

          {task.body_markdown && (
            <div className="mt-8 max-w-prose">
              <ContributionMarkdown content={task.body_markdown} />
            </div>
          )}

          <OwnershipNote />
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <ApplyPanel task={task} />
          {isTakingApplications(task) && <WhatHappensNext />}
        </div>
      </div>
    </div>
  );
}
