#!/usr/bin/env node
// non-slop-skip-file: this is the detector. Its thresholds are the very strings
// it hunts for, so scanning it reports the detector's own numbers.
// golden-section.mjs — does the proportion actually appear, and does anything
// land on it?
//
// The repository claims a golden section. This measures three separate claims,
// because they can each be true while the others are false:
//
//   1. The construction is exact.  The golden rectangle really is φ:1, the
//      squares really tile it, every arc's radius really is its square's side,
//      and consecutive arcs really meet at the same point. This is geometry,
//      and it needs no browser.
//   2. The interface lands on it.  The 0.618 cut the diagram draws is the
//      colour field's own boundary; the Research head's two columns divide at
//      φ; the stylesheet uses the proportion in the rules it says it does.
//   3. The bench fits the field.  Every style in the playground, in every face,
//      lands inside the colour it is printed on. A proportion that clips its
//      own sample is decoration.
//
// Every number this tool prints is measured. Nothing is taken from a comment.
//
// Usage: node tools/golden-section.mjs [--local] [--json] [--url=…]
// Exports: constructionReport, evaluateConstruction, proportionRules,
//          countRelationships, measureAlignment, evaluateAlignment

import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const loadChromium = () => require('playwright').chromium;
const root = fs.realpathSync(fileURLToPath(new URL('../', import.meta.url)));

export const PHI = (1 + Math.sqrt(5)) / 2;

/** How far a measurement may be from the truth before it is a finding. */
export const TOLERANCE = {
  // The construction is drawn in floating point, so it is compared at 1e-9.
  geometry: 1e-9,
  // A pixel of the diagram against a pixel of the field.
  pixel: 1,
  // The proportion of two measured columns.
  ratio: 0.01
};

// ─────────────────────────────────────────────────────────── the construction

/**
 * Measure the golden construction for a box, using the same API the page
 * draws with. `golden` is the exported API from palette-tools.js.
 *
 * Nothing here is asserted — every value is derived from the geometry.
 */
export function constructionReport(golden, width, height) {
  const rect = golden.rectangle(width, height);
  const squares = golden.squares(rect);
  const arcs = golden.arcs(squares);

  // φ² = φ + 1, to the last bit the machine can hold.
  const phiExactness = Math.abs(PHI * PHI - PHI - 1);

  // The rectangle is golden: whichever way round it is, the long side over the
  // short side is φ.
  const ratio = rect.width >= rect.height ? rect.width / rect.height : rect.height / rect.width;
  const ratioError = Math.abs(ratio - PHI);

  // The squares tile the rectangle: their areas add up to the whole. The peel
  // stops when the remainder is under half a pixel, so a sliver at the centre
  // of the spiral is left uncovered — that is the construction, not an error.
  const squaredArea = squares.reduce((sum, square) => sum + square.side * square.side, 0);
  const areaShare = squaredArea / (rect.width * rect.height);

  // Every arc's radius is the side of the square it is drawn in.
  let radiusError = 0;
  // Every arc's start and end are on that circle.
  let cornerError = 0;
  arcs.forEach((arc, index) => {
    radiusError = Math.max(radiusError, Math.abs(arc.radius - squares[index].side));
    const toStart = Math.hypot(arc.start[0] - arc.centre[0], arc.start[1] - arc.centre[1]);
    const toEnd = Math.hypot(arc.end[0] - arc.centre[0], arc.end[1] - arc.centre[1]);
    cornerError = Math.max(cornerError, Math.abs(toStart - arc.radius), Math.abs(toEnd - arc.radius));
  });

  // Consecutive arcs meet: the end of one is the start of the next.
  let chainError = 0;
  for (let i = 1; i < arcs.length; i += 1) {
    chainError = Math.max(chainError,
      Math.abs(arcs[i - 1].end[0] - arcs[i].start[0]),
      Math.abs(arcs[i - 1].end[1] - arcs[i].start[1]));
  }

  // Every square lies inside the rectangle. This is the overshoot, not the
  // slack: a square that pokes out is the failure, and the slack is not.
  let outsideError = 0;
  for (const square of squares) {
    const over = Math.max(
      rect.x - square.x,
      rect.y - square.y,
      (square.x + square.side) - (rect.x + rect.width),
      (square.y + square.side) - (rect.y + rect.height)
    );
    outsideError = Math.max(outsideError, over);
  }

  return {
    width, height, rect, squares, arcs,
    counts: { squares: squares.length, arcs: arcs.length },
    phiExactness,
    ratio, ratioError,
    areaShare, areaError: Math.abs(1 - areaShare),
    radiusError, cornerError, chainError, outsideError
  };
}

/** Turn a construction report into findings. */
export function evaluateConstruction(report) {
  const findings = [];
  const t = TOLERANCE.geometry;
  const push = (rule, why) => findings.push({ rule, why });

  if (report.phiExactness > t) push('phi-exact', `φ² − φ − 1 is ${report.phiExactness.toExponential(2)}, not 0`);
  if (report.ratioError > t) push('golden-rectangle', `the rectangle is ${report.ratio.toFixed(12)}, not φ = ${PHI.toFixed(12)}`);
  // The peel leaves a sliver under half a pixel wide at the centre of the
  // spiral. Anything more than a hundredth of a percent is a real gap.
  if (report.areaError > 1e-4) push('squares-tile', `the squares cover ${(report.areaShare * 100).toFixed(6)}% of the rectangle, not 100%`);
  if (report.radiusError > t) push('arc-radius', `an arc's radius differs from its square's side by ${report.radiusError.toExponential(2)}`);
  if (report.cornerError > t) push('arc-on-circle', `an arc's endpoint is ${report.cornerError.toExponential(2)} off its own circle`);
  if (report.chainError > t) push('arc-chain', `consecutive arcs miss each other by ${report.chainError.toExponential(2)}`);
  if (report.outsideError > t) push('square-inside', `a square leaves the rectangle by ${report.outsideError.toExponential(2)}`);

  return { verdict: findings.length ? 'FAIL' : 'OK', findings };
}

// ───────────────────────────────────────────────────── the stylesheet's rules

/**
 * Count the rules in a stylesheet that divide at the golden proportion.
 *
 * A rule counts when its grid-template-columns names both 1.618fr and 1fr —
 * the house proportion — in the same declaration.
 *
 * This walks the braces rather than matching them with a regular expression.
 * A stylesheet nests: a rule inside a media query has its own braces, and a
 * regex that assumes one rule per pair of braces silently misses half of
 * them. It did — it found three rules where there are six.
 */
export function proportionRules(cssText) {
  const source = cssText.replace(/\/\*[\s\S]*?\*\//g, ' ');
  const rules = [];
  const stack = [];
  let selectorStart = 0;
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (char === '{') {
      stack.push({ selector: source.slice(selectorStart, i).trim().replace(/\s+/g, ' '), bodyStart: i + 1, depth: stack.length });
      selectorStart = i + 1;
      continue;
    }
    if (char !== '}') continue;
    const frame = stack.pop();
    selectorStart = i + 1;
    if (!frame) continue;
    const body = source.slice(frame.bodyStart, i);
    if (frame.selector.startsWith('@')) continue;
    const columns = body.match(/grid-template-columns\s*:\s*([^;]+);/);
    if (!columns) continue;
    const value = columns[1];
    // `\b1fr\b` will not match inside "1.618fr" — there is no "1fr" in it —
    // and it does match "minmax(0, 1fr)", where the unit is followed by a
    // bracket. A test that only looked for a space after the unit found three
    // rules where the stylesheet has six.
    if (!/\b1\.618fr\b/.test(value)) continue;
    if (!/\b1fr\b/.test(value)) continue;
    rules.push({ selector: frame.selector, value: value.trim(), depth: frame.depth });
  }
  return rules;
}

/** How many distinct rules use the proportion, however many times each is declared. */
export function distinctRules(rules) {
  return new Set(rules.map((rule) => rule.selector)).size;
}

/**
 * Count the relationships in the colour data by how many colours they hold.
 * Read from data/colors.json, never from a comment about it.
 */
export function countRelationships(colors) {
  const map = new Map();
  for (const color of colors) {
    for (const id of color.combinations) {
      if (!map.has(id)) map.set(id, []);
      map.get(id).push(color);
    }
  }
  const byCount = {};
  for (const [, list] of map) byCount[list.length] = (byCount[list.length] || 0) + 1;
  return { total: map.size, byCount, twoColour: byCount[2] || 0 };
}

// ──────────────────────────────────────────────────────── the rendered screen

/**
 * Measure where things land on a rendered page.
 *
 * Every number here is read from the browser: the field boundary from the
 * painted fields, the cut from the drawn line, the columns from the laid-out
 * boxes.
 */
export async function measureAlignment(browser, url, { settleMs = 1200, plateId = '001' } = {}) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    // The plate is named in the address. Without a hash the search dialog
    // opens on arrival and swallows the keypresses — and the plate that is
    // measured has to be a two-colour one, because the claims the screen makes
    // are about two-colour relationships.
    const target = url.includes('#') ? url : `${url}#plate-${plateId}`;
    await page.goto(target, { waitUntil: 'networkidle' });
    await page.waitForTimeout(settleMs);

    // The plate view, with the diagram on.
    await page.keyboard.press('p');
    await page.waitForTimeout(400);

    const plate = await page.evaluate(() => {
      const fields = document.querySelector('#fields');
      const first = fields && fields.firstElementChild;
      const fieldWidth = first ? first.getBoundingClientRect().width : 0;
      // The field area is the box the diagram describes, not the whole stage:
      // the rail covers the right of the stage, and the field stops short of it.
      const fieldBox = fields ? fields.getBoundingClientRect() : null;

      const svg = document.querySelector('#golden-overlay-stage');
      const layer = svg && svg.querySelector('.golden-ink-dark');
      const frame = layer && layer.querySelector('rect');
      const cuts = layer ? [...layer.querySelectorAll('line.golden-cut')] : [];
      const verticals = cuts
        .filter((line) => line.getAttribute('x1') === line.getAttribute('x2'))
        .map((line) => Number(line.getAttribute('x1')))
        .sort((a, b) => a - b);

      return {
        stageWidth: Math.round(fieldBox ? fieldBox.width : 0),
        fieldCount: fields ? fields.children.length : 0,
        fieldBoundary: Math.round(fieldWidth),
        overlayWidth: Math.round(svg ? svg.getBoundingClientRect().width : 0),
        frameWidth: frame ? Number(frame.getAttribute('width')) : null,
        frameHeight: frame ? Number(frame.getAttribute('height')) : null,
        verticalCuts: verticals
      };
    });

    // The Research screen: the demo stage, the head, and the bench.
    await page.keyboard.press('a');
    await page.waitForSelector('#about-dialog[open]');
    await page.waitForTimeout(700);

    const demo = await page.evaluate(() => {
      const stage = document.querySelector('#golden-stage');
      const box = stage.getBoundingClientRect();
      const svg = document.querySelector('#golden-overlay-demo');
      const layer = svg && svg.querySelector('.golden-ink-dark');
      const frame = layer && layer.querySelector('rect');
      const fields = document.querySelector('#golden-fields');
      const first = fields && fields.firstElementChild;
      const cuts = layer ? [...layer.querySelectorAll('line.golden-cut')] : [];
      const verticals = cuts
        .filter((line) => line.getAttribute('x1') === line.getAttribute('x2'))
        .map((line) => Number(line.getAttribute('x1')))
        .sort((a, b) => a - b);
      return {
        stageWidth: Math.round(box.width),
        stageHeight: Math.round(box.height),
        stageRatio: box.width / box.height,
        fieldBoundary: first ? Math.round(first.getBoundingClientRect().width) : 0,
        frameWidth: frame ? Number(frame.getAttribute('width')) : null,
        frameHeight: frame ? Number(frame.getAttribute('height')) : null,
        verticalCuts: verticals
      };
    });

    const head = await page.evaluate(() => {
      const head = document.querySelector('.research-head');
      if (!head) return null;
      const wide = head.querySelector('h2');
      const narrow = head.querySelector('p:not(.research-kicker)');
      if (!wide || !narrow) return null;
      const w = wide.getBoundingClientRect().width;
      const n = narrow.getBoundingClientRect().width;
      return { wide: Math.round(w), narrow: Math.round(n), ratio: w / n };
    });

    // The claims the screen makes about itself.
    const claims = await page.evaluate(() => {
      const read = (id) => {
        const node = document.getElementById(id);
        if (!node) return null;
        return {
          count: node.dataset.count ? Number(node.dataset.count) : null,
          of: node.dataset.of ? Number(node.dataset.of) : null,
          pixels: node.dataset.pixels ? Number(node.dataset.pixels) : null,
          text: node.textContent.trim()
        };
      };
      return {
        twoColour: read('golden-two-colour'),
        fieldShare: read('golden-field-share'),
        ruleCount: read('golden-rule-count')
      };
    });

    // The bench: every style, every face, does the sample stay in the field?
    const bench = await page.evaluate(async () => {
      const stage = document.querySelector('#pg-stage');
      const copy = document.querySelector('#pg-copy');
      const head = document.querySelector('#pg-headline');
      if (!stage || !copy || !head) return { cases: [], note: 'the bench is not in the document' };

      const click = async (selector, label) => {
        const button = [...document.querySelectorAll(selector)]
          .find((node) => node.textContent.trim() === label);
        if (!button) return false;
        button.click();
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        return true;
      };

      const measure = () => {
        const stageBox = stage.getBoundingClientRect();
        const copyBox = copy.getBoundingClientRect();
        const padding = parseFloat(getComputedStyle(copy).paddingTop) || 0;
        const first = copy.firstElementChild.getBoundingClientRect();
        return {
          overflow: Math.round((copyBox.top + padding - first.top) * 100) / 100,
          headlinePx: Math.round(parseFloat(getComputedStyle(head).fontSize) * 100) / 100,
          fit: Number(stage.dataset.fit || '1')
        };
      };

      const cases = [];
      const styles = [...document.querySelectorAll('#pg-styles button')].map((b) => b.textContent.trim());
      const fonts = [...document.querySelectorAll('#pg-fonts button')].map((b) => b.textContent.trim());
      for (const style of styles) {
        if (!(await click('#pg-styles button', style))) continue;
        cases.push({ kind: 'style', name: style, ...measure() });
      }
      for (const font of fonts) {
        if (!(await click('#pg-fonts button', font))) continue;
        cases.push({ kind: 'font', name: font, ...measure() });
      }
      return { cases, note: null };
    });

    return { plate, demo, head, claims, bench };
  } finally {
    await page.close();
  }
}

/** Turn a measurement into findings. */
export function evaluateAlignment(measurement) {
  const findings = [];
  const push = (rule, why) => findings.push({ rule, why });
  const { plate, demo, head, claims, bench } = measurement;

  // The diagram's 0.618 cut is the field's own boundary.
  if (plate.fieldCount !== 2) {
    push('plate-is-two-colour', `the measured plate has ${plate.fieldCount} fields; the claims are about a two-colour relationship`);
  }
  if (plate.verticalCuts.length === 2) {
    const cut = plate.verticalCuts[1];
    const delta = Math.abs(cut - plate.fieldBoundary);
    if (delta > TOLERANCE.pixel) {
      push('cut-on-boundary', `the diagram's 0.618 cut is at ${cut}px and the field ends at ${plate.fieldBoundary}px — ${delta}px apart`);
    }
  } else {
    push('cut-on-boundary', `the diagram drew ${plate.verticalCuts.length} vertical cut line(s), expected 2`);
  }

  // The rectangle the diagram draws is the width of the field it describes.
  if (plate.frameWidth !== null && Math.abs(plate.frameWidth - plate.stageWidth) > TOLERANCE.pixel) {
    push('rectangle-full-width', `the plate's golden rectangle is ${plate.frameWidth}px wide and the stage is ${plate.stageWidth}px`);
  }

  // The demo stage is a golden rectangle, so the diagram's 0.618 division is
  // the demo field's boundary too.
  if (demo.frameWidth !== null && Math.abs(demo.frameWidth - demo.stageWidth) > TOLERANCE.pixel) {
    push('demo-rectangle-full-width', `the demo's golden rectangle is ${demo.frameWidth}px wide and the stage is ${demo.stageWidth}px — its 0.618 division cannot land on the field boundary`);
  }
  if (demo.verticalCuts.length === 2) {
    const delta = Math.abs(demo.verticalCuts[1] - demo.fieldBoundary);
    if (delta > TOLERANCE.pixel) {
      push('demo-cut-on-boundary', `the demo's 0.618 cut is at ${demo.verticalCuts[1]}px and the demo field ends at ${demo.fieldBoundary}px — ${delta}px apart`);
    }
  }

  // The Research head divides at the proportion it claims to.
  if (!head) {
    push('head-proportion', 'the Research head was not found on the screen');
  } else if (Math.abs(head.ratio - PHI) > TOLERANCE.ratio) {
    push('head-proportion', `the head's two columns divide at ${head.ratio.toFixed(4)}, not φ = ${PHI.toFixed(4)}`);
  }

  // The claims the screen prints are true.
  if (claims.twoColour && claims.twoColour.count !== null) {
    const data = JSON.parse(fs.readFileSync(path.join(root, 'data/colors.json'), 'utf8'));
    const counted = countRelationships(data);
    if (claims.twoColour.count !== counted.twoColour) {
      push('claim-two-colour', `the screen says ${claims.twoColour.count} two-colour relationships and the data holds ${counted.twoColour}`);
    }
    if (claims.twoColour.of !== null && claims.twoColour.of !== counted.total) {
      push('claim-total', `the screen says ${claims.twoColour.of} relationships and the data holds ${counted.total}`);
    }
  }
  if (claims.fieldShare && claims.fieldShare.pixels !== null) {
    const delta = Math.abs(claims.fieldShare.pixels - plate.fieldBoundary);
    if (delta > TOLERANCE.pixel) {
      push('claim-field-pixels', `the screen says the field ends at ${claims.fieldShare.pixels}px and it ends at ${plate.fieldBoundary}px`);
    }
  }
  if (claims.ruleCount && claims.ruleCount.count !== null) {
    const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
    const counted = proportionRules(css);
    const rules = distinctRules(counted);
    if (claims.ruleCount.count !== rules) {
      push('claim-rule-count', `the screen says the proportion is used in ${claims.ruleCount.count} rule(s) and the stylesheet uses it in ${rules}`);
    }
  }

  // The bench never clips the sample it is showing.
  if (bench.note) {
    push('bench-present', bench.note);
  } else {
    for (const testCase of bench.cases) {
      if (testCase.overflow > TOLERANCE.pixel) {
        push('bench-fits', `the ${testCase.kind} "${testCase.name}" pushes ${testCase.overflow}px past the top of the field`);
      }
      if (testCase.headlinePx < 20) {
        push('bench-readable', `the ${testCase.kind} "${testCase.name}" sets its display at ${testCase.headlinePx}px, below the 20px floor`);
      }
    }
  }

  return { verdict: findings.length ? 'FAIL' : 'OK', findings };
}

// ──────────────────────────────────────────────────────────── preview server

function freePort() {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
}

function waitForServer(port) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      const request = http.get({ host: '127.0.0.1', port, path: '/index.html' }, (response) => {
        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => { body += chunk; if (body.length > 40000) request.destroy(); });
        response.on('end', () => {
          if (!/Palette/i.test(body)) return reject(new Error(`something else is answering on port ${port} — refusing to measure the wrong site`));
          resolve();
        });
      });
      request.on('error', (error) => {
        if (n <= 0) return reject(new Error('preview server did not start'));
        setTimeout(() => attempt(n - 1), 120);
      });
      request.setTimeout(2500, () => request.destroy());
    };
    attempt(60);
  });
}

// ────────────────────────────────────────────────────────────────────── CLI

async function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes('--json');
  const local = args.includes('--local');
  const urlArg = args.find((a) => a.startsWith('--url='));
  const { golden } = require(path.join(root, "palette-tools.js"));

  const construction = constructionReport(golden, 1440, 900);
  const constructionVerdict = evaluateConstruction(construction);
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  const rules = proportionRules(css);
  const data = JSON.parse(fs.readFileSync(path.join(root, 'data/colors.json'), 'utf8'));
  const relationships = countRelationships(data);

  let alignment = null;
  let alignmentVerdict = { verdict: 'NOT RUN', findings: [] };
  let server = null;
  let port = null;

  try {
    let chromium;
    try {
      ({ chromium } = require('playwright'));
    } catch {
      console.log('playwright is not installed — the interface was not measured.');
      console.log('npm i -D playwright && npx playwright install chromium');
      if (asJson) {
        console.log(JSON.stringify({ construction, constructionVerdict, rules, relationships, alignment: null, alignmentVerdict }, null, 2));
      }
      process.exit(2);
    }

    let target = urlArg ? urlArg.slice('--url='.length) : null;
    if (!target && local) {
      port = await freePort();
      server = spawn('node', [path.join(root, 'scripts/serve.mjs')], {
        cwd: root, env: { ...process.env, PORT: String(port) }, stdio: 'ignore'
      });
      await waitForServer(port);
      target = `http://127.0.0.1:${port}/index.html`;
    }
    if (!target) {
      console.log('Pass --local to measure this repository, or --url=<address> to measure a live one.');
      process.exit(2);
    }

    const browser = await chromium.launch();
    try {
      alignment = await measureAlignment(browser, target);
      alignmentVerdict = evaluateAlignment(alignment);
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.log(`The interface could not be measured: ${error.message}`);
    alignmentVerdict = { verdict: 'NOT RUN', findings: [] };
  } finally {
    if (server) server.kill();
  }

  if (asJson) {
    console.log(JSON.stringify({ construction, constructionVerdict, rules, relationships, alignment, alignmentVerdict }, null, 2));
    process.exit(constructionVerdict.verdict === 'OK' && alignmentVerdict.verdict === 'OK' ? 0 : 1);
  }

  console.log('\nThe golden section — what is drawn, and what lands on it.\n');
  console.log(`  the rectangle       ${construction.rect.width.toFixed(3)} × ${construction.rect.height.toFixed(3)} (ratio ${construction.ratio.toFixed(12)})`);
  console.log(`  the squares         ${construction.counts.squares} covering ${(construction.areaShare * 100).toFixed(6)}% of it`);
  console.log(`  the arcs            ${construction.counts.arcs}, every radius equal to its square's side`);
  console.log(`  the chain           consecutive arcs meet to ${construction.chainError.toExponential(2)}`);
  console.log(`  [${constructionVerdict.verdict}] the construction`);
  for (const finding of constructionVerdict.findings) console.log(`    FAIL ${finding.rule}: ${finding.why}`);

  console.log(`\n  relationships       ${relationships.total} in total, ${relationships.twoColour} with two colours`);
  console.log(`  the stylesheet      ${rules.length} rule(s) divide at 1.618fr 1fr: ${rules.map((r) => r.selector).join(', ') || 'none'}`);

  console.log(`\n  [${alignmentVerdict.verdict}] the interface`);
  if (alignment) {
    console.log(`    the plate's field  ends at ${alignment.plate.fieldBoundary}px of ${alignment.plate.stageWidth}px; the diagram's 0.618 cut is at ${alignment.plate.verticalCuts[1]}px`);
    console.log(`    the demo's field   ends at ${alignment.demo.fieldBoundary}px of ${alignment.demo.stageWidth}px; the diagram's 0.618 cut is at ${alignment.demo.verticalCuts[1]}px`);
    if (alignment.head) console.log(`    the head's columns ${alignment.head.wide}px and ${alignment.head.narrow}px — a ratio of ${alignment.head.ratio.toFixed(4)}`);
    console.log(`    the bench          ${alignment.bench.cases.length} case(s) measured, ${alignment.bench.cases.filter((c) => c.overflow > 1).length} clipping`);
  }
  for (const finding of alignmentVerdict.findings) console.log(`    FAIL ${finding.rule}: ${finding.why}`);

  process.exit(constructionVerdict.verdict === 'OK' && alignmentVerdict.verdict === 'OK' ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
