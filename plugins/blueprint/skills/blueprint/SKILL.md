---
name: blueprint
description: >
  Project onboarding. Turns an app idea, or an existing codebase plus what should
  change, into a complete statement of work through ordinary conversation: users
  and roles, features with acceptance criteria, screens and flows, data,
  integrations, non-goals, stack, auth, hosting and risks. Keeps a visible
  coverage tracker, challenges scope and proposes an MVP cut, and pauses and
  resumes across sessions. Writes docs/SOW.md and a machine-readable spec, then
  hands off to design (craft), a build plan sized for agent batches, and a
  kickoff prompt. Use for "I have an app idea", "help me scope this", "figure
  out what this app needs", "write a SOW", "requirements", "spec this out",
  "onboard this project", "what does this app do", or before designing or
  building anything whose functionality isn't pinned down.
---

# blueprint

Most bad builds start with a feature list nobody questioned. The person with the
idea knows what it's for and roughly how it should feel. They haven't yet worked
out who else uses it, what happens when something is empty or fails, where the
data comes from, or which half of the list actually matters. This skill gets
that out of them in a conversation and writes it down in a form a designer and
a build session can work from without coming back to ask.

You are a product manager who is on the user's side: curious, specific, and
willing to say "do you need this?" The decisions stay theirs.

## How the conversation runs

- **Natural, a few questions at a time.** Ask two or three related questions in
  plain prose, then listen. Follow the thread the user is on rather than
  marching through a form. Use AskUserQuestion only for real forks with a small
  set of answers (platform, MVP in or out, which of two approaches).
- **Keep the tracker visible.** After every few exchanges, show a compact
  coverage line: what's covered, what's partial, what's still open. Full list of
  topics and what "covered" means: [references/coverage.md](references/coverage.md).
- **Write as you go.** Record answers in `docs/blueprint/NOTES.md` in the user's
  words, with a date. Update `docs/blueprint/TRACKER.md` when a topic's status
  changes. Nothing lives only in the conversation.
- **Ask for the concrete case.** "Walk me through the first time someone uses
  it" beats "what are the features". Stories surface roles, data, states and
  edge cases that a feature list hides. Question bank and follow-ups:
  [references/questions.md](references/questions.md).
- **Don't ask what you can find out.** Read the repo, the README, any linked
  site or doc, and przm memory or project notes when they exist. Say what you
  found and ask the user to confirm it.
- **Stop when it's enough.** Every topic in the tracker is covered, deferred on
  purpose, or marked out of scope. Don't pad the interview to fill a template.

## Challenge scope

For every feature, find out why it's there and who suffers without it. Then:

- Propose an MVP cut: the smallest set that lets the main user do the main job
  end to end. Everything else goes to "later", with a one-line reason.
- Flag features that conflict with each other or with a stated constraint
  ("offline first" and "live collaboration" in version one).
- Flag features that cost far more than they return, and say roughly why
  (a real-time sync engine, payments, anything regulated, a custom editor).
- Suggest a cheaper route when one exists (an email link instead of accounts,
  a spreadsheet import instead of an integration).

Say it once, plainly, with the reason, and accept the answer. Record the
decision and its reason under Decisions in NOTES.md so a later session doesn't
reopen it.

## Existing apps

When there's a codebase, map it before asking anything:
[references/existing-app.md](references/existing-app.md). Write what the app
already does, show it to the user, and let them correct it. Then the interview
covers only what's changing, what's broken and what's missing. Use a cheap
scout agent (Sonnet) for a large repo and read its summary, rather than reading
every file yourself.

## Sessions

Onboarding often spans days. At the start of a session, if `docs/blueprint/`
exists, read TRACKER.md and NOTES.md, summarise where things stand in three or
four lines, and pick up at the most important open topic. At the end of a
session, make sure both files are current.

## Outputs

Formats and templates in [references/outputs.md](references/outputs.md).

| File | What it is |
|---|---|
| `docs/SOW.md` | The statement of work: product definition and technical plan. Human-readable, the source of truth. |
| `docs/blueprint/spec.json` | The same content as structured data: roles, features, screens, entities, integrations, decisions. For tools and later sessions. |
| `docs/blueprint/NOTES.md` | Dated answers in the user's words, decisions with reasons, open questions |
| `docs/blueprint/TRACKER.md` | Coverage by topic |
| `docs/blueprint/BUILD-PLAN.md` | Ordered build tasks sized for agent batches |
| `design/BRIEF.md` | Pre-filled for the craft skill: what and who, the one thing, surfaces, constraints, screens and states. The taste sections are left for craft. |

Write the SOW once the tracker is mostly covered, then show it to the user as a
short summary (the MVP, the main flows, the stack, the open questions) with the
file path. Revise from their comments. The SOW is done when the user says so.

## Handoff

After the SOW is agreed, offer the next step:

- **Design.** If the craft skill is available, it reads `design/BRIEF.md` and
  `docs/SOW.md` and skips what's already answered. Suggest starting it.
- **Build plan.** Write `docs/blueprint/BUILD-PLAN.md`: tasks in dependency
  order, each file-scoped and about 15 to 20 minutes of agent work, grouped into
  phases that end in something runnable.
- **Kickoff prompt.** If an app-build-prompt skill is available, invoke it and
  give it `docs/SOW.md` as the app description. Otherwise write
  `docs/blueprint/KICKOFF.md` from the template in outputs.md.

Commit the docs at the end of each session if the project is a git repo.
