# Redesigns

A redesign starts from something live: real pages ranking in search, links in
people's bookmarks, analytics events someone reports on every Monday, and a
brand that customers already recognise. Treating it as a new project is how
redesigns lose traffic and trust. Getting the mode wrong is the most common way
a redesign goes bad.

## 1. Decide the mode

- **Preserve**: modernise without changing who the brand is. Same logo, palette
  family, voice and structure. Most client redesigns are this.
- **Overhaul**: a new visual language on top of the existing content and
  structure. Treat the visuals as new; keep the content and information
  architecture.
- **Rebrand**: the brand itself is changing. Run the full craft process as new
  work, and still do the audit below so nothing breaks on the way.

If the request doesn't make it clear, ask once: "Should this keep the current
brand, or are we starting visually from scratch?"

## 2. Audit before touching anything

Write `design/AUDIT.md` from the live site and the codebase:

- **Brand tokens in use**: colours, type stack, logo treatment, radii, icon set.
  Pull them from the CSS, not from memory of the screenshots.
- **Information architecture**: page tree, main navigation, the key paths to
  conversion.
- **Content**: which blocks do work and which are filler.
- **What to keep**: signature interactions, a recognisable hero, the copy voice,
  anything customers would miss.
- **What to retire**: generated-looking patterns, broken layouts, dead links,
  generic stock imagery, performance traps.
- **SEO baseline**: the pages that rank, meta titles and descriptions,
  structured data, Open Graph cards, canonical URLs. This is the biggest risk in
  any redesign.
- **Tracking**: analytics events, form field names, IDs and classes that tag
  managers or tests select on.
- **Accessibility wins to keep**: focus states, alt text, keyboard paths,
  contrast that already passes.
- **Renders of the current site**: run `shoot.mjs` against it at the target
  sizes before changing anything, so there's a before to compare with.

## 3. Never change these without asking

- URL structure and slugs
- Main navigation labels
- Form field names and order (analytics and browser autofill depend on them)
- The logo or wordmark
- Legal, consent and cookie copy
- Anything the audit found tracking or tests depend on

When a change to one of these would clearly help, propose it with the reason and
the risk, and wait.

## 4. Pull the levers in order

Stop when the brief is met. Each step is a bigger change with more risk than the
one before it.

1. **Type.** The largest visual lift for the least risk. A better scale,
   tighter display tracking, a considered face.
2. **Spacing and rhythm.** Section padding, vertical rhythm, the inside-smaller-
   than-outside rule.
3. **Colour.** Unify the neutrals, tint them toward the brand, cut accents back
   to one role. The brand colour stays recognisable. A brand that is already
   purple stays purple.
4. **States and motion.** Missing hover, focus, loading, empty and error states,
   then micro-interactions suited to the surface.
5. **Recompose key sections.** The hero and the top of the funnel, using the
   structure principles in [surfaces/marketing.md](surfaces/marketing.md).
6. **Replace whole blocks.** Only where the existing block can't be saved.

As a rule of thumb: when the structure, content and SEO are sound, levers 1 to 4
deliver most of the value at a fraction of the risk. When the structure itself
is broken (no system, broken mobile, confused navigation), a full redesign that
keeps the content is justified. When the brand is changing, it's new work.

## 5. Tokens from what exists

In preserve mode, derive the token set from the audit: the existing brand colour
becomes the hue anchor in [tokens.md](tokens.md), the existing type becomes the
starting point in [typography.md](typography.md). Improve the scale and the
contrast; don't swap the identity. Record every deliberate change in BRIEF.md
under Decisions with the old value and the new one.

## 6. Verify against the before

Render the same pages at the same sizes after the change and compare the contact
sheets side by side. Then check what a screenshot can't show:

- Every old URL still resolves, or redirects on purpose.
- Titles, descriptions, structured data and OG images survived.
- Tracked events still fire with the same names.
- Forms still submit with the same field names.

Report what changed, what was deliberately kept, and anything from section 3 you
proposed and are waiting on.
