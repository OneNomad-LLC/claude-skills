---
name: nitpick
description: >
  Strict code review from an opinionated senior developer who nitpicks
  everything: naming, readability, organization, repetition, code smells,
  reuse of existing helpers, library choice and consistency with the codebase.
  A second reviewer checks the change against its spec: what's met, missing or
  added beyond it. Use when the user says "nitpick", "nitpick this", "strict
  review", "review this like a senior dev", "does this match the spec", or wants
  a harsh review of a diff, branch, PR or files.
argument-hint: "[branch | ref range | PR number | paths] [--spec <path>]"
license: Apache-2.0
---

# Nitpick

Run two reviews in fresh contexts, in parallel, so neither judges the reasoning that produced the code and neither pollutes the other: **standards** (the `nitpick` agent) and **spec** (the `nitpick-spec` agent).

1. Work out the target from the argument:
   - Nothing: uncommitted changes plus the current branch against its base. Find the base with `git merge-base HEAD origin/HEAD`, falling back to the repo's main development branch (`stage`, `development`, `main`).
   - A branch or ref range: that range against the base.
   - A PR number: on GitHub, `gh pr diff <n>`. Anywhere else, ask for the branch name.
   - Paths: review those files whole.
2. Check the target isn't empty. If it is, say so and stop.
3. Find the spec, first match wins:
   - A path passed with `--spec`.
   - Ticket or task references in the commit messages (`#123`, `1.2`, `BUGHERD-45`) that resolve to an issue, a build plan row or a file.
   - The build plan task and founder brief for this work: `docs/blueprint/BUILD-PLAN.md` rows whose files the diff touches, and `docs/founder/briefs/` for that phase.
   - A file under `docs/`, `specs/` or `.scratch/` matching the branch name or feature.
   - `docs/SOW.md` acceptance criteria for the feature the diff touches.
   If none is found, ask the user once. If there isn't one, skip the spec review and say so in the report.
4. Launch both agents (from this plugin) in the same message so they run in parallel. Each brief is short: the repo path, the exact git command that produces the diff, and anything the user said about intent or scope. The spec brief also names the spec files and sections. Don't paste the diff or the spec into either brief; the agents read them.
5. Merge the two reports into one: the standards verdict and findings first, then the spec verdict and checklist. The overall verdict is the stricter of the two. Don't soften, re-rank or add praise. Then ask whether the user wants the findings fixed. Don't fix anything until they say so.
