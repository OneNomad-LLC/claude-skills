# Templates

## docs/founder/VISION.md

```markdown
# <Project>: vision

## The one line
<What it is and who it's for, in one sentence the user would say out loud.>

## Who it's for
<The people, the moment they reach for it, what they do today instead.>

## What changes for them
<Before and after, concretely.>

## What makes it remarkable
<The two or three things that would make someone tell a friend. Not features: outcomes.>

## Where it goes
- Launch: <the MVP, one paragraph>
- Next: <what follows once launch works>
- The big picture: <where this is in two years if it works>

## Principles
<Five or fewer rules that settle arguments. "Fast beats complete", "never ask for an account", and so on. In the user's words where possible.>

## The bar
<What "good enough to ship" means for this product: polish, speed, reliability, tone.>

## Must not block
<Things the MVP must not make hard later: data shapes, URL structure, multi-tenancy, pricing model.>
```

## docs/founder/QUESTIONS.md

Teams append. Newest at the bottom. The founder edits status and answer in place.

```markdown
# Questions

## Q-<n>: <short title>
- From: <team or task, e.g. phase 2 / checkout API>
- Date: <YYYY-MM-DD>
- Blocking: yes | no
- Question: <one or two sentences>
- Assumed meanwhile: <what the team did so it could keep going, or "stopped">
- Status: open | answered | founder call | user's call
- Answer: <the answer, who decided, and the source or reason>
```

## docs/founder/briefs/<phase>.md

```markdown
# Brief: <phase name>

## Why this matters
<One paragraph tying this phase to the vision.>

## What great looks like
<The bar for this phase. Specific: what the user sees, how fast, how it feels.>

## Done means
<Acceptance criteria from the SOW, as a checklist.>

## Already decided
<Decisions from NOTES that touch this work, each one line with its reason.>

## Yours to decide
<What the team may settle alone. Write down assumptions in the commit message or the inbox.>

## Escalate
Stop and add a question to docs/founder/QUESTIONS.md (format at the top of that file) when a choice
changes what the product does, costs money, touches personal data or privacy, or can't be undone.
If it isn't blocking, write what you assumed and keep going.
```

## Team update (paste into the build session)

```text
Founder update <YYYY-MM-DD>. Answers in docs/founder/QUESTIONS.md, decisions in docs/blueprint/NOTES.md.
- Q-<n> <title>: <answer in one line>. <What to change, if anything.>
Changed in the SOW: <section, one line each, or "nothing">.
Still open: <Q ids, and whether to wait or proceed on the stated assumption>.
```
