# Motion

Motion is information about change. A thing moved because something happened, and the movement tells the eye where to look and what it just did. If an animation carries none of that, it is decoration, and decoration that runs a hundred times a day becomes friction.

## What each motion is for

Every animation should be able to name one of four jobs.

- **Feedback.** The system heard you. A button dips on press, a toggle slides, a field shakes once on a rejected submit. Fast, small, immediate.
- **Orientation.** Where did that come from, where did it go. A sheet rises from the edge it will return to. A deleted row collapses so the list closes over the gap. The eye follows the change instead of finding a different screen.
- **Continuity.** This is the same object in a new place. A card thumbnail becomes the detail header. A tab indicator slides to the next tab instead of blinking off and on.
- **Delight.** A moment that exists for its own sake. Legitimate on a marketing page or at a real milestone (first project created, payment succeeded). Never on a routine action.

Cut anything that serves none of them. A fade-in on every card in a dashboard grid serves nothing. A page that slides content up 24px as you scroll to each paragraph serves nothing. If you can't say which job it does, delete it and see if anyone misses it.

## Scale by surface

The same rules bend by context.

| Surface | Character | Typical duration | Notes |
|---|---|---|---|
| Marketing site | Expressive, authored | 400 to 900ms for set pieces, 150 to 250ms for UI | One signature moment beats ten small ones. Scroll-told pages go through `scroll/README.md`. |
| Web app | Quick, functional | 100 to 220ms | People repeat these actions all day. Nothing blocks input. |
| Mobile (Expo, RN) | Platform physics | Springs, not durations | Follow the platform: iOS is springy and interruptible, Android Material uses emphasised easing. Gesture-driven motion tracks the finger 1:1. |
| Desktop and OS UI | Snappy, spatial | 120 to 250ms | Windows and panels animate from where they were invoked. |

The rule of thumb: the more often something happens, the faster and quieter it gets. A hero reveal happens once. A dropdown opens forty times.

## Tokens

Define these once and never write a raw duration or cubic-bezier inside a component. They sit beside the color and spacing tokens in `tokens.md`.

```css
:root {
  --dur-fast: 120ms;    /* hover, press, toggles, color changes */
  --dur-base: 200ms;    /* menus, popovers, tooltips, list changes */
  --dur-slow: 320ms;    /* dialogs, sheets, route changes */
  --dur-expressive: 600ms; /* marketing set pieces only */

  --ease-standard: cubic-bezier(0.2, 0, 0, 1);      /* things moving on screen */
  --ease-emphasized: cubic-bezier(0.23, 1, 0.32, 1); /* enters, big moves, the expo-out feel */
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);           /* leaving, slightly quicker */
}
```

Enters use `--ease-emphasized`. Exits are faster than enters, roughly 70% of the duration, because the person has already decided to move on. Never use plain `ease-in` for an enter. It delays the moment the eye is already waiting on. Browser default `ease` and `ease-out` are also too weak to feel designed.

Spring presets, for `motion` and Reanimated:

| Name | stiffness | damping | mass | Use |
|---|---|---|---|---|
| `snappy` | 500 | 40 | 1 | toggles, presses, small state changes |
| `smooth` | 300 | 30 | 1 | sheets, cards, layout changes |
| `gentle` | 170 | 26 | 1 | large surfaces, drag release, hero moments |
| `bouncy` | 400 | 18 | 1 | milestones only. Overshoot on a settings toggle is a joke that gets old. |

Use springs over durations wherever the motion can be interrupted or driven by a gesture. A spring keeps its velocity when retargeted. A tween restarts and jerks.

## What to animate

Animate what the compositor can do without re-laying out the page.

- `transform` (translate, scale, rotate) and `opacity`. These are the workhorses.
- `clip-path` for wipes, reveals and shape morphs. Cheap, and it can do things transform cannot.
- `filter` (blur, brightness) sparingly. A blur under 8px on a small element is fine. Animating blur on a full-viewport layer will drop frames on a mid-range phone.
- `background-color`, `color`, `border-color` for hover states. Not compositor-only, but cheap and small.

Never animate `width`, `height`, `top`, `left`, `margin` or `padding`. They trigger layout every frame. For expanding panels, use `grid-template-rows: 0fr` to `1fr` (well supported now) or a transform plus a clip. In `motion`, the `layout` prop does the FLIP work for you.

Never write `transition: all`. It catches properties you did not mean to animate, including ones that change for other reasons (a font load, a theme switch), and the result looks broken in ways that are hard to trace. List the properties.

```css
.btn {
  transition:
    background-color var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-emphasized),
    box-shadow var(--dur-fast) var(--ease-standard);
}
```

## Micro-interaction inventory

Starting values. Adjust to the brand, but change them deliberately.

- **Button press.** `scale(0.97)` on `:active`, 100 to 120ms. Release springs back. Icon-only buttons go to `0.92`. Alternative for flat systems: `translateY(1px)`.
- **Hover lift.** Cards and tiles: `translateY(-2px)` plus a shadow step up, 160ms. Only inside `@media (hover: hover) and (pointer: fine)`, or touch devices get stuck hover states after a tap. Don't lift things that are not clickable.
- **Link and row hover.** Color or background change only, 100ms. No movement.
- **Switch.** Thumb travels with `snappy` spring or 180ms `--ease-emphasized`. Track color crossfades in the same time. Thumb stretches 2px wider while pressed if the platform does that.
- **Checkbox.** The box fills in 100ms, then the check stroke draws with `stroke-dashoffset` over 160ms starting at 60ms. Uncheck is faster, 80ms, no draw.
- **Radio.** Inner dot scales from `0.6` to `1` with opacity, 140ms.
- **List insert.** New item fades in and grows from `scale(0.98)` with a 4px upward offset, 200ms. Siblings move to make room using layout animation, not a jump. Stagger a batch by 30 to 50ms, never more than about eight items, then the rest arrive together.
- **List remove.** Item fades and collapses, 160ms, faster than the insert. Siblings close the gap with the same layout animation.
- **Toast.** Enters from the edge it lives on: `translateY(8px)` and opacity, 220ms `--ease-emphasized`. Exits in 160ms. Stacked toasts scale back 4% each and slide down. Hover pauses the timer. Swipe to dismiss on touch.
- **Dialog.** Overlay fades in 200ms. Panel enters from `scale(0.96)` and opacity 0, 220ms. Exit is 140ms, no scale change needed. Never `scale(0)`. Nothing appears from nothing.
- **Sheet (bottom or side).** Translates from its own edge, 320ms `--ease-emphasized` or the `smooth` spring. Exit 220ms. On mobile it follows the finger and settles on release with velocity.
- **Popover and menu.** Origin at the trigger (`transform-origin` from the anchor, Radix exposes `--radix-popover-content-transform-origin`). `scale(0.95)` to `1`, 140ms. Submenus open with no delay but close with a short grace period so diagonal mouse movement works.
- **Tabs.** Indicator slides between tabs (layout animation or a translated element). Content crossfades, no horizontal slide unless the tabs are truly sequential.
- **Skeleton.** Prefer a slow pulse (opacity 1 to 0.5, 1.6s, ease-in-out) for small or dense UI. Use a shimmer (a gradient sweep, 1.4 to 1.8s linear) for large content areas like cards and article bodies. Shimmer on a hundred small rows is noisy. Either way the shapes must match the content they replace.
- **Number tickers.** Only for a real number that really changed: a balance, a live count, a price. Roll the digits with tabular numerals so width does not jitter. A ticker counting up to "10,000 customers" on load is decoration around a claim, and a lie if the figure is invented.
- **Focus ring.** Appears instantly or in 80ms. Slow focus indicators feel laggy to keyboard users.

Group entrances stagger at 30 to 80ms per item. Longer feels slow.

## Page and route transitions

Keep route transitions short (200 to 320ms) and structural: shared elements persist, the rest crossfades. A full-page slide on every navigation in an app is tiring.

The View Transitions API is the right base. For same-document changes in any framework, wrap the state update:

```ts
document.startViewTransition(() => flushSync(() => setView(next)));
```

Style the transition with pseudo-elements, and name shared elements with `view-transition-name`:

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: var(--dur-slow);
  animation-timing-function: var(--ease-emphasized);
}
.thumb { view-transition-name: var(--vt-name); } /* unique per item, set inline */
```

For a multi-page site with no client router, `@view-transition { navigation: auto; }` opts in same-origin navigations with zero JS.

In Next.js App Router (Next 16 with React 19.2 or later), wrap the parts that should morph in React's `<ViewTransition>` (`import { ViewTransition } from "react"`) and give shared elements a matching `name`. Treat it as progressive enhancement: browsers without the View Transitions API navigate normally, which is a fine fallback. Check the Next.js docs for your version if the component doesn't animate route changes.

Rules: give every `view-transition-name` a unique value on the page or the transition silently fails. Avoid names on elements inside scroll containers that clip. Wrap the custom animation in the reduced-motion query.

## Which library

CSS first. Hovers, presses, focus, menu enters, skeletons, accordions, and scroll reveals are all CSS. It is compositor-friendly, costs nothing in bundle, and cannot block the main thread.

Reach for the **`motion`** package (formerly Framer Motion) in React when you need exit animations, layout animation, gestures, or orchestrated sequences.

```tsx
import { AnimatePresence, motion } from "motion/react";

<AnimatePresence initial={false}>
  {open && (
    <motion.div
      key="panel"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.14 } }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
    />
  )}
</AnimatePresence>
```

Use `layout` on list items for insert, remove and reorder. Use `LazyMotion` with `domAnimation` to keep the bundle small on marketing pages.

In **Expo and React Native**, use Reanimated. It runs on the UI thread, so it holds 60fps while JS is busy.

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring,
  FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";

const scale = useSharedValue(1);
const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
// onPressIn:  scale.value = withSpring(0.97, { stiffness: 500, damping: 40 });
// onPressOut: scale.value = withSpring(1,    { stiffness: 500, damping: 40 });

<Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(140)}
  layout={LinearTransition.springify().damping(30)} style={style} />
```

Reanimated's entering, exiting and layout props cover most list work. Moti wraps Reanimated with a declarative API (`MotiView`, `from`, `animate`, `exit`) and is quicker to write for simple cases. Pick one and be consistent. Use `react-native-gesture-handler` for anything finger-driven so the animation and the gesture share a value.

## Scroll-driven CSS

For light marketing touches (a reveal as a section enters, a header that condenses, a progress bar) use native scroll-driven animations. No JS, off the main thread.

```css
@supports (animation-timeline: view()) {
  .reveal {
    animation: rise linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 60%;
  }
}
@keyframes rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}
```

Wrap it in `@supports`, and make sure the unsupported case shows the content in its final state, never hidden. Keep travel small (12 to 24px). For pages where the scroll itself tells the story (pinned scenes, video scrubbing, layered heroes), stop here and go to `scroll/README.md`.

## Reduced motion

`prefers-reduced-motion: reduce` means less movement, not no feedback. Remove translation, scale, parallax, zoom and autoplaying loops. Keep opacity and color changes, because they carry meaning without vestibular cost.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
  .reveal { animation: none; opacity: 1; transform: none; }
  ::view-transition-group(*) { animation-duration: 0.01ms; }
}
```

The blanket rule above is a safety net. Better to author the reduced version on purpose: swap the slide for a fade, drop the spring, keep the state change legible.

In `motion`, wrap the app in `<MotionConfig reducedMotion="user">`. It disables transform animations and keeps opacity.

On React Native, read the setting with `AccessibilityInfo.isReduceMotionEnabled()` and subscribe to `reduceMotionChanged`, or use `useReducedMotion()` from Reanimated. Reanimated animations also accept `.reduceMotion(ReduceMotion.System)`. Test with the OS setting on. Video and Lottie loops need an explicit pause path.

## Implementation traps

- Never hold continuously changing values in React state: scroll position, pointer position, drag offsets. Every change re-renders the tree and it falls apart on phones. Use motion values (`useMotionValue`, `useTransform`, `useScroll` from `motion/react`), Reanimated shared values on native, or CSS custom properties written directly to the element.
- No raw `window.addEventListener("scroll", ...)` driving animation. Use `useScroll`, IntersectionObserver, GSAP ScrollTrigger or CSS scroll-driven animations.
- In the Next.js App Router, keep anything animated in a small client component (`"use client"`) at the leaf. Pages and layouts stay server components.
- Every effect that starts an animation, observer or timeline cleans it up on unmount.
- Grain and noise overlays go on one fixed, `pointer-events: none` layer, never on a scrolling container. Repainting a filter on scroll kills frame rate on phones.
- One marquee per page at most, and only where breadth is the point (logos, a long list of capabilities). A second one is filler.
- Full-height sections use `100dvh` or `100svh`, not `100vh`, which jumps as mobile browser toolbars show and hide.

## Performance

- Stay on the compositor: transform, opacity, and where it fits, clip-path and filter. Check in DevTools Performance for layout and paint inside your animation frames. Any there means something is wrong.
- 60fps means 16.6ms a frame, and less on 120Hz screens. Long JS during an animation drops frames. Keep handlers thin.
- `will-change` is a promise that costs memory. Set it right before the animation and remove it after, or apply it only to the few elements that will animate. Never in a global rule.
- Big blurs, backdrop filters and large box-shadow animations are the usual offenders. Animate opacity on a pre-shadowed pseudo-element instead of the shadow itself.
- Test on a real mid-range Android phone, not a desktop with a throttle. Simulators lie about GPU cost.
- Animate one thing at a time when in doubt. Layered simultaneous effects compound.
- Pause offscreen loops (`IntersectionObserver` or `animation-play-state`). A shimmer nobody can see still burns battery.
