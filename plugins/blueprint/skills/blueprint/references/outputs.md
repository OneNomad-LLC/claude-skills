# Outputs

## docs/SOW.md

Written for someone who wasn't in the conversation: a designer, a developer, or
the user in three months. Plain language, specific, no filler. Keep it as long
as the project needs and no longer.

```md
# <Project>: statement of work
Version: 0.1   Date: YYYY-MM-DD   Status: draft | agreed

## Summary
What it is, who it's for, and the problem it solves, in one paragraph.
Success looks like: <checkable outcome>.

## Users and roles
| Role | Who they are | What they do | Device and frequency |
|---|---|---|---|

## Scope
### MVP
| ID | Feature | Story | Acceptance criteria | Status |
|---|---|---|---|---|
| F1 | ... | As a <role>, I want <x> so that <y> | Given/when/then, or checkable statements | new / existing / changing |

### Later
| ID | Feature | Why not now |
|---|---|---|

### Non-goals
- It will not ...

## Screens
| Screen | Purpose | Roles | Key states |
|---|---|---|---|

## Flows
### <Main flow>
1. ...
Failure path: ...

## Content and notifications
Where each kind of content comes from. What the app sends, when, and how to opt out.

## Technical plan
### Stack
<choice and one-line reason each>
### Data model
| Entity | Fields | Relations | Owner, visibility |
|---|---|---|---|
### Auth and permissions
| Role | Read | Create | Update | Delete |
|---|---|---|---|---|
### Integrations
| Service | Purpose | Data direction | Failure behaviour | Account holder |
|---|---|---|---|---|
### Hosting and environments
### Security and privacy
### Performance and scale
### Analytics
### Admin and support
### Migration (existing apps)

## Risks and assumptions
| Item | Why it matters | Mitigation or how to test it |
|---|---|---|

## Decisions
| Date | Decision | Reason |
|---|---|---|

## Open questions
| Question | Who answers | Blocks |
|---|---|---|
```

## docs/blueprint/spec.json

The same facts as data. Keep it in sync with SOW.md; SOW.md wins if they
disagree.

```json
{
  "project": "Trailhead",
  "version": "0.1",
  "updated": "2026-09-28",
  "summary": "…",
  "roles": [{ "id": "owner", "name": "Shop owner", "does": "…" }],
  "features": [
    { "id": "F1", "title": "Book a slot", "roles": ["customer"], "story": "…",
      "acceptance": ["…"], "phase": "mvp", "status": "new", "screens": ["S2"] }
  ],
  "screens": [
    { "id": "S2", "name": "Booking", "roles": ["customer"], "purpose": "…",
      "states": ["default", "empty", "loading", "error", "full"] }
  ],
  "flows": [{ "id": "FL1", "name": "First booking", "steps": ["S1", "S2", "S3"] }],
  "entities": [
    { "name": "Booking", "fields": ["id", "customerId", "slotId", "status"],
      "relations": ["Customer", "Slot"], "owner": "customer" }
  ],
  "integrations": [{ "name": "Stripe", "purpose": "deposits", "direction": "out" }],
  "stack": { "web": "Next.js", "db": "Postgres (Neon)", "auth": "…", "host": "Vercel" },
  "platforms": ["web", "ios"],
  "nonGoals": ["…"],
  "decisions": [{ "date": "2026-09-28", "decision": "…", "reason": "…" }],
  "openQuestions": [{ "question": "…", "owner": "Matt", "blocks": ["F4"] }]
}
```

## design/BRIEF.md (for craft)

Fill only what the onboarding established, using craft's brief headings: What
and who, The one thing, Surfaces, Assets, Constraints. Add a **Screens and
states** section listing each MVP screen with its states and the flow it
belongs to, pointing at SOW.md for detail. Leave Character, Copy, Taste and Type
marked `open: for craft` so the design interview asks only those.

## docs/blueprint/BUILD-PLAN.md

```md
# Build plan: <project>
From SOW version <x>, YYYY-MM-DD

## Phase 1: <name>, ends with <something runnable>
| # | Task | Files | Blocked by | Seam | Done when |
|---|---|---|---|---|---|
| 1.1 | Schema and migrations for Booking, Slot | db/schema.ts, db/migrations/* | none | none | migration runs, types compile |
| 1.2 | Slot availability query | src/booking/availability.ts | 1.1 | `getOpenSlots(cafeId, date)` | returns only unbooked slots, tested |
```

Rules: each task is file-scoped and about 15 to 20 minutes of agent work, so
several can run in parallel. **Blocked by** lists the task numbers that must be
merged first, or `none`; foreman runs every task whose blockers are done at the
same time. Two tasks that aren't blocked by each other must not edit the same
file, or their merges collide; if they must, make one block the other.
**Seam** is the public interface the task's tests go through (a function, an
endpoint, a component's props), or `none` for tasks with no logic to test;
`/tdd` uses it instead of asking. Every phase ends in something the user can
run or see. Design tasks come before the screens that need them. Tests sit with
the task they test, not in a phase at the end.

## docs/blueprint/KICKOFF.md

Used when no app-build-prompt skill is available. One fenced block the user
pastes into a fresh Claude Code session.

````md
Build <project>, <one sentence>.

Read docs/SOW.md first. It is the source of truth for scope. Build only the MVP
features. If something in it is ambiguous, stop and ask rather than invent.

Stack, fixed: <stack>.
The defining screen: <screen>. Get it right before anything else.
It must not become: <anti-goal from non-goals>.
Hard constraints: <security, privacy, regulated items from the SOW>.

Work from docs/blueprint/BUILD-PLAN.md in order. Commit at the end of each task.
Design: if design/BRIEF.md has open sections, run the design skill before
building screens.
````
