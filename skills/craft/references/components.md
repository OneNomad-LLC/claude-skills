# Components

Most of the web now runs on shadcn/ui and Radix. That is good for accessibility and bad for identity. Radix gives you correct keyboard behavior, focus management and ARIA. shadcn gives you a starting look. Ship the starting look unchanged and your product is indistinguishable from a thousand others, and reviewers can tell within a second.

Keep the behavior. Replace the skin.

## Why the default reads as default

These are the specific tells. Any one is fine. Together they are a signature.

- **Radius.** `0.5rem` (or `0.625rem` in newer versions) on everything. Buttons, inputs, cards, popovers and dialogs all share one soft corner, so nothing has a shape of its own.
- **Zinc and neutral grays.** Pure, cool, untinted. No relationship to a brand hue. Secondary text is the same gray as borders and muted fills.
- **The ring.** A 2px focus ring with an offset in `--ring`, gray, identical on every control.
- **Heights.** Buttons and inputs at 36 or 40px, text at `text-sm`. Dense but generic, and the same on every screen.
- **Card recipe.** 1px border plus `shadow-sm` plus white fill plus `p-6`. Border and shadow together is two ways of saying the same thing.
- **Lucide at default.** 24px viewBox, 2px stroke, rounded caps, used at 16px so the stroke lands near 1.3px next to text set in a much lighter or heavier face.
- **Type.** Inter or Geist at default weights, headings at `font-semibold tracking-tight`, everywhere.
- **Motion.** `animate-in fade-in zoom-in-95` on every overlay. Fine, but you can see it on every site that uses the kit.

## Order of work

Do it in this order. Skipping ahead to component tweaks before the tokens are right produces a mess of overrides.

1. **Semantic tokens.** Replace the palette first, in OKLCH, following `tokens.md`. Tint every neutral toward the brand hue (chroma 0.005 to 0.02 is enough). Give the focus ring, borders, muted text and surfaces their own tokens. Most of the "not shadcn anymore" effect comes from this step.
2. **Radius and density.** Pick a radius scale of three or four values and commit. Sharp (2 to 4px) reads technical and precise. Medium (8 to 12px) reads friendly. Large (16px and up) reads consumer. Nested radius is outer minus padding. Then set density: control heights, padding, type size. A tool for experts can sit at 32px controls. A consumer app needs 44 to 48.
3. **Type.** Choose the face and weights that carry the brand. Tighten tracking as size grows.
4. **The signature components.** Redraw these to the brand, in order of visibility: button, input, select, card, dialog and sheet, tabs, table, toast. Change the ones people see and touch most. Leave the plumbing (focus trap, portal, collision handling) alone.
5. **Icons and motion.** Swap the icon set or restyle it, then bring in the motion tokens from `motion.md`.

Because shadcn copies components into your repo, edit them directly. Don't wrap and override with `className` from the outside on every use. If the fix is needed in more than one place, it belongs in the component or the token.

### When Radix is not the right base

- **Base UI** (from the MUI and Radix authors) is a headless set with a similar model and active development. Consider it when Radix maintenance is a concern or a primitive you need is missing. The package is `@base-ui/react` (the old `@base-ui-components/react` name stopped at a release candidate).
- **React Aria Components** (Adobe) has the deepest accessibility and internationalization coverage: date and number pickers, complex collections, drag and drop, multi-select. Choose it for data-heavy or globally used products.
- Neither ships a look, which is the point. Style them with your tokens from the start.

## Icons

Pick one set and use it everywhere. Mixed sets are visible immediately, because stroke weight, corner treatment and optical size all differ.

Options:

- **Lucide.** Broad, clean, the shadcn default. Its ubiquity is the drawback.
- **Phosphor.** Six weights (thin to bold, plus duotone and fill) so you can match weight to type. A strong choice when the brand needs character.
- **Tabler.** Very large set, consistent 2px stroke, adjustable. Good for dense tools with unusual needs.
- **Heroicons.** Small, two styles, tidy. Tends to look like Tailwind's own docs.
- **SF Symbols.** On iOS, use `expo-symbols`. They match the system, scale with Dynamic Type and have weights that pair with SF. Use a web or RN set for Android and web, and choose one whose weight roughly matches so the platforms feel related.

Match the stroke to the type. A 1.5px stroke icon next to Inter Regular reads light. Next to a heavy grotesk it disappears. The icon's stroke should be close to the stem width of the adjacent text: about 1.5px at 16px for regular text, 2px for medium and semibold. Phosphor's weights and Tabler's `stroke` prop make this a setting, not a redraw. With Lucide, set `strokeWidth` explicitly and use `absoluteStrokeWidth` when you want a constant stroke as the size changes.

Size tokens, with an explicit rule so an icon can never fill its container:

```css
:root { --icon-sm: 16px; --icon-md: 20px; --icon-lg: 24px; }
.icon, svg.icon { width: var(--icon-md); height: var(--icon-md); flex: none; }
```

Icon next to text: 16px with 14px text, 20px with 16px text. Gap between icon and label is 6 to 8px, or 0.5em.

Optical alignment matters more than the box. A play triangle sits 1 to 2px right of center to look centered. A chevron inside a select needs its own nudge. Check icons against the cap height and x-height of the text beside them, and nudge with `translateY(-0.5px)` when the baseline looks off. Never use emoji as icons.

## State matrix

Every component gets every state that applies. A component drawn only in its resting state is half done.

| State | Required when | Notes |
|---|---|---|
| default | always | |
| hover | pointer platforms | Gate with `(hover: hover)`. Never the only signal of interactivity. |
| pressed | always | Scale or darken. See `motion.md`. |
| focus-visible | always, keyboard reachable | Themed ring with offset, 3:1 against neighbors. Never `outline: none` without a replacement. |
| disabled | if it can be disabled | Explain why nearby: a tooltip, helper text, or a line under the button. A greyed control with no reason is a dead end. Use `aria-disabled` plus a focusable element when the reason must be reachable. |
| loading | if it triggers async work | Keeps its size. Blocks repeat submits. |
| error / invalid | inputs and anything that can fail | Color plus icon plus text. Never color alone. |
| selected / on | toggles, tabs, list rows, menu items | Distinct from hover and focus. |

Selected and focused are different states and often both apply at once. Design the combination.

Minimum inventory for an app: button (primary, secondary, tertiary, destructive, icon-only), text input, select, checkbox, radio, switch, segmented control, tabs, list row, card, banner (info, ok, warn, critical), toast, dialog and sheet, popover and menu, empty state, skeleton, badge, avatar, navigation (sidebar, tab bar), progress.

Build components from semantic tokens only. A raw hex, a raw pixel size or a font stack inside a component is a bug.

## Buttons

- **Hierarchy.** One primary per view region. Secondary is a solid quiet fill or an outline. Tertiary is text only. Destructive is its own style and appears in a confirmation, not next to the safe option at equal weight. Two equal primaries means the hierarchy was never decided.
- **Heights.** Small 32, medium 40, large 48. Touch surfaces use 44 minimum for the hit area even when the visible button is smaller. Padding is roughly 1.5 to 2 times the vertical padding, horizontally.
- **Labels.** One to three words, verb first, on one line. The same intent gets the same label everywhere.
- **Icon spacing.** Icon at 16 or 20px, 8px gap, optically balanced padding: less padding on the icon side. Icon-only buttons are square, have an `aria-label` and a tooltip.
- **Loading without layout shift.** Keep the label in the DOM, hidden with `visibility` or opacity, and overlay the spinner in the same box. The button holds its exact width. Or swap the leading icon for a spinner and keep the text. Disable further presses, but do not disable focus if that would cause the keyboard user to lose their place.
- **Contrast.** White text on a light brand color fails. Measure it. Ghost buttons over photos need a scrim.

## Forms

- **Labels above the field**, always visible. Placeholder text is a hint or an example and is gone the moment someone types. Floating labels are acceptable only when they are done with care, and they cost space and accessibility.
- **One column** unless fields are truly short and related (city, state, zip). Multi-column forms get skipped or misread.
- **Group** related fields with spacing and a legend. Don't box every group.
- **Validation timing.** Validate on blur for the first pass, then on change once a field has been marked invalid, so the error clears as soon as it is fixed. Never show an error on a field the person has not yet touched. Never block typing to enforce a format; format after.
- **Error copy** says what is wrong and how to fix it, next to the field, in plain language. "Enter a date like 03/14/2027" beats "Invalid input". Don't blame ("You entered..."). Link the message to the field with `aria-describedby` and move focus to the first error on a failed submit.
- **Required.** Mark the exception. If most fields are required, mark the optional ones.
- **Input heights** match buttons at the same size. Same radius, same focus ring.
- **Help text** sits below the field, tertiary color, and swaps places with the error rather than stacking above it.
- Use the right `type`, `inputmode`, and `autocomplete` values. On mobile this is half the form experience.

## Tables and lists

- **Density.** Offer compact (32 to 36px rows) and comfortable (44 to 52px). Experts want compact. Set one default and store the choice.
- **Alignment.** Text left, numbers right, with `font-variant-numeric: tabular-nums` so digits line up. Headers align with their column content. Currency has consistent decimals.
- **Sticky header** on any table that scrolls, with a hairline or slight shadow when content passes under it. Sticky first column on wide tables.
- **Row hover** is a subtle surface shift, not a color jump. Clickable rows get a pointer and a visible focus state on the row or its main link. Don't make an entire row a link if it also holds buttons, or give the buttons `stopPropagation` and clear targets.
- **Separators.** Hairlines or whitespace, rarely both. Zebra striping only when rows are very wide.
- **Empty rows and empty tables.** A table with zero results shows a message inside the table body, keeps the header, and offers the next action. A cell with no value shows an en dash, not blank and not "null".
- **Truncation.** Set `max-width` and `text-overflow: ellipsis` on text cells, with the full value in a tooltip. Truncate the middle of file names and IDs.
- **Actions.** Row actions sit in a consistent column, visible on hover and always for keyboard focus, with a menu for the overflow.
- Lists on mobile are not tables. Re-lay the row: title, one or two key facts, a trailing value or chevron.

## Cards

A card is a container with a job: it groups content that can be acted on, moved or compared as a unit. Before adding one, ask what a hairline, spacing or a heading could do instead.

Don't use a card when:

- The content is a section of a page. Use space and a heading.
- It would sit inside another card. Never nest.
- Every item is identical and the grid is the whole page structure. That pattern is the loudest generic-page tell.
- Border and shadow are both doing the work. Choose one.

Use a card when the unit is clickable or draggable, when items differ in content and need equal footing, or when it represents an object (a project, a person, a product) that opens elsewhere. Give the whole card a single primary target and a visible hover and focus state.

## Empty, loading and error states

These are half the product. Design them first, not last.

- **Empty.** Say what belongs here, why it is empty, and give the one action that fills it. A small illustration or icon is optional, and generic clip-art is worse than none. A first-run empty state differs from a "no results" empty state. Search empties say what was searched and offer a way to clear filters.
- **Loading.** Skeletons match the shape, size and position of the content they replace, so nothing jumps when it arrives. Show them only after a short delay (about 150 to 200ms) so a fast response never flashes. For actions, prefer an inline spinner in the control that was pressed. Never put a lone spinner in the middle of a blank page for something that usually takes under a second. Show the stable chrome and stream in the rest. For long waits, show progress or say what is happening.
- **Error.** Say what happened in plain language, whether the person's data is safe, and what to do next, with a retry that works. Keep the error in place: an inline error for a failed widget, a page-level state for a failed route. Offer a way out. Log the technical detail, don't show a stack trace.
- **Optimistic UI** for low-risk actions (likes, toggles, reorders), with a rollback and a toast on failure.

## Toasts

Toasts are for confirming something that already happened and needs no decision. They vanish, so they cannot carry anything important.

- Auto-dismiss after 4 to 6 seconds, longer for longer text, and pause on hover and focus.
- Announce with `role="status"` (or `alert` for errors). Errors that need action belong inline or in a banner, not a toast.
- One line of text, an optional single action ("Undo"). Undo beats a confirm dialog for reversible actions.
- Position in one consistent corner on desktop, above the tab bar on mobile. Stack with limits, and collapse duplicates.
- Never more than three visible.

## Dialogs, sheets and popovers

- **Dialog.** A focused interruption that needs a decision: confirm a destructive action, a short form, a required choice. Centered, with a clear title, a specific primary button ("Delete project", not "OK"), and Escape and outside-click to dismiss unless data would be lost. Keep them short. If it scrolls a lot, it wanted to be a page.
- **Sheet.** A bottom sheet on mobile is the native form of a dialog, and for choices, filters, detail and lightweight editing. A side sheet on desktop suits detail and editing in context, keeping the list visible. Sheets can be dragged, snapped and dismissed by swipe. Large multi-step flows still deserve a full screen.
- **Popover.** A small, non-modal surface anchored to a trigger: a menu, a date picker, a short explanation. No decisions that could lose data. It dismisses on outside click and Escape and never traps focus for long.
- **Tooltip.** Labels an icon or clarifies a term. Never holds interactive content or essential information, and doesn't exist on touch.

Focus goes into the surface when it opens and returns to the trigger when it closes. Radix and React Aria do this. Check that your redraw didn't break it.

## Navigation

- **Sidebar.** For apps with more than four or five top-level areas. 220 to 280px wide, collapsible to icons with tooltips. Group with labels sparingly. The current location has a clear selected state that is not only a color change. Keep the count small, and push infrequent items into a footer or settings.
- **Top bar.** For marketing and simple apps with few destinations. One primary action, visible at all widths.
- **Command palette.** Add one to any app with many objects or actions. Open with Cmd or Ctrl plus K, fuzzy search across navigation, records and commands, keyboard only, recent items first, shortcuts shown next to entries. `cmdk` is the common base. It complements navigation, it does not replace it, because people who never learn the shortcut still need a path.
- **Tab bar (mobile).** Three to five destinations, icon plus label, the active one filled or tinted, at least 44pt hit areas, respecting the safe area. Don't hide primary destinations in a hamburger. Tabs preserve their own scroll and stack state.
- **Breadcrumbs** for deep hierarchies. **Back** is always available and predictable.

## Long text and edge content

Every text slot defines what happens at twice the expected length, and at half. Test with real, awkward content: a 60-character name, a long German compound, a name with no spaces, an email address, RTL text, an empty string.

- Wrap by default. Add `overflow-wrap: anywhere` to slots that hold user content.
- Clamp with an ellipsis (`line-clamp`) for titles in cards and rows, and put the full text within reach.
- Truncate the middle for file names and hashes.
- Buttons don't wrap. If a label doesn't fit, the layout is wrong.
- Flex children need `min-width: 0` to truncate at all.
- Avatars, counts and badges need a plan for `99+`, missing images and single initials.

## Touch targets

44 by 44 points is the minimum for anything tappable, and 48 for outdoor, gloved or accessibility-first use. When the visible element is smaller, extend the hit area with padding or a pseudo-element, and keep at least 8px between adjacent targets. Icon buttons at 20px with a 44px hit area are fine. Check by tapping them with a thumb on a real phone, not by reading the CSS.
