// Shared tool bootstrap. Installs npm packages once into ~/.cache/craft-tools so the
// scripts work in any project without touching its package.json.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { join } from "node:path";

export const TOOLS_DIR = process.env.CRAFT_TOOLS_DIR || join(homedir(), ".cache", "craft-tools");

const requireFrom = () => createRequire(join(TOOLS_DIR, "package.json"));

function install(pkgs) {
  console.error(`craft: installing ${pkgs.join(", ")} into ${TOOLS_DIR} (one time)`);
  mkdirSync(TOOLS_DIR, { recursive: true });
  const manifest = join(TOOLS_DIR, "package.json");
  if (!existsSync(manifest)) writeFileSync(manifest, "{\"private\":true}\n");
  execFileSync("npm", ["install", "--silent", "--prefix", TOOLS_DIR, ...pkgs], { stdio: "inherit" });
}

// Returns the loaded module, installing it first when missing.
export function need(pkg) {
  try {
    return requireFrom()(pkg);
  } catch {
    install([pkg]);
    return requireFrom()(pkg);
  }
}

export function playwright() {
  const pw = need("playwright");
  const marker = join(TOOLS_DIR, ".chromium-installed");
  if (!existsSync(marker)) {
    execFileSync(join(TOOLS_DIR, "node_modules", ".bin", "playwright"), ["install", "chromium"], { stdio: "inherit" });
    writeFileSync(marker, new Date().toISOString());
  }
  return pw;
}

// colorjs.io is ESM-first; load it with a dynamic import from the tools dir.
export async function colorjs() {
  need("colorjs.io");
  const entry = requireFrom().resolve("colorjs.io");
  let mod = await import(entry);
  while (mod && typeof mod !== "function" && mod.default) mod = mod.default;
  return mod;
}
