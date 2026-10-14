import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildTokenDocument, loadTokenSources } from "../scripts/export-tokens.mjs";

const css = readFileSync(new URL("../layout.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../specimen.html", import.meta.url), "utf8");
const SCALE = ["4", "8", "16", "24", "32", "48", "64", "96"];

function mediaParts(source) {
  const desktop = [];
  const mobile = [];
  const marker = /@media\s*\(\s*min-width:\s*760px\s*\)\s*\{/g;
  let last = 0;
  for (const match of source.matchAll(marker)) {
    mobile.push(source.slice(last, match.index));
    const open = match.index + match[0].length - 1;
    let depth = 0;
    let index = open;
    for (; index < source.length; index += 1) {
      if (source[index] === "{") depth += 1;
      else if (source[index] === "}") {
        depth -= 1;
        if (depth === 0) {
          index += 1;
          break;
        }
      }
    }
    desktop.push(source.slice(open + 1, index - 1));
    last = index;
  }
  mobile.push(source.slice(last));
  return { mobile: mobile.join("\n"), desktop: desktop.join("\n") };
}

function columnLine(value, columns) {
  const end = Number(value);
  if (end === -1) return columns + 1;
  return end;
}

function assertColumnEdges(block, columns) {
  const found = [...block.matchAll(/grid-column:\s*(\d+)\s*\/\s*(-?\d+)/g)];
  assert.ok(found.length > 0, `expected column spans for ${columns} columns`);
  for (const match of found) {
    const start = Number(match[1]);
    const end = columnLine(match[2], columns);
    assert.equal(start, 1, match[0]);
    assert.ok(Number.isInteger(end), match[0]);
    assert.ok(end > start && end <= columns + 1, `${match[0]} off a ${columns}-column edge`);
  }
}

test("rules end on column edges", () => {
  const parts = mediaParts(css);
  assertColumnEdges(parts.mobile, 4);
  assertColumnEdges(parts.desktop, 12);
  assert.match(parts.desktop, /\.span-display\s*\{[^}]*grid-column:\s*1\s*\/\s*9/);
  assert.match(parts.mobile, /\.span-display\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/);
  const rules = [...html.matchAll(/class="(rule[^"]*)"/g)].map((match) => match[1]);
  assert.equal(rules.length, 3);
  assert.deepEqual(rules.map((name) => name.match(/rule-(\d)/)[1]).sort(), ["1", "2", "3"]);
  for (const name of rules) assert.match(name, /span-(display|page)/);
});

test("spacing comes from the scale", () => {
  const allowed = /^(0|var\(--(?:space-(?:4|8|16|24|32|48|64|96)|gutter|baseline)\))$/;
  const properties = [...css.matchAll(/(?:^|[{};])\s*((?:margin|padding|column-gap|row-gap|gap|outline-offset)(?:-[a-z]+)*)\s*:\s*([^;]+);/g)];
  assert.ok(properties.length > 0);
  for (const match of properties) {
    for (const part of match[2].trim().split(/\s+/)) {
      assert.match(part, allowed, `${match[1]}: ${part}`);
    }
  }
  const withoutQueries = css.replace(/@media\s*\([^)]*\)/g, "@media");
  const pixels = new Set([1, 2, 3, ...SCALE.map(Number)]);
  for (const match of withoutQueries.matchAll(/(\d+)px/g)) {
    assert.ok(pixels.has(Number(match[1])), match[0]);
  }
});

test("a page uses at most three rule weights", () => {
  const defined = [...css.matchAll(/--rule-(\d+)\s*:\s*(\d+)px/g)];
  assert.deepEqual(defined.map((match) => [match[1], match[2]]), [["1", "1"], ["2", "2"], ["3", "3"]]);
  const used = new Set([...css.matchAll(/var\(--rule-(\d+)\)/g)].map((match) => match[1]));
  assert.ok(used.size <= 3);
  assert.deepEqual([...used].sort(), ["1", "2", "3"]);
  assert.equal(css.includes("--rule-4"), false);
});

test("geometric display is Jost, and body, Thai and Chinese stay put", async () => {
  const sources = await loadTokenSources();
  const document = buildTokenDocument(sources);
  assert.deepEqual(document.interface.font.geometric.$value, ["Jost", "Archivo Narrow", "Arial", "sans-serif"]);
  assert.match(document.interface.font.geometric.$description, /Display and wordmarks only/);
  assert.equal(document.interface.font.display.$value[0], "Archivo Narrow");
  assert.equal(document.interface.font.thai.$value[0], "IBM Plex Sans Thai");
  assert.equal(document.interface.font.hans.$value[0], "Noto Sans SC");
  assert.equal(document.reading.font.body.$value[0], "Arial");
  assert.equal(document.interface.number["dominant-share"].$value, "0.618");
  assert.match(document.interface.number["dominant-share"].$description, /two-colour split/);
  for (const step of SCALE) assert.equal(document.interface.dimension[`space-${step}`].$value, `${step}px`);
  assert.equal(document.interface.dimension.gutter.$value, "24px");
  assert.equal(document.interface.number["grid-columns"].$value, "12");
  assert.equal(document.interface.number["grid-columns-mobile"].$value, "4");
  assert.equal(document.interface.dimension.baseline.$value, "2rem");
  assert.equal(document.interface.dimension["rule-1"].$value, "1px");
  assert.equal(document.interface.dimension["rule-2"].$value, "2px");
  assert.equal(document.interface.dimension["rule-3"].$value, "3px");
  assert.equal(document.interface.number["rule-max"].$value, "3");
  assert.equal(document.interface.dimension["optical-centre-offset"].$value, "4%");
  assert.equal(css.includes("font-display: swap"), true);
  assert.equal(readFileSync("styles.css", "utf8").includes("lowercase-display"), false);
  assert.equal(readFileSync("reading.css", "utf8").includes("lowercase-display"), false);
});

test("the lowercase display class stays off body, Thai and Chinese", () => {
  assert.match(css, /font-family:\s*Arial,\s*sans-serif/);
  assert.match(css, /\[lang="th"\]\s*\{\s*font-family:\s*"IBM Plex Sans Thai"/);
  assert.match(css, /\[lang="zh-Hans"\]\s*\{\s*font-family:\s*"Noto Sans SC"/);
  const lowered = [];
  const tags = [...html.matchAll(/<([a-z0-9]+)([^>]*)>/g)];
  for (const [, name, attrs] of tags) {
    const classes = attrs.match(/class="([^"]*)"/)?.[1]?.split(/\s+/) ?? [];
    if (!classes.includes("lowercase-display")) continue;
    lowered.push(name);
    assert.equal(name === "body" || classes.includes("prose"), false);
    assert.equal(/lang="th"|lang="zh-Hans"/.test(attrs), false);
  }
  assert.deepEqual(lowered, ["h1", "p"]);
  assert.match(html, /class="wordmark lowercase-display span-display"/);
  assert.match(html, /class="samples span-display"/);
  assert.match(html, /class="sample sample-trial" lang="th"/);
  assert.equal(html.includes("<img"), false);
  assert.equal(css.includes("linear-gradient"), false);
  assert.equal(css.includes("box-shadow"), false);
  assert.deepEqual([...css.matchAll(/border-radius:\s*([^;]+);/g)].map((match) => match[1].trim()), ["50%"]);
});

test("self-hosted faces keep their OFL files", () => {
  for (const file of ["fonts/jost/jost-latin.woff2", "fonts/anuphan/anuphan-thai.woff2"]) {
    assert.equal(readFileSync(file).subarray(0, 4).toString(), "wOF2");
  }
  const jost = readFileSync("fonts/jost/OFL.txt", "utf8");
  const anuphan = readFileSync("fonts/anuphan/OFL.txt", "utf8");
  assert.match(jost, /Jost Project Authors/);
  assert.match(jost, /SIL Open Font License/);
  assert.match(anuphan, /Anuphan Project Authors/);
  assert.match(anuphan, /SIL Open Font License/);
  assert.equal(jost.includes("Reserved Font Name"), false);
});

test("layout guides state every check in three languages", () => {
  for (const file of ["LAYOUT-FIELD-GUIDE.md", "LAYOUT-FIELD-GUIDE.th.md", "LAYOUT-FIELD-GUIDE.zh-CN.md"]) {
    const guide = readFileSync(file, "utf8");
    for (const id of ["L1", "L2", "L3", "L4", "G1", "G2", "G3", "S1", "S2", "S3", "B1", "B2", "B3", "B4", "B5"]) {
      assert.ok(guide.includes(id), `${file} missing ${id}`);
    }
    assert.match(guide, /specimen\.html/);
    assert.match(guide, /0\.618|61\.8/);
  }
});
