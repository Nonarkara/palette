import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const ship = await import(new URL("../tools/shipability.mjs", import.meta.url));

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");

// ── the pure functions ───────────────────────────────────────────────────────
// These are the parts that decide whether a route fails. They must be right
// without a browser, because a gate nobody can run is not a gate.

test("a unicode-range is classified by the script holding most of its codepoints", () => {
  assert.equal(ship.classifyScript("U+0e01-0e3a, U+0e40-0e5b"), "thai");
  assert.equal(ship.classifyScript("U+4e00-9fff"), "chinese");
  assert.equal(ship.classifyScript("U+0000-00ff"), "latin");
  // A family that carries both Latin and Thai is two faces, and each face is
  // classified by its own range. Taking the first codepoint of the range would
  // call the Thai face "latin" and hide the real cost.
  assert.equal(ship.classifyScript("U+0000-00ff, U+0131, U+0152-0153"), "latin");
  assert.equal(ship.classifyScript(""), "unknown");
  assert.equal(ship.classifyScript("not a range"), "other");
});

test("script boundaries are where they claim to be", () => {
  assert.equal(ship.scriptOf(0x41), "latin");
  assert.equal(ship.scriptOf(0x0e01), "thai");
  assert.equal(ship.scriptOf(0x4e00), "chinese");
  assert.equal(ship.scriptOf(0x3042), "japanese");
  assert.equal(ship.scriptOf(0xac00), "korean");
  assert.equal(ship.scriptOf(0x2014), "punctuation");
});

test("the summary counts transferred bytes, not the count of resources", () => {
  const report = ship.summarise([
    { url: "/a.html", type: "document", kind: "other", bytes: 100, finishedAt: 10 },
    { url: "/a.css", type: "stylesheet", kind: "other", bytes: 200, finishedAt: 20 },
    { url: "/a.woff2", type: "font", kind: "font", bytes: 300, finishedAt: 90, family: "X", script: "latin" }
  ], { firstPaintAt: 50, renderedScripts: ["latin"] });
  assert.equal(report.total, 600);
  assert.equal(report.totalKB, 0.6);
  assert.equal(report.beforePaint, 300);
  assert.equal(report.byType.font, 300);
  assert.equal(report.fonts.kb, 0.3);
  assert.equal(report.fonts.families[0], "X");
  assert.equal(report.heaviest[0].url, "/a.woff2");
});

test("a picture painted into a box much smaller than the file is waste", () => {
  const waste = ship.oversampledImages([
    { url: "/big.png", naturalWidth: 1600, naturalHeight: 900, renderedWidth: 240 },
    { url: "/fine.png", naturalWidth: 500, naturalHeight: 400, renderedWidth: 200 }
  ], 1);
  assert.equal(waste.length, 1);
  assert.equal(waste[0].url, "/big.png");
  assert.ok(waste[0].factor > 6);
  // Two device pixels per CSS pixel, the file must be that much bigger to be
  // worth sending.
  assert.equal(ship.oversampledImages([{ url: "/x.png", naturalWidth: 600, naturalHeight: 400, renderedWidth: 200 }], 2).length, 0);
});

test("each budget has its own rule, and each rule names the measurement", () => {
  const base = {
    totalKB: 100, beforePaintKB: 50,
    fonts: { kb: 50, families: ["A"], unwanted: [] },
    heaviest: [{ url: "/x", kb: 40 }], oversampled: []
  };
  assert.equal(ship.evaluate(base).verdict, "OK");
  const heavy = ship.evaluate({ ...base, totalKB: 900 });
  assert.equal(heavy.verdict, "FAIL");
  assert.equal(heavy.findings[0].rule, "route-bytes");
  assert.match(heavy.findings[0].why, /900 kB/);
  assert.match(heavy.findings[0].why, /heaviest single resource is \/x/, "a payload warning must name the heaviest resource, not the one you think is heavy");
  assert.equal(ship.evaluate({ ...base, beforePaintKB: 900 }).findings[0].rule, "shell-bytes");
  assert.equal(ship.evaluate({ ...base, fonts: { kb: 900, families: ["A"], unwanted: [] } }).findings[0].rule, "font-bytes");
  assert.equal(ship.evaluate({ ...base, oversampled: [{ url: "/b.png", naturalWidth: 900, renderedWidth: 100, factor: 9 }] }).findings[0].rule, "oversampled-image");
  assert.equal(ship.evaluate({ ...base, fonts: { kb: 50, families: ["A"], unwanted: [{ family: "A", script: "chinese", kb: 12 }] } }).findings[0].rule, "font-for-unseen-script");
});

// ── the Chinese face is subset to the characters the pages set ──────────────
// This is the fix the audit exists to protect. Measured 23 Oct 2026: the
// reading room's first load was 600 kB, and 518 kB of it was webfont, because
// Noto Sans SC is cut into 202 unicode-range chunks and eight visible Chinese
// characters fall in three of them.

const manifest = JSON.parse(await read("data/font-subsets.json"));
const [indexHtml, readingHtml] = await Promise.all([read("index.html"), read("reading.html")]);
const HAN = /[㐀-䶿一-鿿豈-﫿]/g;

test("every Chinese character on both pages is covered by a subset", () => {
  for (const [file, html] of [["index.html", indexHtml], ["reading.html", readingHtml]]) {
    const inPage = new Set(html.match(HAN) || []);
    const page = manifest.pages[file];
    const covered = new Set([...(page.eager.text || ""), ...(page.deferred.text || "")]);
    for (const ch of inPage) {
      assert.ok(covered.has(ch), `${file} sets ${ch} but no subset covers it. Run npm run build.`);
    }
    assert.equal(covered.size, inPage.size, `${file} covers characters the page does not set`);
  }
});

test("the eager and deferred sets do not overlap", () => {
  // A character that is visible in one place and collapsed in another belongs
  // to the eager set only. When both sets claimed it, the browser matched the
  // visible text against the larger face and downloaded the 74 kB file.
  for (const [file, page] of Object.entries(manifest.pages)) {
    const eager = new Set(page.eager.text || "");
    for (const ch of page.deferred.text || "") {
      assert.ok(!eager.has(ch), `${file} claims ${ch} in both the eager and the deferred set`);
    }
  }
});

test("the deferred set holds only text that is not rendered on arrival", () => {
  const page = manifest.pages["reading.html"];
  assert.ok(page.eager.characters > 0, "the reading room shows Chinese on arrival");
  assert.ok(page.deferred.characters > 0, "the reading room hides Chinese behind collapsed disclosures");
  const index = manifest.pages["index.html"];
  assert.equal(index.eager.characters, 0, "the plate view shows no Chinese on arrival");
  assert.ok(index.deferred.characters > 0, "the plate view keeps Chinese behind its dialogs");
});

test("the pages load the subset, not the whole Chinese family", async () => {
  for (const [name, html] of [["index.html", indexHtml], ["reading.html", readingHtml]]) {
    const link = (html.match(/fonts\.googleapis\.com\/css2[^"]*"/) || [""])[0];
    assert.ok(!link.includes("Noto"), `${name} still asks Google for the whole Noto Sans SC family. The stylesheet alone is 61 kB.`);
    assert.match(html, /assets\/fonts-(index|reading)\.css/, `${name} does not link the generated subset`);
  }
  // The generated stylesheets exist and are the generated ones.
  for (const file of ["assets/fonts-index.css", "assets/fonts-reading.css"]) {
    const css = await read(file);
    assert.match(css, /Generated by scripts\/font-subsets\.mjs/, `${file} is not the generated file`);
    assert.match(css, /@import url\("https:\/\/fonts\.googleapis\.com\/css2[^"]*text=/, `${file} does not ask for a subset`);
  }
});

test("a closed disclosure must not resolve a webfont", async () => {
  // Chrome resolves a face for text inside a content-visibility:hidden
  // subtree, which made the reading room's first load bimodal: 114 kB or
  // 181 kB, run by run. Hiding the body with display:none is not resolved.
  // The rendered page is byte-identical either way — this is a cost rule, not
  // a look rule — so it must not be removed quietly.
  const css = await read("reading.css");
  assert.match(
    css,
    /details:not\(\[open\]\)\s*>\s*\*:not\(summary\)\s*\{\s*display:\s*none/,
    "reading.css must hide a closed disclosure's body with display:none, or the deferred webfont comes back"
  );
});

// ── the browser measurement ─────────────────────────────────────────────────
// The browser is optional — see tests/spatial-audit.test.mjs for why.
// `skip: null` SKIPS a node:test test; only false/undefined mean "do not skip".
let browser = null;
let browserSkip = "playwright not installed";
try {
  const { chromium } = await import("playwright");
  browser = await chromium.launch();
  browserSkip = false;
} catch (e) {
  browserSkip = `no usable browser: ${e.message.split("\n")[0]}`;
}
test.after(async () => {
  if (browser) await browser.close();
  server.close();
});

const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".md": "text/markdown" };
const server = createServer(async (req, res) => {
  const p = decodeURIComponent(req.url.split("?")[0]);
  const rel = normalize(p === "/" ? "/index.html" : p).replace(/^(\.\.[/\\])+/, "");
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

test("the reading room no longer pays 518 kB of webfont on arrival", { skip: browserSkip }, async () => {
  const report = await ship.measureRoute(browser, `${base}/reading.html`);
  const verdict = ship.evaluate(report);
  assert.equal(verdict.verdict, "OK", `the reading room fails the shipability budget: ${verdict.findings.map(f => f.why).join(" ")}`);
  assert.ok(report.fonts.kb < 120, `the reading room downloaded ${report.fonts.kb} kB of webfont`);
});

test("the plate view downloads no Chinese face until a dialog asks for one", { skip: browserSkip }, async () => {
  const report = await ship.measureRoute(browser, `${base}/index.html`);
  const verdict = ship.evaluate(report);
  assert.equal(verdict.verdict, "OK", `the plate view fails the shipability budget: ${verdict.findings.map(f => f.why).join(" ")}`);
  const chinese = report.fonts.scripts?.chinese || 0;
  assert.equal(chinese, 0, `the plate view downloaded ${(chinese / 1024).toFixed(1)} kB of Chinese face for text it never shows`);
});
