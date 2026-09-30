import type { Metadata } from "next";
import { AdminContributionBoard } from "@/components/admin/admin-contribution-board";
import { listContributionTasks } from "./actions";

export const metadata: Metadata = {
  title: "Pick a Task · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminContributionBoardPage() {
  const tasks = await listContributionTasks();
  return <AdminContributionBoard initialTasks={tasks} />;
}
