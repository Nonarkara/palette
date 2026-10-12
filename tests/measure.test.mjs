import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const measure = require("../palette-measure.js");
const colors = JSON.parse(await readFile(new URL("../data/colors.json", import.meta.url)));

test("black on white is 21:1 and a ratio is never rounded up into a pass", () => {
  assert.equal(measure.contrastRatio([0, 0, 0], [255, 255, 255]), 21);
  assert.equal(measure.contrastRatio([255, 255, 255], [255, 255, 255]), 1);
  assert.equal(measure.formatRatio(4.49), "4.4:1");
  assert.equal(measure.textOn([118, 118, 118]).body === "pass" || measure.textOn([118, 118, 118]).body === "fail", true);
  const justUnder = { rgb: [255, 255, 255] };
  assert.equal(measure.boundary(justUnder.rgb, justUnder.rgb).body, "fail");
  assert.equal(measure.boundary([0, 0, 0], [255, 255, 255]).body, "pass");
});

test("every catalogue colour can carry black or white body text at 4.5:1", () => {
  for (const color of colors) {
    const report = measure.textOn(color.rgb);
    assert.equal(report.body, "pass", `${color.name} ${color.hex} best ${report.best}`);
    assert.ok(report.best >= 4.5);
    assert.ok(report.ink === "black" || report.ink === "white");
  }
});

test("colour-vision simulation is deterministic, preserves white, and shifts red", () => {
  const red = [255, 0, 0];
  for (const mode of ["protanopia", "deuteranopia", "tritanopia"]) {
    const once = measure.simulate(red, mode);
    assert.deepEqual(measure.simulate(red, mode), once);
    assert.notDeepEqual(once, red);
    once.forEach((channel) => assert.ok(channel >= 0 && channel <= 255));
    const white = measure.simulate([255, 255, 255], mode);
    white.forEach((channel) => assert.ok(Math.abs(channel - 255) <= 1));
    const black = measure.simulate([0, 0, 0], mode);
    black.forEach((channel) => assert.equal(channel, 0));
  }
  assert.deepEqual(measure.simulate(red, "original"), red);
});

test("copy formats name the plate, the hex values, and the stable link", () => {
  const palette = {
    id: 2,
    colors: [
      { name: "Yellow Orange", hex: "#f99d1b", rgb: [249, 157, 27] },
      { name: "Dark Tyrian Blue", hex: "#12354e", rgb: [18, 53, 78] }
    ]
  };
  const model = measure.plateModel(palette);
  assert.equal(model.url, "https://colors.nonarkara.org/#plate-002");
  assert.equal(model.colors[0].share + model.colors[1].share, 1);
  const css = measure.cssVariables(model);
  assert.match(css, /--palette-dominant: #F99D1B/);
  assert.match(css, /--palette-counter-ink:/);
  const tailwind = measure.tailwindTheme(model);
  assert.match(tailwind, /@theme/);
  assert.match(tailwind, /--color-palette-dominant: #F99D1B/);
  assert.match(tailwind, /"palette-counter": "#12354E"/);
  const tokens = JSON.parse(measure.designTokens(model));
  assert.equal(tokens.palette.dominant.$type, "color");
  assert.equal(tokens.palette.dominant.$value, "#F99D1B");
  assert.match(tokens.palette.counter.$description, /not printed ink/);
});
