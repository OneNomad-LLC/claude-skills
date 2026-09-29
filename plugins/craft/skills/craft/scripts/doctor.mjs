#!/usr/bin/env node
/**
 * Preflight for craft. Adapted from scroll-craft by Nate Herk, MIT, see NOTICE.
 *
 *   node doctor.mjs
 *
 * Required: node 20+, npm. Everything else is reported, not enforced: the
 * browser tools cache, a full ffmpeg (scroll video only), the kie.ai key and
 * the resolved scroll workspace. Exits non-zero only when a required item fails.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { TOOLS_DIR } from "./lib/tools.mjs";
import { paths } from "./scroll-workspace.mjs";

const rows = [];
const add = (sev, name, ok, detail, fix = "") => rows.push({ sev, name, ok, detail, fix });

const run = (cmd, args) => {
  try {
    return execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
};

const major = Number(process.versions.node.split(".")[0]);
add("required", "node", major >= 20, `v${process.versions.node}`, "Install Node 20 or newer.");

const npmV = run("npm", ["--version"]);
add("required", "npm", Boolean(npmV), npmV ? npmV.trim() : "not found", "Install npm alongside Node.");

const pwDir = path.join(TOOLS_DIR, "node_modules", "playwright");
const marker = path.join(TOOLS_DIR, ".chromium-installed");
add("optional", "playwright", fs.existsSync(pwDir), fs.existsSync(pwDir) ? TOOLS_DIR : "not in tools cache",
  "Installed on first use of a script that needs it.");
add("optional", "chromium", fs.existsSync(marker), fs.existsSync(marker) ? "installed" : "not installed",
  "Installed on first use of a script that needs it.");

const ffmpegs = [process.env.CRAFT_FFMPEG, "ffmpeg", "/usr/local/bin/ffmpeg", "/opt/homebrew/bin/ffmpeg", "/usr/bin/ffmpeg", "/snap/bin/ffmpeg"].filter(Boolean);
let ffmpeg = null, filterCount = 0;
for (const c of ffmpegs) {
  const out = run(c, ["-hide_banner", "-filters"]);
  if (!out) continue;
  const n = out.split("\n").length;
  if (n > filterCount) { filterCount = n; ffmpeg = c; }
  if (n > 200) break;
}
add("optional", "ffmpeg (full build)", filterCount > 200,
  ffmpeg ? `${ffmpeg} (${filterCount} filters)` : "not found",
  "Only needed for scroll video. A stripped build lacks scale, fps, psnr and the webp muxer. Set CRAFT_FFMPEG to a full one.");

function findKey() {
  if (process.env.KIE_AI_API_KEY) return "env";
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    const p = path.join(dir, ".env");
    if (fs.existsSync(p) && /^\s*KIE_AI_API_KEY\s*=\s*\S+/m.test(fs.readFileSync(p, "utf8"))) return p;
    const up = path.dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return null;
}
const keyWhere = findKey();
add("optional", "KIE_AI_API_KEY", Boolean(keyWhere), keyWhere ? "set" : "not set",
  "Only needed to generate imagery. Building from supplied photos and footage needs no key.");

try {
  const ws = paths();
  add("optional", "scroll workspace", true, `${ws.workspace} (via ${ws.via})`);
} catch (e) {
  add("optional", "scroll workspace", false, e.message, "Fix or delete the offending .craft.json.");
}

const mark = (r) => (r.ok ? "ok  " : r.sev === "required" ? "FAIL" : "warn");
console.log("\ncraft preflight\n");
for (const r of rows) {
  console.log(` [${mark(r)}] ${r.name.padEnd(22)} ${r.detail}`);
  if (!r.ok && r.fix) console.log(`        ${r.fix}`);
}

const hard = rows.filter((r) => !r.ok && r.sev === "required");
console.log("");
if (hard.length) {
  console.log(`${hard.length} required check(s) failed.\n`);
  process.exit(1);
}
console.log("Ready.\n");
