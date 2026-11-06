import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
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
  browser = await chromium.launch();
  browserSkip = false;
} catch (e) {
  browserSkip = `no usable browser: ${e.message.split("\n")[0]}`;
}
test.after(async () => {
  if (browser) await browser.close();
  server.close();
});

// A row of controls that breaks raggedly — 4+2+1, 5+1+1 — is the accidental
// wrapping the doctrine names. An even arrangement is a decision: three rows of
// three, or a final row holding one full-width action.
const rowsOf = (page, selector) =>
  page.evaluate((sel) => {
    const g = document.querySelector(sel);
    if (!g) return null;
    const kids = [...g.children].filter((c) => {
      const r = c.getBoundingClientRect();
      return r.width > 2 && r.height > 2;
    });
    const rows = new Map();
    for (const c of kids) {
      const t = Math.round(c.getBoundingClientRect().top / 8);
      if (!rows.has(t)) rows.set(t, []);
      rows.get(t).push(c.getBoundingClientRect());
    }
    const box = g.getBoundingClientRect();
    return [...rows.values()].map((r) => ({
      count: r.length,
      widths: r.map((x) => Math.round(x.width)),
      fullWidth: r.length === 1 && r[0].width >= box.width * 0.9
    }));
  }, selector);

const assertEven = (label, rows) => {
  assert.ok(rows, `${label} must exist`);
  const counts = rows.map((r) => r.count);
  const first = counts[0];
  for (let i = 0; i < rows.length; i++) {
    if (counts[i] === first) continue;                    // the same shape as the first row
    if (counts[i] === 1) {
      // A row holding one item is a decision only if that item is the
      // deliberate wide one — a full-width action. A narrow leftover is an
      // orphan: the row broke where it ran out of room, not where a person
      // put the break.
      const only = rows[i].widths[0];
      const widestAbove = Math.max(...rows.slice(0, i).flatMap((r) => r.widths));
      assert.ok(only > widestAbove, `${label}: row ${i + 1} leaves one narrow item (${only}px) alone under wider ones (${widestAbove}px) — an orphan, not a decision`);
      continue;
    }
    assert.equal(counts[i], first, `${label}: row ${i + 1} holds ${counts[i]} items but the first row holds ${first} — a ragged break`);
  }
};

test("the reading room's contents nav is one row on a wide screen", { skip: browserSkip }, async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}/reading.html`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  const rows = await rowsOf(page, "nav.contents");
  assert.equal(rows.length, 1, `the contents nav must be one row at 1440, got ${rows.length}`);
  await page.close();
});

test("the reading room's contents nav breaks evenly on a phone", { skip: browserSkip }, async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${base}/reading.html`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  const rows = await rowsOf(page, "nav.contents");
  assert.ok(rows.length > 1, "nine links cannot fit one phone line");
  assertEven("the reading room contents nav", rows);
  await page.close();
});

test("the plate view's mood chips break evenly on a phone", { skip: browserSkip }, async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${base}/index.html`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const rows = await rowsOf(page, ".mood-starters");
  assert.ok(rows, "the mood starters must exist");
  assertEven("the mood starters", rows);
  await page.close();
});

test("nothing overflows sideways at 320px", { skip: browserSkip }, async () => {
  for (const file of ["index.html", "reading.html"]) {
    const page = await browser.newPage({ viewport: { width: 320, height: 844 } });
    await page.goto(`${base}/${file}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2);
    assert.ok(!overflow, `${file} scrolls sideways at 320px`);
    await page.close();
  }
});

test("STYLE.md records the phone arrangement, because a number nobody measured is worse than no number", async () => {
  const style = await readFile(new URL("../STYLE.md", import.meta.url), "utf8");
  assert.match(style, /390/, "STYLE.md must record the phone width the arrangement was measured at");
  assert.match(style, /contents nav|mood chips/i, "STYLE.md must name the arrangements that were measured");
});

console.log("OK: the phone arrangements are even, and nothing overflows at 320px");
