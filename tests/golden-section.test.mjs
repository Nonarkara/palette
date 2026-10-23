import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);
const golden = await import(new URL("../tools/golden-section.mjs", import.meta.url));
const { golden: goldenApi } = require(join(root, "palette-tools.js"));

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");

// ── the construction ─────────────────────────────────────────────────────────
// These decide whether the diagram is allowed on the screen. They must be
// right without a browser, because a gate nobody can run is not a gate.

test("the rectangle that is drawn is a golden rectangle", () => {
  const report = golden.constructionReport(goldenApi, 1440, 900);
  assert.ok(report.ratioError < 1e-9, `ratio error ${report.ratioError}`);
  assert.ok(report.phiExactness < 1e-12, `φ² − φ − 1 is ${report.phiExactness}`);
  assert.equal(golden.evaluateConstruction(report).verdict, "OK");
});

test("the squares tile the rectangle and the arcs meet", () => {
  const report = golden.constructionReport(goldenApi, 1440, 900);
  // The peel stops when the remainder is under half a pixel, so a sliver at
  // the centre of the spiral is uncovered. That is the construction.
  assert.ok(report.areaShare > 0.9999, `the squares cover ${report.areaShare}`);
  assert.ok(report.chainError < 1e-9, `consecutive arcs miss by ${report.chainError}`);
  assert.ok(report.cornerError < 1e-9, `an endpoint is ${report.cornerError} off its circle`);
  assert.ok(report.radiusError < 1e-9, `a radius differs by ${report.radiusError}`);
  assert.ok(report.outsideError <= 1e-9, `a square leaves the rectangle by ${report.outsideError}`);
});

test("the construction holds at the sizes the screen actually uses", () => {
  for (const [width, height] of [[1384, 900], [783, 484], [358, 221], [1024, 768]]) {
    const report = golden.constructionReport(goldenApi, width, height);
    assert.equal(golden.evaluateConstruction(report).verdict, "OK", `at ${width}×${height}`);
  }
});

test("a broken construction is caught, not passed", () => {
  // The gate has to be able to fail. A rule that cannot fail is a claim.
  const report = golden.constructionReport(goldenApi, 1440, 900);
  const broken = { ...report, chainError: 1e-3 };
  const verdict = golden.evaluateConstruction(broken);
  assert.equal(verdict.verdict, "FAIL");
  assert.ok(verdict.findings.some((f) => f.rule === "arc-chain"));
});

test("the stylesheet's use of the proportion is counted, not assumed", async () => {
  const css = await read("styles.css");
  const rules = golden.proportionRules(css);
  assert.ok(rules.length >= 6, `found ${rules.length} rule(s)`);
  assert.equal(golden.distinctRules(rules), 6, `distinct rules: ${rules.map((r) => r.selector).join(", ")}`);
  // Every one of them really names both halves of the proportion.
  for (const rule of rules) {
    assert.match(rule.value, /1\.618fr/);
    assert.match(rule.value, /(^|\s|\))1fr(\s|\)|$)/);
  }
});

test("a rule that does not use the proportion is not counted", () => {
  const css = ".a { grid-template-columns: 1.618fr 1fr; } .b { grid-template-columns: 1fr 1fr; } .c { grid-template-columns: 3fr 2fr; }";
  const rules = golden.proportionRules(css);
  assert.equal(rules.length, 1);
  assert.equal(rules[0].selector, ".a");
});

test("a rule inside a media query is counted too", () => {
  // A scanner that walks braces rather than matching them finds the nested
  // rule. One that assumed a flat stylesheet found three where there are six.
  const css = "@media (max-width: 760px) { .a { grid-template-columns: 1.618fr 1fr; } }";
  const rules = golden.proportionRules(css);
  assert.equal(rules.length, 1);
  assert.equal(rules[0].selector, ".a");
});

test("the relationships are counted from the data, not from a comment", async () => {
  const colors = JSON.parse(await read("data/colors.json"));
  const counted = golden.countRelationships(colors);
  assert.equal(counted.total, 348);
  assert.equal(counted.twoColour, 120);
  assert.equal(counted.byCount[2] + counted.byCount[3] + counted.byCount[4], counted.total);
});

// ── the playground's own data ────────────────────────────────────────────────

test("the playground carries the reasons, not just the names", async () => {
  const data = JSON.parse(await read("data/playground.json"));
  assert.equal(data.fonts.length, 8);
  assert.equal(data.styles.length, 6);
  for (const font of data.fonts) {
    assert.ok(font.name && font.stack && font.role && font.verdict && font.why, `font ${font.id}`);
    // A face that arrived by default says so, so the difference is visible
    // rather than argued.
    if (font.verdict === "default") assert.match(font.role, /default/i);
  }
  for (const style of data.styles) {
    assert.ok(style.name && style.mood && style.changes, `style ${style.id}`);
    assert.ok(style.tokens["--pg-scale"], `style ${style.id} has no scale`);
  }
});

test("every style token is one the bench actually draws", async () => {
  const data = JSON.parse(await read("data/playground.json"));
  const known = new Set(["--pg-align", "--pg-scale", "--pg-tracking", "--pg-rule-above", "--pg-rule-below", "--pg-measure", "--pg-case"]);
  for (const style of data.styles) {
    for (const token of Object.keys(style.tokens)) {
      assert.ok(known.has(token), `${style.id} sets ${token}, which nothing reads`);
    }
  }
});

test("the stylesheet reads every token the data sets", async () => {
  const data = JSON.parse(await read("data/playground.json"));
  const css = await read("styles.css");
  for (const style of data.styles) {
    for (const token of Object.keys(style.tokens)) {
      assert.ok(css.includes(token), `${token} is set by ${style.id} but no rule reads it`);
    }
  }
});

// ── the screen's own claims ──────────────────────────────────────────────────

test("the numbers the Research screen prints are the measured ones", async () => {
  const html = await read("index.html");
  const colors = JSON.parse(await read("data/colors.json"));
  const counted = golden.countRelationships(colors);
  const css = await read("styles.css");
  const rules = golden.distinctRules(golden.proportionRules(css));

  const twoColour = html.match(/id="golden-two-colour"[^>]*data-count="(\d+)"/);
  const total = html.match(/id="golden-two-colour"[^>]*data-of="(\d+)"/);
  const ruleCount = html.match(/id="golden-rule-count"[^>]*data-count="(\d+)"/);
  assert.ok(twoColour && total && ruleCount, "the golden facts carry no measured counts");
  assert.equal(Number(twoColour[1]), counted.twoColour);
  assert.equal(Number(total[1]), counted.total);
  assert.equal(Number(ruleCount[1]), rules);
});

// ── the browser measurement ──────────────────────────────────────────────────
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

test("the diagram's 0.618 cut is the colour field's own boundary", { skip: browserSkip }, async () => {
  const measurement = await golden.measureAlignment(browser, `http://127.0.0.1:${server.address().port}/index.html`);
  const verdict = golden.evaluateAlignment(measurement);
  const reasons = verdict.findings.map((f) => `${f.rule}: ${f.why}`).join("; ");
  assert.equal(verdict.verdict, "OK", reasons);
  // The measured numbers themselves, so a failure says which side moved.
  assert.equal(measurement.plate.fieldCount, 2);
  assert.ok(Math.abs(measurement.plate.verticalCuts[1] - measurement.plate.fieldBoundary) <= 1,
    `cut ${measurement.plate.verticalCuts[1]} vs boundary ${measurement.plate.fieldBoundary}`);
  assert.ok(Math.abs(measurement.demo.verticalCuts[1] - measurement.demo.fieldBoundary) <= 1,
    `demo cut ${measurement.demo.verticalCuts[1]} vs boundary ${measurement.demo.fieldBoundary}`);
});

test("the diagram is drawn over the fields, not over the rail", { skip: browserSkip }, async () => {
  const measurement = await golden.measureAlignment(browser, `http://127.0.0.1:${server.address().port}/index.html`);
  // The overlay's box and the field's box have to be the same box. When the
  // overlay was 56px wider — the width of the rail — its 0.618 cut missed the
  // boundary by exactly that much.
  assert.equal(measurement.plate.overlayWidth, measurement.plate.stageWidth);
  assert.equal(measurement.plate.frameWidth, measurement.plate.stageWidth);
});

test("the Research head's two columns divide at the proportion", { skip: browserSkip }, async () => {
  const measurement = await golden.measureAlignment(browser, `http://127.0.0.1:${server.address().port}/index.html`);
  assert.ok(measurement.head, "the research head was not found");
  assert.ok(Math.abs(measurement.head.ratio - golden.PHI) <= 0.01,
    `the columns divide at ${measurement.head.ratio}, not φ`);
});

test("the bench never clips the sample it is showing", { skip: browserSkip }, async () => {
  const measurement = await golden.measureAlignment(browser, `http://127.0.0.1:${server.address().port}/index.html`);
  assert.equal(measurement.bench.note, null);
  assert.equal(measurement.bench.cases.length, 14, "six styles and eight faces");
  for (const testCase of measurement.bench.cases) {
    assert.ok(testCase.overflow <= 1, `the ${testCase.kind} "${testCase.name}" overflows by ${testCase.overflow}px`);
    assert.ok(testCase.headlinePx >= 20, `the ${testCase.kind} "${testCase.name}" sets ${testCase.headlinePx}px`);
  }
});

test("the golden toggle draws the diagram and reports its state", { skip: browserSkip }, async () => {
  const port = server.address().port;
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(`http://127.0.0.1:${port}/index.html#plate-001`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const toggle = page.locator("#golden-toggle");
    // The button lives in the research room, so the room has to be open.
    assert.equal(await toggle.getAttribute("aria-pressed"), "false");
    assert.equal(await page.locator("#golden-overlay-stage").isVisible(), false);

    await page.keyboard.press("a");
    await page.waitForSelector("#about-dialog[open]");
    await page.waitForTimeout(600);

    await toggle.click();
    await page.waitForTimeout(400);
    assert.equal(await toggle.getAttribute("aria-pressed"), "true");
    assert.equal(await page.locator("#golden-overlay-stage").isVisible(), true);
    assert.match(await page.locator("#golden-status").textContent(), /drawn/i);

    await toggle.click();
    await page.waitForTimeout(400);
    assert.equal(await toggle.getAttribute("aria-pressed"), "false");
    assert.equal(await page.locator("#golden-overlay-stage").isVisible(), false);
  } finally {
    await page.close();
  }
});

test("the same state is shared by the key and the button", { skip: browserSkip }, async () => {
  const port = server.address().port;
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(`http://127.0.0.1:${port}/index.html#plate-001`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.keyboard.press("p");
    await page.waitForTimeout(400);
    assert.equal(await page.locator("#golden-overlay-stage").isVisible(), true);
    await page.keyboard.press("a");
    await page.waitForSelector("#about-dialog[open]");
    await page.waitForTimeout(300);
    // The button on the research screen shows the same state the key set.
    assert.equal(await page.locator("#golden-toggle").getAttribute("aria-pressed"), "true");
  } finally {
    await page.close();
  }
});

test("the Research screen opens on its keyboard shortcut and every part is reachable", { skip: browserSkip }, async () => {
  const port = server.address().port;
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(`http://127.0.0.1:${port}/index.html#plate-001`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.keyboard.press("a");
    await page.waitForSelector("#about-dialog[open]");
    await page.waitForTimeout(600);

    // The jump nav names five parts of the room, and each one exists.
    const targets = await page.$$eval(".research-jump a", (links) => links.map((a) => a.getAttribute("href")));
    assert.equal(targets.length, 5);
    for (const href of targets) {
      assert.ok(await page.$(href), `${href} points at nothing`);
    }

    // The spine is the history, and it is dated.
    const entries = await page.$$eval(".spine-list > li", (items) => items.length);
    assert.equal(entries, 11);

    // The playground offers eight faces and six styles as radio groups, so the
    // arrow keys work and only one is ever checked.
    assert.equal(await page.locator("#pg-fonts button").count(), 8);
    assert.equal(await page.locator("#pg-styles button").count(), 6);
    assert.equal(await page.locator('#pg-fonts [role="radio"][aria-checked="true"]').count(), 1);
    assert.equal(await page.locator('#pg-styles [role="radio"][aria-checked="true"]').count(), 1);
  } finally {
    await page.close();
  }
});

test("the radio groups are operable with the arrow keys", { skip: browserSkip }, async () => {
  const port = server.address().port;
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(`http://127.0.0.1:${port}/index.html#plate-001`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.keyboard.press("a");
    await page.waitForSelector("#about-dialog[open]");
    await page.waitForTimeout(600);
    await page.locator("#pg-styles button").first().focus();
    const before = await page.locator('#pg-styles [role="radio"][aria-checked="true"]').textContent();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(200);
    const after = await page.locator('#pg-styles [role="radio"][aria-checked="true"]').textContent();
    assert.notEqual(before, after);
  } finally {
    await page.close();
  }
});

test("the research screen raises no console errors", { skip: browserSkip }, async () => {
  const port = server.address().port;
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  try {
    await page.goto(`http://127.0.0.1:${port}/index.html#plate-001`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.keyboard.press("a");
    await page.waitForSelector("#about-dialog[open]");
    await page.waitForTimeout(800);
    await page.locator("#pg-styles button").nth(1).click();
    await page.waitForTimeout(300);
    await page.locator("#pg-fonts button").nth(3).click();
    await page.waitForTimeout(600);
    await page.locator("#golden-toggle").click();
    await page.waitForTimeout(400);
    assert.deepEqual(errors, []);
  } finally {
    await page.close();
  }
});
