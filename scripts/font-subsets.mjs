// non-slop-skip-file: this is a generator. Its placeholder text and the URLs it
// builds are the very strings it hunts for, so scanning it reports the
// generator's own patterns.
// scripts/font-subsets.mjs — subset the Chinese face to the characters the
// repository actually sets.
//
// The problem this solves, measured 23 Oct 2026: the reading room's first load
// transferred 600 kB, and 518 kB of it was webfont. Noto Sans SC alone cost
// 433 kB across eight subset files of 45–74 kB each, because Google's
// stylesheet cuts a Chinese face into 202 unicode-range chunks and the eight
// characters of a visible chapter label ("中文 — 设计方法") fall in three
// different chunks. The reader paid 170 kB for eight glyphs.
//
// The fix is to ask for a subset of exactly the characters the page sets.
// Google's css2 endpoint takes a `text=` parameter and returns one file
// containing only those glyphs. Eight characters cost 7.7 kB instead of 170 kB.
//
// The split into eager and deferred matters as much as the subsetting. Chrome
// does not download a face for text it is not rendering, so a face whose
// unicode-range covers only the characters inside a collapsed <details> or a
// closed <dialog> is fetched when the reader opens it, not when they arrive.
// Measured: a page whose visible label is Chinese and whose collapsed body is
// English downloaded 194 kB; the same page with the Chinese in the collapsed
// body downloaded 24 kB.
//
// This script measures which characters are rendered on arrival and which are
// not, asks Google for two subsets, and writes the stylesheet that loads them.
//
// Usage: node scripts/font-subsets.mjs [--check] [--base=http://127.0.0.1:PORT]
// Writes: assets/fonts-index.css, assets/fonts-reading.css, data/font-subsets.json

import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const loadChromium = () => require('playwright').chromium;

const root = fs.realpathSync(fileURLToPath(new URL('../', import.meta.url)));
const FAMILY = 'Noto Sans SC';
const GOOGLE = 'https://fonts.googleapis.com/css2';
// Google refuses a very long text= parameter. Past this the script fails loudly
// rather than silently shipping a URL that 400s.
const MAX_URL = 7000;

const PAGES = [
  { file: 'index.html', css: 'assets/fonts-index.css' },
  { file: 'reading.html', css: 'assets/fonts-reading.css' }
];

// ── the in-page measurement ────────────────────────────────────────────────
// Which characters are on the screen, and which are waiting behind a
// collapsed disclosure or a closed dialog.
const IN_PAGE = () => {
  const HAN = /[㐀-䶿一-鿿豈-﫿]/;
  const eager = new Map();
  const deferred = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const text = node.nodeValue || '';
    if (!HAN.test(text)) continue;
    const parent = node.parentElement;
    if (!parent) continue;
    const style = getComputedStyle(parent);
    // A collapsed <details> body and a closed <dialog> are not rendered, but
    // their text is real and will show when the reader opens them, so it
    // belongs in the deferred set. Nothing is skipped: a character that is
    // hidden is deferred, never dropped.
    //
    // checkVisibility() is the probe. getClientRects() cannot be used: a
    // closed details body still has layout boxes — one client rect and a
    // 96-pixel height — so it reads as visible. Chrome puts
    // `content-visibility: hidden` on the closed details slot, and
    // checkVisibility() sees it. The reading room hides a closed disclosure's
    // body with `display: none`, which checkVisibility() also sees.
    //
    // Text that is rendered, even far below the fold, is eager: the browser
    // lays it out now and fetches its face now.
    const rendered = parent.checkVisibility
      ? parent.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })
      : (style.display !== 'none' && style.visibility !== 'hidden' && parent.getClientRects().length > 0);
    const computed = parseInt(style.fontWeight, 10) || 400;
    // Google offers 400 and 600. CSS font matching sends 500 to 400 and 700 to
    // 600, so those are the two faces this repository can ever need.
    const weight = computed >= 600 ? 600 : 400;
    const bucket = rendered ? eager : deferred;
    for (const ch of text) {
      if (!HAN.test(ch)) continue;
      const seen = bucket.get(ch);
      if (seen === undefined || weight > seen) bucket.set(ch, weight);
    }
  }
  return {
    eager: [...eager].map(([ch, weight]) => ({ ch, weight })),
    deferred: [...deferred].map(([ch, weight]) => ({ ch, weight }))
  };
};

// ── building the request ───────────────────────────────────────────────────
export function googleUrl(chars, weights) {
  const text = chars.map(c => c.ch).join('');
  const wght = [...new Set(weights)].sort().join(';');
  const url = `${GOOGLE}?family=${FAMILY.replace(/ /g, '+')}:wght@${wght}&text=${encodeURIComponent(text)}&display=swap`;
  if (url.length > MAX_URL) {
    throw new Error(`the subset request for ${chars.length} character(s) is ${url.length} characters long, over the ${MAX_URL} limit. Split the page's Chinese into more than one subset, or cut the text.`);
  }
  return url;
}

export function stylesheet(families) {
  const lines = [
    '/* Generated by scripts/font-subsets.mjs — do not edit by hand.',
    '   Run `npm run build` after changing any Chinese text in the repository.',
    '',
    '   Noto Sans SC, subset to the characters these pages actually set. The',
    '   eager subset covers the text a reader sees on arrival. The deferred',
    '   subset covers text behind a collapsed disclosure or a closed dialog,',
    '   and the browser fetches that file only when the text is revealed.',
    '   The typeface is unchanged: a subset carries the same outlines for the',
    '   same glyphs, and nothing else. */'
  ];
  for (const family of families) {
    lines.push(`/* ${family.note} */`);
    lines.push(`@import url("${family.url}");`);
  }
  return lines.join('\n') + '\n';
}

// ── measuring ──────────────────────────────────────────────────────────────
async function measurePage(browser, url) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(600);
    return await page.evaluate(IN_PAGE);
  } finally {
    await context.close();
  }
}

// ── preview server ─────────────────────────────────────────────────────────
function freePort() {
  return new Promise((resolve, reject) => {
    const s = http.createServer();
    s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => resolve(p)); });
    s.on('error', reject);
  });
}

function waitForServer(port) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      const req = http.get({ host: '127.0.0.1', port, path: '/index.html' }, res => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', c => { body += c; if (body.length > 40000) req.destroy(); });
        res.on('end', () => {
          if (!/Palette/i.test(body)) return reject(new Error(`something else is answering on port ${port}`));
          resolve();
        });
      });
      req.on('error', () => (n <= 0 ? reject(new Error('preview server did not start')) : setTimeout(() => attempt(n - 1), 120)));
      req.setTimeout(2500, () => req.destroy());
    };
    attempt(60);
  });
}

// ── main ───────────────────────────────────────────────────────────────────
async function collect(base) {
  let chromium;
  try { chromium = await loadChromium(); }
  catch {
    console.error('playwright is not installed, so no page could be measured. npm i -D playwright && npx playwright install chromium');
    process.exit(2);
  }
  const browser = await chromium.launch();
  const pages = {};
  try {
    for (const p of PAGES) {
      pages[p.file] = await measurePage(browser, `${base}/${p.file}`);
    }
  } finally {
    await browser.close();
  }
  return pages;
}

function build(pages) {
  const manifest = { family: FAMILY, generated: '2026-10-23', pages: {} };
  const files = [];
  for (const p of PAGES) {
    const measured = pages[p.file];
    // The two sets must not overlap. A character that is visible in one place
    // and collapsed in another belongs to the eager set only: if the deferred
    // face also claimed it, the browser would match the visible text against
    // the larger face and download the large file. Measured: with the overlap
    // left in, the reading room fetched the 74 kB deferred file for eight
    // visible characters.
    const eagerSet = new Set(measured.eager.map(c => c.ch));
    const deferred = measured.deferred.filter(c => !eagerSet.has(c.ch));
    const eagerWeights = measured.eager.map(c => c.weight);
    const deferredWeights = deferred.map(c => c.weight);
    const families = [];
    if (measured.eager.length) {
      families.push({ note: `eager — ${measured.eager.length} character(s) rendered on arrival`, url: googleUrl(measured.eager, eagerWeights) });
    }
    if (deferred.length) {
      families.push({ note: `deferred — ${deferred.length} character(s) behind a collapsed disclosure or a closed dialog`, url: googleUrl(deferred, deferredWeights) });
    }
    manifest.pages[p.file] = {
      eager: { characters: measured.eager.length, weights: [...new Set(eagerWeights)].sort(), text: measured.eager.map(c => c.ch).join('') },
      deferred: { characters: deferred.length, weights: [...new Set(deferredWeights)].sort(), text: deferred.map(c => c.ch).join('') }
    };
    files.push({ path: path.join(root, p.css), content: stylesheet(families) });
  }
  return { manifest, files };
}

function manifestJson(manifest) {
  return JSON.stringify(manifest, null, 2) + '\n';
}

async function main() {
  const check = process.argv.includes('--check');
  const baseArg = process.argv.find(a => a.startsWith('--base='));
  let server = null;
  let base = baseArg ? baseArg.slice(7).replace(/\/$/, '') : null;
  if (!base) {
    const port = await freePort();
    server = spawn('node', [path.join(root, 'scripts/serve.mjs')], { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
    try { await waitForServer(port); } catch (e) {
      server.kill();
      console.error(`the preview server did not start: ${e.message}`);
      process.exit(2);
    }
    base = `http://127.0.0.1:${port}`;
  }
  let pages;
  try {
    pages = await collect(base);
  } finally {
    if (server) server.kill();
  }
  const { manifest, files } = build(pages);
  const manifestPath = path.join(root, 'data/font-subsets.json');
  const outputs = [...files, { path: manifestPath, content: manifestJson(manifest) }];

  if (check) {
    const stale = [];
    for (const out of outputs) {
      const current = await fsp.readFile(out.path, 'utf8').catch(() => '');
      if (current !== out.content) stale.push(path.relative(root, out.path));
    }
    if (stale.length) {
      console.error(`the font subsets are stale: ${stale.join(', ')}. Run npm run build.`);
      process.exit(1);
    }
    console.log('the Chinese face is subset to the characters the pages set. Nothing to do.');
    return;
  }

  for (const out of outputs) {
    await fsp.mkdir(path.dirname(out.path), { recursive: true });
    await fsp.writeFile(out.path, out.content);
    console.log(`wrote ${path.relative(root, out.path)}`);
  }
  for (const p of PAGES) {
    const m = manifest.pages[p.file];
    console.log(`  ${p.file}: ${m.eager.characters} eager character(s) [${m.eager.weights.join(', ') || '—'}], ${m.deferred.characters} deferred [${m.deferred.weights.join(', ') || '—'}]`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await main();
}
