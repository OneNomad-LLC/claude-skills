# The brief interview

The interview turns a request into decisions a design can be checked against.
Keep it short. Most people will answer eight good questions and resent twenty.

## How to ask

- Use AskUserQuestion, up to four questions per round, two or three rounds.
- Before asking anything, read what you already have: the conversation, the
  repo (existing tokens, components, fonts, a brand folder, README), and any
  linked site. Don't ask what those already answer. Say what you found instead.
- If `docs/SOW.md` exists (the blueprint skill writes it), read it and any
  pre-filled `design/BRIEF.md` first. Roles, screens, states, content and
  constraints are settled there; ask only about character, copy, motion and
  taste.
- Ask the subject open-ended. A made-up menu of industries or audiences biases
  the answer and reads as you deciding their business for them. Multiple choice
  is right for ranges and forks (how expressive, which platforms, copy or
  placeholders), wrong for "what is this".
- When an answer is vague ("clean", "modern", "premium"), ask one follow-up
  that forces a concrete choice, or let the taste picker settle it.
- Record answers in the user's words. Don't polish them into marketing prose.

## Round 1: what and who

1. **What is it, and who is it for?** One or two sentences, in their words.
   Include the situation the user is in when they use it, if it matters
   (one-handed on a phone, at a desk all day, glancing between tasks).
2. **What must someone do or believe by the end?** One action or one sentence.
   If they give three, ask which one wins.
3. **Surfaces and platforms.** Marketing site, web app, iOS, Android, desktop,
   an OS or shell UI. Smallest and largest screen that matter.
4. **What exists already?** Logo, colours, fonts, photography, product shots,
   footage, a brand doc, a codebase with its own components. Real assets beat
   generated ones.

## Round 2: character

1. **Personality in three to five words**, plus up to three references from any
   medium: a film, a magazine, a shop, an album cover, an app they love using.
2. **How far from premium-minimal?** Offer the range: precise and restrained
   (Linear, Vercel, Stripe), polished and spacious (Apple), editorial,
   expressive and experimental (Awwwards territory), playful, dense utility,
   brutalist. Their answer sets the family. Your taste doesn't.
3. **Copy.** Should craft write real copy from the brief, or design around
   realistic-length placeholders that get replaced later? Ask every project.
   Real copy makes the design honest; placeholders are right when copy is owned
   by someone else or still in legal.
4. **Motion appetite.** Quiet and functional, considered micro-interactions, or
   motion as a signature (scroll-driven scenes, a cinematic hero). For a
   marketing page that wants the last one, the scroll module has its own extra
   questions: see [scroll/README.md](scroll/README.md).

## Round 3: constraints (only what applies)

- Accessibility needs beyond the default (craft already targets APCA with WCAG
  2.2 AA as the floor, keyboard access, reduced motion, 44px targets).
- Content source: hard-coded, a CMS, user-generated. Longest realistic content.
- Performance or device limits (low-end Android, kiosk hardware, offline).
- Anything that is a hard product rule, e.g. "no account required", "no
  invented numbers", "must match the existing app".
- Deadline or scope cut: which screens are in, which are out.

Then run the taste picker ([taste-picker.md](taste-picker.md)) unless the user
declines or this is work inside an existing system.

## Creative delegation

When the user says "use your judgment" or otherwise hands over direction,
don't force more questions. Write the brief yourself, put
`Self-authored under creative delegation` at the top, separate what you know
from what you assumed, and proceed. Say so in the final report.

## design/BRIEF.md

```md
# <Project> brief

Status: interviewed | self-authored under creative delegation
Date: YYYY-MM-DD
Mode: new | redesign (preserve) | redesign (overhaul) | rebrand

Reading this as: <what it is> for <audience>, with a <character> language,
leaning toward <stack and type direction>.

## What and who
<their words>

## The one thing
Do: <action, with the single label used for it everywhere>
Believe: <sentence>

## Surfaces
<platforms, smallest and largest sizes, themes (light and dark by default)>

## Assets
<what exists, where it lives, what must be generated>

## Character
Words: <3 to 5>
References: <any medium>
Range: <where on the premium-minimal to expressive range, in their words>
Motion: <appetite>

## Copy
Real copy by craft | placeholders marked for replacement

## Constraints
<hard rules, a11y extras, content source, performance, scope>

## Taste
<filled after the picker: recurring qualities in likes, in dislikes, and what
that means here, specific enough to check a render against>

## Type
<faces, and one or two sentences tying them to the brand>

## Decisions
<dated one-liners for anything settled later that a future session would
otherwise re-open>
```
