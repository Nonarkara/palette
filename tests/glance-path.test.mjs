import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (p) => readFile(new URL(`../${p}`, import.meta.url), "utf8");

const GUIDE = "https://github.com/Nonarkara/Non-Slop/blob/main/ANTI-SPATIAL-HALLUCINATION.md";
const GATE = "https://github.com/Nonarkara/Non-Slop/blob/main/AGENTS.md";
const RULES = ["dead zone", "leapfrog", "skeleton", "extreme scale contrast"];

function marked(source, name) {
  const start = source.indexOf("<!-- glance-path:v1 -->");
  const end = source.indexOf("<!-- /glance-path:v1 -->");
  assert.ok(start !== -1 && end > start, `${name} must carry the glance-path block`);
  return source.slice(start, end);
}

test("agent contracts share one glance-path pointer", async () => {
  const agents = await read("AGENTS.md");
  const claude = await read("CLAUDE.md");
  const block = marked(agents, "AGENTS.md");
  assert.equal(marked(claude, "CLAUDE.md"), block, "AGENTS.md and CLAUDE.md must carry the same glance-path block");
  assert.ok(block.includes(GUIDE), "the pointer must name Non-Slop ANTI-SPATIAL-HALLUCINATION.md");
  assert.ok(block.includes(GATE), "the pointer must name the review gate in Non-Slop AGENTS.md");
  assert.ok(!block.includes("MSH.md"), "the pointer must not send builders to a separate MSH.md");
  assert.ok(block.includes("STYLE.md"), "STYLE.md must still beat the pointer");
  for (const rule of RULES) assert.ok(block.includes(rule), `glance-path block missing: ${rule}`);
  assert.match(block, /one or two accents/i);
  assert.match(block, /prefers-reduced-motion/);
});

test("design docs and anti-slop notes point at the same rules", async () => {
  const files = [
    "ANTI-SLOP.md",
    "ANTI-SPATIAL-HALLUCINATION.md",
    "PALETTE-FIELD-GUIDE.md",
    "README.md",
    "docs/design-brief.md",
    ".cursor/rules/anti-slop.mdc",
  ];
  for (const file of files) {
    const source = await read(file);
    assert.ok(source.includes("Glance path and kinetic grid") || source.includes("glance-path and kinetic-grid"), `${file} must name the pointer`);
    assert.ok(source.includes(GUIDE), `${file} must link the Non-Slop spatial guide`);
    assert.ok(source.includes(GATE), `${file} must link the Non-Slop review gate`);
    assert.ok(!source.includes("MSH.md"), `${file} must not link a separate MSH.md`);
    assert.ok(!/Non-Slop\/blob\/main\/ANTI-SLOP\.md/.test(source), `${file} must not link a Non-Slop ANTI-SLOP.md`);
    assert.ok(source.includes("leapfrog"), `${file} must keep the leapfrog rule`);
    assert.ok(/skeleton/i.test(source), `${file} must keep skeleton-first motion`);
    assert.ok(/dead zone|dead band/i.test(source), `${file} must keep visual gravity`);
  }
});
