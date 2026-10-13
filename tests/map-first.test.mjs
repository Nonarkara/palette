import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildTokenDocument, loadTokenSources } from "../scripts/export-tokens.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

const facts = [
  "--map-bar-top-desktop",
  "--map-bar-top-mobile",
  "--map-bar-bottom",
  "--map-button-pad-block",
  "--map-button-pad-inline",
  "--map-button-border",
  "--map-share-mobile",
  "--map-share-floor",
  "--map-target",
  "48px",
  "44px",
  "56px",
  "0px",
  "8px",
  "1px",
  "0.70",
  "0.65",
  "44 × 44",
  "map-first.css",
  "map-first.html#failure",
  "lang=\"th\"",
  "lang=\"zh-Hans\"",
  "Nation, Water, Mobility, Sea & Air",
  ".map-dashboard",
  ".map-drawer",
];

test("the map-first rule is the same fact set in English, Chinese, and Thai", async () => {
  const [en, zh, th, agents] = await Promise.all([
    read("../MAP-FIRST.md"),
    read("../MAP-FIRST.zh-CN.md"),
    read("../MAP-FIRST.th.md"),
    read("../AGENTS.md"),
  ]);

  assert.match(en, /\[简体中文\]\(MAP-FIRST\.zh-CN\.md\)/);
  assert.match(en, /\[ไทย\]\(MAP-FIRST\.th\.md\)/);
  assert.match(zh, /\[English\]\(MAP-FIRST\.md\)/);
  assert.match(zh, /\[ไทย\]\(MAP-FIRST\.th\.md\)/);
  assert.match(th, /\[English\]\(MAP-FIRST\.md\)/);
  assert.match(th, /\[简体中文\]\(MAP-FIRST\.zh-CN\.md\)/);

  for (const text of [en, zh, th]) {
    for (const fact of facts) {
      assert.ok(text.includes(fact), `missing ${fact}`);
    }
  }

  assert.match(en, /surgical table/);
  assert.match(en, /instrument tray/);
  assert.match(en, /A fluent reader has not signed them/);
  assert.match(zh, /手术台/);
  assert.match(zh, /器械盘/);
  assert.match(zh, /抽屉/);
  assert.match(zh, /流利的读者尚未签字确认这段中文/);
  assert.match(th, /โต๊ะผ่าตัด/);
  assert.match(th, /ถาดเครื่องมือ/);
  assert.match(th, /ลิ้นชัก/);
  assert.match(th, /ผู้อ่านที่คล่องภาษายังไม่ได้ลงชื่อรับรองข้อความไทยนี้/);
  assert.match(agents, /MAP-FIRST\.md/);
  assert.match(agents, /A fluent reader has not signed the Chinese or Thai/);
  assert.match(agents, /That viewport still has no visible border/);
});

test("map tokens match the bar limits and stay off the plate themes", async () => {
  const sources = await loadTokenSources();
  const document = buildTokenDocument(sources);
  const css = sources.mapCss;
  const disk = JSON.parse(await read("../tokens/palette.tokens.json"));

  assert.equal(document.map.dimension["map-bar-top-desktop"].$value, "48px");
  assert.equal(document.map.dimension["map-bar-top-mobile"].$value, "44px");
  assert.equal(document.map.dimension["map-bar-bottom"].$value, "56px");
  assert.equal(document.map.dimension["map-button-pad-block"].$value, "0px");
  assert.equal(document.map.dimension["map-button-pad-inline"].$value, "8px");
  assert.equal(document.map.dimension["map-button-border"].$value, "1px");
  assert.equal(document.map.dimension["map-target"].$value, "44px");
  assert.equal(document.map.number["map-share-mobile"].$value, "0.70");
  assert.equal(document.map.number["map-share-floor"].$value, "0.65");
  assert.equal(document.map.dimension["map-button-border"].$type, "dimension");
  assert.match(document.map.dimension["map-button-border"].$description, /colour field does not use this border/);
  assert.match(document.map.number["map-share-mobile"].$description, /Plate themes leave the map set off/);

  assert.equal(disk.map.dimension["map-bar-top-desktop"].$value, "48px");
  assert.equal(disk.$metadata.tokenSetOrder[3], "map");
  assert.equal(disk.$metadata.activeSets.includes("map"), false);
  for (const theme of disk.$themes) assert.equal(theme.selectedTokenSets.map, undefined);

  assert.match(css, /\.map-dashboard/);
  assert.match(css, /\.map-bar-top/);
  assert.match(css, /\.map-bar-bottom/);
  assert.match(css, /\.map-button/);
  assert.match(css, /\.map-stage/);
  assert.match(css, /\.map-drawer/);
  assert.match(css, /\[lang="th"\]/);
  assert.match(css, /\[lang="zh-Hans"\]/);
  assert.equal(css.includes("linear-gradient"), false);
  assert.equal(css.includes("box-shadow"), false);
  assert.equal(css.includes("border-radius: 8"), false);
  assert.match(css, /border-radius: 0/);

  const phone = 667;
  const twoBars = (phone - 44 - 56) / phone;
  assert.ok(twoBars >= 0.7, `two bars leave ${twoBars}`);
  assert.ok(twoBars >= 0.65);
});

test("the specimen keeps a working map tray and a cramped counterexample", async () => {
  const [html, css] = await Promise.all([
    read("../map-first.html"),
    read("../map-first.css"),
  ]);
  assert.match(html, /id="do"/);
  assert.match(html, /id="failure"/);
  assert.match(html, /id="alerts"/);
  assert.match(html, /id="drawer"/);
  assert.match(html, /data-region="map"/);
  assert.match(html, /aria-expanded/);
  assert.match(html, /aria-controls="drawer"/);
  assert.match(html, /lang="zh-Hans"/);
  assert.match(html, /lang="th"/);
  assert.match(html, /流利的读者尚未签字确认这段中文/);
  assert.match(html, /ผู้อ่านที่คล่องภาษายังไม่ได้ลงชื่อรับรองข้อความไทยนี้/);
  assert.match(css, /@media \(max-width: 760px\)/);

  const rows = html.match(/grid-template-rows:\s*([^;]+);/);
  assert.ok(rows, "failure rows");
  const chrome = [...rows[1].matchAll(/(\d+)px/g)].reduce((sum, match) => sum + Number(match[1]), 0);
  const cramped = (667 - chrome) / 667;
  assert.ok(cramped < 0.65, `cramped share ${cramped} from ${chrome}px of chrome`);
  assert.ok(chrome > 44 + 56, "the failure is more than the two slim bars");
});
