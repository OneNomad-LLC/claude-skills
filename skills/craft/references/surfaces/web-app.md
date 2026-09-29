# Web apps

Product UI is judged by people who use it for hours. They notice a 4px misalignment, a slow table, a missing shortcut, a modal that steals focus. The bar is Linear, Vercel and Stripe: quiet, dense, fast, exact. Base rules live in [../fundamentals.md](../fundamentals.md), [../tokens.md](../tokens.md) and [../components.md](../components.md). This file covers what is particular to application surfaces.

## Density done well

Density is not small text and tight padding. It is more useful information per glance, with hierarchy strong enough that the eye still finds the thing it wants.

- **Linear.** Issue lists are single-line rows at roughly 36 to 40px: status icon, identifier in muted mono-ish text, title, then a right-aligned cluster of labels, assignee avatar and date. Almost no borders. Hover lifts the row with a barely-there background. Colour appears only where it means something (status, priority). Everything else is greyscale.
- **Vercel dashboard.** Generous outer gutters but tight inside cards. Hairline borders, a near-monochrome palette, geometry-first icons. Metadata sits as small muted text under a confident title. Status is a small dot plus a word, not a coloured pill.
- **Stripe dashboard.** Numbers are the interface. Tabular figures throughout, right-aligned amounts, clear column headers, restrained use of one accent. Detail pages put the key object on the left and a scannable timeline or related list on the right.

What they share: a 4px or 8px grid held rigidly, two or three text sizes doing most of the work, muted secondary text at a dependable contrast (still 4.5:1 or better), and borders or shadows used sparingly so the content carries the structure.

Use tabular figures (`font-variant-numeric: tabular-nums`) anywhere numbers stack. Provide a density option only if the audience has power users; otherwise pick one good density.

## Navigation

Pick from the structure of the product, not from taste.

- **Sidebar with sections.** For products with many top-level areas (5 to 12) that users move between all day. Group into labelled sections, allow collapsing to icons, keep the current location unmistakable. Width 220 to 260px. Default choice for serious tools.
- **Top bar.** For products with few areas, or where content wants the full width (analytics canvases, editors). Pair with tabs for sub-areas. Fails when the list grows past about six items.
- **Command palette (Cmd+K).** Additive, not a replacement. It makes deep products fast: jump to anything, run any action. Index navigation, records and commands together, show shortcuts beside results, remember recents. Only worth building if there is enough surface to search. Use `cmdk` restyled to the tokens.
- **Breadcrumbs.** For deep hierarchies (org, project, resource, sub-resource). Each segment clickable, the last one plain text. Truncate the middle on small screens.

Most products combine them: sidebar for areas, breadcrumbs for depth, palette for speed. Do not add all four to a five-screen product.

## Tables, filters, bulk actions

Tables are where most of the daily work happens, so they get the most care.

- Left-align text, right-align numbers, align headers with their data. Sticky header on scroll. Truncate with a tooltip, never wrap unpredictably.
- Row height is a decision (compact 32, default 40, comfortable 48). Pick one and apply everywhere.
- Sorting shows direction on the active column only. Click targets are the whole header cell.
- Filters live in a bar above the table as removable chips, with a clear "Reset". Show the active count. Saved views are worth offering for power tools. Persist filters in the URL so links share state.
- Selection: a checkbox column that appears on hover, shift-click for ranges, and a bulk-action bar that replaces or overlays the header when something is selected, stating the count ("3 selected") and offering the two or three actions that make sense. Destructive bulk actions confirm with the count and the consequence.
- Long lists virtualise or paginate. Loading more must not lose scroll position or selection.
- Row actions: primary action on click, secondary in a `...` menu that also opens on right-click.

## Forms and settings

- One column, labels above fields, help text under. Group related fields with a heading and space, not boxes within boxes.
- Validate on blur and on submit, never mid-keystroke for anything but password strength. Put the error next to the field in words that say what to do, and move focus to the first error on submit.
- Settings pages: left sub-navigation or section anchors, each section a card or a heading with a description, and save behaviour that is explicit. Either autosave every control with a visible "Saved" confirmation, or one clear Save per section. Never a mixture.
- Dangerous settings live in a separated zone at the bottom, with confirmation that names the thing being destroyed.
- Use the platform's inputs properly: `inputmode`, `autocomplete`, `type`. Disabled states explain why.

## Dashboards

Lead with the one number the user opens the page for. Give it size, a comparison ("+12% vs last week") and a small trend. Everything else is support.

Add a chart only when it answers a question ("is this getting better or worse", "where is the spike"). A row of decorative sparklines answers nothing. Follow the dataviz approach in the dataviz skill: clear axes with sensible ticks, direct labels on lines instead of a distant legend, colour used sparingly (one accent plus greys, with a second hue only when a comparison needs it), and dark mode palettes validated separately. Use tabular figures, format large numbers (1.2M), and always show the time range and units.

Tooltips show the exact value and date. Empty ranges say "No data for this period", they do not render a flat line.

## States: empty, loading, error, permission, first-run

Each screen needs all five. Designing only the happy path is how products feel unfinished.

- **Empty.** Say what belongs here and offer the one action that fills it. A small illustration or icon is fine; a blank table with a header is not.
- **Loading.** Skeletons that match the final layout for content, spinners only for short, indeterminate actions. Avoid layout shift when data lands. Keep previous data visible while refetching.
- **Error.** Say what failed, whether the data is safe, and what to do. Offer Retry. Keep technical detail (request ID) available but tucked away.
- **Permission.** Explain who can grant access and how to ask. Do not show a 404 for something the user simply cannot see.
- **First-run.** A short path to the first success, not a tour. A checklist that ticks off as real actions happen works better than a modal carousel.

## Keyboard and focus

Power users judge the product by its keyboard support.

- Every interactive element reachable by Tab in a logical order, with a visible focus ring (2px, offset, high contrast). Never `outline: none` without a replacement.
- Shortcuts for the frequent actions, single-key where the context is clear (C to create, J/K to move in lists) and modifier combos elsewhere. Show them in tooltips and menus. Provide `?` for a shortcuts sheet. Skip shortcuts while typing in inputs.
- Dialogs trap focus, return it to the trigger on close, and close on Escape. Radix does most of this; do not fight it.
- After an action removes the focused element (deleting a row), move focus to a sensible neighbour.
- Respect `prefers-reduced-motion`. See [../motion.md](../motion.md).

## Responsive behaviour

Design the app for desktop first, then decide what tablet and phone need.

- Tablet: sidebar collapses to icons or an overlay, tables keep columns but drop the least important, two-column layouts stack.
- Phone: this is not a shrunken desktop. Sidebar becomes a drawer or bottom tabs, tables turn into stacked cards showing the two or three fields that matter, filters move into a sheet, tap targets reach 44px. Some tasks (bulk edits, complex configuration) may reasonably stay desktop-only; say so in the UI rather than break.
- Test at 1440, 1024, 768 and 390 with the screenshot flow in [../verify.md](../verify.md).

## Realistic synthetic data

Prototypes fail on lorem. Generate believable data: real-looking names across cultures, plausible company names, dates spread over recent weeks, amounts with cents and varied magnitude, some long strings and some very short ones, a few statuses in the failure state, one row with a missing optional field. Include edge cases the design must survive: a 60-character title, a zero, a negative, an empty list. Keep the data in one fixture module so the prototype and the production stories share it.
