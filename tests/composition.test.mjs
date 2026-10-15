import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { sharesFor } from "../scripts/export-tokens.mjs";
import {
  GATES,
  balanceExample,
  latinBodyFits,
  plateFrame,
  reviewComposition,
  srgbLuminance,
  visualWeight,
} from "../composition.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

function property(css, name) {
  const match = css.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`));
  assert.ok(match, `missing --${name}`);
  return match[1].trim();
}

test("a middle value weighs less per pixel than a dark or a bright one", () => {
  const box = { width: 10, height: 10, density: 1 };
  const mid = visualWeight({ ...box, luminance: 0.5 });
  const dark = visualWeight({ ...box, luminance: srgbLuminance("#12354e") });
  const bright = visualWeight({ ...box, luminance: srgbLuminance("#f99d1b") });
  assert.ok(dark > mid);
  assert.ok(bright > mid);
  assert.ok(srgbLuminance("#12354e") < 0.1);
  assert.ok(srgbLuminance("#f99d1b") > 0.4);
});

test("the two-colour plate keeps one heavy field, a full-height cut and an anchored cluster", () => {
  const shares = sharesFor(2).map(Number);
  const model = plateFrame({ width: 1280, height: 800, rail: 56, shares });
  const [dominant] = model.fields;
  const inset = 25.6;
  const labelX = 89.6;
  model.groups = model.fields.map((field) => ({
    id: `name-${field.id}`,
    boxes: [{ x: field.x + inset, y: 760, width: 88, height: 16 }],
  }));
  model.cluster = { x: labelX, y: 520, width: 240, height: 160, luminance: 0.08, density: 3 };
  model.groups.push({
    id: "plate-label",
    boxes: [
      { x: labelX, y: 520, width: 48, height: 18 },
      { x: labelX, y: 544, width: 220, height: 64 },
      { x: labelX, y: 616, width: 200, height: 56 },
    ],
  });
  const review = reviewComposition(model);
  assert.deepEqual(review.failures, []);
  assert.equal(review.ok, true);
  assert.ok(visualWeight(dominant) > visualWeight(model.cluster));
});

test("the reading-room figure passes the same gates", () => {
  const review = reviewComposition(balanceExample());
  assert.deepEqual(review.failures, []);
});

test("equal halves, a stopped line, a wandering group and a rival cluster fail", () => {
  const equal = plateFrame({ width: 1000, height: 600, rail: 0, shares: [0.5, 0.5] });
  assert.ok(reviewComposition(equal).failures.includes("focal-mass"));

  const cut = plateFrame({ width: 1000, height: 600, rail: 0, shares: [0.618, 0.382] });
  cut.lines = [{ x1: cut.lines[0].x1, y1: 80, x2: cut.lines[0].x2, y2: 520 }];
  assert.ok(reviewComposition(cut).failures.includes("line-to-edge"));

  const wandering = plateFrame({ width: 1000, height: 600, rail: 0, shares: [0.618, 0.382] });
  wandering.groups = [{
    id: "loose",
    boxes: [
      { x: 20, y: 20, width: 40, height: 16 },
      { x: 240, y: 180, width: 40, height: 16 },
      { x: 80, y: 420, width: 40, height: 16 },
    ],
  }];
  const loose = reviewComposition(wandering);
  assert.ok(loose.failures.includes("alignment:loose"));

  const rival = balanceExample();
  rival.cluster = { ...rival.cluster, width: 500, height: 300, density: 1 };
  const heavy = reviewComposition(rival);
  assert.ok(heavy.failures.includes("cluster-too-large"));
  assert.ok(heavy.failures.includes("cluster-not-denser"));
});

test("Latin body measure and leading stay inside the gate, and display type is not forced through it", () => {
  assert.equal(latinBodyFits(64, 1.6), true);
  assert.equal(latinBodyFits(50, 1.4), true);
  assert.equal(latinBodyFits(75, 1.6), true);
  assert.equal(latinBodyFits(49, 1.6), false);
  assert.equal(latinBodyFits(76, 1.6), false);
  assert.equal(latinBodyFits(64, 1.2), false);
  assert.equal(GATES.latinMeasureMin, 50);
  assert.equal(GATES.bodyLeadingMax, 1.6);
});

test("the reading room, the field guide and CREDITS name the post and do not host its pictures", async () => {
  const [css, html, guide, credits, notices] = await Promise.all([
    read("../reading.css"),
    read("../reading.html"),
    read("../PALETTE-FIELD-GUIDE.md"),
    read("../CREDITS.md"),
    read("../THIRD_PARTY_NOTICES.md"),
  ]);
  assert.equal(property(css, "measure-ch"), "64");
  assert.equal(property(css, "leading"), "1.6");
  assert.equal(property(css, "field-share"), "0.618");
  assert.match(css, /max-width:\s*calc\(var\(--measure-ch\) \* 1ch\)/);
  assert.match(css, /line-height:\s*var\(--leading\)/);
  assert.match(css, /grid-template-columns:\s*calc\(var\(--field-share\)/);
  assert.match(html, /id="balance"/);
  assert.match(html, /href="#balance"/);
  assert.match(html, /src="https:\/\/www\.instagram\.com\/p\/DeUfRznEv59\/embed\/captioned\/"/);
  for (const text of [html, guide, credits]) {
    assert.match(text, /@desizncircle/);
    assert.match(text, /https:\/\/www\.instagram\.com\/p\/DeUfRznEv59\//);
    assert.doesNotMatch(text, /cdninstagram|fbcdn\.net|\.jpg|\.jpeg|\.webp/);
  }
  assert.match(credits, /embed\/captioned/);
  assert.match(notices, /CREDITS\.md/);
  assert.match(guide, /focal-mass/);
  assert.match(html, /Yellow Orange/);
  assert.match(html, /Dark Tyrian Blue/);
  assert.match(html, /lang="th"/);
  assert.match(html, /lang="zh-Hans"/);
});
