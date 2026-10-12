import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("the editorial method exists, is linked, and uses the combination count", async () => {
  const [editorial, zh, th, readme, guide, notices, colors] = await Promise.all([
    read("../EDITORIAL.md"),
    read("../EDITORIAL.zh-CN.md"),
    read("../EDITORIAL.th.md"),
    read("../README.md"),
    read("../PALETTE-FIELD-GUIDE.md"),
    read("../THIRD_PARTY_NOTICES.md"),
    read("../data/colors.json").then(JSON.parse),
  ]);
  const ids = new Set(colors.flatMap((color) => color.combinations));

  assert.equal(colors.length, 159);
  assert.equal(ids.size, 348);
  assert.match(editorial, /Explore 348 colour combinations by Sanzo Wada/);
  assert.match(editorial, /159 named colours/);
  assert.match(readme, /\[EDITORIAL\.md\]\(EDITORIAL\.md\)/);
  assert.match(guide, /\[EDITORIAL\.md\]\(EDITORIAL\.md\)/);
  assert.match(editorial, /\[简体中文\]\(EDITORIAL\.zh-CN\.md\)/);
  assert.match(editorial, /\[ไทย\]\(EDITORIAL\.th\.md\)/);
  assert.match(zh, /\[English\]\(EDITORIAL\.md\)/);
  assert.match(zh, /\[ไทย\]\(EDITORIAL\.th\.md\)/);
  assert.match(th, /\[English\]\(EDITORIAL\.md\)/);
  assert.match(th, /\[简体中文\]\(EDITORIAL\.zh-CN\.md\)/);
  for (const text of [editorial, zh, th]) {
    assert.match(text, /348/);
    assert.match(text, /petergyang\/no-ai-slop/);
    assert.match(text, /jakubkrehel\/make-interfaces-feel-better/);
  }
  assert.match(notices, /petergyang\/no-ai-slop/);
  assert.match(notices, /jakubkrehel\/make-interfaces-feel-better/);
  assert.match(editorial, /Rounded corners and shadows/);
  assert.match(editorial, /Blanket word bans/);
  assert.match(editorial, /AI-likeness percentage meters/);
  assert.match(editorial, /Deliberate mistakes/);
});
