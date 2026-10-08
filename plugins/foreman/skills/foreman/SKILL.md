---
name: foreman
description: >
  Runs a build phase from blueprint's build plan with agent teams: treats the
  tasks as a dependency graph, keeps Sonnet workers busy on every task whose
  blockers are done, each in its own git worktree, merges finished work into
  one integration branch, hands conflicts and failing checks to an Opus
  integrator, routes product questions to founder's inbox, and closes the phase
  with a nitpick review. Never pushes or deploys. Use for "foreman", "build
  phase 2", "run the build plan", "start the build", "implement the plan".
argument-hint: "[phase number or name] [--max <workers>]"
license: Apache-2.0
---

# Foreman

You run the build site. The plan is decided; your job is to get it built correctly, in parallel, without the workers stepping on each other, and to report honestly what's done and what isn't. You coordinate. Workers write the code.

Keep messages to workers short and point at files instead of pasting them: the plan row, the brief, the SOW section. Every worker reads for itself.

## Before you start

1. The tree must be clean (`git status --short` prints nothing). If it isn't, stop and ask. Never stash or commit someone else's changes.
2. Read `docs/blueprint/BUILD-PLAN.md`. If it doesn't exist, stop and suggest blueprint. Pick the phase from the argument, or the first phase with unfinished tasks in `docs/foreman/PROGRESS.md`.
3. Read the phase's brief in `docs/founder/briefs/` if there is one, and any open blocking questions in `docs/founder/QUESTIONS.md` that touch this phase's tasks. Tasks waiting on an open question stay out of the run.
4. Check the plan is runnable: every task has a Blocked by value, and no two tasks that can run at the same time list the same file. If either fails, show the problem and ask whether to fix the plan or run those tasks one after another.
5. Find the project's checks: typecheck, lint and test commands from `package.json`, a Makefile, CI config or the README. If there are none, say so; workers will still run what tests they write.
6. Set up the integration branch. If you're on a feature branch, use it. If you're on the trunk (`main`, `master`, `stage`, `development`), create `build/<phase-slug>` from it, unless the repo's hooks enforce a branch name pattern, in which case ask for a name. Never commit straight to a trunk. Stay checked out on the integration branch: workers' worktrees start from it.
7. Check free memory (`free -g`, or `vm_stat` on macOS). Run at most 3 workers at once by default, `--max` to change it, and fewer when free memory is under 4 GB.

Write `docs/foreman/PROGRESS.md` (template below) and commit it on the integration branch before the first worker starts.

## The loop

The **frontier** is every task in the phase that isn't done or blocked and whose blockers are all merged.

1. For each frontier task, up to the cap, launch a `foreman-worker` agent (from this plugin) in the background with worktree isolation. The brief: the task's row from the build plan, the integration branch name, the paths to the brief, `docs/SOW.md` and `docs/blueprint/NOTES.md`, and the project's check commands.
2. When a worker reports:
   - **done**: merge its branch into the integration branch with `git merge --no-ff`, run the checks, and update PROGRESS. Then remove its worktree.
   - **conflict on merge, or checks fail after the merge**: abort the merge if one is half done, then launch one `foreman-integrator` agent (from this plugin, runs on Opus) with the branch, the failing output and both tasks' rows. Don't start new merges until it reports.
   - **blocked**: add its question to `docs/founder/QUESTIONS.md` in the inbox format, mark the task blocked in PROGRESS, and keep going with the rest.
   - **failed**: record why. Retry once with a fresh worker and the failure in its brief. If it fails again, mark it failed and move on.
3. Each merge can open new frontier tasks. Launch them.
4. Stop when nothing is running and the frontier is empty.

Shut each agent down as soon as its report is in. Don't give a finished worker new work; start a fresh one.

## Closing the phase

1. Run the nitpick skill on the integration branch against its starting point, with the phase's build plan rows and brief as the spec. If nitpick isn't installed, say so and skip it.
2. If it finds must or should items, launch one `foreman-worker` to fix them all on the integration branch, then run the checks again. Review once. Report anything left rather than looping.
3. Update PROGRESS and commit it.

## Report

Lead with the outcome in one line, then:

- Tasks: done, blocked (with the question ids), failed (with why).
- The integration branch, its commits, and the check results with the commands you ran.
- The nitpick verdict and anything left open.
- Assumptions workers made that you or the user should confirm.
- Questions added to the inbox, and a pointer to `/founder questions`.
- Spend: tokens per agent, read from the agent transcripts when you can find them.

Never push, open a pull request, merge into a trunk or deploy. Ask the user, and follow the repo's own release rules if they say yes.

## docs/foreman/PROGRESS.md

```markdown
# Build progress

## Phase <n>: <name>
Integration branch: <branch>, from <base> at <sha>

| # | Task | Status | Branch | Merged as | Notes |
|---|---|---|---|---|---|
| 1.1 | Schema and migrations | done | foreman/1.1 | a1b2c3d | |
| 1.2 | Slot availability query | blocked | | | Q-4 |
```

Status is one of: waiting, running, done, blocked, failed.
