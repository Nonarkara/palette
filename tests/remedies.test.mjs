import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (p) => readFile(new URL(`../${p}`, import.meta.url), "utf8");

const remedies = await read("REMEDIES.md");
const antiSlop = await read("ANTI-SLOP.md");
const style = await read("STYLE.md");

// ── The remedy layer must exist and be wired in ────────────────────────────────
test("the repo has the third half: a doctrine, a choice, and a destination", async () => {
  for (const file of ["ANTI-SLOP.md", "ANTI-SPATIAL-HALLUCINATION.md", "STYLE.md", "REMEDIES.md"]) {
    assert.ok((await read(file)).length > 500, `${file} must exist and carry content`);
  }
  // A remedy index nobody is pointed at is a remedy index that does not exist.
  for (const [name, source] of [
    ["AGENTS.md", await read("AGENTS.md")],
    ["README.md", await read("README.md")],
    ["CLAUDE.md", await read("CLAUDE.md")]
  ]) {
    assert.ok(source.includes("REMEDIES.md"), `${name} must point an agent at REMEDIES.md`);
  }
});

// ── Every one of the 13 limits must have a destination ─────────────────────────
test("all thirteen hard limits are cross-referenced to a remedy", () => {
  const section = remedies.split("## Cross-reference: the 13 limits")[1];
  assert.ok(section, "REMEDIES.md must carry the limit cross-reference");
  for (let n = 1; n <= 13; n++) {
    assert.ok(new RegExp(`^\\|\\s*${n}\\s*\\|`, "m").test(section), `limit ${n} must have a row in the cross-reference`);
  }
  // The doctrine's own table must still have thirteen rows, or the index is wrong.
  const rows = [...antiSlop.matchAll(/^\|\s*(\d+)\s*\|/gm)].map((m) => Number(m[1]));
  assert.ok(rows.includes(1) && rows.includes(13), "ANTI-SLOP.md must still number its limits 1–13");
});

test("the six spatial-hallucination modes are all cross-referenced", () => {
  const section = remedies.split("## Cross-reference: the six spatial-hallucination modes")[1];
  assert.ok(section, "REMEDIES.md must cross-reference the spatial modes");
  for (const mode of ["Unjustified gaps", "Orphan elements", "Scattered actions", "False hierarchy", "Accidental wrapping", "Spatially expensive information"]) {
    assert.ok(section.includes(mode), `${mode} must have a remedy`);
  }
});

// ── The catalogue must be honest about what it is ──────────────────────────────
test("the carousel is credited, dated, and not treated as a style authority", () => {
  assert.match(remedies, /Aashish Pahwa/, "the source must be credited by name");
  assert.match(remedies, /@okaashish/, "the source must be credited by handle");
  assert.match(remedies, /21 Oct 2026/, "the source must be dated");
  assert.match(remedies, /mockups are textbook slop/i, "the file must say plainly that the source's own mockups are slop");
  assert.match(remedies, /map of destinations.*never as an authority|map of destinations/, "the file must say how the source is used");
});

test("the carousel's images are not reproduced here", () => {
  assert.ok(!/fbcdn\.net/i.test(remedies), "no third-party image URLs");
  assert.ok(!/!\[[^\]]*\]\(/.test(remedies), "no Markdown images embedded");
  assert.ok(!/<[a-z]+[\s>]/i.test(remedies), "no raw HTML tags in the Markdown file");
  assert.ok(!/instagram\.com\/(p|reel)\//i.test(remedies), "no links to the source's post images");
});

test("a dead link is corrected and the correction is recorded", () => {
  for (const [dead, live] of [["animista.io", "animista.net"], ["placeit.me", "placeit.net"], ["siteofsites.com", "siteofsites.co"]]) {
    assert.ok(remedies.includes(live), `${live} must be the address that works`);
    assert.ok(remedies.includes(dead), `${dead} must be named in the corrections table`);
  }
  assert.match(remedies, /parked domain/, "the parked domain must be named as such");
});

// ── The links must be well-formed and unique ──────────────────────────────────
test("every address in the catalogue is a well-formed https link, and no table lists one twice", () => {
  const links = [...remedies.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1]);
  assert.ok(links.length >= 45, `the catalogue should carry the destinations, found ${links.length}`);
  for (const l of links) {
    assert.ok(/^https:\/\//.test(l), `link must be https: ${l}`);
    assert.ok(/^https:\/\/[\w.-]+(\.[a-z]{2,})+(?:\/|$)/i.test(l), `link must have a real host: ${l}`);
    assert.ok(!/\s/.test(l), `link must not contain a space: ${l}`);
  }
  // The same tool may answer two failures in two sections — that is why it is
  // listed twice. The same tool twice in ONE table is a mistake.
  for (const table of remedies.split(/\n\n/)) {
    const inTable = [...table.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1]);
    const seen = new Set();
    for (const l of inTable) {
      assert.ok(!seen.has(l), `the same address appears twice in one table: ${l}`);
      seen.add(l);
    }
  }
});

// ── The verdicts must respect this repo's house rules ──────────────────────────
test("every entry carries a verdict, and the banned ones name the law", () => {
  const rows = [...remedies.matchAll(/^\|\s*\[([^\]]+)\]\([^)]+\)\s*\|([^|]*)\|\s*([^|]*)\|/gm)];
  assert.ok(rows.length >= 45, `every catalogue entry needs a row, found ${rows.length}`);
  let banned = 0;
  for (const [, name, , verdict] of rows) {
    const v = verdict.replace(/\*/g, "").trim();
    assert.ok(/^(Reference|Banned here|Usable)/.test(v), `"${name}" needs a verdict of Reference, Banned here or Usable — got "${verdict.trim()}"`);
    if (v.startsWith("Banned here")) { banned++; assert.ok(/—/.test(v), `"${name}" is banned, so the row must say why`); }
  }
  assert.ok(banned >= 6, `the house rules ban several destinations (gradients, textures, AI images, effect kits); found ${banned} marked`);
});

// ── The new rules and the new instrument must exist and be documented ──────────
test("the phone rules exist, are weighted, and are documented", async () => {
  const { RULES } = await import(new URL("../tools/slop-lint.mjs", import.meta.url));
  for (const id of ["phone-squeezed", "desktop-columns-on-phone"]) {
    const rule = RULES.find((r) => r.id === id);
    assert.ok(rule, `slop-lint must carry the ${id} rule`);
    assert.ok(rule.w > 0, `${id} must carry weight, or it changes nothing`);
    assert.ok(rule.desc.length > 30, `${id} must say what it measures`);
  }
  assert.match(style, /phone-squeezed/, "STYLE.md must record the phone measurements");
  assert.match(style, /390/, "STYLE.md must record the width the phone rules were measured at");
});

test("the audit script exists, and reads STYLE.md back as an allowlist", async () => {
  const audit = await read("scripts/audit.mjs");
  assert.match(audit, /Known results of the rendered check/, "the audit must read the rendered-check allowlist");
  assert.match(audit, /Known results of the spatial audit/, "the audit must read the spatial allowlist");
  assert.match(audit, /NOT RUN/, "the audit must be able to report that an instrument did not run");
  const pkg = JSON.parse(await read("package.json"));
  assert.ok(pkg.scripts.audit, "npm run audit must exist");
});

test("STYLE.md records the spatial mode ids, not the example kinds", () => {
  // A kind is not a mode. The audit allowlist matches ids, so recording kinds
  // there means the allowlist matches nothing.
  const section = style.split("## Known results of the spatial audit")[1] || "";
  assert.match(section, /falseHierarchy/, "STYLE.md must record the spatial mode id");
  assert.match(section, /spatiallyExpensive/, "STYLE.md must record the spatial mode id");
});

console.log("OK: the remedy layer is complete, honest, credited, and wired into the agents");
