"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ContributionMarkdown } from "@/components/contribution/contribution-markdown";
import {
  CONTRIBUTION_DIFFICULTIES,
  CONTRIBUTION_DIFFICULTY_DURATION,
  CONTRIBUTION_DIFFICULTY_LABEL,
  CONTRIBUTION_STATUSES,
  CONTRIBUTION_STATUS_LABEL,
  CONTRIBUTION_TAGS,
  CONTRIBUTION_TAG_LABEL,
  type AdminContributionTask,
  type ContributionDifficulty,
  type ContributionStatus,
} from "@/constants/contribution-board";
import type { SaveContributionTaskInput } from "@/app/admin/tasks/actions";

const STATUS_OPTIONS = CONTRIBUTION_STATUSES.map((s) => ({ value: s, label: CONTRIBUTION_STATUS_LABEL[s] }));

const DIFFICULTY_OPTIONS = CONTRIBUTION_DIFFICULTIES.map((d) => ({
  value: d,
  label: `${CONTRIBUTION_DIFFICULTY_LABEL[d]} (${CONTRIBUTION_DIFFICULTY_DURATION[d]})`,
}));

interface TaskEditorProps {
  /** The task being edited, or null to create a new one. */
  task: AdminContributionTask | null;
  onSave: (input: SaveContributionTaskInput) => void;
  onCancel: () => void;
  saving: boolean;
  error: string | null;
}

/** Create / edit form for one contribution task. */
export function TaskEditor({ task, onSave, onCancel, saving, error }: TaskEditorProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [summary, setSummary] = useState(task?.summary ?? "");
  const [body, setBody] = useState(task?.body_markdown ?? "");
  const [status, setStatus] = useState<ContributionStatus>(task?.status ?? "open");
  const [difficulty, setDifficulty] = useState<ContributionDifficulty>(task?.difficulty ?? "a_few_hours");
  const [tags, setTags] = useState<string[]>(task?.tags ?? []);
  const [previewing, setPreviewing] = useState(false);

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const canSave = title.trim() !== "" && !saving;

  const submit = () => {
    onSave({
      id: task?.id ?? null,
      title: title.trim(),
      summary: summary.trim(),
      bodyMarkdown: body,
      status,
      difficulty,
      tags,
    });
  };

  return (
    // The negative margin + padding keeps focus rings (which draw
    // outside an input's border box) from being clipped by this
    // scroll container, without shifting the fields visually.
    <div className="-m-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-1">
      {/* id is referenced by the Dialog's aria-labelledby */}
      <h2 id="task-editor-title" className="font-display text-xl font-semibold text-foreground">
        {task ? "Edit task" : "New task"}
      </h2>

      <div className="space-y-1.5">
        <label htmlFor="task-title" className="text-sm font-medium text-foreground">
          Title
        </label>
        <Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="task-summary" className="text-sm font-medium text-foreground">
          Summary
        </label>
        <Input
          id="task-summary"
          value={summary}
          placeholder="One line shown on the board row"
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="task-body" className="text-sm font-medium text-foreground">
            Body <span className="text-muted-foreground">(markdown)</span>
          </label>
          {/* Preview renders through the same component the public task
              page uses, so what you see here is what ships. */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="nav"
              size="sm"
              isActive={!previewing}
              aria-pressed={!previewing}
              onClick={() => setPreviewing(false)}
            >
              Write
            </Button>
            <Button
              type="button"
              variant="nav"
              size="sm"
              isActive={previewing}
              aria-pressed={previewing}
              onClick={() => setPreviewing(true)}
            >
              Preview
            </Button>
          </div>
        </div>

        {previewing ? (
          <div className="min-h-48 rounded-xl border border-border bg-card px-4 py-3">
            {body.trim() === "" ? (
              <p className="text-sm text-muted-foreground">Nothing to preview yet. Write some markdown first.</p>
            ) : (
              <ContributionMarkdown content={body} />
            )}
          </div>
        ) : (
          <Textarea
            id="task-body"
            value={body}
            rows={8}
            placeholder={"## What we need\n\n- A bullet\n- Another"}
            onChange={(e) => setBody(e.target.value)}
          />
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="task-status" className="text-sm font-medium text-foreground">
            Status
          </label>
          <Select
            id="task-status"
            value={status}
            options={STATUS_OPTIONS}
            onChange={(e) => setStatus(e.target.value as ContributionStatus)}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="task-difficulty" className="text-sm font-medium text-foreground">
            Difficulty
          </label>
          <Select
            id="task-difficulty"
            value={difficulty}
            options={DIFFICULTY_OPTIONS}
            onChange={(e) => setDifficulty(e.target.value as ContributionDifficulty)}
          />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">Disciplines</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CONTRIBUTION_TAGS.map((tag) => (
            <label key={tag} className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={tags.includes(tag)}
                onChange={() => toggleTag(tag)}
                className="size-4 accent-primary"
              />
              {CONTRIBUTION_TAG_LABEL[tag]}
            </label>
          ))}
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center gap-2 pt-2">
        <Button onClick={submit} disabled={!canSave} size="sm">
          {saving ? "Saving…" : task ? "Save changes" : "Create task"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
