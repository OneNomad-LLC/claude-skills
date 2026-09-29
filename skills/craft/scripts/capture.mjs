#!/usr/bin/env node
// Screenshots the examples listed in <dir>/examples.json for the taste picker.
// Usage: capture.mjs <dir> [--phone] [--full] [--concurrency 3]

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { playwright } from "./lib/tools.mjs";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const dir = resolve(args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--concurrency") || "");
if (!args.length || !existsSync(join(dir, "examples.json"))) {
  console.error("usage: capture.mjs <dir> [--phone] [--full] [--concurrency 3]");
  process.exit(1);
}

const withPhone = flag("--phone");
const withFull = flag("--full");
const concurrency = Math.max(1, Number(opt("--concurrency", 3)) || 3);
const entryTimeout = 30000;
const mobileUA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

const examplesPath = join(dir, "examples.json");
const shotsDir = join(dir, "shots");
mkdirSync(shotsDir, { recursive: true });
const examples = JSON.parse(readFileSync(examplesPath, "utf8"));

const cookieSelectors = ["#onetrust-accept-btn-handler", "#accept-cookies", "#cookie-accept", ".cc-allow", ".cc-dismiss"];

async function dismissCookies(page) {
  try {
    for (const sel of cookieSelectors) {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 100 }).catch(() => false)) {
        await el.click({ timeout: 1000 }).catch(() => {});
        return;
      }
    }
    await page.evaluate(() => {
      const box = /cookie|consent|gdpr/i;
      const label = /accept|agree|allow all|got it|ok/i;
      for (const wrap of document.querySelectorAll("[id],[class]")) {
        if (!box.test(wrap.id || "") && !box.test(String(wrap.className || ""))) continue;
        for (const b of wrap.querySelectorAll("button, [role=button], a.button")) {
          const r = b.getBoundingClientRect();
          if (r.width > 0 && r.height > 0 && label.test(b.textContent || "")) {
            b.click();
            return;
          }
        }
      }
    });
  } catch {}
}

async function shoot(browser, entry, kind) {
  const phone = kind === "phone";
  const context = await browser.newContext({
    viewport: phone ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    deviceScaleFactor: phone ? 2 : 1,
    colorScheme: entry.scheme === "dark" ? "dark" : "light",
    ...(phone ? { userAgent: mobileUA, isMobile: true, hasTouch: true } : {}),
  });
  try {
    const page = await context.newPage();
    await page.goto(entry.url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
    await dismissCookies(page);
    await page.waitForTimeout(800);
    const out = {};
    if (!phone) {
      const file = `${entry.id}-desktop.png`;
      await page.screenshot({ path: join(shotsDir, file) });
      out.desktop = `shots/${file}`;
      if (withFull) {
        const height = await page.evaluate(() => document.documentElement.scrollHeight).catch(() => 900);
        const full = `${entry.id}-full.png`;
        await page.screenshot({
          path: join(shotsDir, full),
          fullPage: true,
          clip: { x: 0, y: 0, width: 1440, height: Math.min(Math.max(height, 900), 5000) },
        });
        out.full = `shots/${full}`;
      }
    } else {
      const file = `${entry.id}-phone.png`;
      await page.screenshot({ path: join(shotsDir, file) });
      out.phone = `shots/${file}`;
    }
    return out;
  } finally {
    await context.close().catch(() => {});
  }
}

const withTimeout = (p, ms) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`timed out after ${ms / 1000}s`)), ms))]);

async function capture(browser, entry) {
  entry.shots = {};
  delete entry.error;
  try {
    if (!entry.url && entry.image) {
      const file = `${entry.id}-desktop${extname(entry.image) || ".png"}`;
      copyFileSync(resolve(entry.image), join(shotsDir, file));
      entry.shots.desktop = `shots/${file}`;
      return;
    }
    if (!entry.url) throw new Error("entry has neither url nor image");
    const jobs = [["desktop"]];
    if (withPhone) jobs.push(["phone"]);
    for (const [kind] of jobs) {
      try {
        Object.assign(entry.shots, await withTimeout(shoot(browser, entry, kind), entryTimeout));
      } catch (err) {
        if (kind === "desktop") throw err;
      }
    }
  } catch (err) {
    entry.error = String(err.message || err).split("\n")[0];
  } finally {
    const got = Object.keys(entry.shots).join(",") || "none";
    console.log(`${entry.error ? "FAIL" : "ok  "} ${entry.id} [${got}]${entry.error ? " " + entry.error : ""}`);
  }
}

const needsBrowser = examples.some((e) => e.url);
const browser = needsBrowser ? await playwright().chromium.launch() : null;
const queue = [...examples];
const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
  while (queue.length) await capture(browser, queue.shift());
});
await Promise.all(workers);
await browser?.close();

writeFileSync(examplesPath, JSON.stringify(examples, null, 2) + "\n");
console.log(`${examples.filter((e) => !e.error).length}/${examples.length} captured, wrote ${basename(examplesPath)}`);
