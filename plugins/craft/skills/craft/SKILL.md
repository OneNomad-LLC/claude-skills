---
name: craft
description: >
  Design and build premium web and app interfaces: marketing sites, landing
  pages, web apps and dashboards, mobile apps (Expo/React Native) and desktop or
  OS UI. Runs a short brief interview and a taste picker (real example sites the
  user rates), sets an OKLCH token system with designed light and dark themes,
  builds a prototype for review, then production code in Next.js + Tailwind or
  Expo, and verifies it with rendered screenshots, contrast and focus lint, and a
  critic pass. Includes a scroll-told landing page mode with layered heroes,
  scroll-scrubbed video and generated imagery through kie.ai. Use for "design
  this", "make it look premium", "redesign", "this looks generic", "this looks
  like a template", "landing page", "marketing site", "dashboard UI", "app
  screens", "design system", "tokens", "dark mode", "polish the UI", "scroll
  animation site", "cinematic hero", "Apple-style landing page", or any request
  for a distinctive, high-end interface.
---

# craft

Most of what makes an interface read as generated is a pile of small
failures: a type scale nobody chose, spacing that drifts by
2px, an accent on everything, a card that has no reason to be a card, a button
with no pressed state, a page that never considered dark mode. This skill makes
those decisions on purpose and then checks the rendered result.

The work goes brief, taste, tokens, prototype, build, verify. Each phase writes
a file the next one reads, so a later session can pick up where this one
stopped.

## Size the process to the request

| Request | Do |
|---|---|
| New product, site or app | Every phase below |
| Redesign of something live | [references/redesign.md](references/redesign.md) first (mode, audit, what never changes silently), then the phases below |
| New screen or flow inside an existing design system | Short brief (job, states, data), reuse the existing tokens, prototype the screen, build, verify |
| A component, a fix, "polish this" | No interview. Read the existing tokens and components, apply [fundamentals](references/fundamentals.md) and [components](references/components.md), verify |
| A scroll-told landing page, cinematic hero, scroll-scrubbed video | Phases 1 to 3 here, then the scroll module: [scroll/README.md](references/scroll/README.md) |

When the codebase already has a design system, it wins over your taste. Extend
it, and say where it's weak instead of quietly forking it. Some surfaces come
with an official system that should be used as-is rather than imitated: Shopify
admin (Polaris), Atlassian apps (Atlaskit), Microsoft 365 add-ins (Fluent), UK
and US public-sector services (GOV.UK Frontend, USWDS). Install the real
package; don't restyle it into something else.

## Phase 1: Brief

Interview the user. Questions, batching and the BRIEF.md template are in
[references/interview.md](references/interview.md). Ask with the
AskUserQuestion tool in rounds of up to four, skip anything the conversation or
codebase already answers, and ask the subject open-ended rather than as a menu.

Always settle, per project: who it's for and the one thing they must do or
believe; surfaces and platforms; existing brand assets and code; personality
in the user's words; how far from premium-minimal to go; **whether craft writes
the real copy or uses realistic-length placeholders**; motion appetite.

If the user explicitly hands over creative direction, write the brief yourself,
mark it `Self-authored under creative delegation`, and keep going.

Before moving on, write the design read as one line at the top of the brief
and say it to the user: "Reading this as: <what it is> for <audience>, with a
<character> language, leaning toward <stack and type direction>." If the user
would correct it, now is the cheap time.

Output: `design/BRIEF.md` in the project (create `design/` at the repo root).

## Phase 2: Taste

For new work, run the taste picker unless the user declines. Find 8 to 12 real
examples that match the request and span a real range, screenshot them, and let
the user mark likes and dislikes in a local picker page. Full method in
[references/taste-picker.md](references/taste-picker.md).

```bash
node <skill>/scripts/capture.mjs design/taste --phone
node <skill>/scripts/picker.mjs design/taste --open
```

Read `design/taste/picks.json` and look at the liked and disliked screenshots
yourself. Write a **Taste** section into BRIEF.md: the specific qualities that
recur in the likes, the ones that recur in the dislikes, and what that means
for this project. Borrow principles, never layouts.

## Phase 3: Tokens

Define the system before drawing a screen. Rules and working code for CSS,
Tailwind v4, shadcn and Expo are in [references/tokens.md](references/tokens.md);
type choices and pairings are in [references/typography.md](references/typography.md).

- Colour in OKLCH, derived from the brand. Neutrals tinted toward the brand hue.
- Light and dark both designed, then every text and surface pair checked with
  APCA. Targets: Lc 75 or better for body text, 60 for other content text, 45
  for large headlines. WCAG 2 AA is the floor underneath that.
- Spacing on a 4px base, a type scale sized to the surface, 3 or 4 radii, 3
  elevation levels, motion durations and easings, icon sizes.
- The type pick gets one or two sentences in BRIEF.md tying it to the brand.

Output: the project's token file (`app/globals.css` or equivalent for Next.js,
`theme/tokens.ts` for Expo, `design/tokens.css` for static work).

## Phase 4: Prototype

Build the key screens as a working prototype before any production wiring, and
get the user's review. Format per stack is in
[references/prototyping.md](references/prototyping.md). Mock data only, real
states included (empty, loading, error, long content), both themes, the
smallest and largest target sizes.

Render it, look at the renders, fix what you see, then show it:

```bash
node <skill>/scripts/shoot.mjs http://localhost:3000/proto --themes light,dark \
  --viewports desktop=1440x900,phone=390x844 --sheet --out design/renders/proto
```

Stop for the user's review. Offer a second direction only when the taste picks
were split or the user asks.

## Phase 5: Build

Production code on the approved prototype. Surface-specific guidance:

- [surfaces/marketing.md](references/surfaces/marketing.md)
- [surfaces/web-app.md](references/surfaces/web-app.md)
- [surfaces/mobile.md](references/surfaces/mobile.md): native navigation and
  behaviour with a brand skin is the default
- [surfaces/desktop.md](references/surfaces/desktop.md)

Always in play: [fundamentals.md](references/fundamentals.md),
[components.md](references/components.md) (shadcn and Radix for behaviour,
restyled until nothing reads as a default kit) and
[motion.md](references/motion.md) (expressive on marketing, quick in apps).

Every interactive element gets its full state set: hover, pressed,
focus-visible, disabled with a reason, loading, error, selected. Every data view
gets empty, loading and error states. This is where most generated UI falls
short, so check it deliberately.

## Phase 6: Verify

Not optional. Procedure in [references/verify.md](references/verify.md):

1. The project's own checks (typecheck, lint, tests, build).
2. `shoot.mjs` across themes and viewports, plus `--reduced-motion`. It lints
   APCA and WCAG contrast, invisible focus, off-scale spacing, overflow, clipped
   text, icon blowouts, small tap targets, missing accessible names, broken
   images, console errors, requests that leave the machine, em dashes in visible
   text, wrapping buttons and navigation at desktop, one action under several
   labels, too many eyebrow labels, and 100vh heroes. Exit 1 means fix.
3. Open every contact sheet and look. Write down what's wrong before fixing it.
4. Interaction pass in the user's real browser with Claude in Chrome when it's
   available: hover, Tab through focus order, the main flow end to end.
5. Copy audit: re-read every visible string (headings, buttons, captions, alt
   text, errors) and rewrite anything grammatically off, vague about what it
   refers to, or trying to sound clever. Plain beats cute.
6. Critic pass: spawn the `craft-critic` agent on the contact sheets and brief.
7. Fix, render again, look again. Two rounds is normal.

Report what you verified and what you couldn't (a real phone, native gestures,
haptics, a browser you don't have).

## Setup

```bash
node <skill>/scripts/doctor.mjs
```

Scripts install Playwright and colorjs.io once into `~/.cache/craft-tools`
(override with `CRAFT_TOOLS_DIR`), so nothing is added to the project.
Generated imagery needs `KIE_AI_API_KEY` in the environment or a `.env` the
project ignores. Never write the key into any file that gets committed, and
never print it.

## Output

The working code, `design/BRIEF.md` (brief, taste notes, type rationale), the
token file, renders under `design/renders/`, and a short report: what was built,
the direction and why, what the verification found and what you changed after
looking, and what is still unverified.
