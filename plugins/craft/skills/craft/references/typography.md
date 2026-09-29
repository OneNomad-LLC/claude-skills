# Typography

Most of what reads as premium or cheap in an interface is type. A good face set badly looks amateur, and a plain face set well looks expensive. The order of work is scale, then metrics, then face. Pick the face last, and pick it for a reason.

## Scale

Set the scale before choosing sizes screen by screen. Ratio depends on surface.

| Surface | Ratio | Why |
|---|---|---|
| Dense app, dashboard, tool | 1.125 to 1.25 | Many levels have to fit in a small range, and each step has to stay readable next to the next. |
| Standard web app, docs | 1.2 to 1.25 | Room for a clear page title and section heads without shouting. |
| Marketing, editorial | 1.25 to 1.5 for display | Contrast in size is the hierarchy. Body stays near 1.125 steps, display jumps. |
| Mobile | 1.125 to 1.2 | Small canvas, large touch text, and the user's Dynamic Type setting will scale it. |

Use a scale of seven or eight steps and no more. Example tokens for a web app at 1.2 from a 15px base, with line height and tracking attached to each step:

```css
:root {
  --text-xs:   0.75rem;    --lh-xs: 1.35;   --tr-xs: 0.01em;    /* 12 */
  --text-sm:   0.8125rem;  --lh-sm: 1.45;   --tr-sm: 0.005em;   /* 13 */
  --text-base: 0.9375rem;  --lh-base: 1.55; --tr-base: 0;       /* 15 */
  --text-lg:   1.125rem;   --lh-lg: 1.45;   --tr-lg: -0.005em;  /* 18 */
  --text-xl:   1.375rem;   --lh-xl: 1.3;    --tr-xl: -0.012em;  /* 22 */
  --text-2xl:  1.75rem;    --lh-2xl: 1.2;   --tr-2xl: -0.02em;  /* 28 */
  --text-3xl:  2.25rem;    --lh-3xl: 1.12;  --tr-3xl: -0.028em; /* 36 */
  /* marketing display, fluid */
  --text-display: clamp(2.75rem, 1.4rem + 5.6vw, 6rem);
  --lh-display: 0.98;  --tr-display: -0.035em;
}
```

Display sizes beyond 6rem need a reason. Bigger is not more confident, and on a phone a normal hero headline at desktop size wraps to six lines. Step the hero down a rung below about 700px and check the wrapped result in a 390px render.

## Tracking

Default tracking is tuned for text sizes. It is wrong at both ends.

- **Display (32px and up): tighten.** About -0.02em at 32 to 48px, -0.03 to -0.04em at 64px and above. A large face at default tracking looks loose and unfinished. This is optical correction, not style.
- **Body (14 to 18px): leave it.** Zero, or within 0.005em.
- **Small text (11 to 13px): open slightly.** +0.01 to +0.02em. Small sizes clog.
- **Uppercase labels and small caps: open more.** +0.05 to +0.1em. Capitals have no ascenders to guide the eye, and they need the air. Never set long passages in caps.
- **Tracking on lowercase body copy for emphasis** is a mistake. Use weight.

Tracking values change per face. Inter wants about -0.02em at 40px. Fraunces and other high-contrast serifs want less. Check the render and adjust.

Italic display type with descenders (g, j, p, q, y) clips under a line height of 1 or less. Give italic display lines at least 1.1, or add a few pixels of bottom padding on the wrapper, and check every italic word in the render.

## Line height

Line height falls as size rises, and rises with measure.

- Display: 0.95 to 1.1. Below 1.0 only works for one or two lines with no descenders touching the next line's ascenders.
- Headings: 1.1 to 1.25.
- UI text and labels: 1.3 to 1.4.
- Body in apps: 1.45 to 1.55.
- Long-form body: 1.6 to 1.7, more if the measure is wide.

Use unitless values. Fixed pixel line heights break under user font scaling.

## Measure

45 to 75 characters per line, 62ch as a default. A full-width paragraph on a 1600px monitor is unreadable regardless of size. Set `max-width: 62ch` on prose. Short measure allows tighter leading and wide measure needs looser. In multi-column layouts, check each column separately.

## Numbers

Numbers that change or align use tabular figures: `font-variant-numeric: tabular-nums` (Tailwind: `tabular-nums`). Tables, prices, counters, timers, and anything that updates in place. Proportional figures in a counter make the layout jitter every tick.

Use lining figures in UI and tables. Old-style figures suit running prose in a serif and nowhere else. Units go smaller and quieter than the values they follow. Use `font-variant-numeric: slashed-zero` in mono where 0 and O have to be told apart.

## Families and weights

- **Two families at most, plus a mono.** Display carries voice and text carries prose. A third family is a costume. One family with a good range often beats two.
- **Use only weights that exist in the loaded files.** Instrument Serif and DM Serif Display ship one weight. Asking for 600 gives a synthesised bold, which is smeared and wrong. Set `font-synthesis: none` so it fails visibly in dev, not quietly in production.
- **Three weights cover most products:** 400 for text, 500 for emphasis and UI labels, 600 for headings. A fourth needs a reason.
- **Emphasis inside a headline uses the same family's italic or bold.** Dropping a serif word into a sans headline for interest looks amateur.
- **Variable fonts** are one file for a range of weights and often a width or optical axis. Prefer them. They also let you set 450 or 550 for dark-mode compensation.

## Optical sizing and rendering

- Fonts with an optical size axis (Inter, Fraunces, Newsreader, Bricolage Grotesque) draw small text sturdier and display text finer. Leave `font-optical-sizing: auto` on and it follows font size. Loading the axis, not just the weights, is what makes it work.
- Add `-webkit-font-smoothing: antialiased` on dark backgrounds on macOS so light text doesn't bloom.
- **Dark mode compensation.** Light on dark reads thinner and tighter. Add about 0.05 to line height, 0.005 to 0.01em to tracking, and one weight step (or +30 on a variable axis). Test in a render. Metrics tuned for light look thin and blurry inverted.
- `text-wrap: balance` on headings, buttons and short text. `text-wrap: pretty` on body. Both are free and remove the one-word last line that makes a headline look accidental.
- **Hanging punctuation.** Opening quotes and list bullets should sit outside the text edge so the text aligns. `hanging-punctuation: first` works in Safari only. Elsewhere use a negative `text-indent` of about 0.4em on quote paragraphs, or a negative margin on the bullet.
- Use real typographic characters: curly quotes, en dash for ranges, the multiplication sign, a non-breaking space between a number and its unit.

## Loading without layout shift

Loading fonts is where careful type falls apart. Swapped fonts reflow the page unless the fallback matches the metrics of the loaded face.

**Next.js.** `next/font` self-hosts, preloads, and for Google fonts generates a size-adjusted fallback automatically. For local files, pass `adjustFontFallback`.

```tsx
// app/fonts.ts
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';

export const sans = Geist({ subsets: ['latin'], variable: '--font-sans-loaded', display: 'swap' });
export const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono-loaded', display: 'swap' });

// Fontshare files you downloaded and committed
export const display = localFont({
  src: [{ path: './ClashDisplay-Variable.woff2', weight: '200 700' }],
  variable: '--font-display-loaded',
  display: 'swap',
  adjustFontFallback: 'Arial',
});
```

Put the variables on `<html className={`${sans.variable} ${mono.variable}`}>` and let tokens.css point `--font-sans` at them. Variable fonts need no `weight` option. Static fonts list each weight they have. `display: 'optional'` gives zero shift at the cost of falling back on a slow first visit, which suits body text on a marketing page. Preload only what appears above the fold.

**Outside Next.** Use `@font-face` with `font-display: swap` and a fallback face with `size-adjust`, `ascent-override`, `descent-override` and `line-gap-override` set from the loaded font's metrics. Fontaine and Capsize generate the numbers. Subset to the languages you ship.

**Expo.** Fonts load asynchronously and React Native has no metric-matched fallback, so hold the splash screen until they are ready. Better, embed them at build time so they exist before any JS runs.

```tsx
// app.json plugins: [["expo-font", { "fonts": ["./assets/fonts/Satoshi-Medium.otf"] }]]
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const [loaded] = useFonts({
  'Satoshi-Regular': require('./assets/fonts/Satoshi-Regular.otf'),
  'Satoshi-Medium': require('./assets/fonts/Satoshi-Medium.otf'),
  'Satoshi-Bold': require('./assets/fonts/Satoshi-Bold.otf'),
});
if (loaded) SplashScreen.hideAsync();
```

On native, `fontWeight` does not choose between custom files on Android. Register each weight as its own family name and reference it by name, as above. Keep a `fontFamily` token per role in tokens.ts.

## Choosing a face

Ask what the brand needs the type to say, then narrow. The face should suit the product's job and voice, and it should hold up at the sizes the UI actually uses. Test with real strings, including numerals, a long name and a lowercase-heavy paragraph. Specimens flatter. Real copy tells the truth.

**Inter is not the default.** It is the most-used face in generated interfaces, and choosing it without a reason reads as a non-decision. It is the right call when the brand asks for neutral, when the product is a dense tool where the type should disappear, when you need wide language coverage (Latin, Cyrillic, Greek, Vietnamese), or when accessibility is the brief. In those cases use the optical size axis and tighten display sizes, so it doesn't look like the default anyway.

**A serif is not shorthand for premium.** Use one when the brand names it, or the work is editorial, hospitality or heritage and you can say why this serif fits this brand.

## Starter pairings

Fifteen starting points. All are free unless marked commercial. Google Fonts and Fontshare faces are licensed for commercial use, and Geist is also published by Vercel under the OFL. Check the current licence page before shipping.

**1. Geist and Geist Mono.** Precise, slightly geometric, engineered. Reads as modern software without a personality of its own. *Fits:* developer tools, infrastructure, technical SaaS, dashboards. *Source:* Google Fonts, Vercel (OFL).

**2. Inter (with opsz) and JetBrains Mono.** Neutral and highly legible. Dense UI, forms, tables. *Fits:* internal tools, data products, anything multilingual or accessibility-led. *Source:* Google Fonts (OFL).

**3. Satoshi and JetBrains Mono.** Friendly geometric grotesque, a little rounder than Inter and warmer. *Fits:* consumer SaaS, fintech, startups that want approachable and modern. *Source:* Fontshare (ITF Free Font License).

**4. General Sans and IBM Plex Mono.** Calm, slightly humanist, confident at large sizes. *Fits:* B2B platforms, agencies, portfolios, health and education. *Source:* General Sans on Fontshare, IBM Plex Mono on Google Fonts (OFL).

**5. Cabinet Grotesk and Inter.** Cabinet Grotesk is quirky and bold with sharp details in display. Inter carries the text. *Fits:* creative studios, food and drink, DTC brands with attitude. *Source:* Cabinet Grotesk on Fontshare, Inter on Google Fonts.

**6. Instrument Serif and Instrument Sans.** A condensed display serif with a light editorial feel, over a crisp sans. Instrument Serif has one weight and an italic, so use size for hierarchy. *Fits:* editorial, portfolios, media, boutique consumer brands. *Source:* Google Fonts (OFL).

**7. Fraunces and DM Sans.** Fraunces is a warm, soft serif with optical size, softness and wonk axes. It suits the brand that wants some personality. *Fits:* food, wellness, lifestyle, mission-driven products. *Source:* Google Fonts (OFL).

**8. Newsreader and Geist.** A text serif built for reading, with an optical size axis, over a clean sans for UI. *Fits:* publishing, research, knowledge tools, newsletters. *Source:* Google Fonts (OFL).

**9. Bricolage Grotesque and DM Sans.** Expressive grotesque with width and optical size axes and a slight ink-trap edge. *Fits:* brands that want energy without silliness: community, events, education, creative tools. *Source:* Google Fonts (OFL).

**10. Archivo (wdth axis) as one family.** Width axis gives condensed headlines and normal-width text from a single file. Industrial, athletic, direct. *Fits:* sport, logistics, hardware, mobility. *Source:* Google Fonts (OFL).

**11. Clash Display and General Sans.** Sharp, high-energy display over a neutral text face. Best at large sizes and short strings. *Fits:* Awwwards-style launches, creative agencies, event sites. *Source:* Fontshare (ITF Free Font License).

**12. IBM Plex Sans and IBM Plex Mono.** Sturdy, slightly technical, institutional. A complete family with serif and mono siblings. *Fits:* enterprise, finance, government, healthcare. *Source:* Google Fonts (OFL).

**13. DM Serif Display and DM Sans.** Classic high-contrast display serif over a friendly geometric sans. Display has a single weight. *Fits:* hospitality, boutique retail, wedding and events. *Source:* Google Fonts (OFL).

**14. Erode and Switzer.** A soft, contemporary serif with real character over a clear neo-grotesque. *Fits:* premium consumer, luxury-adjacent, hotels, home and design. *Source:* Fontshare (ITF Free Font License).

**15. Söhne and Tiempos Text.** The reference for Stripe-adjacent restraint (Söhne) and a considered reading serif (Tiempos). *Fits:* premium editorial software, financial and legal brands with budget. *Source:* Klim Type Foundry. **Commercial, optional.** Do not specify unless the client holds a licence. Geist plus Newsreader is the closest free equivalent.

**The overused ones.** Instrument Serif and Fraunces are the display serifs models reach for first, and a serif headline has become the reflex for anything called "creative" or "premium". Both faces are good. Use them when you can say in a sentence why this brand wants this serif, and not because the brief said "editorial". Otherwise start from a sans display cut (Geist, Cabinet Grotesk, General Sans, Satoshi) and let size and tracking do the work. Don't use the same display face on two projects in a row. For emphasis inside a headline, use the italic or a heavier weight of the same family; dropping one word into a different typeface reads as a trick.

Pairing rules that apply to all of them: contrast the two faces in structure (a serif with a sans, or a display cut with a text cut) and match them in x-height so they sit together. Two similar sans faces look like a mistake.

## Justifying the pick in the brief

Tie the face to the brand in one or two sentences, and write it in the design brief so a later session doesn't swap it. Example: "Satoshi over Inter because the brand voice is direct and a little warm, and its rounder terminals soften a product that handles money. Geist Mono for account numbers where tabular alignment matters." If you can't write that sentence, keep looking.

## Mobile specifics

**Dynamic Type on iOS.** Users set a text size in Settings, and accessibility sizes go to roughly three times the default. React Native scales `Text` with it by default (`allowFontScaling` is true). Design for it: let containers grow, wrap instead of truncate, and test at the largest accessibility size. Cap chrome that would break, such as tab bar labels, with `maxFontSizeMultiplier` around 1.2 to 1.3. Never cap body text. RN scales proportionally, and native text styles scale on their own curve, so for exact Apple behaviour use the system font with the platform text styles.

**Font scale on Android.** Users can set font size up to 200% on recent versions, and scaling is nonlinear on Android 14 and later so large text scales less than small. RN uses `sp` for you. Test at 200% and check that buttons, headers and inputs still hold.

**When the system face is right.** SF Pro on iOS and Roboto on Android (Samsung and some others substitute their own face) give a native feel, correct Dynamic Type behaviour, optical sizing between Text and Display cuts handled by the OS, wide language coverage and a zero-byte cost. Choose them for utilities, settings, productivity and OS-adjacent apps, and for any app where feeling native matters more than feeling branded. A common hybrid is system text for body and controls with one custom display face for titles and brand moments. That gets you brand recognition where it shows and native behaviour where it matters.

In RN, `fontFamily: undefined` or `System` picks the platform face. On the web, use `font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif` and accept that it will look different on each platform, which is often what a web app inside an OS wants.
