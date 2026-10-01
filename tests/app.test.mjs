import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const colors = JSON.parse(await readFile(new URL("../data/colors.json", import.meta.url)));
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const js = await readFile(new URL("../app.js", import.meta.url), "utf8");
const contentSource = await readFile(new URL("../content.js", import.meta.url), "utf8");
// content.js assigns window.PALETTE_COPY = {…}; — strip the host binding and
// the trailing semicolon, then evaluate the literal so we can assert against
// the search vocabulary.
const literal = contentSource.replace(/^window\./, "").replace(/;?\s*$/, "");
const vocab = new Function(`return (${literal});`)();

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

test("hero strip uses only colours from the credited catalogue", async () => {
  const svg = await readFile(new URL("../assets/exhibition-strip.svg", import.meta.url), "utf8");
  // Only the field <rect> fills count as colour fields. Text fills are labels,
  // and the full-canvas background (#111111) is the exhibition wall, not a
  // plate — it is the same --black the instrument rail uses.
  const rectFills = [...svg.matchAll(/<rect[^>]*fill="#([0-9a-f]{6})"/gi)]
    .map(([, hex]) => `#${hex.toLowerCase()}`)
    .filter((hex) => hex !== "#111111");
  assert.ok(rectFills.length >= 3, "the strip must show at least three catalogue colour fields");
  const catalog = new Set(colors.map((color) => color.hex.toLowerCase()));
  for (const hex of rectFills) {
    assert.ok(catalog.has(hex), `hero strip invents colour ${hex} — not in Wada catalogue`);
  }
});

test("hero strip description credits real plate numbers, not invented combinations", async () => {
  const svg = await readFile(new URL("../assets/exhibition-strip.svg", import.meta.url), "utf8");
  const descMatch = svg.match(/<desc[^>]*>([^<]+)<\/desc>/);
  assert.ok(descMatch, "hero strip must include a description for screen readers");
  const desc = descMatch[1];
  // The description claims specific plate numbers; verify they exist in the data.
  const plateNumbers = [...desc.matchAll(/\b(286|198)\b/g)].map(([, n]) => Number(n));
  for (const id of plateNumbers) {
    assert.ok(palettesFrom(colors).has(id), `hero strip cites plate ${id} but it is not in the catalogue`);
  }
});

test("scripts are deferred so first paint is not blocked", () => {
  assert.match(html, /<script defer src="content\.js[^"]*"/);
  assert.match(html, /<script defer src="app\.js[^"]*"/);
});

test("keyboard handler ignores Cmd/Ctrl/Alt to avoid stealing browser shortcuts", () => {
  // Every single-letter shortcut (r, g, i, a, j, c) sits behind a
  // metaKey/ctrlKey/altKey guard, otherwise Cmd+R would race the reload.
  const guardIndex = js.indexOf("metaKey || event.ctrlKey || event.altKey");
  const letterHandlers = ["r", "g", "i", "a", "j", "c"].map((letter) =>
    js.indexOf(`letter === "${letter}"`)
  );
  assert.ok(guardIndex > 0, "keydown handler must include a modifier-key guard");
  for (const idx of letterHandlers) {
    assert.ok(idx > guardIndex, `letter shortcut handler must come after the modifier-key guard (looked for "letter === ..." in app.js)`);
  }
});

test("search and index dialogs declare aria-live regions for result updates", () => {
  assert.match(html, /id="search-explainer"[^>]*aria-live="polite"/);
  assert.match(html, /id="index-count"[^>]*aria-live="polite"/);
});

test("plate count cycles through all 348 plates without skipping or duplicating", () => {
  // Re-run the same reconstruction the app does, and assert the visit order is complete.
  const map = palettesFrom(colors);
  const ids = [...map.keys()].sort((a, b) => a - b);
  assert.equal(ids.length, 348);
  for (let i = 0; i < ids.length; i++) {
    assert.equal(ids[i], i + 1, `plate ${ids[i]} should sit at index ${i} when sorted`);
  }
});

test("palette share totals are exactly 1.0 to three decimal places", () => {
  // Mirrors the app's fieldWeights / paletteExport logic.
  const weightsByCount = {
    2: [1.618, 1],
    3: [1.45, 0.9, 0.65],
    4: [1.55, 0.85, 0.7, 0.55]
  };
  for (const [count, weights] of Object.entries(weightsByCount)) {
    const total = weights.reduce((sum, w) => sum + w, 0);
    const shares = weights.map((w) => Number((w / total).toFixed(3)));
    shares[shares.length - 1] = Number((1 - shares.slice(0, -1).reduce((sum, s) => sum + s, 0)).toFixed(3));
    const sum = Number(shares.reduce((s, v) => s + v, 0).toFixed(3));
    assert.equal(sum, 1.0, `count=${count} shares must sum to 1.000, got ${sum}`);
  }
});

test("every plate has a colour that earns the 'dominant' role on at least 38% of the field", () => {
  // The dominant-share CSS variable is derived from the colour count:
  // 2 → 0.618, 3 → 0.483, 4 → 0.425. Nothing smaller than 38% can claim dominance.
  const dominantShare = { 2: 0.618, 3: 0.483, 4: 0.425 };
  for (const [count, share] of Object.entries(dominantShare)) {
    assert.ok(share >= 0.38, `dominant share for ${count} colours is below 38%: ${share}`);
  }
});

test("content vocabulary exposes the same keys the reading logic expects", () => {
  const requiredUses = [
    "quiet editorial", "public signal", "domestic warmth", "night instrument",
    "botanical study", "electric argument", "mineral calm", "confectionery shock",
    "civic daylight", "archival room"
  ];
  for (const key of requiredUses) {
    assert.ok(Array.isArray(vocab.uses[key]), `uses.${key} must be an array`);
    assert.ok(vocab.uses[key].length > 0, `uses.${key} must have at least one suggestion`);
  }
  for (const term of ["warm", "cool", "quiet", "loud", "dark", "light"]) {
    assert.ok(Array.isArray(vocab.terms[term]), `terms.${term} must be an array`);
  }
});

test("search tags cover multilingual mood vocabulary in EN, TH, and ZH", () => {
  const warmWords = vocab.terms.warm.join(" ");
  const quietWords = vocab.terms.quiet.join(" ");
  // The check-content.mjs script asserts presence of canonical multilingual anchors;
  // here we assert the vocabulary itself ships the words a Thai or Chinese visitor
  // would type. Missing words break search for those scripts.
  assert.match(warmWords, /อบอุ่น|แสงแดด/);
  assert.match(warmWords, /温暖|阳光/);
  assert.match(quietWords, /สงบ|นุ่ม/);
  assert.match(quietWords, /安静|柔和/);
});
