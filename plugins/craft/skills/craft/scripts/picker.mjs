#!/usr/bin/env node
// Local taste picker server. Serves the picker page, writes picks.json on submit, then exits.
// Usage: picker.mjs <dir> [--port 4790] [--open]

import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const portIdx = args.indexOf("--port");
const startPort = portIdx >= 0 ? Number(args[portIdx + 1]) || 4790 : 4790;
const dir = resolve(args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--port") || "");
if (!args.length || !existsSync(join(dir, "examples.json"))) {
  console.error("usage: picker.mjs <dir> [--port 4790] [--open]");
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const pageFile = join(here, "..", "picker", "index.html");
const shotsRoot = join(dir, "shots");
const types = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" };

const send = (res, code, body, type = "text/plain; charset=utf-8") => {
  res.writeHead(code, { "content-type": type, "cache-control": "no-store" });
  res.end(body);
};

function readBody(req) {
  return new Promise((ok, fail) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > 2e6) {
        fail(new Error("too large"));
        req.destroy();
      } else chunks.push(c);
    });
    req.on("end", () => ok(Buffer.concat(chunks).toString("utf8")));
    req.on("error", fail);
  });
}

async function handle(req, res) {
  const url = new URL(req.url, "http://127.0.0.1");
  const path = url.pathname;

  if (req.method === "GET" && (path === "/" || path === "/index.html")) {
    return send(res, 200, readFileSync(pageFile), "text/html; charset=utf-8");
  }
  if (req.method === "GET" && path === "/examples.json") {
    return send(res, 200, readFileSync(join(dir, "examples.json")), "application/json");
  }
  if (req.method === "GET" && path === "/draft") {
    const draft = join(dir, "picks.draft.json");
    return existsSync(draft) ? send(res, 200, readFileSync(draft), "application/json") : send(res, 404, "none");
  }
  if (req.method === "GET" && path.startsWith("/shots/")) {
    let rel;
    try {
      rel = decodeURIComponent(path.slice("/shots/".length));
    } catch {
      return send(res, 400, "bad path");
    }
    const file = resolve(shotsRoot, rel);
    if (!file.startsWith(shotsRoot + sep) || !existsSync(file) || !statSync(file).isFile()) {
      return send(res, 404, "not found");
    }
    return send(res, 200, readFileSync(file), types[extname(file).toLowerCase()] || "application/octet-stream");
  }
  if (req.method === "POST" && (path === "/picks" || path === "/progress")) {
    let data;
    try {
      data = JSON.parse(await readBody(req));
    } catch {
      return send(res, 400, "invalid json");
    }
    if (path === "/progress") {
      writeFileSync(join(dir, "picks.draft.json"), JSON.stringify(data, null, 2) + "\n");
      return send(res, 200, "ok");
    }
    const out = join(dir, "picks.json");
    writeFileSync(out, JSON.stringify(data, null, 2) + "\n");
    send(res, 200, "ok");
    console.log(`picks written: ${out}`);
    setTimeout(() => process.exit(0), 400);
    return;
  }
  send(res, 404, "not found");
}

const server = createServer((req, res) => {
  handle(req, res).catch((err) => send(res, 500, String(err.message || err)));
});

function listen(port, tries) {
  server.once("error", (err) => {
    if (err.code === "EADDRINUSE" && tries > 0) listen(port + 1, tries - 1);
    else {
      console.error(err.message);
      process.exit(1);
    }
  });
  server.listen(port, "127.0.0.1", () => {
    const url = `http://127.0.0.1:${port}/`;
    console.log(`picker running at ${url}`);
    if (args.includes("--open")) {
      const cmd = process.platform === "darwin" ? "open" : "xdg-open";
      spawn(cmd, [url], { stdio: "ignore", detached: true }).on("error", () => {}).unref();
    }
  });
}
listen(startPort, 10);
