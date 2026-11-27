import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const lint = await import(new URL("../tools/slop-lint.mjs", import.meta.url));

const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".md": "text/markdown" };
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split("?")[0]);
  const rel = normalize(path === "/" ? "/index.html" : path).replace(/^(\.\.[/\\])+/, "");
  try {
    const body = await readFile(join(root, rel));
    res.writeHead(200, { "content-type": MIME[extname(rel)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

// The browser is optional — see tests/spatial-audit.test.mjs for why.
// `skip: null` SKIPS a node:test test; only false/undefined mean "do not skip".
let browser = null;
let browserSkip = "playwright not installed";
try {
  const { chromium } = await import("playwright");
  browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ["--no-sandbox", "--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  browserSkip = false;
} catch (e) {
  browserSkip = `no usable browser: ${e.message.split("\n")[0]}`;
}
test.after(async () => {
  if (browser) await browser.close();
  server.close();
});

// ── The rule must exist before it can be wrong ────────────────────────────────
test("the phone rules are declared, weighted, and explain themselves", () => {
  for (const id of ["phone-squeezed", "desktop-columns-on-phone"]) {
    const rule = lint.RULES.find((r) => r.id === id);
    assert.ok(rule, `slop-lint must carry the ${id} rule`);
    assert.ok(rule.w > 0, `${id} must carry weight`);
    assert.match(rule.desc, /390|phone/i, `${id} must say it is about the phone`);
  }
  assert.equal(new Set(lint.RULES.map((r) => r.id)).size, lint.RULES.length, "rule ids must be unique");
});

// ── The measurement must be exposed, not hidden in a threshold ────────────────
test("the phone measurements are reported as numbers a person can check", async () => {
  const src = await readFile(new URL("../tools/slop-lint.mjs", import.meta.url), "utf8");
  for (const metric of ["smallTextShare", "narrowStrips", "trioRowsWide", "wideGrids"]) {
    assert.ok(src.includes(metric), `the tool must report ${metric}, or the threshold is unfalsifiable`);
  }
});

// ── The broken fixture must trip both rules ───────────────────────────────────
test("a desktop layout squeezed into a phone trips both phone rules", { skip: browserSkip }, async () => {
  const r = await lint.lintUrl(browser, `${base}/tests/fixtures/phone-squeezed.html`, { saveShots: false });
  assert.ok(r.lint, "the fixture must be measurable");
  for (const id of ["phone-squeezed", "desktop-columns-on-phone"]) {
    assert.ok(r.lint.hits.includes(id), `the squeezed fixture must trip ${id}, got: ${r.lint.hits.join(", ")}`);
  }
  assert.ok(r.mobile.smallTextShare >= 0.25, "the fixture's text is shrunk below 12px");
  assert.ok(r.mobile.narrowStrips >= 1, "the fixture keeps a narrow column beside a wide one at 390px");
  // Equal columns are a phone's own arrangement, not a squeezed desktop.
  const strip = r.mobile.narrowStripExamples[0];
  assert.ok(strip, "the fixture's strip must be reported with its rectangle");
  assert.ok(strip.widest >= 1.8 * strip.stripWidth, "a strip is narrow only beside a much wider column");
});

// ── This repo must not trip them ──────────────────────────────────────────────
test("the plate view is not a squeezed desktop", { skip: browserSkip }, async () => {
  const r = await lint.lintUrl(browser, `${base}/index.html`, { saveShots: false });
  assert.ok(r.lint, "the plate view must be measurable");
  for (const id of ["phone-squeezed", "desktop-columns-on-phone"]) {
    assert.ok(!r.lint.hits.includes(id), `the plate view must not trip ${id}, got: ${r.lint.hits.join(", ")}`);
  }
  assert.equal(r.mobile.smallTextShare, 0, "no text on the phone is set below 12px");
  for (const id of ["eyebrow", "italic-word", "tracked-caps", "side-stripe", "stat-card-row", "title-blurb", "status-dot"]) {
    assert.ok(!r.lint.hits.includes(id), `the plate view must not trip ${id}, got: ${r.lint.hits.join(", ")}`);
  }
});

test("the reading room is not a squeezed desktop", { skip: browserSkip }, async () => {
  const r = await lint.lintUrl(browser, `${base}/reading.html`, { saveShots: false });
  assert.ok(r.lint, "the reading room must be measurable");
  for (const id of ["phone-squeezed", "desktop-columns-on-phone"]) {
    assert.ok(!r.lint.hits.includes(id), `the reading room must not trip ${id}, got: ${r.lint.hits.join(", ")}`);
  }
  for (const id of ["eyebrow", "italic-word", "tracked-caps", "side-stripe", "stat-card-row", "title-blurb", "status-dot"]) {
    assert.ok(!r.lint.hits.includes(id), `the reading room must not trip ${id}, got: ${r.lint.hits.join(", ")}`);
  }
});

test("the eight giveaways trip on a template page and stay quiet on a plate-like page", { skip: browserSkip }, async () => {
  const bans = ["eyebrow", "italic-word", "tracked-caps", "side-stripe", "stat-card-row", "title-blurb", "status-dot"];
  const slop = await lint.lintUrl(browser, `${base}/tests/fixtures/giveaway-bans.html`, { saveShots: false, settleMs: 400 });
  assert.ok(slop.lint, "the template must be measurable");
  for (const id of bans) {
    assert.ok(slop.lint.hits.includes(id), `the template must trip ${id}, got: ${slop.lint.hits.join(", ")}`);
    assert.equal(lint.RULES.find((r) => r.id === id).w, 1);
  }
  assert.ok((slop.desktop.giveawayKickers || 0) >= 1);
  assert.ok((slop.desktop.giveawayBlurbs || 0) >= 3);
  assert.ok((slop.desktop.giveawayStatRows || 0) >= 1);
  const clean = await lint.lintUrl(browser, `${base}/tests/fixtures/giveaway-clean.html`, { saveShots: false, settleMs: 400 });
  assert.ok(clean.lint, "the clean page must be measurable");
  for (const id of bans) {
    assert.ok(!clean.lint.hits.includes(id), `the clean page must not trip ${id}, got: ${clean.lint.hits.join(", ")}`);
  }
  assert.equal(clean.desktop.giveawayTracked || 0, 0, "negative tracking on a condensed face is not tracked caps");
});

console.log("OK: a squeezed desktop is caught, and this repo's own pages are not");
