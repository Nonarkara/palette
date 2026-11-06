// non-slop-example: this file deliberately contains the slop it tests for —
// a fake stat, placeholder copy and a generic button label — so the scanner
// must not read those strings as defects in this repository.
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const brief = await import(new URL("../tools/brief-lint.mjs", import.meta.url));

const read = (p) => readFile(new URL(`../${p}`, import.meta.url), "utf8");
const vagueFixture = await read("tests/fixtures/brief-vague.md");
const anchoredFixture = await read("tests/fixtures/brief-anchored.md");

// ── The gap this tool closes ──────────────────────────────────────────────────
// Non-Slop scans css, html and script. It does not scan Markdown, so a brief
// written in Markdown was never checked by anything in this repo. If that
// changes, this tool becomes redundant — and the test should notice.
test("Non-Slop really does skip Markdown, which is why brief-lint exists", async () => {
  const scan = await read(".non-slop/lib/scan.mjs");
  const kindLine = scan.match(/const KIND = \{[^}]*\}/);
  assert.ok(kindLine, "the vendored scanner must still declare its file-kind map");
  assert.ok(!kindLine[0].includes('".md"'), "if the scanner now reads Markdown, brief-lint may be redundant — revisit this tool");
});

// ── The vague brief must fail, and for the right reasons ───────────────────────
test("the vague fixture trips every rule the tool exists to catch", () => {
  const res = brief.lintBrief(vagueFixture, "tests/fixtures/brief-vague.md");
  const rules = new Set(res.findings.map((f) => f.rule));
  for (const rule of ["vague-comparative", "vague-directive", "placeholder-brief", "unsourced-stat", "generic-cta"]) {
    assert.ok(rules.has(rule), `the vague fixture must trip ${rule}, got: ${[...rules].join(", ")}`);
  }
  assert.ok(res.findings.length >= 5, `expected several findings, got ${res.findings.length}`);
});

test("'make it more premium' is reported as a comparative, not as a word", () => {
  const res = brief.lintBrief(vagueFixture, "f.md");
  const hit = res.findings.find((f) => f.rule === "vague-comparative");
  assert.ok(hit, "the comparative must be reported");
  assert.equal(hit.sev, "P1", "a comparative is the worst offender and outranks a plain adjective");
  assert.match(hit.why, /feeling/i, "it must say what is wrong: it asks for a feeling");
});

// ── The anchored brief must pass ───────────────────────────────────────────────
test("the anchored fixture is clean — every directive carries an anchor", () => {
  const res = brief.lintBrief(anchoredFixture, "tests/fixtures/brief-anchored.md");
  assert.deepEqual(res.findings, [], `the anchored brief must not trip anything: ${JSON.stringify(res.findings, null, 2)}`);
});

test("this repo's own brief is clean", async () => {
  const res = brief.lintBrief(await read("docs/design-brief.md"), "docs/design-brief.md");
  assert.deepEqual(res.findings, [], `docs/design-brief.md must be clean: ${JSON.stringify(res.findings, null, 2)}`);
});

// ── The tool must not be a keyword hammer ──────────────────────────────────────
test("a vague word that carries an anchor is not a finding", () => {
  const res = brief.lintBrief("- The rail is 56px wide, so the plate number fits in Archivo Narrow.\n", "x.md");
  assert.deepEqual(res.findings, [], "an anchored vague word is a decision, not a smell");
});

test("fenced code is an example, not an instruction", () => {
  const res = brief.lintBrief("```\nmake it more premium\n```\n", "x.md");
  assert.deepEqual(res.findings, [], "a fenced block must not be linted as a directive");
});

test("a number with a source is not an unsourced stat", () => {
  const withSource = brief.lintBrief("- Trusted by 10,000+ teams, per the 2026 study at https://example.org/study.\n", "x.md");
  assert.deepEqual(withSource.findings.filter((f) => f.rule === "unsourced-stat"), [], "a sourced number is allowed");
  const without = brief.lintBrief("- Trusted by 10,000+ teams worldwide.\n", "x.md");
  assert.ok(without.findings.some((f) => f.rule === "unsourced-stat"), "an unsourced number must be reported");
});

// ── The tool must not rewrite anything ─────────────────────────────────────────
// The doctrine for generic-promise: quote the sentence, say what it promises
// without a subject or a number, propose the smallest edit. Do not invent a
// number. A linter that silently invents "12px" is worse than no linter.
test("the tool never proposes a rewritten sentence", () => {
  const res = brief.lintBrief(vagueFixture, "f.md");
  for (const f of res.findings) {
    assert.equal(f.rewrite, undefined, "the tool must not carry a rewritten sentence");
    assert.equal(f.replacement, undefined, "the tool must not carry a replacement");
    assert.ok(typeof f.quote === "string" && f.quote.length > 0, "every finding quotes the source");
    assert.ok(typeof f.fix === "string" && f.fix.length > 10, "every finding says what to do");
  }
  for (const f of res.findings.filter((x) => x.rule.startsWith("vague"))) {
    assert.match(f.fix, /number/i, "a vague finding must say how to anchor it");
    assert.match(f.fix, /do not invent a number|Do not rewrite it automatically/i, "it must refuse to invent a number");
  }
});

// ── Honest reporting ──────────────────────────────────────────────────────────
test("a file that cannot be read is reported, not silently passed", () => {
  const res = brief.lintFile(`${root}/tests/fixtures/does-not-exist.md`);
  assert.equal(res.findings.length, 0);
  assert.equal(res.skipped, "missing", "a missing file must be named");
});

test("the scan reports which files it did not scan", () => {
  const res = brief.lintPaths([`${root}/tests/fixtures`]);
  assert.ok(res.filesScanned >= 2, "both fixtures are briefs and must be scanned");
  assert.ok(Array.isArray(res.skipped), "skipped files must be reported");
});

test("doctrine and reference files are not briefs, and are skipped by default", () => {
  const res = brief.lintPaths([root]);
  const skipped = res.skipped.map((s) => s.path);
  assert.ok(skipped.some((p) => p.endsWith("ANTI-SLOP.md")), "ANTI-SLOP.md is doctrine, not a brief");
  assert.ok(skipped.some((p) => p.endsWith("REMEDIES.md")), "REMEDIES.md is a reference index, not a brief");
  // And it must be skipped for the stated reason, not quietly dropped.
  const why = res.skipped.find((s) => s.path.endsWith("ANTI-SLOP.md")).why;
  assert.match(why, /doctrine|not a brief/i, "a skipped file must say why it was skipped");
});

console.log("OK: the vague brief fails, the anchored brief passes, and nothing is rewritten");
