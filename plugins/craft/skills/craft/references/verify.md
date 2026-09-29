# Verification

A design is verified when someone has looked at the rendered pixels in every
theme and size that matters, and the automated checks are clean. Source code
that "should render fine" isn't verified. Neither is a green lint run nobody
looked past.

Run it once per logical change, not after every edit.

## 1. The project's own checks

Whatever the repo has: `pnpm typecheck && pnpm lint && pnpm test --run && pnpm build`,
or the Expo equivalents. Stop at the first failure.

## 2. Render and lint

Serve a production-like build (`pnpm build && pnpm start`, or `npx expo start --web`
for Expo, or `node <skill>/scripts/serve.mjs --root design/prototype` for static
work). Then:

```bash
node <skill>/scripts/shoot.mjs \
  http://localhost:3000/ http://localhost:3000/dashboard "http://localhost:3000/dashboard?state=empty" \
  --themes light,dark --viewports desktop=1440x900,tablet=1024x768,phone=390x844 \
  --sheet --out design/renders/<change>
node <skill>/scripts/shoot.mjs http://localhost:3000/ --reduced-motion --themes light \
  --viewports phone=390x844 --out design/renders/<change>-reduced
```

Useful flags: `--full-page` for long pages, `--theme-attr` when the app uses a
different attribute than `data-theme` (a `dark` class on `<html>` is toggled
automatically), `--spacing-scale 8` for an 8px system, `--min-target 48` for
Android-first work, `--video steps.json` to record a flow (`--help` shows the
steps format).

It writes one PNG per page, viewport and theme, a contact sheet per page, and
`report.md`. Lint errors exit 1:

| Check | What it catches |
|---|---|
| contrast | APCA Lc under 60 for small text or 45 for large, and WCAG 2 below 4.5:1 or 3:1. Body copy under Lc 75 is a warning. Text over images is reported as unchecked; check those by eye. |
| focus-invisible | An element whose appearance doesn't change when it receives keyboard focus |
| off-scale spacing | Margins, padding and gaps off the spacing scale (warning, summarised per page) |
| overflow, clipped text | Horizontal scroll, text cut off by its container |
| icon blowout | An SVG icon with no size rule that grew to fill its box |
| tap targets | Interactive elements under `--min-target` |
| names, images | Missing accessible names, broken images |
| console, network | Runtime errors, and requests that leave the machine |
| em-dash | Em and en dashes in visible text (warning) |
| cta-wrap, nav-wrap | A button label or the main navigation wrapping onto a second line at 1024px and wider |
| duplicate-cta-intent | One action under several labels, like "Get in touch" and "Let's talk" (warning) |
| eyebrow-count | Small uppercase labels above more than one section heading in three (warning) |
| viewport-height | Full-height sections sized with 100vh, which jump on mobile browsers; use 100dvh or 100svh (warning) |

When a screen is designed for one viewport only, render it at that viewport
only, or overflow at the others is noise.

## 3. Look

Open every contact sheet with the image reader and look at it the way the user
will. Write down what's wrong before touching code: alignment, rhythm, weight,
a state that looks unfinished, a dark theme that's just an inversion, anything
that looks like a template. Run the checklist at the end of
[fundamentals.md](fundamentals.md) against the renders, not the source.

"Looked, all good" on a first pass means you didn't look hard enough.

## 4. Read the copy

Read every visible string on the rendered pages, top to bottom: headings,
buttons, captions, alt text, empty states, errors, the footer. Rewrite anything
that is:

- grammatically off, or a phrase that sounds right and means nothing
- vague about what it refers to ("we plan to keep it that way" with no "it")
- trying to sound thoughtful: forced metaphors, mock-humble asides, poetic
  labels on functional sections ("Field notes" for a blog)
- a number that looks precise but came from nowhere

If a string is doubtful, replace it with a plain sentence that says what the
thing does. Cute copy that misses is worse than plain copy. This applies to
placeholders too: realistic length, but still sensible.

## 5. Interact

Screenshots can't show hover, focus order, or how a flow feels. When Claude in
Chrome is available, open the running app in a new tab of the user's browser
and:

- Tab through every page. Focus is visible everywhere and the order makes sense.
- Hover every kind of interactive element once.
- Run the main job end to end, including one error path.
- Open and close every overlay with the keyboard.

Don't resize the user's window; use `shoot.mjs` viewports for sizes. When Chrome
isn't available, record the flow with `--video` instead and watch it.

## 6. Critic pass

Spawn the `craft-critic` agent with the brief path, the contact sheet paths and
`report.md`. It returns a must, should and nice list judged against the brief
and the checklist. Fix the musts, most of the shoulds, and say which you left.

## 7. Again

Fix, render again, look again. Two rounds is normal. A third usually means the
brief or the tokens were underspecified; fix them, not only the screen.

## What a green run doesn't cover

Say these plainly in the report when they apply:

- **A real phone.** Headless Chromium isn't Safari on iOS or Chrome on a
  mid-range Android. Video decoding, autoplay, touch scrolling, safe areas and
  font rendering differ.
- **Native apps.** Expo web screenshots catch layout and contrast, not native
  rendering, gestures, haptics or platform navigation. Ask the user to check on
  a simulator or device, and say which screens.
- **Real content.** Mock data never has the one customer name with 60
  characters. Say which slots were tested at 2x length.
