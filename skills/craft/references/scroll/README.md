# Scroll module

Scroll-told landing pages are one mode of craft. Scroll is the one input every visitor already knows, so this mode treats it as a timeline: the wheel is a scrubber, the page is a film with real text on top, and each section behaves differently enough that the visitor keeps going to find out what the next one does. Adapted from scroll-craft by Nate Herk (MIT, see NOTICE).

The main craft interview already covers subject, audience, assets, copy and taste. Do not ask those again. This file covers what is specific to a scroll page.

What you produce: a brief, a journey, a page grammar, a feeling curve with one engineered peak, a scroll score, one signature move, assets, one real HTML page on a token-driven floor, and screenshots proving it holds at every scroll position.

## Scroll-specific questions

Ask these in one pass, and only the ones the main interview left open.

1. **Energy curve.** Where should it feel calm, where intense? A page loud the whole way is as flat as one quiet the whole way.
2. **Feeling by stage, and the one moment.** Energy is loudness, feeling is emotion, and they do not line up: on a loud page the quiet act can be the most intense. The stage answers become the feeling curve, the one moment becomes the peak. See [feel.md](feel.md).
3. **Signature-move seed.** One thing this site should do that no site they have seen does. "Be memorable" is not an answer.
4. **Distance from premium-minimal.** Offer the range in [uniqueness.md §5](uniqueness.md): brutalist, maximalist, playful, retro, dense, editorial, premium-minimal. Their answer sets the aesthetic family.
5. **One unbroken world or distinct scenes.** One continuous place the scroll flies through ([worldflight.md](worldflight.md)), or separate scenes, chapters and cuts. The biggest structural fork, and theirs to call. Neither is the default.

Record the answers in `<workspace>/builds/<name>/BRIEF.md` in their words. Under explicit creative delegation, write the brief yourself, label it `Self-authored under explicit creative delegation`, and proceed. BRIEF.md also carries the feeling curve, the peak written as the sentence a visitor would say to a friend, the completed sentence "It's the site where ___" (an experience, not a device name), and any authored silence so verification can tell it from dead scroll.

## Setup

```bash
node <skill>/scripts/doctor.mjs                       # preflight
node <skill>/scripts/scroll-workspace.mjs --ensure    # resolve and create the workspace
```

The workspace resolves from `CRAFT_HOME`, then the nearest `.craft.json` (`{ "workspace": "..." }`), then `<project root>/craft-work`. Builds live in `<workspace>/builds/<name>/` and the fingerprint registry in `<workspace>/FINGERPRINTS.md`, which starts empty.

Copy `engine/scrollcraft.js` and `engine/scrollcraft.css` into the build folder. Never edit the engine per project. Theme it with tokens and write your own markup.

A `KIE_AI_API_KEY` is needed only to generate assets. Building from supplied photos and footage needs no key. Check the balance with `node <skill>/scripts/kie.mjs probe`.

## Journey beats

Write four to seven beats before anything else, each a shift in what the visitor knows or feels:

```
1  Recognition   they see their own morning
2  Tension       the cost of it, named plainly
3  Turn          the thing that changes
4  Substance     why it holds up
5  Range         what they can choose
6  Commitment    the one action
```

Sections serve beats. A section that serves no beat is cut, however good the shot. Also settle what the visitor must believe by the end (one sentence) and the one action they take next, with one label used everywhere.

## Grammar, signature move, fingerprint gate

Details in [uniqueness.md](uniqueness.md). Do all three before planning acts.

- **Pick a grammar** from the eight defined ones. A new grammar needs a different navigation, sequence, ending and set of bans, not just a new label. Filmic one-shot is the default trap, so if you choose it, say why the other seven lost.
- **Invent the signature move.** One bespoke interaction coded in the page, seeded by question 3. A recoloured spotlight or a retuned tilt is not one. The engine stays untouched.
- **Run the fingerprint gate.** Compare the plan against every row in `<workspace>/FINGERPRINTS.md`. It must differ from each row on at least 4 of 6 dimensions: grammar, nav treatment, hero device, act-sequence shape, close pattern, signature move. If it fails, change the plan, not the log. The format is in [FINGERPRINTS.md](FINGERPRINTS.md).

## Feeling curve, then the score

Write one line per act, the emotion then what on screen causes it, before the score table. A device chosen before the feeling is a device looking for a reason. Name the peak in the same pass and give it the largest span on the page. Method in [feel.md](feel.md).

Then give each beat a device, with the reason:

| Beat | Device | Why this one |
|---|---|---|
| Recognition | `scrub` | The camera moving under the reader's own hand is the strongest open |
| Tension | `pin` + kinetic | Copy assembles line by line while the frame holds still |
| Turn | `reveal` | A wipe is a change of state, which is what this beat is |

That is a filmic score. Read your grammar's leans-on and bans list before filling rows. Device patterns are in [devices.md](devices.md).

Checks before building:

- The grammar's bans hold.
- Four or more device families, never the same one twice in a row.
- At most two `scrub` acts.
- No two adjacent acts share a feeling. If they do, one is filler.
- One peak, with the largest span by a visible margin, and a quieter act before it.
- Every act earns its span. Eight to fourteen viewport heights is a pacing reference for long cinematic pages, not a quota.
- Act count and length avoid the 6 to 7 acts at 13.6 to 13.8vh band, which is a fingerprint dimension.

## Assets

Pipeline, prompt scaffolds and model notes are in [assets.md](assets.md). The commands:

```bash
node <skill>/scripts/kie.mjs still "<style preamble>\n\n<scene>" out/01-hero.png --ar 16:9 [--ref brand-can.png]
node <skill>/scripts/kie.mjs shot  "<camera move>" out/01-hero.png out/01.mp4 --dur 5
bash  <skill>/scripts/encode.sh out/01.mp4 assets/01.mp4
bash  <skill>/scripts/encode.sh out/01.mp4 assets/01-m.mp4 mobile
```

Reuse one style preamble verbatim in every prompt so separate images read as one shoot. Look at every asset before using it. Encode for scrubbing, not playback: `encode.sh` sets a dense GOP because seeking walks from the previous keyframe. Layer the hero into planes that move at different rates (the `parallax` recipe in [devices.md](devices.md)), and read [hero-depth.md](hero-depth.md) before planning it. Worlds and art direction are in [worlds.md](worlds.md); the ten-site execution standard is in [approved-collection.md](approved-collection.md).

## Build

Write real HTML: real `<h1>`, `<p>`, links and reading order. The engine reads `data-sc-*` attributes and drives the markup; it never generates DOM. Start from [template.html](template.html) and read [taste.md](taste.md) before writing markup. Theme by overriding tokens, six values and two fonts:

```css
:root {
  --sc-canvas: #0A0806;  --sc-surface: #16110E;
  --sc-ink:    #F5EBDD;  --sc-ink-soft: #A2968A;
  --sc-accent: #FF5A3D;  --sc-accent-ink: #15110F;
  --sc-font-display: "Archivo", system-ui, sans-serif;
  --sc-font-text:    "Geist", system-ui, sans-serif;
}
```

## Verify

A scroll page has no single state, and failures live between the two frames you happened to look at. Full procedure in [scroll-verify.md](scroll-verify.md).

```bash
node <skill>/scripts/serve.mjs --root . --port 4500 &
node <skill>/scripts/scroll-shoot.mjs --url http://localhost:4500 --out lab/shots
node <skill>/scripts/scroll-shoot.mjs --url http://localhost:4500 --out lab/mobile --width 390 --height 844
node <skill>/scripts/scroll-shoot.mjs --url http://localhost:4500 --out lab/reduced --reduced-motion
node <skill>/scripts/worldflight-assert.mjs --url http://localhost:4500    # worldflight builds only
```

The harness reports dead scroll, cues that never reach full opacity, and contrast measured on the composited page. Then read `sheet.png` yourself, tab through for focus order, and run the feel check ([feel.md §6](feel.md)): one word per act for what you felt, then diff against BRIEF.md. Where they disagree the page is wrong, not the brief. Headless Chrome cannot reproduce a phone's video decoder, autoplay policy or touch scrolling. On any mobile defect, deploy [device-diag.html](device-diag.html) beside the site on the first round.

## Principles

- **Variety is the product.** Five sections that behave identically are one section shown five times. Use several device families and score the journey so no two neighbours match.
- **Photographic by default.** Clay, low-poly and claymation dioramas are recognisable at a glance and make every site look alike. Use them only when the brand is genuinely illustrated.
- **Decide structure separately from style.** A different world is not a different page. Pick the grammar deliberately or every build inherits the same skeleton.
- **Chain only on request.** One unbroken camera flight is the most fragile thing to build and exists to hide cuts. Varying the device removes the cut for free.
- **Brief before assets.** Generating first bakes in guesses. Record real answers, or explicitly delegated decisions, in BRIEF.md.
- **Feeling before devices.** A curve written first gives each device a job. One peak gets the asset budget, the silence before it and the most scroll room. Two peaks cancel out.
- **The ending resolves.** The last feeling is the one visitors carry, so the close holds instead of fading into a footer.
- **Keep the engine fixed.** Bespoke behaviour belongs in the page, driven off `--sc-p` and your own `data-sc-*`, so the mechanism stays trustworthy across builds.
- **Fix contrast locally.** A full-frame dark overlay flattens the image. Put a scrim only where the text sits.
- **Text stays markup.** Baked-in text is not selectable, translatable or sharp.
- **Only real numbers.** An invented statistic in a counter costs trust. No number, no counter.
- **Animate cheap properties.** `transform` and `opacity`, with `clip-path` for wipes. Animating layout properties or using `transition: all` janks under scrub.
- **Avoid the tells.** Scroll cues, `01 / 06` counters, an eyebrow over every heading, centred copy in every act, gradient text, neon glow and zero-offset halo shadows all read as machine-made. Vary the text anchor and let headings carry themselves.
- **No em dashes in visible copy.** Use a period, comma, colon or parentheses.
- **Silence the clips.** Audio on a scrub clip is a bug. `encode.sh` strips the track.
- **Always verify by scrolling.** A green harness is not a real phone, so say what you did not verify.

## Output

The build folder with BRIEF.md, then a short report: the grammar and why the others lost, the signature move, the gate result against each registry row, the journey, the feeling curve and peak, the feel-check diff, the score table, what you generated, what you verified and what you could not, whether the brief was self-authored, and the local URL. Then append the build's row to `<workspace>/FINGERPRINTS.md`.
