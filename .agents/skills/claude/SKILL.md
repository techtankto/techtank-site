---
name: claude
description: Claude Code repo hygiene: keeping CLAUDE.md a symlink to AGENTS.md, gitignoring Claude Code's local-only state, agent memory, and changes to settings or hooks. Use when setting up a repo for Claude Code, or auditing one that already has a CLAUDE.md and/or AGENTS.md.
---

# Claude

Repo-level conventions for Claude Code, kept separate from any tool-agnostic
instructions in `AGENTS.md`.

1. **`CLAUDE.md` is a symlink to `AGENTS.md` at the repo root**, never a
   second copy of the same instructions: `ln -s AGENTS.md CLAUDE.md`. If
   `AGENTS.md` exists and `CLAUDE.md` doesn't, or exists as a plain file
   instead of a symlink, create or replace it with the symlink. If neither
   file exists yet, don't invent one; that's a separate decision.
2. **Gitignore Claude Code's local-only state**: add `.claude/settings.local.json`
   (personal permission overrides, machine-specific) and `.claude/worktrees`
   (scratch state for isolated worktree runs) to `.gitignore`. Neither belongs
   in version control.
3. **Never use an agent's memory store for durable project facts** (Claude Code's
   memory directory, `MEMORY.md`, or any tool-specific equivalent): memory only
   one tool can read is invisible to code review and drifts out of date.
   Durable guidance lives in the doc that owns it, in the repo. If something is
   worth remembering, commit it.
4. **Don't change settings or hooks unless asked.** Both run on every session
   for everyone who clones the repo, so a change there changes other people's
   tooling.
