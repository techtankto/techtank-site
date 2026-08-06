import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContributionTaskDetail } from "@/components/contribution/contribution-task-detail";
import { getPublicContributionTask } from "../actions";

export const dynamic = "force-dynamic";

interface TaskPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TaskPageProps): Promise<Metadata> {
  const { id } = await params;
  const task = await getPublicContributionTask(id);

  if (!task) return { title: "Task not found" };

  // Sharing a specific task is the point, so the card describes the
  // task rather than falling back to the site-wide copy.
  const description = task.summary || "A way to help run TechTank TO.";
  return {
    title: task.title,
    description,
    openGraph: { title: `${task.title} — TechTank`, description },
  };
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;
  const task = await getPublicContributionTask(id);

  if (!task) notFound();

  return <ContributionTaskDetail task={task} />;
}
