---
name: trim-audit
description: >
  Audit a whole repo for bugs, security holes, what breaks under real load,
  risky code without tests, slow paths, and code to delete, merge or split.
  Ranked, in plain English, with file and line. One-shot report, changes
  nothing. Use for "audit this codebase", "review the whole repo", "find
  bloat", "what can I delete", /trim-audit.
license: Apache-2.0
---

Audit the repo as the senior developer who just inherited it and will get paged when it breaks. Priorities, in order: correct, safe, holds up under load, tested, fast, lean. This report was asked for, so give it in full.

## 1. Map first

- Audit what the user names: a folder, a package or the whole repo. Nothing named means the whole repo.
- Read the README, build and deploy config, dependency list, entry points (main, routes, handlers, jobs, CLI commands) and the tests.
- Work out the expected load: one person running a script, or many users and processes at once. Judge scale against that and say which load you assumed.
- Trace the main flows end to end: where data comes in, what gets stored, what goes out. Read the costly paths in full: user input, money, auth, writes, background jobs, anything shared between processes.
- In a big repo, go deep where a mistake costs the most instead of reading file by file. Say what you didn't read.

## 2. What to look for

1. **Bug:** wrong results, crashes, missed edge cases (empty, zero, last item, rounding, time zones), callers that disagree with what a function returns, one rule applied two different ways.
2. **Risk:** security holes (injection, weak randomness, secrets in code, unchecked user input), data loss (swallowed errors, writes in the wrong order, no transaction).
3. **Scale:** fine for one user, wrong for many. Check-then-write races, the same work repeated by every process, memory or lists that only grow, a query per item, O(n^2) on large input, per-process state that needs to be shared.
4. **Missing test:** risky logic (a branch, a parser, money, security, data writes) with no test that fails when it breaks. One good test, not coverage numbers.
5. **Speed:** large slowdowns are problems. Small wins, like work repeated in a hot loop, are suggestions.
6. **Lean:** code that shouldn't exist or should be smaller.
   - delete: dead code, unused options, flags and config, speculative features
   - reuse: two helpers doing one job (keep one, name its path)
   - stdlib or native: the language or platform already does it, or a dependency does what a few lines could
   - yagni: an interface with one implementation, a factory with one product, a wrapper that only forwards calls
   - merge: near-copies that always change together
   - split: one function or class doing several unrelated jobs. Split by job, never by line count, and never into helpers that exist only to shorten a function

## 3. Check before you report

- Every finding needs a concrete case: this input or situation leads to this wrong result. No case, no finding.
- Before calling code unused, grep the whole tree for it, including tests, fixtures, config and string or dynamic references.
- A `shortcut:` comment that names its limit is a decision, not a finding, unless the expected load already crosses that limit.
- Propose the smallest fix that works, and prefer fixes that delete code. Don't add layers, frameworks or config the problem doesn't need.
- No style taste, no "consider", no vague worries.

## 4. Output

Plain English: short sentences, everyday words, and each technical term explained the first time. The reader may never have seen this code.

Open with `What this repo does:` in two or three sentences, then the load you assumed.

Then the findings in three groups, most important first, skipping empty ones:

- **Must fix:** bugs, security, data loss, anything that breaks at the expected load.
- **Should fix:** risky code without a test, real slowness, duplication, functions that mix jobs, code that shouldn't exist.
- **Nice to have:** small speed-ups, shorter forms.

Number the findings across all groups so the user can say "fix 2 and 5". Report at most 20, and say how many smaller ones you left out. Each finding has four parts, one or two short sentences each:

2. **Orders land on the wrong day** (`billing/close_day.py:40-52`)
   - **What this is:** At midnight this job closes the day and bills that day's orders.
   - **Problem:** It reads "today" from the server clock, which runs in UTC. An order placed at 00:30 in Berlin is billed to the previous day.
   - **Fix:** Work out the day once, in the shop's time zone: `datetime.now(ZoneInfo("Europe/Berlin")).date()`.
   - **If we skip it:** Late orders show the wrong date and accounting corrects them by hand.

Finish with:

- `Verdict:` one line, either healthy or what to fix first.
- `Lean: -<N> lines, -<M> dependencies possible.` when there are lean findings.
- `Not checked:` the parts you didn't read or couldn't run.

If nothing turns up: `What this repo does:`, then `Healthy. Nothing to fix.` and one line on what you checked.

One-shot report. It changes no code.
