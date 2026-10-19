// Tests for tools/basics-lint.mjs. The browser part skips itself when Playwright's Chromium is not installed.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { contrastRatio, inPageBasics, measureInteractive, judgeBasics, imageIssues, PERF_INIT_SCRIPT, BASICS } from '../tools/basics-lint.mjs';

test('contrast ratio matches WCAG reference values', () => {
  assert.equal(+contrastRatio([0, 0, 0], [255, 255, 255]).toFixed(1), 21);
  assert.equal(+contrastRatio([255, 255, 255], [255, 255, 255]).toFixed(1), 1);
  assert.ok(contrastRatio([0x76, 0x76, 0x76], [255, 255, 255]) >= 4.5, '#767676 on white is the classic AA pass');
  assert.ok(contrastRatio([0x77, 0x77, 0x77], [255, 255, 255]) < 4.5, '#777 on white just fails AA');
});

test('every check has an id, a level and a plain description', () => {
  const ids = new Set();
  for (const b of BASICS) {
    assert.ok(/^[a-z-]+$/.test(b.id) && !ids.has(b.id), b.id); ids.add(b.id);
    assert.ok(['fail', 'warn'].includes(b.level), b.id);
    assert.ok(b.desc.length > 10, b.id);
  }
});

test('judgeBasics: clean metrics pass, each failure is named', () => {
  const clean = { htmlLang: 'en', viewportMeta: true, homeLink: true, languages: ['en', 'th', 'zh'], perf: { lcpMs: 900, cls: 0 }, interactive: { focusSampled: 5, noFocus: 0, hoverSampled: 5, noHover: 0 } };
  assert.equal(judgeBasics(clean, { ...clean, smallTargets: 0 }).verdict, 'PASS');
  const r = judgeBasics({ ...clean, htmlLang: '', imgNoAlt: 2, imgNoAltExamples: ['a.png', 'b.png'], perf: { lcpMs: 5200, cls: 0.3 } }, { smallTargets: 3, smallTargetExamples: ['Go 20×18'], perf: { lcpMs: 4600, cls: 0 } });
  assert.equal(r.verdict, 'FAIL');
  assert.deepEqual(r.fails.map(f => f.id).sort(), ['cls', 'html-lang', 'img-alt', 'lcp', 'tap-targets']);
  const w = judgeBasics({ ...clean, perf: { lcpMs: 3000, cls: 0.15 }, languages: ['en'] }, {});
  assert.equal(w.verdict, 'WARN');
  assert.deepEqual(w.warns.map(x => x.id).sort(), ['cls-some', 'en-th-zh', 'lcp-slow']);
  const oneSlow = judgeBasics({ ...clean, perf: { lcpMs: 4740, cls: 0 } }, { perf: { lcpMs: 340, cls: 0 } });
  assert.deepEqual([oneSlow.fails.length, oneSlow.warns.map(x => x.id)], [0, ['lcp-slow']], 'one slow load is a warning, not a failure');
  const onlyOne = judgeBasics({ ...clean, perf: { lcpMs: 6000, cls: 0 } }, {});
  assert.deepEqual([onlyOne.fails.length, onlyOne.warns.map(x => x.id)], [0, ['lcp-slow']], 'a single measurement can only warn');
  const broken = judgeBasics({ ...clean, interactive: { get noFocus() { throw new Error('boom'); } } }, {});
  assert.ok(broken.warns.some(x => x.id === 'check-error' && /focus-visible/.test(x.detail)), 'a broken check is reported, not passed silently');
});

test('imageIssues flags heavy, oversized and too-many-bytes images, and ignores small ones', () => {
  assert.deepEqual(imageIssues([{ url: 'https://x/a.webp', bytes: 80e3 }], [{ src: 'https://x/a.webp', natural: 800, shown: 400 }]), []);
  const issues = imageIssues([{ url: 'https://x/hero.jpg', bytes: 900e3 }, { url: 'https://x/b.png', bytes: 1.4e6 }], [{ src: 'https://x/hero.jpg', natural: 4000, shown: 400 }]);
  assert.equal(issues.length, 3);
  assert.match(issues[0], /2 image\(s\) over 300 KB, largest 1400 KB b\.png/);
});

let chromium = null;
try { ({ chromium } = await import('playwright')); } catch {}
let browser = null;
if (chromium) { try { browser = await chromium.launch({ executablePath: process.env.CHROME || undefined }); } catch { browser = null; } }

async function serve() {
  const dir = new URL('./fixtures/basics/', import.meta.url);
  const srv = http.createServer(async (req, res) => {
    const name = req.url.split('?')[0].replace(/^\//, ''); // "/", "/th/" and other paths serve good.html
    try { const body = await readFile(new URL(/^[\w-]+\.(html|svg)$/.test(name) ? name : 'good.html', dir)); res.writeHead(200, { 'content-type': name.endsWith('.svg') ? 'image/svg+xml' : 'text/html; charset=utf-8' }); res.end(body); }
    catch { res.writeHead(404); res.end(); }
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  return { srv, base: `http://127.0.0.1:${srv.address().port}/` };
}

async function run(base, file) {
  const out = {};
  for (const [vp, w, h, mobile] of [['d', 1440, 900, false], ['m', 390, 844, true]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: mobile });
    const page = await ctx.newPage(); await page.addInitScript(PERF_INIT_SCRIPT);
    await page.goto(base + file, { waitUntil: 'load' }); await page.waitForTimeout(300);
    out[vp] = await page.evaluate(`(${inPageBasics})(${contrastRatio}, ${JSON.stringify({ mobile })})`);
    if (!mobile) out[vp].interactive = await measureInteractive(page);
    await ctx.close();
  }
  return judgeBasics(out.d, out.m);
}

test('browser: a careful page passes the basics', { skip: !browser && 'Playwright Chromium not installed' }, async () => {
  const { srv, base } = await serve();
  try {
    const r = await run(base, 'good.html');
    assert.deepEqual(r.fails, [], JSON.stringify(r.fails));
    assert.deepEqual(r.warns, [], JSON.stringify(r.warns));
    assert.equal(r.verdict, 'PASS');
  } finally { srv.close(); }
});

test('browser: a project site (user.github.io/name/) links home one level down', { skip: !browser && 'Playwright Chromium not installed' }, async () => {
  const { srv, base } = await serve();
  try {
    const page = await browser.newPage();
    await page.route('**/proj/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html lang="en"><body><a href="/proj/">Name</a><a href="/proj/about.html">About</a></body></html>' }));
    await page.goto(base + 'proj/about.html');
    const d = await page.evaluate(`(${inPageBasics})(${contrastRatio}, {})`);
    assert.equal(d.homeLink, true);
    await page.close();
  } finally { srv.close(); }
});

test('browser: a careless page fails each basic it breaks', { skip: !browser && 'Playwright Chromium not installed' }, async () => {
  const { srv, base } = await serve();
  try {
    const r = await run(base, 'bad.html');
    const fails = r.fails.map(f => f.id).sort();
    for (const id of ['contrast', 'control-names', 'focus-visible', 'form-labels', 'html-lang', 'img-alt', 'tap-targets']) assert.ok(fails.includes(id), `expected ${id} in ${fails}`);
    const warns = r.warns.map(w => w.id);
    for (const id of ['zoom-blocked', 'home-link', 'en-th-zh', 'hover-states']) assert.ok(warns.includes(id), `expected warn ${id} in ${warns}`);
  } finally { srv.close(); }
});

test.after(async () => { if (browser) await browser.close(); });
