#!/usr/bin/env node
// non-slop-skip-file: this is the detector. Its thresholds are the very strings
// it hunts for, so scanning it reports the detector's own numbers.
// shipability.mjs — what the reader actually pays for on the first load.
//
// A file's size on disk is not what a reader pays. A reader pays for the bytes
// that crossed the wire before they could use the page. This measures that:
// transferred bytes per route, broken down by kind, with the heaviest resource
// named rather than guessed at.
//
// Usage: node tools/shipability.mjs <url>... [--json] [--budget=1200] [--shell=300]
// Exports: parseFontFaces, classifyScript, summarise, oversampledImages, evaluate,
//          measureRoute
//
// The pure functions are importable without a browser so they can be unit
// tested on a machine that has no Playwright installed. The browser is loaded
// lazily, for the same reason as tools/slop-lint.mjs.

import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const loadChromium = () => require('playwright').chromium;
const root = fs.realpathSync(fileURLToPath(new URL('../', import.meta.url)));

// A preview server on a free port, so `--local` measures this repository and
// nothing else. A port that was already taken belongs to some other project,
// and measuring that project under this repo's name is worse than measuring
// nothing.
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

// ---------------------------------------------------------------- font faces

// A Google Fonts stylesheet lists one @font-face per family, weight and
// unicode-range. The unicode-range is the chunking: a family is cut into
// dozens of files, and the browser downloads only the chunks whose ranges the
// visible text actually touches.
export function parseFontFaces(cssText) {
  const faces = [];
  const blocks = String(cssText || '').split('@font-face').slice(1);
  for (const block of blocks) {
    const family = (block.match(/font-family:\s*['"]([^'"]+)['"]/) || [])[1];
    const weight = (block.match(/font-weight:\s*([\d\s]+);/) || [])[1]?.trim() || '400';
    const style = (block.match(/font-style:\s*([a-z]+)/) || [])[1] || 'normal';
    const url = (block.match(/url\((https?:[^)]+)\)/) || [])[1];
    const range = (block.match(/unicode-range:\s*([^;]+);/) || [])[1]?.trim() || '';
    if (!family || !url) continue;
    faces.push({ family, weight, style, url, range });
  }
  return faces;
}

// Which script a unicode-range covers. A page that shows only English should
// not be paying for the Thai or the Chinese chunks.
//
// A range is a list of codepoint intervals, so the whole list is read and the
// script holding the most codepoints wins. Taking the first codepoint alone
// mislabelled every face: IBM Plex Sans Thai's Latin chunk starts at U+0000
// and its Thai chunk starts at U+0E01, and a family with both was reported as
// one script for both files.
export function classifyScript(unicodeRange) {
  const range = String(unicodeRange || '').trim();
  if (!range) return 'unknown';
  const intervals = [...range.matchAll(/U\+([0-9A-Fa-f]{4,6})(?:-([0-9A-Fa-f]{4,6}))?/g)]
    .map(m => [parseInt(m[1], 16), parseInt(m[2] || m[1], 16)]);
  if (!intervals.length) return 'other';
  const tally = {};
  for (const [lo, hi] of intervals) {
    const script = scriptOf(Math.floor((lo + hi) / 2));
    tally[script] = (tally[script] || 0) + (hi - lo + 1);
  }
  return Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
}

// The scripts a route actually shows on arrival. A face for a script the
// reader never sees is a charge for nothing.
//
// The kana block is checked before the Chinese one: 0x3040–0x30FF sits inside
// 0x2E80–0x9FFF, so the wider range first would call every Japanese syllable
// Chinese.
export function scriptOf(codePoint) {
  if (codePoint >= 0x0e00 && codePoint <= 0x0e7f) return 'thai';
  if (codePoint >= 0x3040 && codePoint <= 0x30ff) return 'japanese';
  if (codePoint >= 0xac00 && codePoint <= 0xd7af) return 'korean';
  if (codePoint >= 0x0590 && codePoint <= 0x05ff) return 'hebrew';
  if (codePoint >= 0x0600 && codePoint <= 0x06ff) return 'arabic';
  if (codePoint >= 0x0400 && codePoint <= 0x04ff) return 'cyrillic';
  if (codePoint >= 0x0370 && codePoint <= 0x03ff) return 'greek';
  if (codePoint >= 0x0000 && codePoint <= 0x024f) return 'latin';
  if (codePoint >= 0x2000 && codePoint <= 0x206f) return 'punctuation';
  if (codePoint >= 0x0300 && codePoint <= 0x036f) return 'latin-ext';
  if (codePoint >= 0x1e00 && codePoint <= 0x1eff) return 'latin-ext';
  if (codePoint >= 0x2e80 && codePoint <= 0x9fff) return 'chinese';
  if (codePoint >= 0xf900 && codePoint <= 0xfaff) return 'chinese';
  return 'other';
}

// ---------------------------------------------------------------- summarising

const KB = 1024;

export function summarise(resources, { firstPaintAt = null, renderedScripts = [] } = {}) {
  const byType = {};
  let total = 0;
  let beforePaint = 0;
  for (const r of resources) {
    const bytes = r.bytes || 0;
    total += bytes;
    byType[r.type] = (byType[r.type] || 0) + bytes;
    if (firstPaintAt != null && r.finishedAt != null && r.finishedAt <= firstPaintAt) beforePaint += bytes;
  }
  const heaviest = [...resources].sort((a, b) => b.bytes - a.bytes).slice(0, 8);
  const fonts = resources
    .filter(r => r.kind === 'font')
    .map(r => ({ ...r, family: r.family || 'unknown', script: r.script || 'unknown' }));
  const fontBytes = fonts.reduce((sum, f) => sum + f.bytes, 0);
  const scripts = {};
  for (const f of fonts) scripts[f.script] = (scripts[f.script] || 0) + f.bytes;
  const shown = new Set(renderedScripts);
  return {
    total,
    totalKB: +(total / KB).toFixed(1),
    byType,
    beforePaint,
    beforePaintKB: +(beforePaint / KB).toFixed(1),
    renderedScripts,
    fonts: {
      count: fonts.length,
      bytes: fontBytes,
      kb: +(fontBytes / KB).toFixed(1),
      scripts,
      families: [...new Set(fonts.map(f => f.family))],
      // A face for a script the route never shows is a charge for nothing.
      unwanted: fonts.filter(f => !shown.has(f.script) && f.script !== 'unknown')
        .map(f => ({ family: f.family, script: f.script, bytes: f.bytes, kb: +(f.bytes / KB).toFixed(1) })),
      heaviest: fonts.sort((a, b) => b.bytes - a.bytes).slice(0, 5)
    },
    heaviest: heaviest.map(r => ({ url: r.url, type: r.type, bytes: r.bytes, kb: +(r.bytes / KB).toFixed(1) })),
    resources: resources.map(r => ({ url: r.url, type: r.type, bytes: r.bytes, kind: r.kind || 'other' }))
  };
}

// A picture painted into a box much smaller than the file is bytes no screen
// can use. Returns the offenders with the factor they waste.
export function oversampledImages(images, devicePixelRatio = 1) {
  const out = [];
  for (const img of images || []) {
    const box = Math.max(0, (img.renderedWidth || 0) * (devicePixelRatio || 1));
    if (!box || !img.naturalWidth) continue;
    const factor = img.naturalWidth / box;
    if (factor >= 3) {
      out.push({ ...img, factor: +factor.toFixed(2), wasteBytes: Math.round(img.naturalWidth * (img.naturalHeight || 0) * (1 - 1 / (factor * factor))) });
    }
  }
  return out.sort((a, b) => b.factor - a.factor);
}

// ---------------------------------------------------------------- verdict

// Budgets are explicit and every one of them is checked against a measurement.
//
// The numbers come from this repository's own routes, measured 23 Oct 2026 on
// the live site: the plate view transfers 98 kB and the reading room 114 kB
// after the Chinese face was subsetted. The budgets sit above those with
// room to grow and far below the defect they exist to catch — the reading
// room was 600 kB with 518 kB of webfont before the fix.
export const DEFAULT_BUDGETS = {
  routeKB: 400,     // transferred bytes on the first load of one route
  shellKB: 250,     // bytes that had to arrive before the page was usable
  fontKB: 250,      // webfont bytes on one route
  oversampleFactor: 3
};

export function evaluate(report, budgets = DEFAULT_BUDGETS) {
  const findings = [];
  const b = { ...DEFAULT_BUDGETS, ...budgets };
  if (report.totalKB > b.routeKB) {
    findings.push({
      rule: 'route-bytes',
      severity: 'fail',
      why: `${report.totalKB} kB on the first load, over the ${b.routeKB} kB route budget. The heaviest single resource is ${report.heaviest[0]?.url || 'unknown'} at ${report.heaviest[0]?.kb || 0} kB.`
    });
  }
  if (report.beforePaintKB > b.shellKB) {
    findings.push({
      rule: 'shell-bytes',
      severity: 'fail',
      why: `${report.beforePaintKB} kB had to arrive before the first paint, over the ${b.shellKB} kB shell budget.`
    });
  }
  if (report.fonts.kb > b.fontKB) {
    findings.push({
      rule: 'font-bytes',
      severity: 'fail',
      why: `${report.fonts.kb} kB of webfont on one route, over the ${b.fontKB} kB font budget. Families: ${report.fonts.families.join(', ')}.`
    });
  }
  for (const img of report.oversampled || []) {
    findings.push({
      rule: 'oversampled-image',
      severity: 'fail',
      why: `${img.url} is ${img.naturalWidth}px wide painted into ${img.renderedWidth}px — ${img.factor}× more than the box can use.`
    });
  }
  for (const face of report.fonts.unwanted || []) {
    findings.push({
      rule: 'font-for-unseen-script',
      severity: 'fail',
      why: `${face.family} (${face.script}) was downloaded but this route shows no ${face.script} text on arrival: ${face.kb} kB for a face nobody can read yet.`
    });
  }
  return {
    verdict: findings.length ? 'FAIL' : 'OK',
    findings,
    budgets: b
  };
}

// ---------------------------------------------------------------- measuring

// Measure one route on a cold cache. Every response is recorded with the
// number of bytes that crossed the wire, not the number on disk.
//
// The bytes come from the Resource Timing API, which reports `transferSize`:
// the body plus its headers, after compression, as sent. Falling back to the
// decoded body length overstates the cost by the compression ratio — a 63 kB
// stylesheet was measured as 231 kB the first time this was run, because the
// response carried no content-length and the decoded fallback was used. The
// reader pays 63 kB. Only the wire counts.
export async function measureRoute(browser, url, { viewport = { width: 1440, height: 900 }, settleMs = 4000, deviceScaleFactor = 1 } = {}) {
  const context = await browser.newContext({ viewport, deviceScaleFactor, locale: 'th-TH', timezoneId: 'Asia/Bangkok' });
  const page = await context.newPage();
  const seen = new Map();
  const fontCss = new Map();

  page.on('response', async (response) => {
    try {
      const request = response.request();
      const type = request.resourceType();
      const headers = response.headers();
      const record = {
        url: response.url(),
        type,
        kind: type === 'font' ? 'font' : type === 'image' ? 'image' : type === 'fetch' || type === 'xhr' ? 'data' : 'other',
        contentLength: Number(headers['content-length'] || 0),
        encoding: headers['content-encoding'] || '',
        status: response.status()
      };
      if (type === 'stylesheet' && /fonts\.googleapis\.com/.test(response.url())) {
        try { fontCss.set(response.url(), await response.text()); } catch { /* the css is counted as a stylesheet either way */ }
      }
      seen.set(response.url(), record);
    } catch { /* a response that vanished mid-flight costs the reader nothing */ }
  });

  let timing = null;
  let images = [];
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForLoadState('networkidle', { timeout: settleMs + 4000 }).catch(() => {});
    await page.waitForTimeout(settleMs / 2);
    timing = await page.evaluate(() => {
      const paint = performance.getEntriesByType('paint').find(e => e.name === 'first-contentful-paint');
      const nav = performance.getEntriesByType('navigation')[0];
      // Which scripts the route actually shows on arrival. A collapsed
      // disclosure and a closed dialog do not count: their text is not
      // rendered, so the reader is not shown it yet.
      const scriptOf = (code) => {
        if (code >= 0x0e00 && code <= 0x0e7f) return 'thai';
        if (code >= 0x3040 && code <= 0x30ff) return 'japanese';
        if (code >= 0xac00 && code <= 0xd7af) return 'korean';
        if (code >= 0x0590 && code <= 0x05ff) return 'hebrew';
        if (code >= 0x0600 && code <= 0x06ff) return 'arabic';
        if (code >= 0x0400 && code <= 0x04ff) return 'cyrillic';
        if (code >= 0x0370 && code <= 0x03ff) return 'greek';
        if (code >= 0x0000 && code <= 0x024f) return 'latin';
        if (code >= 0x2000 && code <= 0x206f) return 'punctuation';
        if (code >= 0x0300 && code <= 0x036f) return 'latin-ext';
        if (code >= 0x1e00 && code <= 0x1eff) return 'latin-ext';
        if (code >= 0x2e80 && code <= 0x9fff) return 'chinese';
        if (code >= 0xf900 && code <= 0xfaff) return 'chinese';
        return 'other';
      };
      const scripts = new Set();
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        const text = node.nodeValue || '';
        if (!text) continue;
        const parent = node.parentElement;
        if (!parent) continue;
        const style = getComputedStyle(parent);
        if (style.display === 'none' || style.visibility === 'hidden') continue;
        const visible = parent.checkVisibility
          ? parent.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })
          : parent.getClientRects().length > 0;
        if (!visible) continue;
        for (const ch of text) {
          scripts.add(scriptOf(ch.codePointAt(0)));
        }
      }
      return {
        fcp: paint ? paint.startTime : null,
        renderedScripts: [...scripts],
        resources: performance.getEntriesByType('resource').map(e => ({
          url: e.name,
          transferSize: e.transferSize,
          encodedBodySize: e.encodedBodySize,
          decodedBodySize: e.decodedBodySize,
          responseEnd: e.responseEnd,
          initiatorType: e.initiatorType
        })),
        navigation: nav ? {
          url: nav.name,
          transferSize: nav.transferSize,
          encodedBodySize: nav.encodedBodySize,
          decodedBodySize: nav.decodedBodySize,
          responseEnd: nav.responseEnd
        } : null
      };
    });
    images = await page.evaluate(() => [...document.images].map(img => ({
      url: img.currentSrc || img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      renderedWidth: Math.round(img.getBoundingClientRect().width)
    })));
  } finally {
    await context.close();
  }

  // Bytes for every resource the browser actually fetched.
  const resources = [];
  const used = new Set();
  const addResource = (url, type, kind, transferSize, encodedBodySize, decodedBodySize, responseEnd) => {
    const bytes = transferSize || encodedBodySize || 0;
    resources.push({
      url,
      type,
      kind,
      bytes,
      decodedBytes: decodedBodySize || 0,
      finishedAt: responseEnd == null ? null : Math.round(responseEnd)
    });
    used.add(url);
  };

  if (timing?.navigation) {
    addResource(timing.navigation.url, 'document', 'other', timing.navigation.transferSize, timing.navigation.encodedBodySize, timing.navigation.decodedBodySize, timing.navigation.responseEnd);
  }
  for (const entry of timing?.resources || []) {
    const meta = seen.get(entry.url);
    addResource(
      entry.url,
      meta?.type || entry.initiatorType,
      meta?.kind || (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest' ? 'data' : 'other'),
      entry.transferSize,
      entry.encodedBodySize,
      entry.decodedBodySize,
      entry.responseEnd
    );
  }
  // Anything the network saw but the timing API did not report still cost bytes.
  for (const [url, meta] of seen) {
    if (used.has(url)) continue;
    addResource(url, meta.type, meta.kind, meta.contentLength, meta.contentLength, 0, null);
  }

  // Map every font file back to the family that asked for it.
  const faces = [];
  for (const css of fontCss.values()) faces.push(...parseFontFaces(css));
  const faceByUrl = new Map(faces.map(f => [f.url, f]));
  for (const r of resources) {
    if (r.kind !== 'font') continue;
    const face = faceByUrl.get(r.url);
    r.family = face?.family || 'unknown';
    r.script = face ? classifyScript(face.range) : 'unknown';
    r.weight = face?.weight || '';
  }

  const report = summarise(resources, {
    firstPaintAt: timing?.fcp == null ? null : Math.round(timing.fcp),
    renderedScripts: timing?.renderedScripts || []
  });
  report.oversampled = oversampledImages(images, deviceScaleFactor);
  report.url = url;
  report.firstPaintMs = timing?.fcp == null ? null : Math.round(timing.fcp);
  report.decodedTotal = resources.reduce((sum, r) => sum + (r.decodedBytes || 0), 0);
  report.decodedTotalKB = +(report.decodedTotal / KB).toFixed(1);
  return report;
}

// ---------------------------------------------------------------- CLI

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const local = args.includes('--local');
  const budgetArg = args.find(a => a.startsWith('--budget='));
  const shellArg = args.find(a => a.startsWith('--shell='));
  const fontArg = args.find(a => a.startsWith('--font='));
  const budgets = {
    ...DEFAULT_BUDGETS,
    ...(budgetArg ? { routeKB: Number(budgetArg.split('=')[1]) } : {}),
    ...(shellArg ? { shellKB: Number(shellArg.split('=')[1]) } : {}),
    ...(fontArg ? { fontKB: Number(fontArg.split('=')[1]) } : {})
  };
  let urls = args.filter(a => !a.startsWith('--'));
  let server = null;
  let port = null;
  if (local) {
    if (!urls.length) urls = ['index.html', 'reading.html'];
    port = await freePort();
    server = spawn('node', [path.join(root, 'scripts/serve.mjs')], { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
    try { await waitForServer(port); } catch (e) {
      server.kill();
      console.error(`the preview server did not start: ${e.message}`);
      process.exit(2);
    }
    urls = urls.map(u => `http://127.0.0.1:${port}/${u.replace(/^\//, '')}`);
  }
  if (!urls.length) {
    console.error('usage: node tools/shipability.mjs <url>... | --local [--json] [--budget=kb] [--shell=kb] [--font=kb]');
    process.exit(2);
  }
  let chromium;
  try { chromium = await loadChromium(); }
  catch {
    console.error('playwright is not installed — nothing was measured. npm i -D playwright && npx playwright install chromium');
    process.exit(2);
  }
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const reports = [];
  try {
    for (const url of urls) reports.push(await measureRoute(browser, url));
  } finally {
    await browser.close();
    if (server) server.kill();
  }
  if (json) {
    console.log(JSON.stringify(reports.map(r => ({ ...r, evaluation: evaluate(r, budgets) })), null, 2));
    process.exit(0);
  }
  let failed = false;
  for (const r of reports) {
    const verdict = evaluate(r, budgets);
    console.log(`\nshipability ${r.url}`);
    console.log(`  first load ${r.totalKB} kB transferred · first paint ${r.firstPaintMs == null ? 'n/a' : r.firstPaintMs + ' ms'} · before paint ${r.beforePaintKB} kB`);
    const types = Object.entries(r.byType).sort((a, b) => b[1] - a[1]);
    for (const [type, bytes] of types) console.log(`    ${type.padEnd(11)} ${(bytes / KB).toFixed(1).padStart(8)} kB`);
    console.log(`    fonts       ${r.fonts.kb} kB in ${r.fonts.count} file(s): ${r.fonts.families.join(', ') || 'none'}`);
    console.log(`    scripts     the route shows ${r.renderedScripts.join(', ') || 'nothing'} on arrival`);
    const scripts = Object.entries(r.fonts.scripts || {});
    if (scripts.length) console.log(`    font scripts ${scripts.map(([s, b]) => `${s} ${(b / KB).toFixed(1)} kB`).join(' · ')}`);
    if (r.heaviest[0]) console.log(`    heaviest    ${r.heaviest[0].url} — ${r.heaviest[0].kb} kB`);
    for (const f of verdict.findings) console.log(`  FAIL ${f.rule}: ${f.why}`);
    console.log(`  — ${verdict.verdict} (budgets: route ${budgets.routeKB} kB, shell ${budgets.shellKB} kB, fonts ${budgets.fontKB} kB)`);
    if (verdict.verdict !== 'OK') failed = true;
  }
  console.log('\nA file size on disk is not what a reader pays. Only the bytes that crossed the wire count.');
  process.exit(failed ? 1 : 0);
}
