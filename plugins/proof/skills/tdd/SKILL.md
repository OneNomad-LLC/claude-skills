---
name: tdd
description: >
  Build a feature or fix test-first, one vertical slice at a time, red then
  green. Agrees the test seams with the user before any test is written and
  reuses seams from the build plan or a founder brief. Use for "tdd", "test
  first", "red green", "write the tests first", or when the user wants a
  feature built with tests that survive refactors.
argument-hint: "[feature or behaviour to build]"
license: Apache-2.0
---

# TDD

Build the work in small slices. Each slice is one failing test, then the least code that passes it. Tests describe behaviour a caller can see, so they keep passing when the internals change.

## Before the first test

1. **Find the behaviours.** Read the acceptance criteria in `docs/SOW.md` or the relevant brief in `docs/founder/briefs/` if they exist. Otherwise ask the user what the feature must do. List the behaviours in plain sentences, in the order you will build them.
2. **Find the seams.** A seam is the public boundary you test at: a function, an HTTP route, a CLI command, a component's rendered output. Check the matching task in `docs/blueprint/BUILD-PLAN.md` (optional "Seam" field) and the brief. If one names a seam, use it and tell the user you did. If not, propose seams, one line each on what it catches and what it misses, and wait for a yes. Write no test at a seam the user has not agreed.
3. **Find the runner.** Use the project's existing test runner, file layout and naming. If there is none, propose the mainstream choice for the stack (Vitest or Jest for TypeScript, pytest for Python, `go test` for Go) and ask before installing anything.

## The loop

Repeat per behaviour:

1. **Red.** Write one test for the next behaviour at an agreed seam. Run it. Confirm it fails, and that it fails for the reason you expect, not from a typo or missing import.
2. **Green.** Write the least code that passes. Do not build for the next test. Run the whole suite, not just the new test.
3. **Next.** Let what the slice taught you shape the next test. Do not plan all the tests up front.

Refactor after green, once the behaviours are covered, with the tests running. Do not refactor inside the loop.

## What a good test is

- It names a behaviour: "rejects a coupon after its expiry date", not "test validate()".
- It calls the public interface and asserts on what a caller observes.
- It would survive a rewrite of the internals.
- Its expected value is a literal or a worked example, never recomputed the way the code computes it.
- One reason to fail.

Longer examples are in `references/tests.md`.

## Anti-patterns

- **Implementation-coupled.** It mocks your own collaborators, calls private methods, asserts call counts, or checks results by reading the database directly. Tell: it breaks on a refactor that changed no behaviour.
- **Tautological.** `expect(total(items)).toBe(items.reduce(...))` passes by construction. It can never disagree with the code.
- **All tests first.** Writing every test before any code tests the shape you imagined. Work one slice at a time so each test reacts to the last.
- **Green on first run.** A test that never failed proves nothing. If it passes before the code exists, it is wrong or redundant.

## Mocking

Mock only at system boundaries: network APIs, payment and email providers, the clock, randomness, and sometimes the filesystem or database (prefer a real test database). Never mock code you own. Pass boundary dependencies in as arguments so a test can swap them. Give each external operation its own small function (`getUser`, `createOrder`) instead of one generic `fetch` wrapper, so each fake returns one shape with no branching.

## Done

All agreed behaviours have a passing test, the full suite is green, and you have told the user which seams were covered and which behaviours were left out.
