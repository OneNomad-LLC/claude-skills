# Coverage

The tracker is a list of topics. Each topic is **covered** (the "done when"
line is true), **partial**, **open**, **deferred** (on purpose, with who decides
and when), or **n/a** (with a reason). The SOW is ready when nothing important
is open.

Order is a suggestion. Follow the conversation, and use the order to decide
what to ask next when it goes quiet.

## Product

| Topic | Done when |
|---|---|
| Purpose | One or two sentences on what it is and the problem it solves, in the user's words. |
| Success | What would make this a success in six months, stated so it could be checked (people using it weekly, a task that takes 5 minutes instead of an hour). |
| Users and roles | Every kind of person who touches it, including admins, guests, and the owner doing support. For each: what they're trying to do, how often, on what device. |
| The main job | The one flow that is the app, walked through step by step from the first screen to done. |
| First run | What a brand new user sees and does, including sign-up or no sign-up, and what they see before they have any data. |
| Features | Each feature as a user story with acceptance criteria and an MVP or later tag. |
| Non-goals | What it deliberately won't do, at least three. These prevent more scope creep than any feature list. |
| Content | Where the words, images and data on each screen come from: user-entered, admin-entered, imported, generated, a CMS. |
| Notifications | What the app tells people outside itself (email, push, SMS), when, and how they turn it off. |
| States | For the main screens: empty, loading, error, offline, permission denied, too much data. |
| Money | Whether anything is paid, by whom, how (one-off, subscription, per seat), and refunds. n/a is a valid answer. |

## Screens and flows

| Topic | Done when |
|---|---|
| Screen list | Every screen or page, with its purpose and which roles see it. |
| Flows | The main flows as numbered steps across screens, including one error path each. |
| Platforms | Web, iOS, Android, desktop; smallest and largest screens that matter; offline needs. |
| Navigation | How people move between the main areas. |

## Technical

| Topic | Done when |
|---|---|
| Stack | Frontend, backend and database, with a one-line reason. Default to what the user already uses unless there's a reason not to. |
| Data model | The main entities, their key fields, and how they relate. Who owns each record and who can see it. |
| Auth and permissions | How people sign in (or don't), and what each role can read, create, change and delete. |
| Integrations | Every outside service: what it's for, which direction data flows, what happens when it's down, and who holds the account. |
| Hosting and environments | Where it runs, environments (preview, staging, production), how it deploys, domains. |
| Security and privacy | Personal data held, where, for how long, who can see it; anything regulated (health, payments, children, location). |
| Performance and scale | Expected users and data volume at launch and in a year; anything that must be fast. |
| Analytics | What needs measuring to know if it's working, and with what tool. n/a is valid. |
| Admin and support | How the owner fixes a user's problem, edits content, or bans someone, without touching the database by hand. |
| Migration | For existing apps or replaced tools: what data moves, how, and what breaks. |

## Delivery

| Topic | Done when |
|---|---|
| MVP cut | The agreed MVP feature set, and the "later" list with reasons. |
| Risks and assumptions | The things that would sink it if wrong, and the assumptions being made without evidence. |
| Open questions | Each with who answers it and what it blocks. |

## TRACKER.md format

```md
# Blueprint tracker: <project>
Updated: YYYY-MM-DD

| Topic | Status | Note |
|---|---|---|
| Purpose | covered | |
| Users and roles | partial | admin role unclear |
| Money | n/a | free, no plans to charge |
| Integrations | deferred | Matt decides after pricing talk, blocks nothing in MVP |
```

The coverage line to show in conversation is a single sentence: "Covered 12 of
27, partial 4 (roles, states, auth, hosting), open next: data model."
