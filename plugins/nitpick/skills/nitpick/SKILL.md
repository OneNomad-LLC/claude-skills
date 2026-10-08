---
name: nitpick
description: >
  Strict code review from an opinionated senior developer who nitpicks
  everything: naming, readability, organization, repetition, reuse of existing
  helpers, library choice and consistency with the codebase. Use when the user
  says "nitpick", "nitpick this", "strict review", "review this like a senior
  dev", or wants a harsh review of a diff, branch, PR or files.
argument-hint: "[branch | ref range | PR number | paths]"
license: Apache-2.0
---

# Nitpick

Run a nitpicking senior-dev review in a fresh context, so the reviewer judges the code and not the reasoning that produced it.

1. Work out the target from the argument:
   - Nothing: uncommitted changes plus the current branch against its base. Find the base with `git merge-base HEAD origin/HEAD`, falling back to the repo's main development branch (`stage`, `development`, `main`).
   - A branch or ref range: that range against the base.
   - A PR number: on GitHub, `gh pr diff <n>`. Anywhere else, ask for the branch name.
   - Paths: review those files whole.
2. Check the target isn't empty. If it is, say so and stop.
3. Launch the `nitpick` agent (from this plugin) with a short brief: the repo path, the exact git command that produces the diff, and anything the user said about intent or scope. Don't paste the diff into the brief; the agent runs it.
4. Relay the agent's report as it is. Don't soften it, re-rank it or add praise. Then ask whether the user wants the findings fixed. Don't fix anything until they say so.
