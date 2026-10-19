// basics-lint.mjs — "ship basics" checks that run alongside slop-lint.
// These are pass/fail hygiene checks (access, phone, speed, conventions), not taste.
// They never change the slop score, and STYLE.md cannot exempt a FAIL: raise it with the owner instead.
// Source of the list: ruttl, "11 Website Design Best Practices To Follow In 2026"
// (https://www.ruttl.com/blog/web-design-best-practices), filtered through ANTI-SLOP.md.
// No dependencies: slop-lint.mjs drives the browser and calls these.

// WCAG 2.x contrast ratio for two [r,g,b] colours (0-255). Self-contained so it can run in the page.
export function contrastRatio(fg, bg) {
  const lum = ([r, g, b]) => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const a = lum(fg), b = lum(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// Runs in the page: page.evaluate(`(${inPageBasics})(${contrastRatio}, ${JSON.stringify(opts)})`).
export function inPageBasics(ratio, opts = {}) {
  const VW = innerWidth, VH = innerHeight, LIMIT = VH * 4;
  const MAPSEL = '.leaflet-container,.maplibregl-map,.mapboxgl-map,.gm-style,.ol-viewport,.esri-view,.cesium-widget,.cesium-viewer';
  const maps = [...document.querySelectorAll(MAPSEL)];
  const inMap = el => maps.some(m => m.contains(el));
  const visible = el => {
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1 || r.top > LIMIT || r.bottom <= 0 || r.right <= 0 || r.left >= VW) return false; // off-screen (e.g. a skip link) is not shown
    const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05 && !el.closest('[aria-hidden="true"],[inert]');
  };
  const parseC = s => { const m = s && s.match(/^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
  const over = (top, under) => top.slice(0, 3).map((v, i) => v * top[3] + under[i] * (1 - top[3]));
  const say = el => (el.innerText || el.getAttribute('aria-label') || el.value || el.getAttribute('name') || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 40);
  const out = {};

  // contrast: text against the background it actually sits on
  const seen = new Set(); let low = 0, unknown = 0; const lowEx = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n, k = 0;
  while ((n = tw.nextNode()) && k < 4000) {
    const el = n.parentElement; if (!el || seen.has(el) || !/[\p{L}\p{N}]/u.test(n.textContent)) continue;
    seen.add(el); if (el.closest('script,style,noscript,option') || inMap(el) || !visible(el)) continue; k++;
    if (el.closest(':disabled,[aria-disabled="true"]')) continue;
    const cs = getComputedStyle(el); const fg = parseC(cs.color); if (!fg) { unknown++; continue; }
    if (fg[3] < 0.1 || parseFloat(cs.webkitTextStrokeWidth) > 0 || cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text') { unknown++; continue; } // outlined or clipped text: not measurable here
    const layers = []; let p = el, alpha = 1, bad = false;
    for (; p; p = p.parentElement) {
      const ps = getComputedStyle(p); alpha *= +ps.opacity;
      if (ps.backgroundImage && ps.backgroundImage !== 'none') { bad = true; break; }
      const c = parseC(ps.backgroundColor); if (!c) { bad = true; break; }
      if (c[3] > 0) layers.push(c);
      if (c[3] >= 0.99) break;
      if ((ps.position === 'absolute' || ps.position === 'fixed') && p !== el) { bad = true; break; }
    }
    if (bad) { unknown++; continue; }
    let bg = [255, 255, 255]; for (const l of layers.reverse()) bg = over(l, bg);
    const fgc = over([fg[0], fg[1], fg[2], fg[3] * alpha], bg);
    const size = parseFloat(cs.fontSize), large = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700);
    const need = large ? 3 : 4.5, r = ratio(fgc, bg);
    if (r < need) { low++; if (lowEx.length < 6) lowEx.push({ text: n.textContent.trim().slice(0, 30), ratio: +r.toFixed(2), need }); }
  }
  out.lowContrast = low; out.contrastUnknown = unknown; out.lowContrastExamples = lowEx;

  // interactive elements: names, labels, tap size
  const TARGETS = 'a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=link],[role=tab],[role=checkbox],[role=radio],[role=switch],[role=menuitem]';
  const labelled = el => {
    if ((el.getAttribute('aria-label') || '').trim() || (el.getAttribute('title') || '').trim()) return true;
    const lb = el.getAttribute('aria-labelledby'); if (lb && lb.split(/\s+/).some(id => (document.getElementById(id)?.textContent || '').trim())) return true;
    return false;
  };
  let noName = 0, noLabel = 0, small = 0; const nameEx = [], labelEx = [], smallEx = [];
  for (const el of document.querySelectorAll(TARGETS)) {
    if (!visible(el) || inMap(el)) continue;
    const field = el.matches('input,select,textarea');
    if (field) {
      const t = (el.getAttribute('type') || '').toLowerCase();
      if (['submit', 'button', 'reset'].includes(t)) { if (!(el.value || '').trim() && !labelled(el)) { noName++; nameEx.length < 6 && nameEx.push(say(el)); } }
      else if (t === 'image') { if (!(el.getAttribute('alt') || '').trim() && !labelled(el)) { noName++; nameEx.length < 6 && nameEx.push('input[type=image]'); } }
      else if (!labelled(el) && !el.closest('label') && !(el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`))) { noLabel++; labelEx.length < 6 && labelEx.push(el.getAttribute('placeholder') || el.getAttribute('name') || el.tagName.toLowerCase()); }
    } else {
      const imgAlt = [...el.querySelectorAll('img[alt],svg title')].some(i => (i.getAttribute('alt') || i.textContent || '').trim());
      if (!(el.innerText || '').trim() && !imgAlt && !labelled(el)) { noName++; nameEx.length < 6 && nameEx.push(el.outerHTML.slice(0, 60)); }
    }
    if (opts.mobile) {
      if (el.parentElement && el.parentElement.closest(TARGETS)) continue; // count the outer target only
      const cs = getComputedStyle(el);
      if (el.matches('a') && cs.display === 'inline') { // a link inside a sentence is exempt (WCAG 2.5.8)
        const blk = el.closest('p,li,dd,td,blockquote,figcaption'); if (blk && (blk.innerText || '').length > (el.innerText || '').length + 20) continue;
      }
      let r = el.getBoundingClientRect(); const lab = el.closest('label') || (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`));
      if (lab) { const q = lab.getBoundingClientRect(); r = { width: Math.max(r.width, q.width), height: Math.max(r.height, q.height) }; }
      if (r.width < 43.5 || r.height < 43.5) { small++; smallEx.length < 6 && smallEx.push(`${say(el)} ${Math.round(r.width)}×${Math.round(r.height)}`); }
    }
  }
  out.unnamedControls = noName; out.unnamedExamples = nameEx; out.unlabelledFields = noLabel; out.unlabelledExamples = labelEx;
  if (opts.mobile) { out.smallTargets = small; out.smallTargetExamples = smallEx; }

  // images: alt present (alt="" is fine for decoration); size vs display
  let noAlt = 0; const altEx = []; out.images = [];
  for (const img of document.querySelectorAll('img')) {
    if (inMap(img)) continue;
    if (!img.hasAttribute('alt') && visible(img)) { noAlt++; altEx.length < 6 && altEx.push((img.currentSrc || img.src).split('/').pop().slice(0, 50)); }
    const r = img.getBoundingClientRect();
    if (img.currentSrc && r.width > 0) out.images.push({ src: img.currentSrc, natural: img.naturalWidth, shown: Math.round(r.width) });
  }
  out.imgNoAlt = noAlt; out.imgNoAltExamples = altEx;

  // document basics
  out.htmlLang = document.documentElement.getAttribute('lang') || '';
  const vp = document.querySelector('meta[name=viewport]')?.getAttribute('content') || '';
  out.viewportMeta = /width\s*=\s*device-width/i.test(vp);
  const maxScale = vp.match(/maximum-scale\s*=\s*([\d.]+)/i);
  out.zoomBlocked = /user-scalable\s*=\s*(no|0)\b/i.test(vp) || (!!maxScale && +maxScale[1] < 2);

  // conventions: a way home near the top; EN/TH/ZH reachable
  const here = new URL(location.href);
  out.homeLink = [...document.querySelectorAll('a[href]')].some(a => {
    const r = a.getBoundingClientRect(); if (r.width < 1 || r.top > 200 || r.bottom < 0) return false;
    try { const u = new URL(a.href, here); return u.origin === here.origin && /^\/((en|th|zh|zh-cn|zh-hans)\/?)?(index\.html?)?$/i.test(u.pathname) && !u.hash.slice(1); } catch { return false; }
  });
  const langs = new Set();
  for (const e of document.querySelectorAll('[hreflang],[lang]')) { const l = (e.getAttribute('hreflang') || e.getAttribute('lang') || '').toLowerCase(); if (/^th/.test(l)) langs.add('th'); if (/^zh/.test(l)) langs.add('zh'); if (/^en/.test(l)) langs.add('en'); }
  for (const e of document.querySelectorAll('a,button,option,[role=menuitem],[role=tab]')) {
    const t = (e.textContent || '').trim(); if (t.length > 12) continue;
    if (/^(ไทย|ภาษาไทย|th)$/i.test(t)) langs.add('th'); if (/^(中文|简体|简体中文|zh)$/i.test(t)) langs.add('zh'); if (/^(en|english|eng)$/i.test(t)) langs.add('en');
  }
  out.languages = [...langs].sort();
  out.perf = window.__basicsPerf ? { lcpMs: Math.round(window.__basicsPerf.lcp), cls: +window.__basicsPerf.cls.toFixed(3) } : null;
  return out;
}

// Add with page.addInitScript(PERF_INIT_SCRIPT) before page.goto: records LCP and layout shift.
// CLS here is the sum of all unexpected shifts (an upper bound of the session-window CLS).
export const PERF_INIT_SCRIPT = `window.__basicsPerf={lcp:0,cls:0};try{
new PerformanceObserver(l=>{for(const e of l.getEntries())window.__basicsPerf.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});
new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__basicsPerf.cls+=e.value}).observe({type:'layout-shift',buffered:true});}catch(e){}`;

// Collect image transfer sizes (Playwright page). Map tiles are left out. Call before goto; await .done() after load.
export function watchImages(page) {
  const jobs = [];
  page.on('requestfinished', req => {
    if (req.resourceType() !== 'image' || req.url().startsWith('data:')) return;
    if (/tile|\/\d+\/\d+\/\d+(@\dx)?(\.\w+)?(\?|$)/i.test(req.url())) return;
    jobs.push(req.sizes().then(s => ({ url: req.url(), bytes: s.responseBodySize })).catch(() => null));
  });
  return { done: async () => (await Promise.all(jobs)).filter(Boolean) };
}

const STYLE_KEYS = ['outlineStyle', 'outlineWidth', 'outlineColor', 'boxShadow', 'backgroundColor', 'color', 'borderTopColor', 'borderBottomColor', 'textDecorationLine', 'opacity', 'transform', 'filter'];
const snap = el => { const cs = getComputedStyle(el); return Object.fromEntries(['outlineStyle', 'outlineWidth', 'outlineColor', 'boxShadow', 'backgroundColor', 'color', 'borderTopColor', 'borderBottomColor', 'textDecorationLine', 'opacity', 'transform', 'filter'].map(k => [k, cs[k]])); };
const changed = (a, b) => STYLE_KEYS.some(k => a[k] !== b[k]) && !(a.outlineStyle === 'none' && b.outlineStyle === 'none' && STYLE_KEYS.filter(k => a[k] !== b[k]).every(k => k.startsWith('outline')));

// Keyboard focus and hover checks (desktop). Mutates focus/hover state, so run it after screenshots.
export async function measureInteractive(page, { maxTabs = 15, maxHover = 8 } = {}) {
  const out = { focusSampled: 0, noFocus: 0, noFocusExamples: [], hoverSampled: 0, noHover: 0, noHoverExamples: [] };
  await page.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.blur());
  const visited = new Set();
  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(60);
    const r = await page.evaluate(`(() => { const snap = ${snap}; const el = document.activeElement;
      if (!el || el === document.body || el.tagName === 'IFRAME') return null;
      const key = el.outerHTML.slice(0, 120); const on = snap(el); el.blur(); const off = snap(el); el.focus({ preventScroll: true });
      return { key, on, off, label: (el.innerText || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 40) }; })()`);
    if (!r || visited.has(r.key)) { if (r) break; continue; }
    visited.add(r.key); out.focusSampled++;
    if (!changed(r.on, r.off)) { out.noFocus++; out.noFocusExamples.length < 6 && out.noFocusExamples.push(r.label); }
  }
  const boxes = await page.evaluate(n => [...document.querySelectorAll('a[href],button,[role=button]')].map((el, i) => { el.setAttribute('data-basics-i', i); const r = el.getBoundingClientRect(); return { i, x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }; })
    .filter(b => b.w >= 16 && b.h >= 12 && b.y > 0 && b.y < innerHeight && b.x > 0 && b.x < innerWidth).slice(0, n), maxHover);
  for (const b of boxes) {
    await page.mouse.move(1, 1).catch(() => {});
    const off = await page.evaluate(`(() => { const snap = ${snap}; const el = document.querySelector('[data-basics-i="${b.i}"]'); return el ? snap(el) : null; })()`);
    await page.mouse.move(b.x, b.y); await page.waitForTimeout(120);
    const r = await page.evaluate(`(() => { const snap = ${snap}; const el = document.querySelector('[data-basics-i="${b.i}"]'); if (!el) return null;
      const top = document.elementFromPoint(${b.x}, ${b.y}); if (!top || !(el === top || el.contains(top))) return null;
      return { on: snap(el), label: (el.innerText || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 40) }; })()`);
    if (!r || !off) continue; out.hoverSampled++;
    if (!changed(r.on, off)) { out.noHover++; out.noHoverExamples.length < 6 && out.noHoverExamples.push(r.label); }
  }
  await page.mouse.move(1, 1).catch(() => {});
  return out;
}

// Budgets. LCP/CLS use Core Web Vitals "good" lines; measured in a lab, so treat them as a screen.
export const BUDGETS = { tap: 44, lcpWarnMs: 2500, lcpFailMs: 4000, clsWarn: 0.1, clsFail: 0.25, imageWarnBytes: 300e3, imagesTotalWarnBytes: 2e6, oversizeFactor: 2.5, oversizeMinBytes: 100e3 };

// LCP is noisy in a lab: FAIL only when both loads are slow (the faster of the two is over budget).
const lcpBoth = (d, m) => { const a = d.perf?.lcpMs, b = m.perf?.lcpMs; return a && b ? Math.min(a, b) : (a || b || 0); };

// Each check: id, level (fail|warn), plain description, test(desktop, mobile) -> detail string or '' (pass).
export const BASICS = [
  { id: 'contrast', level: 'fail', desc: 'Text below WCAG AA contrast (4.5:1, or 3:1 for large text)', test: (d, m) => { const n = Math.max(d.lowContrast || 0, m.lowContrast || 0); return n ? `${n} text elements, e.g. ${JSON.stringify((d.lowContrastExamples || []).concat(m.lowContrastExamples || []).slice(0, 2))}` : ''; } },
  { id: 'tap-targets', level: 'fail', desc: 'Phone tap targets smaller than 44×44 CSS px (links inside sentences exempt)', test: (d, m) => m.smallTargets ? `${m.smallTargets}, e.g. ${(m.smallTargetExamples || []).slice(0, 3).join('; ')}` : '' },
  { id: 'img-alt', level: 'fail', desc: 'Images with no alt attribute (use alt="" for decoration)', test: d => d.imgNoAlt ? `${d.imgNoAlt}, e.g. ${d.imgNoAltExamples.slice(0, 3).join(', ')}` : '' },
  { id: 'control-names', level: 'fail', desc: 'Buttons or links with no accessible name', test: d => d.unnamedControls ? `${d.unnamedControls}` : '' },
  { id: 'form-labels', level: 'fail', desc: 'Form fields with no label (a placeholder is not a label)', test: d => d.unlabelledFields ? `${d.unlabelledFields}, e.g. ${d.unlabelledExamples.slice(0, 3).join(', ')}` : '' },
  { id: 'focus-visible', level: 'fail', desc: 'Keyboard focus is invisible on some controls', test: d => d.interactive?.noFocus ? `${d.interactive.noFocus} of ${d.interactive.focusSampled} tabbed, e.g. ${d.interactive.noFocusExamples.slice(0, 3).join(', ')}` : '' },
  { id: 'html-lang', level: 'fail', desc: '<html> has no lang attribute', test: d => d.htmlLang ? '' : 'missing' },
  { id: 'viewport-meta', level: 'fail', desc: 'No <meta name="viewport" content="width=device-width">', test: (d, m) => (m.viewportMeta ?? d.viewportMeta) === false ? 'missing' : '' },
  { id: 'lcp', level: 'fail', desc: `Largest paint later than ${BUDGETS.lcpFailMs / 1000}s on both desktop and phone loads (lab)`, test: (d, m) => { const v = lcpBoth(d, m); return v > BUDGETS.lcpFailMs ? `${v} ms` : ''; } },
  { id: 'cls', level: 'fail', desc: `Layout shift over ${BUDGETS.clsFail} (warn over ${BUDGETS.clsWarn})`, test: (d, m) => { const v = Math.max(d.perf?.cls || 0, m.perf?.cls || 0); return v > BUDGETS.clsFail ? `${v}` : ''; } },
  { id: 'lcp-slow', level: 'warn', desc: `Largest paint later than ${BUDGETS.lcpWarnMs / 1000}s on one load (lab; one slow load can be the network)`, test: (d, m) => { const v = Math.max(d.perf?.lcpMs || 0, m.perf?.lcpMs || 0); return v > BUDGETS.lcpWarnMs && lcpBoth(d, m) <= BUDGETS.lcpFailMs ? `${v} ms` : ''; } },
  { id: 'cls-some', level: 'warn', desc: `Layout shift over ${BUDGETS.clsWarn}`, test: (d, m) => { const v = Math.max(d.perf?.cls || 0, m.perf?.cls || 0); return v > BUDGETS.clsWarn && v <= BUDGETS.clsFail ? `${v}` : ''; } },
  { id: 'image-weight', level: 'warn', desc: `An image over ${BUDGETS.imageWarnBytes / 1e3} KB, images over ${BUDGETS.imagesTotalWarnBytes / 1e6} MB in total, or an image served >${BUDGETS.oversizeFactor}× its shown width`, test: d => (d.imageIssues || []).join('; ') },
  { id: 'zoom-blocked', level: 'warn', desc: 'Viewport blocks pinch zoom (user-scalable=no or maximum-scale<2)', test: (d, m) => (m.zoomBlocked || d.zoomBlocked) ? 'blocked' : '' },
  { id: 'hover-states', level: 'warn', desc: 'Most links/buttons show no change on hover', test: d => d.interactive?.hoverSampled >= 3 && d.interactive.noHover / d.interactive.hoverSampled > 0.5 ? `${d.interactive.noHover} of ${d.interactive.hoverSampled}` : '' },
  { id: 'home-link', level: 'warn', desc: 'No link back to the home page near the top (logo or name)', test: d => d.homeLink === false ? 'none in the top 200px' : '' },
  { id: 'en-th-zh', level: 'warn', desc: 'No EN/TH/ZH switch found (public frontends are trilingual)', test: d => { const l = d.languages || []; const miss = ['en', 'th', 'zh'].filter(x => !l.includes(x)); return miss.length && l.length ? `missing ${miss.join(',')}` : !l.length ? 'none found' : ''; } },
];

// Turn image sizes (from watchImages) + in-page image list into plain issues.
export function imageIssues(sizes = [], shown = []) {
  const issues = []; const total = sizes.reduce((a, s) => a + (s.bytes || 0), 0);
  const heavy = sizes.filter(s => s.bytes > BUDGETS.imageWarnBytes).sort((a, b) => b.bytes - a.bytes);
  if (heavy.length) issues.push(`${heavy.length} image(s) over ${BUDGETS.imageWarnBytes / 1e3} KB, largest ${Math.round(heavy[0].bytes / 1e3)} KB ${heavy[0].url.split('/').pop().slice(0, 40)}`);
  if (total > BUDGETS.imagesTotalWarnBytes) issues.push(`images total ${(total / 1e6).toFixed(1)} MB`);
  const bytesOf = new Map(sizes.map(s => [s.url, s.bytes]));
  const big = shown.filter(i => i.natural > BUDGETS.oversizeFactor * i.shown && (bytesOf.get(i.src) || 0) > BUDGETS.oversizeMinBytes);
  if (big.length) issues.push(`${big.length} image(s) served >${BUDGETS.oversizeFactor}× shown width, e.g. ${big[0].natural}px shown at ${big[0].shown}px`);
  return issues;
}

export function judgeBasics(d = {}, m = {}) {
  const fails = [], warns = [];
  for (const b of BASICS) { let detail = ''; try { detail = b.test(d, m) || ''; } catch { detail = ''; } if (detail) (b.level === 'fail' ? fails : warns).push({ id: b.id, detail }); }
  return { verdict: fails.length ? 'FAIL' : warns.length ? 'WARN' : 'PASS', fails, warns };
}
