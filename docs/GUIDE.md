# How to use claude-skills

This guide covers installing the plugins, what each one does day to day, and how to run a project through all of them. For a quick overview, see the [README](../README.md).

- [Install](#install)
- [founder](#founder)
- [blueprint](#blueprint)
- [craft](#craft)
- [napkin and pager](#napkin-and-pager)
- [nitpick](#nitpick)
- [A full project, start to finish](#a-full-project-start-to-finish)
- [Updating and removing](#updating-and-removing)
- [Troubleshooting](#troubleshooting)

## Install

In Claude Code:

```
/plugin marketplace add OneNomad-LLC/claude-skills
/plugin install founder@claude-skills
/plugin install blueprint@claude-skills
/plugin install craft@claude-skills
/plugin install napkin@claude-skills
/plugin install pager@claude-skills
/plugin install nitpick@claude-skills
```

Or from a terminal, with `claude plugin marketplace add` and `claude plugin install` and the same arguments. Restart Claude Code afterwards.

Install only what you'll use. founder needs blueprint. The others stand alone.

**Requirements.** napkin and pager run small Node hooks, so `node` must be on the PATH Claude Code uses for hooks. craft needs Node 20 or later. Its scripts install Playwright into `~/.cache/craft-tools` the first time they run.

**More than one Claude account on a machine.** Each config directory has its own plugins. If you run a second account with `CLAUDE_CONFIG_DIR=~/.claude-work`, install there too:

```
CLAUDE_CONFIG_DIR=~/.claude-work claude plugin marketplace add OneNomad-LLC/claude-skills
CLAUDE_CONFIG_DIR=~/.claude-work claude plugin install founder@claude-skills
```

**Working on the plugins themselves.** Point the marketplace at your clone instead of GitHub, so changes show up after a version bump without a push:

```
claude plugin marketplace add ~/path/to/claude-skills
```

## founder

The founder turns your vision into paper the agent teams can build from, then runs the loop back to you. It thinks big, expects a lot from the team, and never quietly decides something that's yours to decide.

| Command | What happens |
|---|---|
| `/founder` | Reads the project docs and tells you where things stand: vision, SOW, open questions by urgency, the next phase to brief. |
| `/founder vision` | Talks the idea through with you and writes `docs/founder/VISION.md`, then hands off to blueprint for the details. Once the SOW is agreed, it checks the SOW against the vision. |
| `/founder brief phase-2` | Writes a one-page brief in `docs/founder/briefs/` for a build phase: why it matters, what great looks like, what done means, what the team may decide alone, and when to stop and ask. |
| `/founder questions` | Works through `docs/founder/QUESTIONS.md`. It answers what the docs already settle, makes small reversible calls itself and lists them so you can overrule, and brings you the rest a few at a time with a recommendation for each. |

**The question loop.** Every brief tells the build agents how to ask. When a team hits a choice that changes the product, costs money, touches personal data or can't be undone, it adds an entry to the inbox:

```markdown
## Q-3: No-show deposits
- From: phase 2 / booking API
- Blocking: yes
- Question: Do we keep the deposit when a guest doesn't show up?
- Assumed meanwhile: stopped
- Status: open
```

Non-blocking questions carry the assumption the team went ahead with, so the build doesn't stall. When you run `/founder questions`, answers go back into the inbox, decisions into `docs/blueprint/NOTES.md`, and scope changes into the SOW. You get a short update to paste into the build session.

## blueprint

blueprint interviews you in normal conversation until it can write a complete statement of work. It asks two or three questions at a time, keeps a coverage tracker, pushes back on scope and proposes an MVP cut. For an existing codebase it maps what's there first and asks only about what's changing.

Start it with `/blueprint`, or just describe an app idea. It pauses and resumes across sessions.

What it writes:

| File | Contents |
|---|---|
| `docs/SOW.md` | Product definition and technical plan. The source of truth. |
| `docs/blueprint/spec.json` | The same content as structured data |
| `docs/blueprint/NOTES.md` | Answers in your words, decisions with reasons, open questions |
| `docs/blueprint/TRACKER.md` | Coverage by topic |
| `docs/blueprint/BUILD-PLAN.md` | Ordered tasks, each about 15 to 20 minutes of agent work, in phases that end in something runnable |
| `design/BRIEF.md` | A head start for craft |
| `docs/blueprint/KICKOFF.md` | A prompt to start a fresh build session |

## craft

craft designs and builds interfaces that don't look like every other generated app. Start it with `/craft`, or ask for a landing page, a dashboard, app screens or a redesign.

1. **Brief.** A short interview: who it's for, the one action that matters, brand assets, personality. If blueprint wrote `design/BRIEF.md`, craft skips what's answered.
2. **Taste.** It finds 8 to 12 real sites that fit, and you mark likes and dislikes in a local picker page.
3. **Tokens.** An OKLCH colour system with designed light and dark themes, a type scale, spacing, radii and motion.
4. **Prototype.** The key screens in the real stack with mock data and every state. You review it before any production wiring.
5. **Build.** Next.js and Tailwind, or Expo for mobile.
6. **Verify.** Screenshots in every theme and viewport, lint for contrast, focus, spacing and tap targets, then a critic agent's review.

For a landing page told through scrolling, ask for a scroll or cinematic landing page. Generated imagery in that mode needs a `KIE_AI_API_KEY` in your environment (see `plugins/craft/.env.example`).

## napkin and pager

Two always-on modes. napkin is a lazy senior architect and pager is a lazy senior DevOps engineer. Both push Claude toward the fewest moving parts that fully solve the task, and both end their replies with what was skipped and any risk you should know about.

They load at the start of every session and into every subagent, but each one's rules apply only in its area:

- **napkin**: system design, service boundaries, data models, datastore and framework choices, technical plans. It prefers the existing app and database, one deployable, and today's scale plus one order of magnitude. It writes down the number at which to revisit.
- **pager**: CI/CD, Dockerfiles, deploy scripts, hosting and env config, IaC, DNS, cron, monitoring. It prefers the platform's built-in features and managed services. Every change comes with how to verify it and how to undo it. It won't deploy, destroy, migrate or change DNS on a live system without your go-ahead.

**Levels.** Type these as a prompt:

| Command | Effect |
|---|---|
| `/napkin lite` | Builds what you asked, names the simpler option in one line, and lets you pick |
| `/napkin` or `/napkin full` | The full rules. The default. |
| `/napkin ultra` | Also pushes back on the requirement itself |
| `/napkin off` or `stop napkin` | Off for the rest of this session |
| `/napkin default lite` | Sets the level new sessions start at |

pager works the same way with `/pager`. The level is per session. State lives in `~/.claude/.napkin/` and `~/.claude/.pager/`, or under `CLAUDE_CONFIG_DIR` if you set it.

## nitpick

A code review from an opinionated senior developer who nitpicks everything. It runs in a fresh subagent, so it judges the code without the reasoning that produced it.

```
/nitpick                 # uncommitted changes plus the branch against its base
/nitpick feature/foo     # a branch
/nitpick main..HEAD      # a ref range
/nitpick 123             # a GitHub PR
/nitpick src/lib/date.ts # whole files
```

It checks naming and readability, function and file size, nesting, magic values, dead code, types, error handling, repetition, whether a helper already exists in the codebase, and whether new dependencies are mainstream and maintained. It looks up each new package's release history and downloads rather than guessing.

You get a verdict (Request changes, Approve with nits, or Approve) and findings ranked must, should and nit. Each has a `file:line` and the fix. Problems in code the diff didn't touch go in a separate, non-blocking list. It never edits files. Ask Claude to apply the findings when you want them fixed.

The reviewer runs on Sonnet. Change `model` in `plugins/nitpick/agents/nitpick.md` for a heavier review.

## A full project, start to finish

1. **`/founder vision`**. Describe the idea. The founder asks who it's for, what makes it remarkable and where it goes, and writes `VISION.md`.
2. **blueprint takes over**. The interview fills in users, flows, data, integrations and hosting. Agree the SOW and the MVP cut.
3. **`/craft`**. Pick a direction in the taste picker, review the prototype, iterate until it's right.
4. **`/founder brief phase-1`**. Start a build session with the kickoff prompt and the phase brief. napkin and pager are already active.
5. **Teams build**. Questions land in `docs/founder/QUESTIONS.md`.
6. **`/founder questions`**. Answer what's yours and paste the update into the build session.
7. **`/nitpick`** before each merge. Fix the musts and shoulds.
8. Repeat 4 to 7 for each phase.

## Updating and removing

```
/plugin marketplace update claude-skills
/plugin update <plugin>@claude-skills
/plugin remove <plugin>
```

Removing napkin or pager leaves their small state folders (`~/.claude/.napkin/`, `~/.claude/.pager/`). Delete them if you like.

## Troubleshooting

- **A command doesn't exist after install.** Restart Claude Code. Plugins load at session start.
- **napkin or pager seems inactive.** Check that `node` runs from a non-interactive shell (`bash -c 'command -v node'`), and that you haven't turned it off this session. Run `/napkin` to switch it back on.
- **An update didn't arrive.** Installs are cached by version. Run `/plugin marketplace update claude-skills`, then update the plugin.
- **founder says blueprint is missing.** Install it: `/plugin install blueprint@claude-skills`.
