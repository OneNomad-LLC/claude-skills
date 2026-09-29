# Prototypes

The prototype exists to get a yes on the design before production wiring makes
it expensive to change. Build it in the cheapest form that the user can judge
honestly, which usually means the real stack with fake data.

## Pick the form

| Situation | Prototype |
|---|---|
| Next.js project exists | Routes under `app/(proto)/proto/...` using the real tokens and components, mock data from `design/mock/*.ts`. Delete or gate the routes before release. |
| Expo project exists | Screens under `app/(proto)/` in Expo Router with mock data, reviewed on a device or simulator and on Expo web for screenshots |
| No project yet | Static HTML in `design/prototype/` with `design/tokens.css`, one file per screen, a tiny `flow.js` for navigation. Tailwind via the Play CDN is fine here and nowhere else. |
| Scroll-told marketing page | The scroll module's template and engine: [scroll/README.md](scroll/README.md) |

## What goes in

- The screens that carry the product: the one the user lands on, the one where
  the main job happens, and the one that proves the system scales (a settings
  page, a table, a long article).
- Real states on each: default, empty, loading, error, long content, and the
  first-run state if there is one.
- Both themes, switchable. A visible theme toggle in a corner outside the
  product UI is fine for review.
- The smallest and largest target sizes.
- Realistic mock data with awkward lengths: a name that wraps, a number with
  seven digits, one item, zero items, 400 items.
- The copy decided in the brief: real copy, or placeholders of realistic length
  marked clearly (e.g. wrapped in a `data-placeholder` span that renders with a
  dotted underline in the prototype only).

Leave out anything that doesn't change the user's judgement: auth, real APIs,
persistence, analytics.

## Flows

When the main job spans screens, make it clickable end to end. In a Next.js or
Expo prototype that's just links and local state. For static HTML, one section
per step with `data-step`, a `flow.js` under 150 lines that shows one step at a
time, and `#step` deep links so a reviewer can open any step directly.

Keyboard works in every prototype: Tab reaches everything, Enter and Space
activate, Escape closes overlays.

## Review loop

1. Render with `shoot.mjs` at the target sizes, both themes.
2. Look at every contact sheet. Fix what's wrong before the user sees it.
3. Show the user: the local URL, the contact sheets, and two or three sentences
   on the decisions that matter (the type, the palette, the navigation model).
   Ask for a yes, or for what to change.
4. Record the verdict and any decisions in BRIEF.md under Decisions.

Offer a second direction only when the taste picks were split or the user asks.
Two directions means both are finished to the same level on the same screen;
a polished one next to a rough one isn't a choice.

## Moving to production

Reuse, don't rebuild. Components built for the prototype move into the real
component folder; mock data becomes the shape the API has to fill. Anything
the prototype faked (timers, fake latency) gets a note so the build replaces it.
