"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BoardRow } from "@/components/contribution/board-row";
import { BoardEmptyState } from "@/components/contribution/board-empty-state";
import {
  CONTRIBUTION_DIFFICULTIES,
  CONTRIBUTION_DIFFICULTY_LABEL,
  CONTRIBUTION_TAGS,
  CONTRIBUTION_TAG_LABEL,
  isTakingApplications,
  type ContributionTask,
} from "@/constants/contribution-board";

type StatusFilter = "active" | "open" | "in_progress" | "done" | "all";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "active", label: "In play" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "all", label: "Everything" },
];

const DISCIPLINE_OPTIONS = [
  { value: "", label: "All disciplines" },
  ...CONTRIBUTION_TAGS.map((tag) => ({ value: tag, label: CONTRIBUTION_TAG_LABEL[tag] })),
];

const EFFORT_OPTIONS = [
  { value: "", label: "Any effort" },
  ...CONTRIBUTION_DIFFICULTIES.map((difficulty) => ({
    value: difficulty,
    label: CONTRIBUTION_DIFFICULTY_LABEL[difficulty],
  })),
];

function matchesStatus(task: ContributionTask, status: StatusFilter): boolean {
  if (status === "all") return true;
  if (status === "active") return task.status !== "done";
  return task.status === status;
}

function matchesQuery(task: ContributionTask, q: string): boolean {
  if (q === "") return true;
  const needle = q.toLowerCase();
  return task.title.toLowerCase().includes(needle) || task.summary.toLowerCase().includes(needle);
}

function countLabel(open: number, shown: number): string {
  const word = (n: number) => (n === 1 ? "task" : "tasks");
  if (open === 0) return `${shown} ${word(shown)}`;
  if (open === shown) return `${open} ${word(open)} open for the taking`;
  return `${shown} ${word(shown)}, ${open} open for the taking`;
}

interface ContributionBoardProps {
  tasks: ContributionTask[];
}

/**
 * The public contribution board: a filterable, GitHub-issues-style list.
 * Filtering runs client-side over the tasks handed down by the server
 * (local state, like the events browser) so the page stays a single
 * request.
 */
export function ContributionBoard({ tasks }: ContributionBoardProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("active");
  const [discipline, setDiscipline] = useState("");
  const [effort, setEffort] = useState("");

  const filtered = useMemo(
    () =>
      tasks.filter(
        (task) =>
          matchesStatus(task, status) &&
          matchesQuery(task, query) &&
          (discipline === "" || task.tags.includes(discipline)) &&
          (effort === "" || task.difficulty === effort),
      ),
    [tasks, status, query, discipline, effort],
  );

  const hasActiveFilters = query !== "" || status !== "active" || discipline !== "" || effort !== "";
  const shownOpenCount = filtered.filter(isTakingApplications).length;

  const clearFilters = () => {
    setQuery("");
    setStatus("active");
    setDiscipline("");
    setEffort("");
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 md:flex-row md:items-center">
        <div className="md:w-64">
          <Input
            type="search"
            value={query}
            placeholder="Search tasks"
            aria-label="Search tasks"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:flex-1">
          <Select
            aria-label="Filter by status"
            value={status}
            options={STATUS_OPTIONS}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
          />
          <Select
            aria-label="Filter by discipline"
            value={discipline}
            options={DISCIPLINE_OPTIONS}
            onChange={(e) => setDiscipline(e.target.value)}
          />
          <Select
            aria-label="Filter by effort"
            value={effort}
            options={EFFORT_OPTIONS}
            onChange={(e) => setEffort(e.target.value)}
          />
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="shrink-0 cursor-pointer">
            Clear
          </Button>
        )}
      </div>

      {/* Count */}
      {filtered.length > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">{countLabel(shownOpenCount, filtered.length)}</p>
      )}

      {/* List */}
      {filtered.length > 0 ? (
        <ul className="space-y-3">
          {filtered.map((task) => (
            <BoardRow key={task.id} task={task} />
          ))}
        </ul>
      ) : (
        <BoardEmptyState hasActiveFilters={hasActiveFilters} />
      )}
    </div>
  );
}
