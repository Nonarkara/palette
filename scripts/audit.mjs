#!/usr/bin/env node
// audit.mjs — one command, every instrument, one honest report.
//
// The repo has four instruments and no single command:
//   1. non-slop scan    static source rules          (no browser needed)
//   2. slop-lint        rendered screen rules        (browser)
//   3. spatial-audit    six layout failure modes     (browser)
//   4. brief-lint       design brief rules           (no browser needed)
//
// This runs all four against a real local preview and prints one report.
//
// Two rules this script keeps:
//   - Nothing is skipped silently. If an instrument cannot run, it is reported
//     as NOT RUN and the exit code says so. A green audit that quietly checked
//     nothing is worse than a red one.
//   - A documented false positive is a liability, not a pardon. The rendered
//     hits and spatial modes recorded in STYLE.md are read back as allowlists:
//     anything NOT recorded there fails the audit. If STYLE.md rots, the audit
//     goes red.
//
// Exit: 0 all passed · 1 something failed · 2 something could not run.

import { spawn, execFileSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fs.realpathSync(fileURLToPath(new URL('../', import.meta.url)));
const PAGES = [
  { name: 'plate view', file: 'index.html' },
  { name: 'reading room', file: 'reading.html' },
];

const results = [];
function record(name, status, summary, detail = []) {
  results.push({ name, status, summary, detail });
  const tag = { PASS: 'PASS  ', FAIL: 'FAIL  ', WARN: 'WARN  ', 'NOT RUN': 'NOTRUN' }[status] || status;
  console.log(`\n[${tag}] ${name}\n         ${summary}`);
  for (const d of detail) console.log(`         ${d}`);
}

// ---------------------------------------------------------------- preview server
function freePort() {
  return new Promise((resolve, reject) => {
    const s = http.createServer();
    s.listen(0, '127.0.0.1', () => {
      const p = s.address().port;
      s.close(() => resolve(p));
    });
    s.on('error', reject);
  });
}
function waitForServer(port, tries = 60) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      const req = http.get({ host: '127.0.0.1', port, path: '/index.html' }, res => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', c => { body += c; if (body.length > 40000) req.destroy(); });
        res.on('end', () => {
          // Identity check. A port that was already taken belongs to some other
          // project, and measuring that project under this repo's name is worse
          // than not measuring at all. The palette view must name itself.
          if (!/Palette/i.test(body)) {
            return reject(new Error(`something else is answering on port ${port} — refusing to audit the wrong site`));
          }
          resolve();
        });
      });
      req.on('error', () => (n <= 0 ? reject(new Error('preview server did not start')) : setTimeout(() => attempt(n - 1), 120)));
      req.setTimeout(2500, () => { req.destroy(); });
    };
    attempt(tries);
  });
}

// ---------------------------------------------------------------- STYLE.md known results
// The sections below are prose for a person and data for this script.
function styleSection(heading) {
  const style = fs.readFileSync(path.join(root, 'STYLE.md'), 'utf8');
  const i = style.indexOf(heading);
  if (i < 0) return '';
  const rest = style.slice(i + heading.length);
  const j = rest.search(/^## /m);
  return j < 0 ? rest : rest.slice(0, j);
}
function backticked(section) {
  const ids = new Set();
  for (const m of section.matchAll(/`([^`]+)`/g)) ids.add(m[1]);
  return ids;
}
/** Rule ids recorded in STYLE.md → Allow. */
function allowedRuleIds() {
  const section = styleSection('## Allow');
  const ids = backticked(section);
  // The Allow section names its rules in plain text — "rule default-font in
  // reading.css" — so read those too.
  for (const m of section.matchAll(/\brule\s+([a-z][a-z0-9-]*)\b/gi)) ids.add(m[1]);
  return ids;
}
/** Rendered-check hits recorded in STYLE.md, and which of them are still open. */
function renderedKnown() {
  const ids = new Set(), open = new Set();
  const section = styleSection('## Known results of the rendered check');
  for (const line of section.split('\n')) {
    if (!/^\s*\|/.test(line)) continue;
    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length < 3) continue;
    if (!/^\d+$/.test(cells[1])) continue;          // header and rule rows, not findings
    const id = cells[0].replace(/`/g, '');
    if (!id || !/^[a-z][a-z0-9-]*$/i.test(id)) continue;
    ids.add(id);
    if (/open question|not dismissed|raise with the owner/i.test(line)) open.add(id);
  }
  return { ids, open };
}
/** Spatial mode ids recorded in STYLE.md. */
function spatialKnown() {
  return backticked(styleSection('## Known results of the spatial audit'));
}

// ---------------------------------------------------------------- instruments
async function runStaticScan() {
  let raw;
  try {
    raw = execFileSync('node', [path.join(root, '.non-slop/bin/non-slop.mjs'), 'scan', root, '--json'], { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  } catch (e) {
    raw = e.stdout || '';
    if (!raw) { record('non-slop scan (static)', 'FAIL', `the scanner did not run: ${String(e.message).split('\n')[0]}`); return; }
  }
  let res;
  try { res = JSON.parse(raw); } catch {
    record('non-slop scan (static)', 'FAIL', 'the scanner did not return JSON');
    return;
  }
  const s = res.summary || {};
  const detail = [];
  if (res.note) detail.push(`note: ${res.note}`);
  detail.push(`${res.filesScanned} file(s) scanned · ${s.points} point(s) · ${s.allowed} allowed · ${s.review} review · ${s.askOwner || 0} to ask the owner`);
  const failing = (res.findings || []).filter(f => f.status === 'FAIL');
  for (const f of failing.slice(0, 10)) detail.push(`P${f.sev} ${f.id} ${f.rel || ''}:${f.line || ''} ${f.title || ''}`);
  if (failing.length > 10) detail.push(`… and ${failing.length - 10} more`);
  record('non-slop scan (static)', s.verdict === 'OK' ? 'PASS' : 'FAIL',
    `verdict ${s.verdict} · ${s.p0 || 0} P0 · ${s.p1 || 0} P1 · ${s.p2 || 0} P2`, detail);
}

async function runBriefLint() {
  const docsDir = path.join(root, 'docs');
  const targets = fs.existsSync(docsDir) ? [docsDir] : [];
  if (!targets.length) {
    record('brief-lint (design briefs)', 'WARN', 'no briefs found — nothing was checked', ['point it at a file: node tools/brief-lint.mjs <path>']);
    return;
  }
  const { lintPaths } = await import(path.join(root, 'tools/brief-lint.mjs'));
  const res = lintPaths(targets);
  const detail = [`${res.filesScanned} brief(s) scanned · ${res.anchoredVagueWords} anchored vague word(s) accepted`];
  for (const f of res.findings.slice(0, 10)) detail.push(`${f.sev} ${f.rule} ${path.relative(root, f.file)}:${f.line} — ${f.why}`);
  if (res.findings.length > 10) detail.push(`… and ${res.findings.length - 10} more`);
  for (const s of res.skipped) detail.push(`not scanned: ${path.relative(root, s.path)} (${s.why})`);
  record('brief-lint (design briefs)', res.findings.length ? 'FAIL' : 'PASS',
    res.findings.length ? `${res.findings.length} finding(s)` : 'no vague directive without an anchor', detail);
}

async function runRendered(port) {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    record('slop-lint (rendered)', 'NOT RUN', 'playwright is not installed — no screen was measured', ['npm i -D playwright && npx playwright install chromium']);
    record('spatial-audit (layout geometry)', 'NOT RUN', 'playwright is not installed — no geometry was measured', ['npm i -D playwright && npx playwright install chromium']);
    return;
  }
  const { lintUrl, RULES } = await import(path.join(root, 'tools/slop-lint.mjs'));
  const { auditUrl } = await import(path.join(root, 'tools/spatial-audit.mjs'));
  const knownSlop = new Set([...allowedRuleIds(), ...renderedKnown().ids]);
  const openSlop = renderedKnown().open;
  const knownSpatial = spatialKnown();
  const weightOf = Object.fromEntries(RULES.map(r => [r.id, r.w]));

  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  try {
    const slopDetail = [], spatialDetail = [];
    let slopFail = 0, spatialFail = 0;
    for (const p of PAGES) {
      const url = `http://127.0.0.1:${port}/${p.file}`;
      const lint = await lintUrl(browser, url, { saveShots: false });
      if (!lint.lint) {
        slopDetail.push(`${p.name}: not measured (${lint.status || 'error'}) ${lint.desktopError || lint.mobileError || ''}`);
        slopFail++;
        continue;
      }
      const hits = lint.lint.hits || [];
      const undocumented = hits.filter(h => !knownSlop.has(h));
      // A rule with weight 0 is reported only. It cannot make a page fail, so it
      // must not make the audit fail either — but it is listed, because a
      // reported-only rule nobody wrote down is still a decision nobody made.
      const counted = undocumented.filter(h => (weightOf[h] ?? 0) > 0);
      const reportedOnly = undocumented.filter(h => (weightOf[h] ?? 0) === 0);
      const mobile = lint.mobile || {};
      slopDetail.push(`${p.name}: ${lint.lint.verdict} · ${lint.lint.points} point(s) · hits: ${hits.join(', ') || 'none'}`);
      slopDetail.push(`  mobile: ${mobile.smallTextShare != null ? mobile.smallTextShare + ' of text under 12px' : 'n/a'} · ${mobile.narrowStrips || 0} narrow column(s) beside a wider one · ${mobile.trioRowsWide || 0} three-up row(s)`);
      if (counted.length) {
        slopFail++;
        slopDetail.push(`  NOT IN STYLE.md: ${counted.join(', ')} — record the reason or fix it`);
      } else if (reportedOnly.length) {
        slopDetail.push(`  reported only, not recorded in STYLE.md: ${reportedOnly.join(', ')} — write down the reason or accept it as a known result`);
      }
      const openHere = hits.filter(h => openSlop.has(h));
      if (openHere.length) slopDetail.push(`  still open, awaiting the owner: ${openHere.join(', ')}`);
      if (hits.length && !counted.length && !reportedOnly.length) {
        slopDetail.push(`  all ${hits.length} hit(s) are recorded in STYLE.md`);
      }
    }
    record('slop-lint (rendered)', slopFail ? 'FAIL' : 'PASS',
      slopFail ? `${slopFail} page(s) with an undocumented hit` : 'every hit is recorded in STYLE.md', slopDetail);

    for (const p of PAGES) {
      const url = `http://127.0.0.1:${port}/${p.file}`;
      const a = await auditUrl(browser, url, { settleMs: 2500 });
      if (a.error) { spatialDetail.push(`${p.name}: ${a.error}`); spatialFail++; continue; }
      const flagged = a.summary.modes.filter(m => m.count);
      const undocumented = flagged.filter(m => !knownSpatial.has(m.id));
      spatialDetail.push(`${p.name}: ${a.summary.flagged} of 6 modes flagged${flagged.length ? ' — ' + flagged.map(m => m.mode).join(', ') : ''}`);
      for (const m of flagged) {
        const kinds = (m.examples || []).map(e => e.kind).filter(Boolean);
        spatialDetail.push(`  ${m.id} ×${m.count} — ${m.ask}${kinds.length ? ` (${[...new Set(kinds)].join(', ')})` : ''}`);
      }
      if (undocumented.length) {
        spatialFail++;
        spatialDetail.push(`  NOT IN STYLE.md: ${undocumented.map(m => m.id).join(', ')} — record the reason or fix it`);
      }
    }
    record('spatial-audit (layout geometry)', spatialFail ? 'FAIL' : 'PASS',
      spatialFail ? `${spatialFail} page(s) with an undocumented mode` : 'no undocumented layout mode', spatialDetail);
  } finally {
    await browser.close();
  }
}

// ---------------------------------------------------------------- main
async function main() {
  console.log('Palette audit — every instrument, one report.');
  console.log('A documented false positive is a liability: STYLE.md is read back as the allowlist.');

  await runStaticScan();
  await runBriefLint();

  const port = await freePort();
  const server = spawn('node', [path.join(root, 'scripts/serve.mjs')], { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
  try {
    await waitForServer(port);
    await runRendered(port);
  } catch (e) {
    record('rendered checks', 'NOT RUN', `the preview server did not start: ${e.message}`);
  } finally {
    server.kill();
  }

  const failed = results.filter(r => r.status === 'FAIL');
  const notRun = results.filter(r => r.status === 'NOT RUN');
  const warned = results.filter(r => r.status === 'WARN');
  console.log('\n' + '─'.repeat(60));
  for (const r of results) console.log(`${r.status.padEnd(8)} ${r.name}`);
  if (notRun.length) console.log(`\n${notRun.length} instrument(s) did NOT run. A green line that checked nothing is not a pass.`);
  if (warned.length) console.log(`${warned.length} instrument(s) had nothing to check.`);
  if (failed.length) { console.log(`\n${failed.length} instrument(s) failed.`); process.exit(1); }
  if (notRun.length) process.exit(2);
  console.log('\nAll instruments ran and passed. Now look at the screens yourself, and have a different agent or person review. Never self-review.');
  process.exit(0);
}

main();
