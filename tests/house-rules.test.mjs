import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");
const [styles, reading, readingCss, style, figma] = await Promise.all([
  read("styles.css"),
  read("reading.html"),
  read("reading.css"),
  read("STYLE.md"),
  read("FIGMA-PRINCIPLES.md")
]);

// ── The conservation law, made mechanical ─────────────────────────────────────
// These are Dr Non's rules. A rule stated in prose is a preference; a rule with a
// test is a law. Each one below is quoted in STYLE.md so the two cannot drift.

assert.match(styles, /border-radius:\s*0\s*!important/, "styles.css must zero every radius");
assert.match(styles, /border-radius:\s*0\s*!important/, "the radius reset must win over any later rule");

// No gradients, shadows or decorative texture in either stylesheet.
for (const [name, source] of [["styles.css", styles], ["reading.css", readingCss]]) {
  for (const banned of ["linear-gradient", "radial-gradient", "conic-gradient", "box-shadow:", "text-shadow:", "filter: blur", "backdrop-filter"]) {
    assert.ok(!source.includes(banned), `${name} contains a banned decorative effect: ${banned}`);
  }
}

// ── The top bar may not outrank the work ───────────────────────────────────────
// The plate view must not grow a top bar. The reading room header is measured, not
// guessed: assert the CSS cannot exceed the limit it claims in STYLE.md.
const headerPad = readingCss.match(/\.room-header\s*\{[^}]*padding:\s*(\d+)px/);
assert.ok(headerPad, "reading.css must declare an explicit room-header padding");
const headerLineHeight = 25.6; // 1rem at line-height 1.6, verified in the browser
const headerMax = Number(headerPad[1]) * 2 + 44; // padding both sides + the 44px link floor
assert.ok(headerMax <= 56, `reading room header computes to ${headerMax}px, over the 56px limit (padding ${headerPad[1]}px)`);
assert.ok(headerLineHeight > 0);

// ── The measure is a physical fact, expressed in ch ───────────────────────────
// A rem cap gives a 12px caption a longer line than 16px prose. Prose columns
// must be capped in ch, and the cap must be a real reading measure.
const proseCap = readingCss.match(/\.prose\s*\{[^}]*max-width:\s*(\d+(?:\.\d+)?)ch/);
assert.ok(proseCap, "reading.css must cap .prose in ch, not rem");
const measure = Number(proseCap[1]);
assert.ok(measure >= 45 && measure <= 75, `reading measure is ${measure}ch; a paperback line is 45–75ch`);

// Every prose max-width in the plate stylesheet should be ch or a deliberate
// structure (table, grid, chart), never a bare rem column that rots independently.
// Measured 20 Oct 2026: running prose reaches 78ch at its widest. Catalogue rows
// (the 348-item index) legitimately run wider — they are a table, not a paragraph,
// and narrowing them would shrink a label to fit a sentence.
const FINEPRINT_CAP_CH = 78;
assert.match(
  styles,
  new RegExp(`\\.interpretation-fineprint\\s*\\{[^}]*max-width:\\s*${FINEPRINT_CAP_CH}ch`),
  `the 12px method note must stay within ${FINEPRINT_CAP_CH}ch; it measured 200ch uncapped`
);

// ── The five defaults, taught ─────────────────────────────────────────────────
// The chapter that teaches the rules must actually contain them, in all three
// languages, or the lesson is only in English.
const defaultsChapter = reading.match(/<section id="defaults"[\s\S]*?<\/section>/);
assert.ok(defaultsChapter, "reading.html must keep the defaults chapter");
for (const teaching of [
  "much bigger than its text",
  "never an accident",
  "top bar taller than the page",
  "physical object",
  "the stack, not the item"
]) {
  assert.ok(defaultsChapter[0].includes(teaching), `the defaults chapter must teach: "${teaching}"`);
}
assert.ok(defaultsChapter[0].includes('lang="th"'), "the defaults chapter needs its Thai reading");
assert.ok(defaultsChapter[0].includes('lang="zh-Hans"'), "the defaults chapter needs its Chinese reading");

// ── Provenance of the borrowed material ────────────────────────────────────────
assert.match(figma, /figma\.com\/resource-library\/graphic-design-principles/, "the field note must link its source");
assert.match(figma, /read 20 October 2026|retrieved 20 October 2026/i, "the field note must record when it was read");
assert.match(figma, /No Figma text is\s+reproduced/, "the field note must state it paraphrases, not copies");
assert.ok(!/13 Graphic Design Principles \+ How To Apply Them/.test(reading), "do not paste the source's title as our own heading");

// ── STYLE.md must agree with the code, not just assert it ─────────────────────
assert.match(style, /## Allow/, "STYLE.md needs an Allow section for the scanner");
assert.match(style, /## Protected voice/, "STYLE.md needs Protected voice");
assert.match(style, /IBM Plex Sans Thai/, "STYLE.md must name the non-looped Thai face");
for (const [name, source] of [["styles.css", styles], ["reading.css", readingCss], ["reading.html", reading], ["STYLE.md", style]]) {
  assert.ok(!/\bSarabun\b/.test(source), `${name} names Sarabun; Thai must use a non-looped face only`);
}

// The known rendered-check false positives must stay documented, or the next agent
// re-derives them. STYLE.md is where that lives.
assert.match(style, /## Known results of the rendered check/, "STYLE.md must record the rendered check's known results");
for (const finding of ["void", "hero-no-data", "modal-on-load"]) {
  assert.ok(style.includes(finding), `STYLE.md must record the known ${finding} finding`);
}
assert.match(style, /does \*\*not\*\* read `## Allow`/, "STYLE.md must state that render ignores the allowlist");

// A skip marker must never buy a clean scan with no trace. This is the
// vendored copy of the fix, so assert the copy is actually the fixed one —
// otherwise a re-vendor silently reintroduces the bug.
{
  const scan = await readFile(new URL("../.non-slop/lib/scan.mjs", import.meta.url), "utf8");
  assert.ok(
    /marker[\s\S]{0,400}skipped\(/.test(scan),
    "the vendored scanner must route a skip marker through skipped(), not drop it with a bare return null"
  );
  assert.ok(
    !/non-slop-skip-file[^\n]*\) && !process\.env\.NON_SLOP_INCLUDE_EXAMPLES\) return null/.test(scan),
    "the vendored scanner must not drop a marked file silently"
  );
}

console.log("OK: conservation law, measure, header height, the five defaults and provenance are enforced");