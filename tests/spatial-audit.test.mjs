import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { readFile as read } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const audit = await import(new URL("../tools/spatial-audit.mjs", import.meta.url));

// A static server for the repo, so the audit runs against real files.
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".md": "text/markdown" };
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split("?")[0]);
  const rel = normalize(path === "/" ? "/index.html" : path).replace(/^(\.\.[/\\])+/, "");
  try {
    const body = await read(join(root, rel));
    res.writeHead(200, { "content-type": MIME[extname(rel)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  chromium = null;
}

const browser = chromium ? await chromium.launch() : null;
test.after(async () => {
  if (browser) await browser.close();
  server.close();
});

test("the auditor names all six spatial-hallucination modes", () => {
  assert.equal(audit.MODES.length, 6);
  const ids = audit.MODES.map((m) => m.id);
  for (const id of ["unjustifiedGaps", "orphanElements", "scatteredActions", "falseHierarchy", "accidentalWrapping", "spatiallyExpensive"]) {
    assert.ok(ids.includes(id), `the auditor must measure the "${id}" mode`);
  }
  // Every mode carries the question a reviewer asks.
  for (const m of audit.MODES) {
    assert.ok(m.ask && m.ask.length > 20, `${m.id} must carry the question it asks`);
    assert.ok(m.mode && m.mode.length > 3, `${m.id} must name the mode in plain words`);
  }
});

test("the litmus test is stated in the doctrine and in the tool", async () => {
  const doctrine = await readFile(new URL("../ANTI-SPATIAL-HALLUCINATION.md", import.meta.url), "utf8");
  assert.match(doctrine, /why is this here, why this size, and why this far from that/i, "the doctrine must state the litmus test");
  const tool = await readFile(new URL("../tools/spatial-audit.mjs", import.meta.url), "utf8");
  assert.match(tool, /Why is this here, why this size, and why this far from that\?/, "the tool must carry the litmus test");
});

test("the auditor flags all six modes on a deliberately broken layout", { skip: !browser && "playwright not installed" }, async () => {
  const r = await audit.auditUrl(browser, `${base}/tests/fixtures/spatial-hallucination.html`, { settleMs: 300 });
  const flagged = r.summary.modes.filter((m) => m.count > 0).map((m) => m.id);
  for (const id of ["unjustifiedGaps", "orphanElements", "scatteredActions", "falseHierarchy", "accidentalWrapping", "spatiallyExpensive"]) {
    assert.ok(flagged.includes(id), `the broken fixture must trigger "${id}" — the auditor is not measuring it`);
  }
  assert.ok(r.summary.points >= 8, `the broken fixture should score at least 8, got ${r.summary.points}`);
});

test("the auditor stays quiet on the plate view", { skip: !browser && "playwright not installed" }, async () => {
  const r = await audit.auditUrl(browser, `${base}/index.html`, { settleMs: 2500 });
  // The plate view is a full-viewport colour field. The auditor must not read
  // that deliberate emptiness as a failure.
  assert.equal(r.summary.flagged, 0, `the plate view must not be flagged, got: ${JSON.stringify(r.summary.modes.filter((m) => m.count).map((m) => [m.id, m.count]))}`);
});

test("the auditor does not call a vertical instrument rail a split nav", { skip: !browser && "playwright not installed" }, async () => {
  const r = await audit.auditUrl(browser, `${base}/index.html`, { settleMs: 2500 });
  const scattered = r.geometry.scatteredActions;
  assert.equal(scattered.length, 0, "a column of controls is an arrangement, not a split nav");
  const wrapped = r.geometry.accidentalWrapping;
  assert.equal(wrapped.length, 0, "the instrument rail must not read as accidental wrapping");
});

test("a vertical control stack is never reported as split across rows", async () => {
  // The rule that keeps the plate view clean, checked without a browser.
  const src = await readFile(new URL("../tools/spatial-audit.mjs", import.meta.url), "utf8");
  assert.match(src, /isVertical/, "the auditor must know a column from a row");
  assert.match(src, /flexDirection === "column"/, "the auditor must exempt column layouts");
});

test("the reading room's findings are honest, and are recorded as such", { skip: !browser && "playwright not installed" }, async () => {
  const r = await audit.auditUrl(browser, `${base}/reading.html`, { settleMs: 2500 });
  // The reading room is a long essay. It has a jump nav, so the "no way to
  // jump" signal must not fire — length alone is not a failure.
  const expensive = r.geometry.spatiallyExpensive.map((e) => e.kind);
  assert.ok(!expensive.includes("no-way-to-jump"), "the reading room has a contents nav and must not be told it has no way to jump");
  // The findings that DO fire are real and must be recorded in STYLE.md.
  const style = await readFile(new URL("../STYLE.md", import.meta.url), "utf8");
  assert.match(style, /## Known results of the rendered check/, "STYLE.md must record the auditor's known results");
  assert.match(style, /spatial-audit/, "STYLE.md must name the spatial auditor");
});
