# Tokens

Tokens come before any screen. If you are placing a hex value or a raw pixel size inside a component, the token set is missing something. Add the token.

The worked example below uses one brand colour (a green at hue 152) so the numbers are real. Swap the hue and chroma for the brief's brand. Do not keep the green.

## Two layers

1. **Primitives** are raw values named for what they are: `--n-500`, `--brand-700`, `--space-4`, `--radius-3`. They never appear in components.
2. **Semantic tokens** are named for the job they do: `--surface-raised`, `--text-secondary`, `--accent`, `--border-subtle`. Components use only these. Themes reassign only these.

A theme is a block that redefines semantic tokens. If a component needs a per-theme override, the semantic set is missing a job. Add it, don't patch the component.

## Required scales

| Scale | Values | Notes |
|---|---|---|
| Space | 4 8 12 16 20 24 32 40 48 64 96 128 | 4px base. `--space-N` is N x 4px. No odd values. |
| Type | 7 to 8 steps | Size, line height, weight and tracking as a set. See typography.md. |
| Radius | 4 6 10 16 and full | Three or four. Nested radius = outer radius minus padding. |
| Elevation | 3 levels plus border | Tinted to the canvas hue. In dark, level comes from surface lightness. |
| Motion | 120 / 200 / 320ms, two easings | Reduced-motion override drops movement, keeps opacity. |
| Icon | 16 / 20 / 24 | Base rule sets `flex: none` so an icon never stretches. |
| Z-index | 0 10 20 30 40 50 60 | Named layers. No `z-index: 9999` anywhere. |

## Building a palette from one brand colour

Work in OKLCH. Lightness means the same thing across hues, so a 600 in green and a 600 in red sit at the same weight, and status colours stay balanced next to the brand.

1. **Anchor the hue.** Take the brand colour's hue as `--brand-h`. Take its chroma, then reduce it if it falls outside sRGB at mid lightness. Most saturated brand colours want 0.14 to 0.20.
2. **Set a lightness ramp** that is the same for every colour family: 50 at 0.98, 100 at 0.95, 200 at 0.90, 300 at 0.83, 400 at 0.74, 500 at 0.65, 600 at 0.56, 700 at 0.47, 800 at 0.39, 900 at 0.32, 950 at 0.24.
3. **Taper chroma at the extremes.** Multiply peak chroma by 0.10, 0.22, 0.45, 0.70, 0.90, 1.0, 1.0, 0.88, 0.72, 0.55, 0.40 across the same stops. Full chroma at 50 is a neon pastel, and full chroma at 950 is mud.
4. **Tint the neutrals.** Use the brand hue at chroma 0.004 to 0.012. It is invisible on its own and it makes greys sit with the accent instead of against it. Warm and cool brands read wrong on dead grey.
5. **Pick the accent step.** The button fill is usually 600 to 700 in light and 300 to 400 in dark. Whichever step you choose, check the pair (fill against on-accent text) and the pair (fill against the surface it sits on).
6. **Check gamut.** High chroma at low or high lightness leaves sRGB. Clip by lowering chroma, never lightness, so the ramp stays even. Browsers do it for you, React Native won't, so convert to hex for native (see below).

## tokens.css

Primitives first, then one set of semantic tokens. Each colour is written once as `light-dark(light value, dark value)`. `:root` declares `color-scheme: light dark`, which follows `prefers-color-scheme`, and `[data-theme]` overrides it for an explicit choice. That is the system fallback and the manual toggle in one block, with no second copy of the dark values to drift.

```css
:root {
  color-scheme: light dark;
  --brand-h: 152;  --brand-c: 0.17;

  --brand-50:  oklch(0.98 calc(var(--brand-c) * 0.10) var(--brand-h));  --brand-100: oklch(0.95 calc(var(--brand-c) * 0.22) var(--brand-h));
  --brand-300: oklch(0.83 calc(var(--brand-c) * 0.70) var(--brand-h));  --brand-400: oklch(0.74 calc(var(--brand-c) * 0.90) var(--brand-h));
  --brand-600: oklch(0.56 var(--brand-c) var(--brand-h));
  --brand-700: oklch(0.47 calc(var(--brand-c) * 0.88) var(--brand-h));  --brand-800: oklch(0.39 calc(var(--brand-c) * 0.72) var(--brand-h));
  /* 200, 500 and 900 follow the same recipe from the ramp above */

  --n-50: oklch(0.985 0.004 var(--brand-h));  --n-100: oklch(0.965 0.005 var(--brand-h));
  --n-200: oklch(0.93 0.006 var(--brand-h));  --n-300: oklch(0.87 0.008 var(--brand-h));
  --n-400: oklch(0.71 0.010 var(--brand-h));  --n-500: oklch(0.55 0.012 var(--brand-h));
  --n-600: oklch(0.44 0.012 var(--brand-h));  --n-900: oklch(0.21 0.010 var(--brand-h));

  /* dark surfaces get four steps of their own: the ramp is too coarse near black */
  --dk-0: oklch(0.16 0.008 var(--brand-h));  --dk-1: oklch(0.19 0.009 var(--brand-h));
  --dk-2: oklch(0.225 0.010 var(--brand-h)); --dk-3: oklch(0.26 0.011 var(--brand-h));

  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;  --space-5: 20px;
  --space-6: 24px; --space-8: 32px; --space-10: 40px; --space-12: 48px; --space-16: 64px;
  --radius-1: 4px; --radius-2: 6px; --radius-3: 10px; --radius-4: 16px;
  --dur-fast: 120ms; --dur-base: 200ms; --dur-slow: 320ms;
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --motion-distance: 1;
  --icon-sm: 16px; --icon-md: 20px; --icon-lg: 24px;
  --z-sticky: 10; --z-dropdown: 20; --z-overlay: 30; --z-modal: 40; --z-toast: 50; --z-tooltip: 60;
  --font-text: var(--font-text-loaded), system-ui, sans-serif;
  --font-code: var(--font-code-loaded), ui-monospace, monospace;

  /* semantic */
  --surface-sunken:  light-dark(var(--n-100), var(--dk-0));  --surface-hover: light-dark(var(--n-100), var(--dk-3));
  --surface-base:    light-dark(var(--n-50), var(--dk-1));
  --surface-raised:  light-dark(oklch(0.995 0.002 var(--brand-h)), var(--dk-2));
  --surface-overlay: light-dark(oklch(0.995 0.002 var(--brand-h)), var(--dk-3));

  --text-primary:   light-dark(var(--n-900), oklch(0.94 0.006 var(--brand-h)));
  --text-secondary: light-dark(var(--n-600), oklch(0.76 0.010 var(--brand-h)));
  --text-tertiary:  light-dark(var(--n-500), oklch(0.62 0.012 var(--brand-h)));
  --text-disabled:  light-dark(var(--n-400), oklch(0.48 0.010 var(--brand-h)));
  --text-on-accent: light-dark(var(--n-50), var(--dk-0));

  --border-subtle: light-dark(var(--n-200), oklch(0.29 0.011 var(--brand-h)));
  --border-strong: light-dark(var(--n-300), oklch(0.38 0.012 var(--brand-h)));

  --accent:        light-dark(var(--brand-700), oklch(0.76 0.13 var(--brand-h)));
  --accent-hover:  light-dark(var(--brand-800), oklch(0.81 0.12 var(--brand-h)));
  --accent-subtle: light-dark(var(--brand-100), oklch(0.26 0.05 var(--brand-h)));
  --focus-ring:    light-dark(var(--brand-600), oklch(0.72 0.13 var(--brand-h)));

  /* status, four jobs each. Light L 0.58 / 0.96 / 0.42 / 0.85, dark L 0.72 / 0.24 / 0.82 / 0.38 */
  --status-ok:        light-dark(oklch(0.58 0.17 150), oklch(0.72 0.15 150));
  --status-ok-bg:     light-dark(oklch(0.96 0.03 150), oklch(0.24 0.05 150));
  --status-ok-fg:     light-dark(oklch(0.42 0.12 150), oklch(0.82 0.11 150));
  --status-ok-border: light-dark(oklch(0.85 0.08 150), oklch(0.38 0.08 150));
  /* warn (hue 80), critical (25) and info (245) repeat the four lines above with their hue */

  --shadow-1: 0 1px 2px light-dark(oklch(0.25 0.02 var(--brand-h) / 0.08), oklch(0 0 0 / 0.3));
  --shadow-2: 0 2px 4px light-dark(oklch(0.25 0.02 var(--brand-h) / 0.06), oklch(0 0 0 / 0.25)),
              0 8px 16px light-dark(oklch(0.25 0.02 var(--brand-h) / 0.08), oklch(0 0 0 / 0.35));
  --shadow-3: 0 4px 8px light-dark(oklch(0.25 0.02 var(--brand-h) / 0.06), oklch(0 0 0 / 0.3)),
              0 24px 48px light-dark(oklch(0.25 0.02 var(--brand-h) / 0.14), oklch(0 0 0 / 0.5));
}

[data-theme="light"] { color-scheme: light; }
[data-theme="dark"]  { color-scheme: dark; }

@media (prefers-reduced-motion: reduce) {
  /* movement goes, fades stay: components read --motion-distance for any translate or scale */
  :root { --motion-distance: 0; --dur-slow: var(--dur-base); }
}
```

`light-dark()` has been in every evergreen browser since mid 2024. If the brief needs older Safari, generate the dark values into a `[data-theme="dark"]` block and a matching `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ... } }` block from one source file.

Set `data-theme` from an inline script in `<head>` before first paint, or the page flashes light.

## Tailwind v4

Tailwind v4 reads tokens from CSS. `@theme inline` makes a utility resolve to the variable itself, so the theme switch works at runtime instead of being baked at build.

```css
@import "tailwindcss";
@import "./tokens.css";

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme { --color-*: initial; }

@theme inline {
  --color-sunken: var(--surface-sunken);  --color-canvas: var(--surface-base);
  --color-raised: var(--surface-raised);  --color-overlay: var(--surface-overlay);
  --color-ink: var(--text-primary);  --color-ink-secondary: var(--text-secondary);
  --color-ink-tertiary: var(--text-tertiary);  --color-on-accent: var(--text-on-accent);
  --color-line: var(--border-subtle);  --color-line-strong: var(--border-strong);
  --color-accent: var(--accent);  --color-accent-hover: var(--accent-hover);
  --color-accent-subtle: var(--accent-subtle);
  --color-ok: var(--status-ok);  --color-warn: var(--status-warn);
  --color-critical: var(--status-critical);  --color-info: var(--status-info);

  --radius-sm: var(--radius-1);  --radius-md: var(--radius-2);
  --radius-lg: var(--radius-3);  --radius-xl: var(--radius-4);
  --shadow-sm: var(--shadow-1);  --shadow-md: var(--shadow-2);  --shadow-lg: var(--shadow-3);
  --font-sans: var(--font-text);  --font-mono: var(--font-code);
}
```

The token file names its fonts `--font-text` and `--font-code` so they never collide with Tailwind's own `--font-sans` and `--font-mono`, which would make the variable reference itself.

Clearing `--color-*` removes the default palette, so `bg-blue-500` fails at build and nobody can reach for it. Spacing needs no mapping: v4's `--spacing: 0.25rem` is already a 4px base, so `p-4` is 16px.

Opacity modifiers such as `bg-accent/10` work on these variables because v4 compiles them through `color-mix`. Because the dark theme is a variable swap, most components need no `dark:` variant at all. If you write `dark:` on a colour, ask what semantic token was missing.

## shadcn/ui

shadcn components read a fixed set of variable names, and one of them collides with ours: shadcn's `--accent` is a hover surface, not the brand colour. In a shadcn project, rename the three semantic brand tokens in tokens.css to `--brand`, `--brand-hover` and `--brand-subtle`, and leave `--accent` to shadcn. In the Tailwind block, map `--color-brand: var(--brand)` instead of `--color-accent`.

Then point the shadcn names at the semantic layer once, in `:root`. The semantic tokens change per theme, so the shadcn names follow and you need no `.dark` block.

```css
:root {
  --background: var(--surface-base);  --foreground: var(--text-primary);
  --card: var(--surface-raised);  --card-foreground: var(--text-primary);
  --popover: var(--surface-overlay);  --popover-foreground: var(--text-primary);
  --primary: var(--brand);  --primary-foreground: var(--text-on-accent);
  --secondary: var(--surface-sunken);  --secondary-foreground: var(--text-primary);
  --muted: var(--surface-sunken);  --muted-foreground: var(--text-secondary);
  --accent: var(--surface-hover);  --accent-foreground: var(--text-primary);
  --destructive: var(--status-critical);
  --border: var(--border-subtle);  --input: var(--border-strong);  --ring: var(--focus-ring);
  --radius: var(--radius-3);  --chart-1: var(--brand);
  --sidebar: var(--surface-sunken);  --sidebar-foreground: var(--text-primary);
  --sidebar-primary: var(--brand);  --sidebar-primary-foreground: var(--text-on-accent);
  --sidebar-accent: var(--surface-hover);  --sidebar-accent-foreground: var(--text-primary);
  --sidebar-border: var(--border-subtle);  --sidebar-ring: var(--focus-ring);
}
```

shadcn's CLI writes the matching `--color-background: var(--background)` lines into `@theme inline`, so the utilities (`bg-primary`, `text-muted-foreground`) work unchanged.

Then restyle the components. Radix and shadcn give you behaviour, focus management and ARIA. They do not give you a design. Change radius, borders, padding, type and state styles until the components stop looking like the docs site.

## Dark mode

Dark is designed. It is not `filter: invert()` and it is not the light theme with the ramp reversed.

- **Elevation is lighter surfaces.** Higher things are lighter: sunken 0.16, base 0.19, raised 0.225, overlay 0.26. Shadows barely register on dark, so add a 1px low-contrast border or ring for definition.
- **Lower the accent chroma and raise its lightness.** A saturated light-mode accent vibrates on dark. Drop chroma about 20% and move to the 300 to 400 lightness band.
- **No pure white body text.** Use L 0.92 to 0.95. Pure white on near-black blooms and tires the eye.
- **No pure black canvas** except on OLED-first mobile surfaces where you have chosen it, and then keep raised surfaces distinct.
- **Set text a little heavier and looser.** Light on dark reads thinner. Add a touch of line height and tracking, or one weight step. Typography.md covers the numbers.
- **Re-check every pair.** Contrast changes direction. Secondary text that passed on light can fail on dark, and status text needs its own dark values (light foreground on a deep tinted background).

## Status colours

Four jobs: ok, warn, critical, info. Each has a solid (icon, dot, fill), a `-bg` (banner or badge background), a `-fg` (text on that background) and a `-border`.

- Use the same L and C for every hue at each stop. Red and green then weigh the same and none of them shouts.
- If the brand hue sits within about 30 degrees of a status hue, shift the status hue or the brand will read as a state. A green brand wants a teal-leaning ok, or ok can share the accent and rely on the icon.
- Yellow is the problem hue. Warn text on a light background needs a dark amber (L 0.42), not yellow. Fill the warn dot with amber and put text in `-fg`.

## Contrast targets

Use APCA to set the target and WCAG 2.2 AA as the floor. If they disagree, take the stricter result. APCA is polarity-aware, so check dark pairs separately. Lc is the lightness contrast value; the sign flips for light on dark and the magnitude is what matters here.

| Use | APCA Lc | WCAG 2 floor |
|---|---|---|
| Body text, preferred | 90 | 4.5:1 |
| Body text, minimum | 75 | 4.5:1 |
| Other content text (secondary, captions, labels) | 60 | 4.5:1 |
| Large headlines, icons and controls, focus rings | 45 | 3:1 |
| Placeholder and disabled | 30 | none (exempt, but keep legible) |
| Dividers, decorative borders | 15 | none |

Two notes. WCAG 2 has no exemption for small secondary text, so a 12px caption still needs 4.5:1 there even if its Lc is fine. And 3:1 for a control's boundary or a focus ring is measured against the colour next to it, which may be the raised surface and not the page.

`scripts/shoot.mjs` in this repo lints APCA contrast on renders. Run it on every theme and treat a flagged pair as a defect. Text over images, video or gradients is reported as unchecked rather than guessed, so check those by eye at every breakpoint and at the brightest frame.

## Expo and React Native

React Native does not parse `oklch()` reliably, and it does not gamut-map. Design in OKLCH, convert to hex once (culori's `formatHex` after `clampChroma` does it), and commit the hex. The values below are converted from the tokens above.

```ts
// tokens.ts
import { useColorScheme } from 'react-native';

export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64 } as const;
export const radius = { sm: 4, md: 6, lg: 10, xl: 16, full: 999 } as const;
export const motion = { fast: 120, base: 200, slow: 320 } as const;
export const icon = { sm: 16, md: 20, lg: 24 } as const;

const light = {
  surfaceSunken: '#f1f4f2', surfaceBase: '#f8fbf9', surfaceRaised: '#fcfefd', surfaceOverlay: '#fcfefd',
  textPrimary: '#151a16', textSecondary: '#4e554f', textTertiary: '#6d746e', textDisabled: '#9da39e',
  textOnAccent: '#f8fbf9', borderSubtle: '#e5e9e6', borderStrong: '#d0d6d2',
  accent: '#056d36', accentHover: '#055328', accentSubtle: '#ddf6e2', focusRing: '#068c47',
  critical: '#cb4644', criticalBg: '#feedeb',
} as const;

const dark: Theme = {
  surfaceSunken: '#0b0e0c', surfaceBase: '#111512', surfaceRaised: '#181d19', surfaceOverlay: '#202621',
  textPrimary: '#e8ece9', textSecondary: '#adb3ae', textTertiary: '#818883', textDisabled: '#5a5f5b',
  textOnAccent: '#0b0e0c', borderSubtle: '#272d29', borderStrong: '#3e443f',
  accent: '#6bc987', accentHover: '#82d79a', accentSubtle: '#0e2b18', focusRing: '#5ebc7b',
  critical: '#f47b74', criticalBg: '#331513',
};

export type Theme = { [K in keyof typeof light]: string };
export const themes: Record<'light' | 'dark', Theme> = { light, dark };

export function useTheme() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { scheme, colors: themes[scheme], space, radius, motion, icon } as const;
}
```

Build styles through a `makeStyles(theme)` helper so they rebuild on a scheme change. For a manual switch, hold the override in a context and have `useTheme` read it before `useColorScheme`. Set `"userInterfaceStyle": "automatic"` in `app.json` or iOS never reports a change.

Native has no CSS shadows, so elevation is `shadowColor`, `shadowOffset`, `shadowOpacity` and `shadowRadius` on iOS and `elevation` on Android. They will not match. In dark, skip shadows and rely on the lighter surface plus a border.
