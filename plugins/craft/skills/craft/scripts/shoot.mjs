#!/usr/bin/env node
// Render HTML files or URLs at several viewports and themes, lint the result,
// and optionally record a scripted walkthrough video. Run with --help for usage.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { colorjs, playwright } from "./lib/tools.mjs";

const USAGE = `usage: node shoot.mjs <file|dir|url>... [options]

  --out <dir>             output folder (default ./shots)
  --viewports <list>      name=WxH,... (default desktop=1440x900,tablet=1024x600,small=800x480,phone=390x844)
  --themes <list>         themes to render (default light,dark). "none" renders the page as-is.
                          Each theme sets the theme attribute, toggles a dark class on <html>
                          and emulates prefers-color-scheme when the name is light or dark.
  --theme-attr <name>     attribute set on <html> for a theme (default data-theme)
  --reduced-motion        emulate prefers-reduced-motion: reduce
  --full-page             capture the full scroll height, not only the viewport
  --sheet                 also build one contact sheet PNG per page
  --min-target <px>       smallest allowed tap target when linting (default 44)
  --spacing-scale <px>    base unit for the off-scale spacing warning (default 4, 0 disables)
  --no-lint               skip the lint pass
  --video <steps.json>    record a walkthrough of the first target using a steps file
  --video-viewport <WxH>  viewport for the walkthrough (default first viewport)

Lints: horizontal overflow, icon blowouts, accessible names, broken images, clipped text,
tap targets, console errors, external requests, text contrast (APCA and WCAG 2), focus
visibility, off-scale spacing.

Steps file: [{"do":"click","selector":"text=Library"},{"do":"wait","ms":600},
  {"do":"type","selector":"#q","text":"water"},{"do":"press","key":"Enter"},
  {"do":"goto","url":"#/maps"},{"do":"theme","value":"dark"},{"do":"scroll","y":600}]

Writes PNGs, report.json and report.md to --out. Exit code 1 when lint finds errors.`;

const DEFAULT_VIEWPORTS = "desktop=1440x900,tablet=1024x600,small=800x480,phone=390x844";
const FOCUSABLE = "a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex=\"-1\"])";
const LEVEL_ORDER = { error: 0, warn: 1, info: 2 };

let Color;

function parseArgs(argv) {
  const opts = {
    targets: [], out: "shots", viewports: DEFAULT_VIEWPORTS, themes: "light,dark", themeAttr: "data-theme",
    fullPage: false, sheet: false, minTarget: 44, spacingScale: 4, reducedMotion: false, lint: true,
    video: null, videoViewport: null,
  };
  const valueFlags = {
    "--out": "out", "--viewports": "viewports", "--themes": "themes", "--theme-attr": "themeAttr",
    "--min-target": "minTarget", "--spacing-scale": "spacingScale", "--video": "video", "--video-viewport": "videoViewport",
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") { console.log(USAGE); process.exit(0); }
    else if (arg === "--full-page") opts.fullPage = true;
    else if (arg === "--sheet") opts.sheet = true;
    else if (arg === "--reduced-motion") opts.reducedMotion = true;
    else if (arg === "--no-lint") opts.lint = false;
    else if (valueFlags[arg]) opts[valueFlags[arg]] = argv[++i];
    else if (arg.startsWith("--")) throw new Error(`unknown option ${arg}`);
    else opts.targets.push(arg);
  }
  if (!opts.targets.length) { console.error(USAGE); process.exit(2); }
  opts.minTarget = Number(opts.minTarget);
  opts.spacingScale = Number(opts.spacingScale);
  return opts;
}

function parseViewports(spec) {
  return spec.split(",").map((entry) => {
    const [name, size] = entry.includes("=") ? entry.split("=") : [entry, entry];
    const [width, height] = size.toLowerCase().split("x").map(Number);
    if (!width || !height) throw new Error(`bad viewport "${entry}"`);
    return { name, width, height };
  });
}

function parseThemes(spec) {
  const list = spec.split(",").map((t) => t.trim()).filter(Boolean);
  return !list.length || (list.length === 1 && list[0] === "none") ? [""] : list;
}

function expandTargets(targets) {
  return targets.flatMap((target) => {
    if (/^https?:\/\//.test(target) || target.startsWith("file://")) return [{ name: slugFromUrl(target), url: target }];
    const path = resolve(target);
    if (!existsSync(path)) throw new Error(`not found: ${target}`);
    const files = statSync(path).isDirectory()
      ? readdirSync(path).filter((f) => f.endsWith(".html")).sort().map((f) => join(path, f))
      : [path];
    return files.map((file) => ({ name: basename(file, extname(file)), url: pathToFileURL(file).href }));
  });
}

function slugFromUrl(url) {
  const { host, pathname, hash } = new URL(url);
  const slug = `${pathname}${hash}`.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return slug || host.replace(/[^a-z0-9]+/gi, "-");
}

async function applyTheme(page, attr, value) {
  if (!value) return;
  await page.evaluate(([a, v]) => {
    const root = document.documentElement;
    root.setAttribute(a, v);
    root.classList.toggle("dark", v === "dark");
  }, [attr, value]);
  if (value === "light" || value === "dark") await page.emulateMedia({ colorScheme: value });
  await page.waitForTimeout(150);
}

// Runs in the page. Finds layout and touch problems and gathers the raw data for the
// contrast and spacing lints, which Node judges.
function collectPage({ minTarget, scale }) {
  const problems = [];
  const describe = (el) => {
    const label = (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
    const id = el.id ? `#${el.id}` : "";
    const cls = typeof el.className === "string" && el.className ? `.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
    return `${el.tagName.toLowerCase()}${id}${cls}${label ? ` "${label}"` : ""}`;
  };
  const selectorOf = (el) => {
    const parts = [];
    for (let node = el; node && node !== document.body && parts.length < 3; node = node.parentElement) {
      const tag = node.tagName.toLowerCase();
      if (node.id) { parts.unshift(`${tag}#${node.id}`); break; }
      const cls = typeof node.className === "string" && node.className ? `.${node.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
      parts.unshift(`${tag}${cls}`);
    }
    return parts.join(" > ");
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && Number(s.opacity) > 0;
  };

  const doc = document.documentElement;
  if (doc.scrollWidth > window.innerWidth + 1) {
    problems.push({ level: "error", rule: "horizontal-overflow", detail: `page is ${doc.scrollWidth}px wide in a ${window.innerWidth}px viewport` });
  }

  const interactive = document.querySelectorAll("a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=tab], [role=switch], [role=checkbox], [tabindex]:not([tabindex='-1'])");
  for (const el of interactive) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < minTarget || r.height < minTarget) {
      const inline = el.tagName === "A" && getComputedStyle(el).display === "inline";
      if (!inline) problems.push({ level: "warn", rule: "small-target", detail: `${describe(el)} is ${Math.round(r.width)}x${Math.round(r.height)}` });
    }
    const name = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || el.getAttribute("title") || el.textContent.trim() || el.getAttribute("placeholder") || (el.id && document.querySelector(`label[for="${el.id}"]`));
    if (!name && !el.closest("label")) problems.push({ level: "error", rule: "no-accessible-name", detail: describe(el) });
  }

  for (const el of document.querySelectorAll("body *")) {
    if (!visible(el) || el.children.length) continue;
    const s = getComputedStyle(el);
    const clipsX = el.scrollWidth > el.clientWidth + 1 && ["hidden", "clip"].includes(s.overflowX);
    if (clipsX && s.textOverflow !== "ellipsis") problems.push({ level: "warn", rule: "clipped-text", detail: `${describe(el)} is cut off without an ellipsis` });
  }

  for (const svg of document.querySelectorAll("svg")) {
    if (!visible(svg)) continue;
    const box = svg.viewBox && svg.viewBox.baseVal;
    const r = svg.getBoundingClientRect();
    if (box && box.width && box.width <= 48 && r.width > box.width * 4) {
      problems.push({ level: "error", rule: "icon-blowout", detail: `${box.width}px icon drawn at ${Math.round(r.width)}x${Math.round(r.height)} inside ${describe(svg.parentElement)}` });
    }
  }

  for (const img of document.querySelectorAll("img")) {
    if (!img.complete || img.naturalWidth === 0) problems.push({ level: "error", rule: "broken-image", detail: img.getAttribute("src") });
    if (!img.hasAttribute("alt")) problems.push({ level: "warn", rule: "img-no-alt", detail: img.getAttribute("src") });
  }

  const texts = [];
  const media = [...document.querySelectorAll("img, video")].filter(visible).map((m) => m.getBoundingClientRect());
  const transparent = (c) => c === "transparent" || /(,\s*0|\/\s*0)\)$/.test(c);
  const opaque = (c) => /^rgb\(/.test(c) || /(,\s*1|\/\s*1)\)$/.test(c);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let n = walker.nextNode(); n && texts.length < 1500; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!el || !n.nodeValue.trim() || seen.has(el) || ["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"].includes(el.tagName)) continue;
    seen.add(el);
    if (el.closest("[aria-hidden='true']") || el.closest(":disabled")) continue;
    const shown = el.checkVisibility ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : visible(el);
    const r = el.getBoundingClientRect();
    if (!shown || r.width < 2 || r.height < 2) continue;

    const s = getComputedStyle(el);
    let opacity = 1;
    const chain = [];
    let image = false;
    let solid = false;
    for (let a = el; a; a = a.parentElement) {
      const cs = getComputedStyle(a);
      opacity *= Number(cs.opacity);
      if (!solid && cs.backgroundImage !== "none") { image = true; break; }
      if (!solid && !transparent(cs.backgroundColor)) {
        chain.push(cs.backgroundColor);
        if (opaque(cs.backgroundColor)) solid = true;
      }
    }
    if (!solid && media.some((m) => r.left < m.right && r.right > m.left && r.top < m.bottom && r.bottom > m.top)) image = true;
    texts.push({
      selector: selectorOf(el), text: n.nodeValue.trim().replace(/\s+/g, " ").slice(0, 40), tag: el.tagName.toLowerCase(),
      size: parseFloat(s.fontSize), weight: Number(s.fontWeight) || 400, color: s.color, opacity, chain, image,
    });
  }

  const spacing = [];
  if (scale > 0) {
    const props = ["margin-top", "margin-right", "margin-bottom", "margin-left", "padding-top", "padding-right", "padding-bottom", "padding-left", "row-gap", "column-gap"];
    let checked = 0;
    for (const el of document.querySelectorAll("body *")) {
      if (checked++ > 4000) break;
      if (!visible(el)) continue;
      const s = getComputedStyle(el);
      // equal left and right margins are usually margin: auto, which resolves to arbitrary px
      const centred = s.marginLeft === s.marginRight;
      for (const prop of props) {
        if (centred && (prop === "margin-left" || prop === "margin-right")) continue;
        const raw = s.getPropertyValue(prop);
        if (!/^-?[\d.]+px$/.test(raw)) continue;
        const v = Math.abs(parseFloat(raw));
        if (v === 0 || v === 1 || v === 2) continue;
        const off = Math.abs(v / scale - Math.round(v / scale)) * scale;
        if (off > 0.1) spacing.push({ selector: selectorOf(el), prop, value: raw, off });
      }
    }
  }
  return { problems, texts, spacing };
}

function rgba(str) {
  const c = new Color(str).to("srgb");
  const rgb = c.coords.map((v) => Math.min(1, Math.max(0, Number.isNaN(v) ? 0 : v)));
  return { rgb, a: c.alpha ?? 1 };
}

function over(top, under, alpha = top.a) {
  return { rgb: top.rgb.map((v, i) => v * alpha + under.rgb[i] * (1 - alpha)), a: 1 };
}

const hex = (c) => new Color("srgb", c.rgb).toString({ format: "hex" });

// Composites the background chain over white, then the text over that.
function judgeContrast(texts) {
  const groups = new Map();
  const add = (level, rule, key, item, detail) => {
    const id = `${rule}|${key}`;
    if (!groups.has(id)) groups.set(id, { level, rule, items: [] });
    groups.get(id).items.push({ ...item, detail });
  };
  for (const t of texts) {
    if (t.image) { add("info", "contrast-unchecked", "all", t, `${t.selector} "${t.text}"`); continue; }
    let fg, bg;
    try {
      bg = [...t.chain].reverse().reduce((under, layer) => over(rgba(layer), under), { rgb: [1, 1, 1], a: 1 });
      const text = rgba(t.color);
      fg = over(text, bg, text.a * t.opacity);
    } catch {
      add("info", "contrast-unchecked", "all", t, `${t.selector} "${t.text}" (colour not parsed)`);
      continue;
    }
    const fgColor = new Color("srgb", fg.rgb);
    const bgColor = new Color("srgb", bg.rgb);
    const lc = Math.abs(Color.contrast(bgColor, fgColor, "APCA"));
    const ratio = Color.contrast(bgColor, fgColor, "WCAG21");
    const large = t.size >= 24 || (t.size >= 18.66 && t.weight >= 700);
    const colours = `${hex(fg)} on ${hex(bg)}`;
    const info = `${t.selector} "${t.text}" ${colours}, Lc ${lc.toFixed(1)}, ratio ${ratio.toFixed(2)} (${t.size}px/${t.weight})`;
    const item = { selector: t.selector, text: t.text, colours, lc: Number(lc.toFixed(1)), ratio: Number(ratio.toFixed(2)), size: t.size, weight: t.weight };
    const apcaFail = lc < (large ? 45 : 60);
    if (apcaFail) add("error", "contrast-apca", colours, item, info);
    if (ratio < (large ? 3 : 4.5)) add("error", "contrast-wcag", colours, item, info);
    const body = ["p", "li", "td", "dd", "blockquote"].includes(t.tag) && t.size >= 14 && t.size <= 20;
    if (!apcaFail && body && lc < 75) add("warn", "contrast-body-apca", colours, item, info);
  }
  return [...groups.values()].map(({ level, rule, items }) => {
    const more = items.length > 1 ? ` (+${items.length - 1} more)` : "";
    const detail = rule === "contrast-unchecked"
      ? `${items.length} text elements sit over an image or gradient and were not checked, e.g. ${items[0].detail}`
      : `${items[0].detail}${more}`;
    return { level, rule, detail, items: items.map(({ detail: _d, ...rest }) => rest) };
  });
}

function judgeSpacing(spacing, scale) {
  if (!spacing.length) return [];
  const worst = [...new Map(spacing.map((s) => [`${s.selector}|${s.prop}|${s.value}`, s])).values()]
    .sort((a, b) => b.off - a.off).slice(0, 10)
    .map(({ selector, prop, value }) => ({ selector, prop, value }));
  const list = worst.map((w) => `${w.selector} ${w.prop} ${w.value}`).join("; ");
  return [{ level: "warn", rule: "off-scale-spacing", detail: `${spacing.length} values are off the ${scale}px scale. Top ${worst.length}: ${list}`, items: worst }];
}

// Tabs through the focusable elements so :focus-visible applies, and compares the
// styles a focus indicator could use before and after.
async function focusLint(page) {
  const freeze = await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important;animation:none!important}" });
  const described = await page.evaluate((sel) => {
    const snap = (el) => {
      const s = getComputedStyle(el);
      return [s.outlineStyle, s.outlineWidth, s.outlineColor, s.boxShadow, s.borderTopColor, s.borderRightColor, s.borderBottomColor, s.borderLeftColor, s.backgroundColor].join("|");
    };
    window.__craft = { snap, base: {} };
    const out = [];
    for (const el of document.querySelectorAll(sel)) {
      if (out.length >= 60) break;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      if (el.closest(":disabled") || r.width <= 0 || r.height <= 0 || s.visibility === "hidden" || s.display === "none") continue;
      const label = (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
      const cls = typeof el.className === "string" && el.className ? `.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
      el.setAttribute("data-craft-focus", out.length);
      window.__craft.base[out.length] = snap(el);
      out.push(`${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}${cls}${label ? ` "${label}"` : ""}`);
    }
    document.activeElement?.blur?.();
    window.scrollTo(0, 0);
    return out;
  }, FOCUSABLE);

  const problems = [];
  const reached = new Set();
  for (let i = 0; i < Math.min(described.length + 40, 140); i++) {
    await page.keyboard.press("Tab");
    const hit = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return { done: true };
      const idx = el.getAttribute("data-craft-focus");
      if (idx === null) return {};
      return { idx: Number(idx), changed: window.__craft.snap(el) !== window.__craft.base[idx] };
    });
    if (hit.done) break;
    if (hit.idx === undefined || reached.has(hit.idx)) continue;
    reached.add(hit.idx);
    if (!hit.changed) problems.push({ level: "error", rule: "focus-invisible", detail: `${described[hit.idx]} shows no change on keyboard focus` });
  }

  await page.evaluate(() => {
    document.querySelectorAll("[data-craft-focus]").forEach((el) => el.removeAttribute("data-craft-focus"));
    document.activeElement?.blur?.();
    delete window.__craft;
    window.scrollTo(0, 0);
  });
  await freeze.evaluate((el) => el.remove());
  return problems;
}

async function lintShot(page, opts) {
  const raw = await page.evaluate(collectPage, { minTarget: opts.minTarget, scale: opts.spacingScale });
  return [
    ...raw.problems,
    ...judgeContrast(raw.texts),
    ...judgeSpacing(raw.spacing, opts.spacingScale),
    ...await focusLint(page),
  ];
}

async function shootAll(browser, opts, pages, viewports, themes) {
  const results = [];
  for (const target of pages) {
    for (const vp of viewports) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
      const page = await context.newPage();
      if (opts.reducedMotion) await page.emulateMedia({ reducedMotion: "reduce" });
      const consoleErrors = [];
      const external = new Set();
      page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
      page.on("pageerror", (err) => consoleErrors.push(err.message));
      page.on("request", (req) => {
        const u = new URL(req.url());
        const local = u.protocol === "file:" || u.protocol === "data:" || u.protocol === "blob:" || ["localhost", "127.0.0.1", "0.0.0.0"].includes(u.hostname) || u.hostname.endsWith(".localhost");
        if (!local) external.add(`${u.protocol}//${u.host}`);
      });
      await page.goto(target.url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts && document.fonts.ready);
      for (const theme of themes) {
        await applyTheme(page, opts.themeAttr, theme);
        const file = `${target.name}__${theme || "default"}__${vp.name}-${vp.width}x${vp.height}.png`;
        await page.screenshot({ path: join(opts.out, file), fullPage: opts.fullPage });
        const problems = opts.lint ? await lintShot(page, opts) : [];
        results.push({ page: target.name, url: target.url, viewport: vp, theme: theme || null, file, problems });
      }
      const last = results[results.length - 1];
      last.consoleErrors = consoleErrors;
      last.externalRequests = [...external];
      await context.close();
    }
  }
  return results;
}

async function buildSheets(browser, opts, results) {
  const byPage = Map.groupBy ? Map.groupBy(results, (r) => r.page) : results.reduce((m, r) => m.set(r.page, [...(m.get(r.page) || []), r]), new Map());
  const sheets = [];
  for (const [name, shots] of byPage) {
    const cells = shots.map((s) => `<figure><img src="${pathToFileURL(resolve(opts.out, s.file)).href}"><figcaption>${s.viewport.name} ${s.viewport.width}x${s.viewport.height}${s.theme ? ` · ${s.theme}` : ""}</figcaption></figure>`).join("");
    const html = `<!doctype html><meta charset="utf-8"><style>
      body{margin:0;padding:24px;background:#1b1b1f;color:#eee;font:14px system-ui,sans-serif}
      h1{font-size:18px;margin:0 0 16px}
      .grid{display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start}
      figure{margin:0;background:#2a2a30;padding:8px;border-radius:8px}
      img{display:block;max-height:420px;max-width:640px;border:1px solid #444}
      figcaption{padding-top:6px;color:#aaa}</style><h1>${name}</h1><div class="grid">${cells}</div>`;
    const page = await browser.newPage({ viewport: { width: 1800, height: 900 } });
    await page.setContent(html, { waitUntil: "load" });
    const file = `${name}__sheet.png`;
    await page.screenshot({ path: join(opts.out, file), fullPage: true });
    await page.close();
    sheets.push(file);
  }
  return sheets;
}

async function recordWalkthrough(browser, opts, target, viewports) {
  const steps = JSON.parse(readFileSync(opts.video, "utf8"));
  const vp = opts.videoViewport ? parseViewports(opts.videoViewport)[0] : viewports[0];
  const size = { width: vp.width, height: vp.height };
  const context = await browser.newContext({ viewport: size, recordVideo: { dir: opts.out, size } });
  const page = await context.newPage();
  if (opts.reducedMotion) await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(target.url, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  for (const step of steps) {
    if (step.do === "click") await page.click(step.selector);
    else if (step.do === "type") await page.fill(step.selector, step.text);
    else if (step.do === "press") await page.keyboard.press(step.key);
    else if (step.do === "wait") await page.waitForTimeout(step.ms ?? 500);
    else if (step.do === "scroll") await page.mouse.wheel(0, step.y ?? 400);
    else if (step.do === "theme") await applyTheme(page, opts.themeAttr, step.value);
    else if (step.do === "goto") await page.goto(new URL(step.url, target.url).href, { waitUntil: "networkidle" });
    else throw new Error(`unknown step ${JSON.stringify(step)}`);
    await page.waitForTimeout(step.pause ?? 700);
  }
  await page.waitForTimeout(800);
  const video = page.video();
  await context.close();
  const file = `${target.name}__walkthrough.webm`;
  await video.saveAs(join(opts.out, file));
  await video.delete();
  return file;
}

function writeReport(opts, results, sheets, video) {
  const count = (level) => results.reduce((n, r) => n + r.problems.filter((p) => p.level === level).length, 0);
  const consoleErrors = results.flatMap((r) => r.consoleErrors || []);
  const external = [...new Set(results.flatMap((r) => r.externalRequests || []))];
  const errors = count("error");
  writeFileSync(join(opts.out, "report.json"), JSON.stringify({ results, sheets, video }, null, 2));

  const lines = [
    `# Render report`,
    ``,
    `${results.length} screenshots, ${sheets.length} contact sheets${video ? `, walkthrough ${video}` : ""}.`,
    `Errors: ${errors}. Warnings: ${count("warn")}. Info: ${count("info")}. Console errors: ${consoleErrors.length}. External hosts: ${external.length}.`,
    ``,
  ];
  const head = lines.length;

  const pageNames = [...new Set(results.map((r) => r.page))];
  for (const name of pageNames) {
    lines.push(`## ${name}`, ``);
    const shots = results.filter((r) => r.page === name);
    const viewportNames = [...new Set(shots.map((r) => r.viewport.name))];
    for (const vpName of viewportNames) {
      const group = shots.filter((r) => r.viewport.name === vpName);
      const vp = group[0].viewport;
      lines.push(`### ${vp.name} ${vp.width}x${vp.height}`, ``);
      const cons = [...new Set(group.flatMap((r) => r.consoleErrors || []))];
      const ext = [...new Set(group.flatMap((r) => r.externalRequests || []))];
      if (cons.length) lines.push(`Console errors:`, ...cons.map((e) => `- ${e}`), ``);
      if (ext.length) lines.push(`Requests leaving the machine:`, ...ext.map((h) => `- ${h}`), ``);
      for (const shot of group) {
        lines.push(`#### ${shot.theme || "default"} (${shot.file})`, ``);
        const problems = [...new Map(shot.problems.map((p) => [`${p.rule}|${p.detail}`, p])).values()]
          .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
        if (!problems.length) lines.push(`No lint findings.`);
        for (const p of problems.slice(0, 60)) lines.push(`- **${p.level}** ${p.rule}: ${p.detail}`);
        if (problems.length > 60) lines.push(`- ...and ${problems.length - 60} more in report.json`);
        lines.push(``);
      }
    }
  }
  writeFileSync(join(opts.out, "report.md"), lines.join("\n"));
  console.log(lines.slice(0, head).join("\n"));
  console.log(`full report: ${join(opts.out, "report.md")}`);
  return errors + consoleErrors.length;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const viewports = parseViewports(opts.viewports);
  const themes = parseThemes(opts.themes);
  const pages = expandTargets(opts.targets);
  mkdirSync(opts.out, { recursive: true });

  const mod = await colorjs();
  Color = mod.default ?? mod;
  const { chromium } = playwright();
  const browser = await chromium.launch();
  try {
    const results = await shootAll(browser, opts, pages, viewports, themes);
    const sheets = opts.sheet ? await buildSheets(browser, opts, results) : [];
    const video = opts.video ? await recordWalkthrough(browser, opts, pages[0], viewports) : null;
    const failures = writeReport(opts, results, sheets, video);
    process.exitCode = failures ? 1 : 0;
  } finally {
    await browser.close();
  }
}

main().catch((err) => { console.error(err.message); process.exit(2); });
