---
name: debug
description: >
  A gated loop for hard bugs and performance regressions: reproduce with a
  check that fails on this bug, minimise, write falsifiable hypotheses,
  instrument to get the evidence, fix the root cause, add a regression test.
  Use for "debug this", "diagnose", "why is this failing", "this is slow", or
  any bug that has resisted a first guess.
argument-hint: "[symptom]"
license: Apache-2.0
---

# Debug

Work the phases in order. Do not start a phase until the one before it is done. If you skip one, say which and why.

## Rules

- Say whether each diagnosis is **verified** (you saw the evidence) or **suspected** (you inferred it). Never present a hypothesis as a conclusion.
- Prefer direct evidence over reading code and guessing: logs, traces, real outputs, a profiler, a query plan.
- Never propose a destructive action (deleting data, resetting state, force-pushing, dropping a table, restarting production) on an unverified theory.
- Redact secrets before showing any command, log or captured request. Quote only the lines that carry the signal.

## 1. Reproduce with a check that fails on this bug

Build one command that goes red on this exact symptom and green when it is fixed. A failing test is best. A script, a `curl` against a dev server, a CLI run diffed against known output, a replay of a captured request, or a headless browser script also work. For a regression between two known states, automate the check so `git bisect run` can use it.

Run it and show the output. It must catch the user's symptom, not a nearby failure, and give the same verdict every run, in seconds. For a flaky bug, loop the trigger until the failure rate is high enough to work with.

If you cannot build one, stop. List what you tried and ask the user for access to the environment, a redacted artifact (log, HAR, dump), or permission to add temporary instrumentation. Do not theorise without a check.

## 2. Minimise

Cut inputs, config, data and steps one at a time, rerunning after each cut. Stop when every remaining piece is needed to keep it red. This shrinks what you have to suspect and becomes the regression test later.

## 3. Hypothesise

Write three to five hypotheses, ranked, before testing any. For each one state the observation that would prove it wrong:

> If X is the cause, then Y will show in the logs, and Z will make the bug vanish. If Y is absent, X is wrong.

If you cannot state that observation, sharpen the hypothesis or drop it. Show the list to the user before testing. They may know a recent deploy or an already-ruled-out cause. Do not block on a reply if they are away.

## 4. Instrument and observe

Each probe targets one hypothesis's observation. Change one thing at a time. Prefer a debugger or REPL, then targeted logs at the points that separate the hypotheses. Never log everything and grep.

Prefix every temporary log with a unique tag such as `[DEBUG-a4f2]` so cleanup is one grep.

For performance, measure first: take a baseline with a timer, profiler or query plan, then narrow down. Do not guess at fixes.

After each observation, mark each hypothesis confirmed, ruled out or still open. Only a hypothesis you saw the evidence for is verified.

## 5. Fix the root cause and lock it down

Fix the verified cause, not the symptom. Turn the minimal repro into a regression test at a seam that reproduces how the bug really occurs. A test that is too shallow to hit the real trigger gives false confidence. If no such seam exists, say so, because that is a finding about the design.

Watch the test fail, apply the fix, watch it pass, then rerun the original check from phase 1 on the unminimised case.

## 6. Clean up

- The phase 1 check no longer fails.
- The regression test passes, or the missing seam is noted.
- `grep` for your debug tag and remove every temporary log and probe.
- Delete throwaway scripts or move them somewhere clearly marked.
- State the confirmed cause in the commit or PR message so the next person learns it.
