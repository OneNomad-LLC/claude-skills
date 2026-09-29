# Fundamentals

Read this before you lay out a screen. The rest of craft (tokens, type, motion, surfaces) assumes these are already in your hands.

Everything below is a claim about the rendered result. "I used a spacing scale" is not evidence. A screenshot with the right gaps in it is.

## What premium looks like

Premium is not a style. It is the absence of visible indecision. Three families of reference cover most briefs, and they get there differently.

### Precision (Linear, Vercel, Stripe)

- Density is chosen, not accidental. Rows are 32 to 40px, text is 13 to 14px in the app, and nothing feels cramped because the hierarchy is clear and the gaps between groups are bigger than the gaps inside them.
- Borders are hairlines at low contrast. Surfaces separate by a step in lightness more often than by a shadow. Where there is a shadow it is short, tinted and layered.
- Neutrals do the work. Colour appears in one place per view: a selected row, a primary button, a status dot.
- Type is small, tight and confident. Weights are 400, 500 and 600. Display sizes are tracked in. Numbers are tabular and columns line up to the pixel.
- Everything answers instantly. Hover is 120ms, focus is drawn, menus open from their trigger, and keyboard shortcuts are shown next to the label they belong to.
- Marketing pages from these companies use real product UI as the hero, cropped and lit, never an illustration of a dashboard.

### Polish (Apple)

- Space is generous and the layout has one subject per screen. A headline, one line of support, one control, one image. Then air.
- Corner radii are concentric. An inner shape sits inside an outer one with the radius reduced by the padding, so curves stay parallel.
- Materials have a reason. Blur and translucency appear on things that float over content (toolbars, sheets) and nowhere else.
- Motion is physical. Things have mass, settle with a small overshoot or none, and can be interrupted mid-flight.
- Type is large where it matters and quiet everywhere else. Weight contrast (regular against semibold) does more than size contrast.
- Every control feels touchable. Targets are 44pt or more, pressed states are visible, and haptics or sound confirm what the eye already saw.

### Expression (Awwwards-level)

- One idea carries the whole page, and you can say it in a sentence. A typeface pushed to an extreme size, a single photograph treated with conviction, a colour used at full saturation over a large area.
- Scale contrast is violent on purpose. A 200px headline next to 12px metadata. Nothing in the middle.
- The grid is visible and then broken deliberately. Something bleeds, overlaps or sits off-axis, and everything else stays strict so the break reads as intent.
- Motion is authored. Entrances are choreographed to reading order, scroll reveals are tied to content, and there is a moment (one, not six) the visitor remembers.
- The craft under the show is still ordinary craft: real copy, correct contrast, a mobile layout composed for the phone and not squeezed from the desktop one, and a reduced-motion version that keeps the meaning.

Expression can borrow precision's discipline. It cannot skip it.

## Hierarchy

One primary thing per view. If you can't name it in a second, the view has no hierarchy, and no effect will supply one.

Use three levers, in this order of strength:

1. **Size**, the loudest. Reserve big for the one or two things that deserve it.
2. **Weight**, the cheapest. Regular against semibold separates a label from a value without adding a size to the scale.
3. **Colour**, the quietest. Primary ink, secondary ink, tertiary ink. Accent is a fourth level and is spent on the action.

Two levers beat one. A heading that is bigger, bolder and darker than its neighbours is louder than it needs to be. Change two, keep the third equal.

Apply the squint test to every render. Blur the screenshot until detail is gone. You should still find the primary element, then the secondary one, then the major groups, in that order. If the image greys into an even field, the fix is hierarchy. Shadows, gradients and animation will not rescue it.

A primary button is the most prominent pressable thing on screen. Secondary and tertiary actions step down visibly. Two filled accent buttons side by side is a decision that has not been made.

## Spacing rhythm

Use a 4px base. The 4-step gives the middle values (12, 20) that an 8-only scale forces you to fake.

**Proximity is the grouping mechanism.** Things that belong together sit close, and things that don't sit far. If you reached for a border or a card to show two items are related, the spacing was wrong first.

**Inside is smaller than outside.** Padding within a group is less than the margin between groups. A card with 16px padding needs 24 to 32px between it and its neighbour. Reverse this and the layout collapses into an even texture.

**More space above a heading than below it.** A section heading belongs to the content that follows. 48px above and 12px below reads as a heading. Equal gaps read as a list of unrelated lines.

Rhythm is the contrast between tight and generous. If you can't point at which intervals are the tight ones and which are the breaks, there isn't any. Repeating one value everywhere is the most common cause.

Density follows surface:

| Surface | Row or control height | Section gap | Body size |
|---|---|---|---|
| Data-dense app (tables, admin, dev tools) | 28 to 36px | 24 to 32px | 13 to 14px |
| Standard web app | 36 to 44px | 32 to 48px | 14 to 16px |
| Marketing site | 44 to 56px controls | 96 to 160px between sections | 16 to 18px |
| Mobile | 44 to 56pt targets | 24 to 40pt | 16 to 17pt |

Section padding on a phone is not the desktop value scaled down by feel. Set it fluid with `clamp()`. Eight rem of padding on a 375px screen is a scroll tax.

## Layout and grids

- Pick a max content width per surface and hold it. Marketing: 1120 to 1280px. Reading: 680px or a 65ch measure. App shells: fluid with a fixed sidebar (220 to 280px).
- Use a 12-column grid on desktop, 4 on mobile, with gutters from the spacing scale. Snap to it. Off-grid placement is an expressive move and has to look chosen.
- Asymmetry is stronger than symmetry. A 7/5 or 8/4 split with one dominant side has more tension than 6/6. Plain type on space often beats a container.
- A centred hero with a headline, subline, two buttons and a screenshot underneath is the default, and a default is what you're trying to avoid. Left-align, offset the media, crop the product, or let one element cross the fold.
- Don't build the page from a row of three identical cards. If the content really is three parallel things, vary the scale of one, or set them as a list with hairlines.
- Never nest cards. A card inside a card means one of them is a section.
- If a grid has an empty trailing cell, it was planned wrong. Change the shape of the grid. Don't paste in a blank tile.
- Hold one radius family across the page. Pill buttons on square cards look like two systems.

## Alignment and optical correction

Left edges line up, and within a container all content shares one inner margin. Check by drawing a vertical line down the screenshot in your head.

Then correct by eye, because computed equality lies:

- Icons next to text centre on the x-height or cap height, not the line box. A 16px icon beside 14px text usually needs a 1px nudge.
- A play triangle in a circle sits 1 to 2px right of centre. Circles and round shapes overshoot square ones by a few percent to look the same size.
- Large headings have side bearings that read as indentation. Pull display type left by 0.04 to 0.06em to align with the body edge.
- Buttons with an icon on one side need less padding on that side. Equal padding makes them look lopsided.
- Uppercase labels look higher in their box than lowercase text. Add 1px of top padding or trim the bottom.
- In dark mode, light shapes look larger than dark ones of the same size. Shrink glyphs and badges slightly.

## Colour use

**Neutrals carry the interface.** Around 90% of any screen is surface and ink. Accent is rare enough to mean something. If everything is blue, nothing is.

- Six roles: canvas, surface, ink, ink-soft, accent, accent-ink. Status colours are a separate small set and stay quiet until they matter.
- The accent owns a role: primary action, selection, one data series. Scattered small accents are confetti.
- Lock the accent for the whole product. A warm-grey site does not grow a second hue in section seven.
- Secondary text is tinted toward the surface hue, never flat grey. `#888` on a warm dark ground looks dirty.
- No pure `#000` and no pure `#fff` body text. Off-black and off-white have air in them.
- The palette comes from the brand in the brief. A stock indigo accent is a non-decision. Tokens.md covers building one from a single brand colour.
- Every design ships in light and dark, each designed on its own. Status never relies on hue alone; pair it with an icon, label or weight.

## Imagery and iconography

- One icon set, one stroke weight, one corner style, one optical size per context. Mixing a 1.5px line set with a filled set is visible from across the room.
- Icons take their size from tokens (16, 20, 24) and can never grow to fill their container. Give the base rule `flex: none`.
- Emoji are not an icon system.
- Photography has one treatment: same grade, same crop logic, same subject distance. Mixed stock reads as mixed stock.
- Use real product screenshots or real renders. A div-built fake dashboard is recognisable at thumbnail size, and so are text baked into generated images.
- Illustration, if used, is drawn from the brand's shapes and palette. Off-the-shelf blob people are the illustrated equivalent of lorem ipsum.
- Every image has a reserved aspect ratio so nothing shifts when it loads. Set `width` and `height` as a pair, and override both or neither in CSS.

## Content realism

Design with the data the product will actually hold.

- No lorem ipsum, no "John Doe", no "Acme Inc". Either write the real copy or use placeholders of realistic length, marked for replacement, as the brief decided. Error messages and empty states are always real.
- Use awkward lengths. A 34-character project name, a two-word one, a name with a diacritic, a number with six digits and a decimal. Decide what happens at twice the expected length: wrap, clamp with an ellipsis, or truncate the middle of a file name.
- Numbers are plausible and uneven ($1,284.50, not $1,000.00). No invented statistics with fake precision.
- Buttons name the outcome ("Send invoice", not "Submit"). One label per intent across the product.
- Empty states teach. Error states say what happened and what to do. Destructive confirmations state what is lost, with numbers.

## Detail and states

Half-built is the resting state and nothing else. Every interactive element needs:

- hover (pointer only, gated on `(hover: hover) and (pointer: fine)`), pressed, focus-visible, disabled
- loading, where it triggers async work, with a skeleton that matches the final layout
- empty, error and offline, wherever the data can be absent
- selected or on, for toggles, tabs and rows

Focus-visible is drawn in the accent with an offset and reaches 3:1 against what it sits on. Disabled controls say why, nearby. Press feedback is `scale(0.97)` or a 1px drop. Transitions on UI are under 300ms, on `transform` and `opacity`, with an ease-out curve.

Then the parts nobody drew: selection colour, caret colour, scrollbar, underline offset, `color-scheme`, theme-color meta, favicon in both themes, tabular numerals wherever numbers count or align.

## The three failures

### 1. It looks generic

**How to recognise it.** Cover the logo. If the page could belong to any of a thousand products, this is the failure. The signs: default shadcn radius and zinc palette, a violet-to-blue gradient, Inter at every size, a centred hero over three equal cards, a soft glow behind a screenshot, emoji or stock line icons on every feature.

**Why it happens.** Every one of those is the statistical average of what has been built before. Defaults are the path of least resistance and they carry no information about this brand.

**What to fix.** Go back to the brief and pull out three specific facts about the brand, audience and product. Derive the palette from the brand colour. Pick the face for a reason you can write in a sentence. Change the structure: an asymmetric grid, a product crop, a list on space, a different first screen. Then check that at least one thing on the page could not be moved to a competitor's site.

### 2. The fundamentals are weak

**How to recognise it.** Squint and nothing stands out. Or three things compete. Spacing feels even and slightly off. Text is a size nobody chose. Two greys sit beside each other that are not quite the same. Some columns of numbers don't line up.

**Why it happens.** The scales were never set, so each value was chosen locally. Hierarchy was added by decoration instead of by contrast.

**What to fix.** Stop decorating. Write the tokens, then rebuild one screen from them. Assign the primary, secondary and tertiary element. Snap all gaps to the scale, with tight inside and loose between. Reduce type to a scale of six or seven steps. Cut to one accent. Render again and squint.

### 3. It is missing detail

**How to recognise it.** The static screenshot is fine. Then you hover and nothing happens, tab and nothing is drawn, submit and nothing loads. The empty list is a blank rectangle. Icons are different weights. A long name breaks the row. Dark mode is the light theme inverted.

**Why it happens.** Only the resting state was designed, and only in one theme.

**What to fix.** Write the state matrix for each component and build every cell. Load the screen with real data, then no data, then too much, then an error. Tab through it. Switch theme. Zoom text to 200%. Fix what breaks.

## Craft checklist

Run this against rendered screenshots at desktop, tablet and phone widths, in light and dark. Every item is yes or no. A no is a defect.

### Hierarchy and layout

- [ ] Can I name the primary element of each view within a second of squinting?
- [ ] Is there one primary action, and is it the most prominent pressable thing?
- [ ] Is every gap on the spacing scale?
- [ ] Are gaps inside groups smaller than gaps between groups?
- [ ] Is there more space above each heading than below it?
- [ ] Do left edges line up, and does each container share one inner margin?
- [ ] Is the layout more than a centred stack or a row of equal cards?
- [ ] At the smallest width, is there no overflow, overlap or horizontal scroll?
- [ ] On phone, are frequent actions in the lower half within thumb reach?

### Type

- [ ] Are there six or seven text sizes or fewer, all from the scale?
- [ ] Is body copy between 45 and 75 characters per line?
- [ ] Is display type tracked tighter and small labels opened slightly?
- [ ] Do changing numbers and columns use tabular figures?
- [ ] Do headings balance, with no widow or single-word last line?
- [ ] Does each weight used actually exist in the loaded font files?
- [ ] Is dark-mode text set with slightly more leading and weight than light?

### Colour and theme

- [ ] Is the accent used in only one role per view?
- [ ] Is secondary text tinted, and is there no pure black or white text?
- [ ] Does body text reach APCA Lc 75 or better, and every other text at its target?
- [ ] Does every pair also clear WCAG 2.2 AA (4.5:1 body, 3:1 large and non-text)?
- [ ] Is dark mode built from its own surfaces, not an inversion?
- [ ] Can every status be read without colour?
- [ ] Does the palette trace back to the brand in the brief?

### Icons and imagery

- [ ] Is there one icon set, one stroke weight, and every icon sized from tokens?
- [ ] Do icons sit optically centred against the text they accompany?
- [ ] Do standalone icons have an accessible name, and core actions a visible label?
- [ ] Is photography graded and cropped consistently, with no faked screenshots?
- [ ] Are aspect ratios reserved so nothing shifts on load?

### Content

- [ ] Is copy real, or realistic-length placeholders clearly marked as the brief decided, with no lorem ipsum or placeholder names?
- [ ] Does the data include awkward lengths, and does every slot handle twice the expected length?
- [ ] Do buttons name the outcome, and does each intent have one label?
- [ ] Do errors say what happened and what to do next?
- [ ] Do destructive actions state what will be lost before the confirm?

### States and motion

- [ ] Do hover, pressed, focus-visible and disabled exist on every interactive element?
- [ ] Is focus-visible drawn clearly, at 3:1 against its background?
- [ ] Do loading, empty, error and offline states exist wherever they can occur, each with a next step?
- [ ] Are UI transitions under 300ms and limited to transform and opacity?
- [ ] Does reduced motion keep the opacity changes and drop the movement?
- [ ] Are touch targets at least 44 by 44, with the hit area padded when the visible element is smaller?

### Finish

- [ ] Are selection, caret, scrollbar and `color-scheme` themed?
- [ ] Are there no debug borders, placeholder boxes or TODO text?
- [ ] Would this pass as a marketing screenshot for the product? If it reads as a template, it is not done.
