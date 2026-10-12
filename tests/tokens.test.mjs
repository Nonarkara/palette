import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  buildTokenDocument,
  combinationsFrom,
  loadTokenSources,
  plateId,
  renderedTokens,
  sharesFor,
  slug,
} from "../scripts/export-tokens.mjs";

const TOKEN_NAME = /^[a-zA-Z0-9_-][a-zA-Z0-9$_-]*(\.[a-zA-Z0-9$_-]+)*$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const sources = await loadTokenSources();
const document = buildTokenDocument(sources);
const guide = await readFile(new URL("../tokens/README.md", import.meta.url), "utf8");
const app = await readFile(new URL("../app.js", import.meta.url), "utf8");

function walk(node, path, visit) {
  if (node && typeof node === "object" && "$value" in node) {
    visit(path, node);
    return;
  }
  for (const [key, value] of Object.entries(node)) {
    assert.match(key, /^[A-Za-z0-9_-]+$/, `group segment ${path}.${key}`);
    walk(value, path ? `${path}.${key}` : key, visit);
  }
}

function tokensIn(set) {
  const found = [];
  walk(set, "", (name, token) => found.push([name, token]));
  return found;
}

function rootProperties(css) {
  const start = css.indexOf(":root");
  const open = css.indexOf("{", start);
  let depth = 0;
  let block = "";
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    else if (css[index] === "}") {
      depth -= 1;
      if (depth === 0) {
        block = css.slice(open + 1, index);
        break;
      }
    }
  }
  return [...block.matchAll(/--([A-Za-z0-9_-]+)\s*:/g)].map((match) => match[1]);
}

test("the committed export matches the generator", async () => {
  const disk = await readFile(new URL("../tokens/palette.tokens.json", import.meta.url), "utf8");
  const fresh = await renderedTokens();
  if (disk !== fresh) {
    const left = disk.split("\n");
    const right = fresh.split("\n");
    let line = 0;
    while (line < left.length && line < right.length && left[line] === right[line]) line += 1;
    assert.fail(`tokens/palette.tokens.json is stale at line ${line + 1}. Run npm run build.\nfile: ${left[line]}\nbuild: ${right[line]}`);
  }
});

test("catalogue, plates, themes, and metadata are complete", () => {
  const plates = combinationsFrom(sources.colors);
  assert.equal(Object.keys(document.catalogue.colour).length, 159);
  assert.equal(plates.length, 348);
  const setNames = Object.keys(document).filter((key) => !key.startsWith("$"));
  assert.deepEqual(setNames.slice(0, 3), ["catalogue", "interface", "reading"]);
  assert.equal(setNames.length, 351);
  assert.deepEqual(
    setNames.slice(3),
    plates.map((plate) => `plate/${plateId(plate.id)}`)
  );
  assert.deepEqual(document.$metadata.tokenSetOrder, setNames);
  assert.deepEqual(document.$metadata.activeThemes, ["Plate/001"]);
  assert.deepEqual(document.$metadata.activeSets, ["catalogue", "interface", "reading", "plate/001"]);
  assert.equal(document.$themes.length, 348);
  assert.equal(new Set(document.$themes.map((theme) => theme.id)).size, 348);

  for (const color of sources.colors) {
    const token = document.catalogue.colour[slug(color.name)];
    assert.equal(token.$value, color.hex.toLowerCase());
    assert.equal(token.$type, "color");
    assert.match(token.$description, new RegExp(`^${color.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.`));
    assert.match(token.$description, /credited digital conversion/i);
  }

  for (const [index, plate] of plates.entries()) {
    assert.equal(plate.id, index + 1);
    const label = plateId(plate.id);
    const set = document[`plate/${label}`];
    const theme = document.$themes[plate.id - 1];
    assert.equal(theme.name, label);
    assert.equal(theme.group, "Plate");
    assert.match(theme.id, UUID);
    assert.equal(typeof theme.description, "string");
    assert.ok(theme.description.length > 0);
    assert.deepEqual(theme.selectedTokenSets, {
      catalogue: "enabled",
      interface: "enabled",
      reading: "enabled",
      [`plate/${label}`]: "enabled",
    });
    const roles = ["dominant", "counter", "support", "signal"].slice(0, plate.colors.length);
    assert.deepEqual(Object.keys(set.role), roles);
    assert.deepEqual(Object.keys(set.share), roles);
    const shares = sharesFor(plate.colors.length);
    plate.colors.forEach((color, index) => {
      assert.equal(set.role[roles[index]].$value, `{colour.${slug(color.name)}}`);
      assert.equal(set.role[roles[index]].$type, "color");
      assert.equal(set.share[roles[index]].$value, shares[index]);
      assert.equal(set.share[roles[index]].$type, "number");
    });
    const numeric = shares.map(Number);
    assert.ok(Math.abs(numeric.reduce((sum, share) => sum + share, 0) - 1) < 0.001);
  }
});

test("every token is a Penpot DTCG leaf and every reference resolves", () => {
  const names = new Set();
  for (const [setName, set] of Object.entries(document)) {
    if (setName.startsWith("$")) continue;
    assert.equal(setName, setName.trim());
    assert.ok(!setName.includes(" "), setName);
    for (const [name, token] of tokensIn(set)) {
      assert.match(name, TOKEN_NAME, name);
      assert.deepEqual(Object.keys(token), ["$value", "$type", "$description"]);
      assert.equal(typeof token.$description, "string");
      assert.ok(token.$description.length > 0, name);
      assert.ok(["color", "dimension", "number", "string", "fontFamilies"].includes(token.$type), token.$type);
      if (token.$type === "color") {
        assert.match(token.$value, /^(#[0-9a-f]{6}|\{colour\.[a-z0-9-]+\})$/);
        assert.equal(typeof token.$value, "string");
      }
      if (typeof token.$value === "string" && token.$value.startsWith("{")) {
        const target = token.$value.slice(1, -1);
        assert.match(target, TOKEN_NAME);
        names.add(target);
      }
    }
  }
  const catalogueNames = new Set(tokensIn(document.catalogue).map(([name]) => name));
  for (const target of names) assert.ok(catalogueNames.has(target), target);
  assert.equal(JSON.stringify(document).includes("colorSpace"), false);
});

test("interface and reading sets keep the stylesheet custom properties", () => {
  const covers = (names, property) => names.some((name) => name.split(".").includes(property));
  const interfaceNames = tokensIn(document.interface).map(([name]) => name);
  for (const property of rootProperties(sources.stylesCss)) {
    assert.ok(covers(interfaceNames, property), property);
  }
  const readingNames = tokensIn(document.reading).map(([name]) => name);
  for (const property of rootProperties(sources.readingCss)) {
    assert.ok(covers(readingNames, property), property);
  }
  assert.equal(document.interface.dimension.rail.$value, "3.5rem");
  assert.equal(document.interface.color["about-red"].$value, "{colour.red}");
  assert.equal(document.interface.color["wada-orange"].$value, "{colour.yellow-orange}");
  assert.equal(document.interface.color["wada-blue"].$value, "{colour.dark-tyrian-blue}");
  assert.equal(document.reading.color.chord.$value, "{colour.yellow-orange}");
  assert.equal(document.reading.color.deep.$value, "{colour.dark-tyrian-blue}");
  assert.equal(document.reading.color.paper.$type, "color");
  assert.match(document.reading.color.paper.$value, /^#[0-9a-f]{6}$/);
  assert.deepEqual(document.interface.font.display.$value[0], "Archivo Narrow");
  assert.deepEqual(document.interface.font.thai.$value[0], "IBM Plex Sans Thai");
  assert.deepEqual(document.interface.font.hans.$value[0], "Noto Sans SC");
  assert.deepEqual(document.interface.font.data.$value[0], "JetBrains Mono");
  assert.match(document.interface.font.thai.$description, /lang="th"/);
  assert.match(document.interface.font.hans.$description, /lang="zh-Hans"/);
});

test("plate shares stay locked to the exhibition weights", () => {
  assert.match(app, /if \(count === 2\) return \[1\.618, 1\]/);
  assert.match(app, /if \(count === 3\) return \[1\.45, 0\.9, 0\.65\]/);
  assert.match(app, /return \[1\.55, 0\.85, 0\.7, 0\.55\]/);
  assert.match(app, /\["dominant", "counter", "support", "signal"\]/);
  assert.deepEqual(sharesFor(2), ["0.618", "0.382"]);
  assert.deepEqual(sharesFor(3), ["0.483", "0.300", "0.217"]);
  assert.deepEqual(sharesFor(4), ["0.425", "0.233", "0.192", "0.150"]);
});

test("the import guide credits Penpot and describes both importers", () => {
  for (const line of [
    "https://help.penpot.app/user-guide/design-systems/design-tokens/",
    "https://penpot.app/blog/a-practical-guide-to-the-design-tokens-json-format/",
    "https://github.com/penpot/penpot",
    "Mozilla Public License 2.0",
    "KALEIDOS SUBSIDIARY SL",
    "Incompatible With Secondary Licenses",
    "Tokens Studio",
    "tokens/palette.tokens.json",
    "159",
    "348",
    "credited digital conversion",
    "Tools",
    "Import",
    "$metadata",
    "tokenSetOrder",
    "Plate/001",
  ]) {
    assert.ok(guide.includes(line), `tokens/README.md missing ${line}`);
  }
});
