# Mobile apps

Default stack is Expo and React Native. Fundamentals in [../fundamentals.md](../fundamentals.md), tokens in [../tokens.md](../tokens.md), type in [../typography.md](../typography.md), motion in [../motion.md](../motion.md). This file covers what changes when the screen fits in a hand.

## The approach: native behaviour, brand skin

Keep each platform's navigation and behaviour. Make type, colour, components and motion your own.

Concretely, keep: the iOS swipe-from-edge back gesture and Android's system back, native stack transitions, tab bars, sheets and their detents, haptics, system pickers, share sheets, the keyboard, text selection and scroll physics. Customise: the typeface and scale, the colour system, buttons, cards, list rows, empty states, icons where a symbol will not do, and the motion that happens inside a screen.

Why: people carry years of muscle memory. They swipe back without thinking, expect a sheet to drag down, feel a tap confirmed by a haptic. Break those and the app feels wrong before they can say why. Identity does not live in the back gesture. It lives in what they read, see and touch inside each screen. You get both by skinning the native skeleton.

Go fully platform-native (system components, SF Symbols everywhere, default type) when the app is a utility, an enterprise tool, or the team has no brand yet and wants to feel at home. Go fully custom (own navigation, own transitions) only when the product is the interaction itself: a game, a creative tool, a media experience where the custom motion is the point. Accept the cost: you must rebuild accessibility, gestures and edge cases by hand. Say that to the user before choosing it.

## Expo specifics

**Expo Router.** File-based routing. Use `Stack` for hierarchy, `Tabs` for top-level areas (three to five), and modal presentation for tasks that interrupt the flow. Use `presentation: "formSheet"` with detents for short, contextual tasks on iOS, and `presentation: "modal"` for full-screen tasks. Let the header be native where possible and style it through options, only replacing it with a custom header when the design demands it.

**Safe areas.** Use `react-native-safe-area-context`. Wrap the app in `SafeAreaProvider`, use `useSafeAreaInsets` for custom bars and bottom-pinned buttons. Never hard-code notch or home-indicator heights.

**Haptics with `expo-haptics`.** Use them to confirm, never to decorate. Selection (`selectionAsync`) for changes in a picker, segment or toggle. Impact light or medium for a press that lands (adding an item, snapping to a detent). Notification success, warning or error for the outcome of an action (payment completed, validation failed). Do not fire on scroll, on every tap, or repeatedly. Guard for Android, where support varies, and respect the user's system setting.

**Icons.** `expo-symbols` for SF Symbols on iOS, with a matching icon set (Lucide or Material Symbols) as the Android and web fallback. Keep weight and size aligned with the adjacent text.

**Blur.** `expo-blur` for tab bars, headers over content and sheets, used with restraint. Blur is costly on older Android and reads as noise when everything has it. One or two surfaces per screen, tinted so text stays readable in both schemes.

**Lists.** FlashList for anything long or dynamic. Provide `estimatedItemSize`, stable `keyExtractor`, memoised item components. Avoid inline arrow functions in `renderItem`.

**Motion.** Reanimated for anything beyond a fade: shared values, `withSpring` for interactive feedback, layout animations for list changes, gesture-driven motion with Gesture Handler. Keep it on the UI thread. Honour reduce-motion via `useReducedMotion`.

**Colour scheme.** `useColorScheme` (or the `userInterfaceStyle` setting in app config) drives light and dark from the token set. Design both from the start, do not invert. Test contrast in both.

## iOS and Android differences worth honouring

- **Navigation bars.** iOS uses large titles that collapse on scroll and a chevron back button with the previous title. Android uses a smaller top app bar with an arrow. Let each render natively.
- **Back.** iOS relies on the edge swipe, so never place horizontal-scroll content or drawers where they fight it. Android has system back (button or predictive gesture), so every screen must handle it sensibly.
- **Type scale.** iOS defaults to SF Pro with Dynamic Type sizes, Android to Roboto with sp. If the brand type is custom, map its scale to each platform's rhythm rather than forcing one number set.
- **Touch feedback.** Android expects ripple. iOS expects a highlight or a small scale or opacity change. Use `Pressable` and style the pressed state per platform.
- **Bottom sheets.** iOS users expect drag detents and a grabber. Android users expect Material sheets with a scrim. Use native form sheets on iOS, and a well-behaved sheet library on Android.
- **Controls.** Switches, date pickers and alerts look different on each platform. Prefer the native control and skin what you can.

## Ergonomics and access

- **Thumb zone.** Primary actions belong in the lower half. Put the main button at the bottom, above the safe area. Keep destructive or rare actions out of easy reach.
- **Targets.** 44pt minimum on iOS, 48dp on Android, with spacing between. Use `hitSlop` when the visual is smaller than the target.
- **Dynamic Type and font scaling.** Text scales with system settings. Do not set `allowFontScaling={false}` to protect a layout. Fix the layout: allow wrapping, use flexible heights, test at the largest sizes. Cap scaling with `maxFontSizeMultiplier` only on tight elements like tab labels.
- **Keyboard.** Use `KeyboardAvoidingView` (behavior differs per platform) or a keyboard-controller library so the focused input and its submit button stay visible. Set `returnKeyType`, `textContentType` and `autoComplete` to match the field. Dismiss on scroll or tap outside.
- **Pull to refresh.** Use the native `RefreshControl` on scrollable lists that show remote data. Give feedback after, not only during.
- **Offline.** Decide what works without a connection. Show cached content with a subtle "Offline" indicator, queue writes where safe, and fail with a clear message and retry where not. Never show a blank screen or an endless spinner.
- **Accessibility.** Labels and roles on every touchable, logical reading order, and sufficient contrast. Check with VoiceOver and TalkBack.

## Verification

The screenshot flow in [../verify.md](../verify.md) applies. Run the Expo web build and capture with `scripts/shoot.mjs` at phone widths (390 and 360) in light and dark. That catches layout breaks, overflow, spacing errors and contrast problems.

It does not show native rendering. Expo web will not exercise gestures, haptics, real safe-area insets, native navigation transitions, blur, sheet detents, keyboard behaviour or Dynamic Type. Be explicit about that in the report. Then ask the user to check on a simulator or a real device, and give them a short list of what to look at: the back gesture on the deepest screen, the sheet detents, haptics on the key actions, the keyboard with the longest form, largest text size, and dark mode. Do not claim these were verified from web screenshots.
