# The taste picker

Words like "clean", "bold" and "premium" mean something different to everyone.
The picker replaces them with reactions to real screens. The user rates 8 to 12
examples, and the pattern in their likes and dislikes becomes the Taste section
of the brief.

## 1. Find examples

Search for live sites and apps that match the request: same category, similar
audience, and adjacent categories whose craft transfers (a banking app can teach
a fitness dashboard about density). Use web search, and the galleries that
curate well: godly.website, land-book.com, siteinspire.com, awwwards.com,
minimal.gallery, and for product UI the public marketing and docs pages of
companies known for it. App screens behind a login (Mobbin and similar) aren't
reachable; use App Store and Play Store listing screenshots instead, downloaded
to a local file.

Choose for range, not agreement. A set of ten near-identical minimal sites
teaches nothing, because every answer is "like". Aim for:

- Two or three that sit where the brief points.
- Two or three that push further in the same direction (more expressive, or
  more restrained).
- Two or three that deliberately go another way: different density, a serif
  where the rest are sans, dark-first, image-led instead of type-led.
- At least one from the direct category, so the user sees how peers look.

Write one `why` line per example naming the specific quality it represents
("12px dense tables with strong number alignment", "serif display over full
bleed photography"), never "clean and modern".

## 2. Capture

Write `design/taste/examples.json`:

```json
[
  { "id": "linear-home", "title": "Linear", "url": "https://linear.app",
    "why": "precise type, near-monochrome UI with one accent", "category": "web-app" },
  { "id": "things-ios", "title": "Things 3 (App Store)", "image": "design/taste/raw/things.png",
    "why": "native iOS navigation with a custom, warm skin", "category": "mobile" }
]
```

Optional `"scheme": "dark"` renders a site in dark mode.

```bash
node <skill>/scripts/capture.mjs design/taste --phone      # --full adds a long full-page shot
```

It screenshots each URL at 1440x900 (and 390x844 with `--phone`), tries to
dismiss cookie banners, copies `image` entries in as they are, and records
failures in examples.json without stopping. Look at the shots before showing
them. Replace any that captured a cookie wall, a blank page or a login screen.

## 3. Pick

```bash
node <skill>/scripts/picker.mjs design/taste --open
```

It serves a local page on 127.0.0.1. Tell the user it's open and what to do:
like or dislike each example, add a word on what specifically, submit when
done. The server writes `design/taste/picks.json` and exits. Progress is saved
as they go, so a closed tab loses nothing.

If the browser can't be opened for them, give the URL.

## 4. Read the picks

Open `picks.json`, then look at the liked and disliked screenshots again with
the verdicts in mind. Notes beat verdicts: "love the type, hate the purple"
tells you more than a like.

Write the Taste section of BRIEF.md:

- **Recurring in likes**: concrete, checkable qualities. "Large tight-tracked
  sans display, generous whitespace, product shown in real UI screenshots,
  monochrome with a single warm accent."
- **Recurring in dislikes**: same precision. "Gradient backgrounds, illustrated
  characters, busy dashboards with many coloured charts."
- **For this project**: what those mean here, as decisions. "Type-led hero,
  neutral palette tinted toward the brand amber, one accent, real screenshots
  over illustrations."
- **Split signals**: where the picks disagree. That's the place to offer two
  directions in the prototype.

Borrow principles, never layouts. If a render starts to look like a specific
example, change it.

Keep `design/taste/` out of anything public if the screenshots are of other
companies' work; they're reference, not assets.
