# Marketing sites

A marketing page has one job: move a specific visitor from "what is this" to one action. Everything on the page either helps them believe something they need to believe, or gets out of the way. Read [../fundamentals.md](../fundamentals.md) for spacing and hierarchy, [../tokens.md](../tokens.md) before choosing colour, and [../typography.md](../typography.md) before choosing type. Marketing pages live or die on type, so do not skip that one.

## Derive the structure, don't pick a template

Hero, three feature cards, logo strip, pricing, footer is a template, not a structure. It answers no question the visitor actually has.

Work backwards. In the interview, get answers to these:

- Who arrives, and from where? Ad, search, a friend's link, a press mention.
- What do they already believe when they land?
- What must they believe before they will act? List these as plain claims: "it works with my stack", "it is fast", "other teams like mine use it", "I can afford it", "I can leave if it goes wrong".
- What is the one action? Book a demo, start free, download, join the waitlist, order.

Each belief becomes a section, ordered by how the visitor's doubt arrives, not by how the company org chart looks. A developer tool usually needs proof it works (show the product, real code, real output) before it needs a value pitch. A restaurant needs the food, the room and the booking button, in that order, and nothing else. A B2B service selling to a sceptical buyer needs case evidence early.

Cut any section that does not carry a belief. A page with five sections that each earn their place beats one with ten.

### One action, one label

Pick the action and name it once. If the button says "Start free trial" in the nav, it says "Start free trial" in the hero, the pricing table and the closing band. Do not mix "Get started", "Try it", "Sign up" and "Join now" on one page. The visitor should never wonder whether they are different things.

A secondary action is allowed (watch the film, read the docs) but it must look clearly secondary, and it must not compete in the same visual weight.

## Hero composition

The hero is the one place the page states its claim. Choose the composition from what the product is and what asset you really have.

**Type-led.** Large headline, short support line, one button, lots of air. Fits products that are hard to picture (infrastructure, finance, services) and brands whose voice is the asset. It demands excellent type: a tight scale, a considered face, optical sizing, careful line breaks. Weak type makes this look empty.

**Product-led.** The interface, device or object is the hero, cropped or framed with intent. Fits software and hardware where seeing it is the pitch. Use a real, crisp screenshot at correct density (see [web-app.md](web-app.md) for realistic data), not a wireframe. Crop it so it bleeds off an edge; a fully framed screenshot floating in space reads as a stock image.

**Image-led.** A photograph or rendered scene carries the mood, with type set over or beside it. Fits food, travel, fashion, hospitality, anything sold on feeling. The image must be genuinely good and consistent with the rest. Check contrast of text over the image at every breakpoint, and set a scrim only if needed, not by reflex.

**Layered depth.** Foreground, midground and background planes, sometimes with parallax or light scroll response. Fits brands that want a sense of place. This is the doorway to the scroll module, see below.

Two heroes rarely mix well. Choose one and commit.

## Copy

Ask in the interview, per project: does craft write the real copy, or does it use realistic-length placeholders?

- **Placeholders.** Match real lengths (a headline that runs two lines, a paragraph of four sentences, not "Lorem ipsum" and not a three-word stub). Mark every one for replacement, visibly in the prototype and with a `TODO(copy)` comment in code, so nothing ships by accident.
- **Real copy.** Write it specific rather than clever. "Deploys in 40 seconds, rolls back in one click" beats "Ship at the speed of thought". Say what the thing is in the first line. Use the customer's words from the interview. Puns and slogans come last, if at all.

In both modes, never invent statistics, customer counts, awards, press quotes or testimonials. A made-up "10,000+ teams" is a lie with the client's name on it. If a number matters and the user has not supplied it, leave a clearly marked slot.

## Imagery

Order of preference:

1. Assets the user supplied. Ask for them in the interview. Real photos of real products and people beat everything generated.
2. Generated through kie.ai, following [../scroll/assets.md](../scroll/assets.md). Write one style preamble (lighting, lens feel, palette, grain, subject treatment) and prepend it verbatim to every prompt so the set reads as one shoot. Review outputs before they go into the prototype; regenerate the outliers rather than living with them.
3. Illustration, abstract type or CSS-built graphics, when the brand is not photographic.

Avoid stock-looking scenes: laughing people at laptops, floating gradient blobs with no reason to exist, 3D shapes unrelated to the product. If an image could sit on any company's site, it is doing no work.

## Patterns that read as generated

None of these is forbidden. Each is a pattern that shows up so often in generated pages that a visitor reads "template" before they read the words. Use one only when you can say what it does for this page.

- **A hero doing too much.** The hero is one moment: at most a small label, the headline (two lines at desktop), a subline of about 20 words, and one primary plus one secondary action. Taglines under the buttons, trust strips, pricing teasers and avatar rows belong in the sections below. The whole hero, including the action, fits in the first viewport. If it doesn't, the type is too big or the copy is too long. Top padding past about 6rem makes the content float halfway down the screen.
- **A label above every heading.** The small uppercase tracked label over each section title is the most repeated rhythm in generated sites. At most one section in three gets one. The heading usually says enough.
- **Split section headers.** A big headline on the left with a small paragraph floating on the right, when the right column holds nothing else. Stack them instead, unless the right column carries a real visual.
- **Layouts that repeat.** Three image-and-text sections alternating sides in a row, or the same layout family used for two sections. A page of eight sections wants at least four different layouts.
- **Decoration that pretends to be information.** Section numbers (`01 / 06`), version tags in the hero (`v0.6`, `BETA`) when it isn't a launch, colored status dots that aren't a status, city, time or weather strips, photo credits on stock images, tags laid over photos, a strip of three words across the bottom of the hero (`BRAND. MOTION. SPATIAL.`), a sentence explaining the section under its heading.
- **Poetic labels on functional sections.** "Field notes" for a blog, "Quietly trusted by" for customers, "Stage 1 / Stage 2" instead of the step's actual verb. Plain labels, or none.
- **Fake product.** A dashboard, terminal or task list built from styled divs to look like a screenshot. Show the real product, a real component running in the page, a generated image, or photography.
- **Grids that don't fit the content.** Bento grids with an empty cell, or six text-only cards on the same background. Shape the grid to the number of items, and give some cells real imagery.
- **Lists as hairline tables.** Ten spec rows with a border under each. Group them, feature the three that matter, or give each a card with the value large.
- **Scroll cues.** "Scroll to explore" and bouncing mouse icons. People know how to scroll.
- **Logo walls with captions.** A logo wall is logos. Labels like "payments" under Stripe add nothing.
- **Section themes that flip.** One light section in the middle of a dark page (or the reverse) feels like a different site, unless one deliberate theme change is part of the story.

## Social proof honesty

Only show proof that exists. Real logos with permission, real quotes with a name, role and company, real numbers with a source or a date. If there is none yet, skip the section. An honest page with no logo strip is better than a decorated fake one. A specific small proof ("Used by the ops team at X since 2024") beats a wall of generic praise.

## Navigation and footer

Fit them to the brand. A single-product startup wants a slim bar: wordmark, three or four links, the one action. A larger brand can carry a mega menu only if the content justifies it. The nav button uses the same label as everywhere else.

Footers do real work for trust and SEO: legal, contact, sitemap links, social. Size them to the brand. A luxury brand may want a nearly silent footer; a SaaS product usually wants proper columns. Do not fill columns with dead links.

Mobile nav is a design task, not a hamburger afterthought. Test it open, with focus trapped and Escape closing it.

## Performance

Performance is part of the design. A gorgeous page that paints at four seconds loses the visitor before they see it.

- Identify the LCP element (usually the hero image or headline). Give it explicit dimensions, `priority` in `next/image`, and correct `sizes`. Never lazy-load it.
- Fonts: self-host, subset, `font-display: swap` or `optional`, preload the one or two faces used above the fold. Use `next/font`. Check the fallback metrics so the swap does not shift layout.
- Video: always supply a `poster` that matches the first frame, compress hard, keep the hero clip short and muted, and do not autoplay on data-saver or reduced-motion.
- Images: AVIF or WebP, sized to the layout, no 4000px originals.
- Third-party scripts loaded late, off the critical path.

Verify with the flow in [../verify.md](../verify.md), and check a throttled mobile run, not only your fast desktop.

## Static page or scroll module

Switch to the scroll module ([../scroll/README.md](../scroll/README.md)) when the brief asks for the page to feel like an experience: scroll-driven video, a layered cinematic hero, a story that unfolds as you move. It suits brands selling a feeling, with strong assets and a visitor who has time.

Stay with a well-made static page when the goal is conversion speed, when the audience wants information fast, when assets are thin, when the site is content-heavy or updated often, or when the budget for performance and testing is tight. A precise static page with excellent type and one strong image outperforms a mediocre scroll piece every time. Say this to the user plainly if their brief points at an effect the content does not justify.
