// The eight giveaways are hard bans. A STYLE.md line keeps one on purpose.
// These strings are the tells the scanner hunts; the file is not a page.
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (p) => readFile(new URL(`../${p}`, import.meta.url), "utf8");
const { fileCtx, runRules, scanTarget } = await import(new URL("../.non-slop/lib/scan.mjs", import.meta.url));
const { parseStyle } = await import(new URL("../.non-slop/lib/style.mjs", import.meta.url));
const { RULES } = await import(new URL("../.non-slop/lib/rules.mjs", import.meta.url));
const lint = await import(new URL("../tools/slop-lint.mjs", import.meta.url));
const { RENDER_RULES } = await import(new URL("../.non-slop/lib/render.mjs", import.meta.url));

const NEW = ["eyebrow", "side-stripe", "italic-word", "tracked-caps", "stat-card-row", "title-blurb", "status-dot"];
const asFile = (name, text) => fileCtx(`/tmp/${name}`, "/tmp", text);
const fails = (findings, id) => findings.filter((f) => f.id === id && f.status === "FAIL");
const empty = parseStyle("");

test("the doctrine names the eight bans and credits the graphic", async () => {
  const law = await read("ANTI-SLOP.md");
  assert.match(law, /## Eight giveaways, banned as a default/);
  for (const name of ["Mitchell Romney", "Johannes Nagl", "Phil Whitehouse", "Austin Ballard", "sadeeqah S.", "Bryce Galbraith"]) {
    assert.ok(law.includes(name), `ANTI-SLOP.md must credit ${name}`);
  }
  for (const id of [...NEW, "default-font"]) assert.ok(law.includes(`\`${id}\``), `the doctrine must name ${id}`);
  assert.match(law, /STYLE\.md/);
  assert.match(law, /negative tracking/i);
});

test("agent instructions point at the bans and do not restate them", async () => {
  for (const file of ["AGENTS.md", "CLAUDE.md", ".cursor/rules/anti-slop.mdc", ".cursor/rules/non-slop.mdc", ".non-slop/AGENTS.md", "skills/anti-slop-design/SKILL.md"]) {
    const source = await read(file);
    assert.match(source, /Eight giveaways are banned as a default/, `${file} must point at the bans`);
    assert.match(source, /ANTI-SLOP\.md/, `${file} must link the law`);
    assert.ok(!source.includes("All Systems Operational"), `${file} must not copy the ban list`);
  }
});

test("the new rules exist, and the old thresholds are still in force", () => {
  for (const id of NEW) {
    const rule = RULES.find((r) => r.id === id);
    assert.ok(rule, `static scan must carry ${id}`);
    assert.ok(rule.keep && /STYLE\.md/.test(rule.keep), `${id} must be keepable from STYLE.md`);
  }
  assert.ok(RULES.find((r) => r.id === "eyebrow-caps"), "eyebrow-caps must stay");
  assert.ok(RULES.find((r) => r.id === "accent-border-card"), "accent-border-card must stay");
  assert.ok(RULES.find((r) => r.id === "default-font"), "default-font must stay");
  assert.equal(RULES.find((r) => r.id === "default-font").sev, "P1");
  for (const id of NEW) {
    for (const table of [lint.RULES, RENDER_RULES]) {
      const rule = table.find((r) => r.id === id);
      assert.ok(rule, `rendered rules must carry ${id}`);
      assert.equal(rule.w, 1, `${id} is a component tell, weight 1`);
    }
  }
  assert.equal(lint.RULES.find((r) => r.id === "default-font").w, 0, "the rendered font check stays reported-only");
});

test("a template page fails the eight bans, and Inter still fails default-font", async () => {
  const html = await read("tests/fixtures/giveaway-bans.html");
  const findings = runRules([asFile("giveaway-bans.html", html)], empty);
  for (const id of [...NEW, "default-font", "accent-border-card"]) {
    assert.ok(fails(findings, id).length >= 1, `${id} must fail on the template, got: ${findings.filter((f) => f.status === "FAIL").map((f) => f.id).join(", ")}`);
  }
  const onDisk = await scanTarget(new URL("../tests/fixtures/giveaway-bans.html", import.meta.url).pathname);
  for (const id of NEW) {
    assert.ok(onDisk.findings.some((f) => f.id === id && f.status === "FAIL"), `scan of the fixture must fail ${id}`);
  }
});

test("STYLE.md turns a ban into ALLOWED and does not delete the finding", async () => {
  const html = await read("tests/fixtures/giveaway-bans.html");
  const style = parseStyle(["## Allow", ...[...NEW, "default-font"].map((id) => `- rule ${id}: a choice someone wrote down`)].join("\n"));
  const findings = runRules([asFile("giveaway-bans.html", html)], style);
  for (const id of [...NEW, "default-font"]) {
    const hit = findings.find((f) => f.id === id);
    assert.ok(hit, `${id} must still be reported`);
    assert.equal(hit.status, "ALLOWED", `${id} must be kept when STYLE.md names it`);
  }
});

test("sentence case, a ruled strip, negative tracking and a timed status do not fire", async () => {
  const html = await read("tests/fixtures/giveaway-clean.html");
  const findings = runRules([asFile("giveaway-clean.html", html)], empty);
  for (const id of NEW) {
    assert.equal(fails(findings, id).length, 0, `${id} must not fire on the clean page: ${findings.filter((f) => f.id === id).map((f) => f.detail).join("; ")}`);
  }
  assert.equal(fails(findings, "default-font").length, 0, "Archivo Narrow is not Inter");
});

test("existing thresholds were not loosened", () => {
  const two = asFile("two.html", `<p class="uppercase tracking-widest">One</p><p class="uppercase tracking-widest">Two</p>`);
  const three = asFile("three.html", `<p class="uppercase tracking-widest">One</p><p class="uppercase tracking-widest">Two</p><p class="uppercase tracking-widest">Three</p>`);
  assert.equal(fails(runRules([two], empty), "eyebrow-caps").length, 0, "two tracked labels are not yet eyebrow-caps");
  assert.ok(fails(runRules([three], empty), "eyebrow-caps").length >= 1, "three tracked labels must still fail eyebrow-caps");
  const oneStripe = asFile("one.css", `.card { border-left: 4px solid #111; }`);
  const twoStripes = asFile("two.css", `.card { border-left: 4px solid #111; }\n.callout { border-left: 4px solid #222; }`);
  assert.equal(fails(runRules([oneStripe], empty), "accent-border-card").length, 0, "one stripe is not yet accent-border-card");
  assert.ok(fails(runRules([oneStripe], empty), "side-stripe").length >= 1, "one stripe is the side-stripe ban");
  assert.ok(fails(runRules([twoStripes], empty), "accent-border-card").length >= 1, "two stripes must still fail accent-border-card");
});

test("the bans do not swallow a voice: negative tracking, a whole italic title, a language span, prose", () => {
  const tight = asFile("tight.css", `.plate-label h1 { letter-spacing: -0.045em; text-transform: uppercase; }\nh3 { text-transform: uppercase; }`);
  assert.equal(fails(runRules([tight], empty), "tracked-caps").length, 0, "negative tracking and bare caps are not tracked-caps");
  const voice = asFile("voice.html", [
    "<h1><em>The whole title</em></h1>",
    "<p>Build <em>faster</em> in a paragraph.</p>",
    "<h2>Wallpaper / <span lang=\"th\">วอลเปเปอร์</span></h2>",
    "<h2>Ship <span class=\"bg-clip-text text-transparent bg-gradient-to-r from-indigo-500\">now</span> today</h2>",
    "<h3>Room</h3><p>A long paragraph that is the section itself, not a grey one-line subtitle under a settings group, and long enough to stay a paragraph.</p>",
    "<h3>Field</h3><p>Another long paragraph with the same job, written out so it cannot be mistaken for a muted dek.</p>",
    "<h3>Rail</h3><p>A third long paragraph. Three headings, three real paragraphs, no muted class.</p>",
    "<div class=\"skeleton animate-pulse\" style=\"width:240px;height:80px\"></div>",
  ].join("\n"));
  const findings = runRules([voice], empty);
  assert.equal(fails(findings, "italic-word").length, 1, "only the gradient word inside a headline fires");
  assert.equal(fails(findings, "italic-word")[0].detail, "now");
  assert.equal(fails(findings, "title-blurb").length, 0);
  assert.equal(fails(findings, "status-dot").length, 0, "a large pulsing block is not a status dot");
  const phrase = asFile("badge.html", "<p><span class=\"dot animate-pulse rounded-full w-2 h-2\"></span> AI Engine Active</p>");
  assert.ok(fails(runRules([phrase], empty), "status-dot").length >= 1);
});

test("this repo's own pages do not trip the new bans", async () => {
  for (const file of ["styles.css", "reading.css", "index.html", "reading.html"]) {
    const res = await scanTarget(new URL(`../${file}`, import.meta.url).pathname);
    const hit = res.findings.filter((f) => NEW.includes(f.id) && f.status === "FAIL");
    assert.deepEqual(hit.map((f) => `${f.id} ${f.rel}:${f.line} ${f.detail}`), [], `${file} must not fail a new ban`);
  }
});

test("rendered weights answer the metrics, including a zero", () => {
  const slop = { giveawayKickers: 1, giveawayItalic: 1, giveawayTracked: 1, giveawayStripes: 2, giveawayStatRows: 1, giveawayBlurbs: 3, giveawayDots: 1, mapShareFirstScreen: 1, dataShareFirstScreen: 1, heroShare: 0, boxesMeasured: 0 };
  const clean = { giveawayKickers: 0, giveawayItalic: 0, giveawayTracked: 0, giveawayStripes: 0, giveawayStatRows: 0, giveawayBlurbs: 2, giveawayDots: 0, mapShareFirstScreen: 1, dataShareFirstScreen: 1, heroShare: 0, boxesMeasured: 0 };
  for (const id of NEW) assert.ok(lint.score(slop).hits.includes(id), `score must include ${id}`);
  for (const id of NEW) assert.ok(!lint.score(clean).hits.includes(id), `two blurbs must not score ${id}`);
  assert.equal(lint.score({ giveawayBlurbs: 2, mapShareFirstScreen: 1, dataShareFirstScreen: 1 }).hits.includes("title-blurb"), false);
});
