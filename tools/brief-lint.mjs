#!/usr/bin/env node
// non-slop-skip-file: this is the detector. Its word list is the very set of words
// it hunts for, so scanning it reports the detector's own patterns.
// brief-lint.mjs — check a design brief before an agent builds from it.
//
// The gap this fills: Non-Slop scans css, html and script. It does not scan
// Markdown, so a brief written in Markdown — the exact "make it more premium"
// failure — is never checked by anything in this repo.
//
// The rule it enforces: a vague directive must carry an anchor. A number with
// a unit, a named material, a named reference, a file, or a real quote. Without
// one, the instruction names a quality but no subject, and no agent can meet it.
//
// It never rewrites. It quotes the sentence, says what is missing, and asks the
// smallest question that would name the real thing. It never invents a number.
//
// Usage: node tools/brief-lint.mjs <path...> [--json] [--all] [--quiet]
// Exports: findAnchors, vagueHit, lintBrief, lintFile, lintPaths

import fs from 'node:fs';
import path from 'node:path';

export const MAX_BYTES = 4_000_000;

// Words that name a quality and nothing else. Each one is a legitimate word;
// each one is also a thing an agent will happily improvise on.
export const VAGUE_WORDS = [
  'premium', 'modern', 'sleek', 'elegant', 'minimal', 'minimalist', 'beautiful',
  'gorgeous', 'stunning', 'polished', 'professional', 'dynamic', 'engaging',
  'delightful', 'sophisticated', 'luxurious', 'luxury', 'high-end', 'classy',
  'timeless', 'contemporary', 'cutting-edge', 'world-class', 'next-level',
  'seamless', 'intuitive', 'user-friendly', 'innovative', 'perfect', 'ideal',
  'refined', 'impressive', 'outstanding', 'remarkable', 'exceptional',
  'aesthetic', 'visually appealing', 'easy to use', 'top-notch', 'top notch',
  'state-of-the-art', 'bespoke', 'tailored', 'clean', 'simple', 'nice', 'better',
  'best', 'great', 'quality', 'look and feel', 'look & feel', 'vibe', 'feel',
];

// A comparative adjective is a request for a sensation, not a specification.
export const COMPARATIVE = /\b(?:more|less|most|least|very|really|quite|extra|way)\s+(?:\w+\s+){0,2}?(premium|modern|sleek|elegant|minimal|minimalist|beautiful|polished|professional|dynamic|delightful|sophisticated|luxurious|luxury|classy|timeless|contemporary|seamless|intuitive|innovative|clean|simple|nice|better|great)\b/i;

// Common capitalised words that open a sentence and carry no reference.
const STOP_CAPS = new Set(('The A An This That These Those It Its In On At To For And Or But So Then There Here What Why How Where Which Who Whom Whose When If Use Using Make Making Keep Keeping Every Never Always Read Write Build Add Remove Let Put Set Give Take It\'s They Them Their Theirs Our Ours Your Yours My Mine We Us I He She His Her You This\'s Not No Yes All Any Some Most Many Much More Less Same Different New Old Good Better Best Great Bad Small Large Big Tiny Huge High Low Left Right Top Bottom First Second Third Last Next Another Each Both Few Several Other Another One Two Three Four Five Six Seven Eight Nine Ten').split(' '));

// The anchors. A vague word next to one of these has something to point at.
export const ANCHORS = [
  { id: 'number', re: /\d/, desc: 'a number' },
  { id: 'unit', re: /\b\d+(?:\.\d+)?\s?(?:ch|rem|px|em|vh|vw|vmin|vmax|%|ms|s|kg|px)\b/i, desc: 'a number with a unit' },
  { id: 'url', re: /https?:\/\/\S/i, desc: 'a link' },
  { id: 'file', re: /\b[\w.-]+\.(?:md|mdx|css|scss|html?|js|mjs|cjs|ts|tsx|jsx|json|ya?ml|svg|png|jpe?g|webp|avif|woff2?)\b/i, desc: 'a file' },
  { id: 'code', re: /`[^`]+`/, desc: 'a code span' },
  { id: 'quote', re: /["“][^"”]{3,}["”]/, desc: 'a quotation' },
  { id: 'caps', re: /\b[A-Z]{2,}\b/, desc: 'an acronym' },
  { id: 'proper', re: null, desc: 'a named thing' },
];

// A capitalised word that is not the first word of the line and not a common
// capitalised word: the cheapest honest test for "a name is mentioned".
function properNoun(line) {
  const words = line.replace(/^[^\w]*/, '').split(/[\s—–|,;:.()\[\]"'`]+/);
  for (let i = 1; i < words.length; i++) {
    const w = words[i].replace(/[^\w'-]/g, '');
    if (!w || w.length < 3) continue;
    if (!/^[A-Z]/.test(w)) continue;
    if (STOP_CAPS.has(w) || STOP_CAPS.has(w.toUpperCase())) continue;
    if (/^(?:the|and|but|for|with|from|that|this|these|those|when|then|than|your|their|our|its|you|not|all|any|one|two|use|make|keep|every|never|always|read|write|each|both|only|also|more|less|most|first|last|next|new|old|good|best|great|small|large|big|tiny|high|low|left|right|top|bottom)$/i.test(w)) continue;
    return w;
  }
  return null;
}

/** Which anchors a line carries. Returns [{id, desc, found}]. */
export function findAnchors(line) {
  const out = [];
  for (const a of ANCHORS) {
    if (a.id === 'proper') {
      const p = properNoun(line);
      if (p) out.push({ id: 'proper', desc: 'a named thing', found: p });
    } else if (a.re.test(line)) {
      out.push({ id: a.id, desc: a.desc, found: true });
    }
  }
  return out;
}

// Fenced code blocks and inline code are examples, not instructions.
function stripCode(text) {
  const lines = text.split(/\r?\n/);
  let inFence = false;
  return lines.map((raw, i) => {
    if (/^\s*(```|~~~)/.test(raw)) { inFence = !inFence; return { i, raw: '', fence: true }; }
    if (inFence) return { i, raw: '', fence: true };
    return { i, raw, fence: false };
  });
}

const VAGUE_RE = new RegExp(`\\b(?:${VAGUE_WORDS.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');

/** The vague word on a line, if any. */
export function vagueHit(line) {
  const m = VAGUE_RE.exec(line);
  if (!m) return null;
  return { word: m[0], index: m.index };
}

/** The placeholder and copy rules. */
export const COPY_RULES = [
  { id: 'placeholder-brief', sev: 'P1', re: /\b(lorem ipsum|dolor sit amet|your (?:company|product|brand|app) name(?: here)?|company name here|placeholder text|insert (?:copy|text|image) here|\[insert[^\]]*\]|tbd\b|xxx+\b|foo bar\b|sample text|replace me)\b/i, why: 'placeholder copy left in the brief', fix: 'Replace it with the real content, or delete the line. A brief full of placeholders produces a product full of placeholders.' },
  { id: 'unsourced-stat', sev: 'P1', needsSource: true, re: /\b(?:trusted by|serving|used by|join(?:ed)? by)\s+[\d,.]+\s*[+kmb]?\s*(?:teams?|users?|customers?|companies|developers|orgs?)\b|\b\d[\d,.]*\s*\+?\s*(?:teams?|users?|customers?|companies|developers|downloads?|installs?|templates?|components?|integrations?|tools?|apps?)\b|\b\d{1,3}\.\d\s*%\s*(?:uptime|availability)\b|\b[45](?:\.\d)?\s*\/\s*5\b/i, why: 'a round number with no source', fix: 'Give the number, its date and where it came from — or leave it out. Never let the brief promise a figure you cannot produce.' },
  { id: 'generic-cta', sev: 'P2', re: /(?<![\w-])(?:get started|learn more|click here|read more|sign up|subscribe|submit|contact us|book a demo|try it free)(?![\w-])/i, why: 'a button label that says no object', fix: 'Verb plus object: "Check my street", "Download the CSV", "Compare plate 286".' },
];

// A number is sourced if the line can point at where it came from.
export const SOURCE_ANCHORS = [
  { id: 'url', re: /https?:\/\/\S/i, desc: 'a link' },
  { id: 'file', re: /\b[\w.-]+\.(?:md|mdx|css|scss|html?|js|mjs|cjs|ts|tsx|jsx|json|ya?ml|svg|png|jpe?g|webp|avif|woff2?)\b/i, desc: 'a file' },
  { id: 'code', re: /`[^`]+`/, desc: 'a code span' },
  { id: 'quote', re: /["“][^"”]{3,}["”]/, desc: 'a quotation' },
  { id: 'date', re: /\b(?:19|20)\d{2}\b/, desc: 'a date' },
];

/** Does this line point at where a number came from? */
export function findSources(line) {
  const out = [];
  for (const a of SOURCE_ANCHORS) if (a.re.test(line)) out.push({ id: a.id, desc: a.desc });
  const p = properNoun(line);
  if (p) out.push({ id: 'proper', desc: 'a named thing', found: p });
  return out;
}

/**
 * Lint one brief. Returns { file, findings, anchored }.
 * `anchored` counts vague words that did carry an anchor — reported so the
 * reader knows the tool looked at them and decided they were fine.
 */
export function lintBrief(text, file = '<text>') {
  const findings = [];
  let anchored = 0;
  const rows = stripCode(text);
  for (const { i, raw } of rows) {
    const line = raw.replace(/<!--[\s\S]*?-->/g, '').trim();
    if (!line) continue;
    if (/^\|?[\s|:-]*\|?$/.test(line)) continue;            // table rules
    const body = line.replace(/`[^`]*`/g, ' ').replace(/https?:\/\/\S+/g, ' ');
    const anchors = findAnchors(body);
    const hit = vagueHit(body);
    const comparative = COMPARATIVE.test(body);
    if (hit && anchors.length === 0) {
      findings.push({
        file, line: i + 1, rule: comparative ? 'vague-comparative' : 'vague-directive',
        sev: comparative ? 'P1' : 'P2', column: hit.index + 1, word: hit.word,
        quote: line.length > 160 ? line.slice(0, 157) + '…' : line,
        why: comparative
          ? `asks for a feeling ("${hit.word}") instead of a specification`
          : `names a quality ("${hit.word}") with no subject, number, material or reference`,
        fix: 'Anchor it on this line: a number with its unit, a named material, a named reference, a file, or a real quotation. Do not rewrite it automatically, and do not invent a number.',
      });
    } else if (hit) {
      anchored++;
    }
    for (const r of COPY_RULES) {
      const m = body.match(r.re);
      if (!m) continue;
      // A number is only a defect when the line cannot say where it came from.
      if (r.needsSource && findSources(body).length) continue;
      findings.push({
        file, line: i + 1, rule: r.id, sev: r.sev, column: (m.index || 0) + 1, word: m[0],
        quote: line.length > 160 ? line.slice(0, 157) + '…' : line,
        why: r.why, fix: r.fix,
      });
    }
  }
  return { file, findings, anchored };
}

/** Lint one file on disk. Reports honestly when it cannot read it. */
export function lintFile(p) {
  let st;
  try { st = fs.statSync(p); } catch { return { file: p, findings: [], anchored: 0, skipped: 'missing' }; }
  if (!st.isFile()) return { file: p, findings: [], anchored: 0, skipped: 'not a file' };
  if (st.size > MAX_BYTES) return { file: p, findings: [], anchored: 0, skipped: `over ${MAX_BYTES} bytes` };
  let text;
  try { text = fs.readFileSync(p, 'utf8'); } catch { return { file: p, findings: [], anchored: 0, skipped: 'unreadable' }; }
  if (text.includes(String.fromCharCode(0))) return { file: p, findings: [], anchored: 0, skipped: 'binary' };
  return lintBrief(text, p);
}

const BRIEF_EXT = new Set(['.md', '.mdx', '.markdown', '.txt']);

/** Lint a list of files and directories. */
export function lintPaths(paths, { all = false } = {}) {
  const files = [];
  const skipped = [];
  const walk = (p) => {
    let st;
    try { st = fs.statSync(p); } catch { skipped.push({ path: p, why: 'missing' }); return; }
    if (st.isDirectory()) {
      if (/(^|\/)(node_modules|\.git|dist|build|out|coverage|vendor|\.next)$/.test(p)) { skipped.push({ path: p, why: 'build or vendor directory' }); return; }
      for (const e of fs.readdirSync(p)) walk(path.join(p, e));
      return;
    }
    const ext = path.extname(p).toLowerCase();
    if (!BRIEF_EXT.has(ext)) { skipped.push({ path: p, why: `not a brief file (${ext || 'no extension'})` }); return; }
    if (!all && /(^|\/)(ANTI-SLOP|ANTI-SPATIAL-HALLUCINATION|FIGMA-PRINCIPLES|STYLE|REMEDIES|README|CHANGELOG|CONTRIBUTING|LICENSE|THIRD_PARTY_NOTICES)\.md$/i.test(p)) {
      skipped.push({ path: p, why: 'doctrine or reference file, not a brief' });
      return;
    }
    files.push(p);
  };
  for (const p of paths) walk(p);
  const results = files.map(lintFile);
  const findings = results.flatMap(r => r.findings);
  return {
    filesScanned: files.length,
    anchoredVagueWords: results.reduce((a, r) => a + (r.anchored || 0), 0),
    findings,
    skipped,
  };
}

// ---------------------------------------------------------------- CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = process.argv.slice(2);
  const json = argv.includes('--json');
  const quiet = argv.includes('--quiet');
  const all = argv.includes('--all');
  const targets = argv.filter(a => !a.startsWith('--'));
  if (!targets.length) {
    console.error('usage: node tools/brief-lint.mjs <path...> [--json] [--all] [--quiet]');
    console.error('  --all   also scan doctrine and reference files (off by default: prose is not a brief)');
    process.exit(2);
  }
  const res = lintPaths(targets, { all });
  if (json) {
    console.log(JSON.stringify(res, null, 2));
  } else {
    console.log(`brief-lint: ${res.filesScanned} file(s) scanned, ${res.anchoredVagueWords} anchored vague word(s) accepted, ${res.findings.length} finding(s)`);
    for (const f of res.findings) {
      console.log(`\n  ${f.sev} ${f.rule}  ${f.file}:${f.line}:${f.column}`);
      console.log(`    "${f.quote}"`);
      console.log(`    why: ${f.why}`);
      console.log(`    do:  ${f.fix}`);
    }
    if (res.skipped.length) {
      console.log('\nnot scanned:');
      for (const s of res.skipped) console.log(`  ${s.path} (${s.why})`);
    }
  }
  process.exit(res.findings.length ? 1 : 0);
}
