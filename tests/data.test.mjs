import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const colors = JSON.parse(await readFile(new URL("../data/colors.json", import.meta.url)));

function relativeLuminance(rgb) {
  const channels = rgb.map((value) => {
    const channel = value / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function palettesFrom(source) {
  const map = new Map();
  source.forEach((color) => {
    color.combinations.forEach((id) => {
      if (!map.has(id)) map.set(id, []);
      map.get(id).push(color.name);
    });
  });
  return map;
}

test("the credited source contains 159 named colours", () => {
  assert.equal(colors.length, 159);
  assert.equal(new Set(colors.map((color) => color.name)).size, 159);
});

test("the source reconstructs all 348 combinations", () => {
  const palettes = palettesFrom(colors);
  assert.equal(palettes.size, 348);
  assert.deepEqual([...palettes.keys()].sort((a, b) => a - b), Array.from({ length: 348 }, (_, index) => index + 1));
});

test("every combination contains two, three, or four colours", () => {
  for (const [id, names] of palettesFrom(colors)) {
    assert.ok(names.length >= 2 && names.length <= 4, `plate ${id} has ${names.length} colours`);
  }
});

test("every digital colour has valid names and values", () => {
  for (const color of colors) {
    assert.match(color.name, /\S/);
    assert.match(color.hex, /^#[0-9a-f]{6}$/i);
    assert.equal(color.rgb.length, 3);
    color.rgb.forEach((channel) => assert.ok(Number.isInteger(channel) && channel >= 0 && channel <= 255));
  }
});

test("every field can use black or white ink at WCAG AA contrast", () => {
  const darkInkLuminance = 0;
  colors.forEach((color) => {
    const luminance = relativeLuminance(color.rgb);
    const bestContrast = Math.max(
      1.05 / (luminance + 0.05),
      (luminance + 0.05) / (darkInkLuminance + 0.05)
    );
    assert.ok(bestContrast >= 4.5, `${color.name} only reaches ${bestContrast.toFixed(2)}:1`);
  });
});
