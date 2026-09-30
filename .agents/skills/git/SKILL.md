---
name: git
description: Git workflow standards: Conventional Commits, branch naming, the no-AI-attribution rule, and how to review a PR. Use when creating branches, writing commit messages, opening PRs, reviewing a PR, or the user asks how a change should be recorded in git.
---

# Git

How change is recorded.

## Workflow

1. **Work on the branch defined for the task at hand.** Never push directly to `main`.
2. **Create new commits rather than amending.** Never force-push any branch, no exceptions; never skip hooks without explicit permission.
3. **Task PRs target their milestone branch; milestone PRs target the latest `main`.** Work outside a milestone stays on a feature branch. No PR opens unless explicitly asked.

## Conventional Commits

1. All commit subjects follow [Conventional Commits](https://www.conventionalcommits.org/):

   ```text
   <type>(<optional scope>): <imperative summary>
   ```

   - **Allowed types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
   - **Scopes** match the affected area: the surface (`home`), the layer (`templates`, `tokens`, `constants`), or the docs (`prd`, `docs`). Omit when global.
   - **Subject:** ≤ 72 characters, lowercase, no trailing period.
   - **Body:** explain the _why_ when the diff alone doesn't.
   - **Breaking changes:** `!` suffix and a `BREAKING CHANGE:` footer for route moves, renames, or behavior changes.

## Branch naming

1. Branches follow the same type vocabulary as commits:

   ```text
   <type>/<short-kebab-summary>
   ```

   - ≤ 40 characters, lowercase, hyphen-separated.
   - Milestone and task branches carry their identifiers: `feat/m02-works`,
     `feat/m02-t04-works-ledger`.
   - Branches outside a milestone reference the affected area:
     `fix/date-zoning`, `docs/initial-plan`.

## Attribution

1. **No AI/agent attribution** in commits, PRs, or issues: no `Co-Authored-By: Claude/Codex`, no "Generated with Claude Code" markers, no `claude.ai/code` session links.

## Review

1. **Read the project's own vendored skills before reviewing the diff.** Skills under
   `.claude/skills/` / `.agents/skills/` are that project's actual, current standards, not
   generic advice; load the ones relevant to the changed files (`components` for a component
   diff, `data` for a constants/data change, `nextjs` for routing, etc.) and check the diff
   against what they specifically say before reaching for anything else.
2. **Then apply conventional best practice**: correctness, security, performance, test
   coverage, readability: the concerns a project's skills don't cover because they're
   universal rather than project-specific.
3. **A skill deviation is a finding on its own**, distinct from a generic style nit: name the
   skill and the rule it violates, not just "this looks off."
4. **When a project has no vendored skills**, or the change touches an area none of them
   cover, fall back to conventional best practice alone. Never invent a project standard
   that isn't written down anywhere.
