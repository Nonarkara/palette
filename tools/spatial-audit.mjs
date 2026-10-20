#!/usr/bin/env node
// non-slop-skip-file: this is a detector. It contains the class names and the
// thresholds it hunts for, so scanning it reports the detector's own patterns.
//
// spatial-audit.mjs — measure the six spatial-hallucination failure modes on a
// live page, geometrically. Complements slop-lint.mjs, which scores whether a
// page looks like AI output; this asks whether its layout can explain itself.
//
// The doctrine: ANTI-SPATIAL-HALLUCINATION.md
//   "Why is this here, why this size, and why this far from that?"
//   If the answer is merely "the grid put it there", the layout has failed.
//
// Usage: node tools/spatial-audit.mjs <url> [more urls...] [--json] [--settle=ms]
// Setup: npm i -D playwright && npx playwright install chromium
//
// Verdict: the auditor never renders a verdict. It reports geometry. A page is
// not guilty of spatial hallucination because a number crossed a threshold; the
// numbers tell a person where to look. Use them to start a review, not to end one.

import { chromium } from "playwright";

// ---------------------------------------------------------------- in-page metrics
//
// Every metric answers one of the six failure modes. Each returns a list of
// findings with the rectangle that produced it, so a reviewer can look at the
// exact place the layout failed to explain itself.

export function inPageGeometry() {
  const VW = innerWidth, VH = innerHeight, VA = VW * VH;

  const visible = (el, cs) =>
    cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity >= 0.05;
  const rect = (el) => el.getBoundingClientRect();
  const label = (el) => {
    const id = el.id ? `#${el.id}` : "";
    const cls = typeof el.className === "string" && el.className.trim()
      ? `.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}`
      : "";
    return `${el.tagName.toLowerCase()}${id}${cls}`;
  };
  const textOf = (el) => (el.innerText || el.textContent || "").trim().replace(/\s+/g, " ");

  // Elements that only exist to hold space, not to carry content.
  const isSpacer = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const r = rect(el);
    if (r.width < 8 || r.height < 8) return false;
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    const hasMedia = el.querySelector("img,svg,canvas,video,input,select,textarea,iframe");
    if (hasText || hasMedia) return false;
    // A decorative background is content of a sort; only a bare box counts.
    if (cs.backgroundImage && cs.backgroundImage !== "none") return false;
    return true;
  };

  // ── 1. Unjustified gaps ───────────────────────────────────────────────────
  // Space stretched to fill a container. A container whose children occupy a
  // small share of it, where the leftover is a single gap rather than a set of
  // deliberate separations. "space stretched to fill" — one child, one gap.
  const unjustifiedGaps = [];
  {
    const containers = [...document.querySelectorAll("body *")].filter((el) => {
      const cs = getComputedStyle(el);
      return cs.display.includes("flex") || cs.display.includes("grid");
    });
    for (const c of containers) {
      const cs = getComputedStyle(c);
      const kids = [...c.children].filter((k) => {
        const kcs = getComputedStyle(k);
        if (kcs.display === "none" || kcs.position === "absolute" || kcs.position === "fixed") return false;
        return visible(k, kcs);
      });
      if (kids.length === 0) continue;
      const cr = rect(c);
      if (cr.width < 120 || cr.height < 40) continue;

      // Content bounding box of the children.
      let minL = Infinity, minT = Infinity, maxR = -Infinity, maxB = -Infinity;
      for (const k of kids) {
        const kr = rect(k);
        if (kr.width < 1 || kr.height < 1) continue;
        minL = Math.min(minL, kr.left); minT = Math.min(minT, kr.top);
        maxR = Math.max(maxR, kr.right); maxB = Math.max(maxB, kr.bottom);
      }
      if (!isFinite(minL)) continue;
      const contentH = maxB - minT, contentW = maxR - minL;
      const innerH = cr.height - (parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom));
      const innerW = cr.width - (parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight));
      if (innerH <= 0 || innerW <= 0) continue;

      // The container is much taller than its content: the leftover is one
      // stretch of space, not a series of separations.
      const vSlack = (innerH - contentH) / innerH;
      const hSlack = (innerW - contentW) / innerW;
      const oneChild = kids.length === 1;
      if (vSlack > 0.5 && (oneChild || vSlack > 0.7)) {
        unjustifiedGaps.push({
          container: label(c),
          kind: oneChild ? "single-child-stretch" : "block-full-height",
          slackPct: Math.round(vSlack * 100),
          leftoverPx: Math.round(innerH - contentH),
          rect: { x: Math.round(cr.x), y: Math.round(cr.y), w: Math.round(cr.width), h: Math.round(cr.height) }
        });
      }
      if (hSlack > 0.5 && kids.length === 1) {
        unjustifiedGaps.push({
          container: label(c),
          kind: "single-child-stretch",
          axis: "horizontal",
          slackPct: Math.round(hSlack * 100),
          leftoverPx: Math.round(innerW - contentW),
          rect: { x: Math.round(cr.x), y: Math.round(cr.y), w: Math.round(cr.width), h: Math.round(cr.height) }
        });
      }
      // `justify-content: space-between` on a column pushes two children to
      // the extremes of a tall box. The space between them is the leftover of
      // the container's height, not a separation anyone chose — and it grows
      // with the viewport, which is the tell.
      if (cs.display.includes("flex") && (cs.justifyContent === "space-between" || cs.justifyContent === "space-around")) {
        const sorted = [...kids].map((k) => rect(k)).sort((a, b) => a.top - b.top);
        if (sorted.length >= 2) {
          const top = sorted[0].top - cr.top;
          const bottom = cr.bottom - sorted[sorted.length - 1].bottom;
          const between = sorted[1].top - sorted[0].bottom;
          const maxGap = Math.max(top, bottom, between);
          if (maxGap > 80 && maxGap / cr.height > 0.25) {
            unjustifiedGaps.push({
              container: label(c),
              kind: "space-between-pushes-apart",
              gapPx: Math.round(maxGap),
              gapPctOfBox: Math.round((maxGap / cr.height) * 100),
              children: kids.length,
              rect: { x: Math.round(cr.x), y: Math.round(cr.y), w: Math.round(cr.width), h: Math.round(cr.height) }
            });
          }
        }
      }
    }
  }

  // ── 2. Orphan elements ────────────────────────────────────────────────────
  // A photo (or a media object) stranded beside a large empty area. The media
  // is real; the space next to it is not explained by anything.
  const orphanElements = [];
  {
    // "A photo stranded beside an empty area." The photo may be an <img> or a
    // box carrying the picture as a background — a plate, a swatch, a
    // placeholder rectangle. Both are content in the reader's eye.
    const media = [...document.querySelectorAll("img,video,canvas,svg")].filter((el) => {
      if (el.closest("svg") && el.tagName !== "svg") return false;
      const r = rect(el);
      return r.width > 60 && r.height > 60 && r.top < VH * 4 && r.bottom > 0;
    });
    // Boxes whose only content is a background fill — a picture, not a space.
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (!cs.backgroundImage || cs.backgroundImage === "none") continue;
      if (cs.backgroundImage.includes("gradient")) continue; // a gradient is not a picture
      const r = rect(el);
      if (r.width < 60 || r.height < 60) continue;
      if (r.top > VH * 4 || r.bottom < 0) continue;
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (hasText) continue;
      if (el.querySelector("img,svg,canvas,video")) continue;
      media.push(el);
    }
    for (const m of media) {
      const mr = rect(m);
      const p = m.parentElement;
      if (!p) continue;
      const pr = rect(p);
      if (pr.width < 200) continue;
      // Walk up to the nearest container that lays out in two columns.
      let host = p;
      for (let d = 0; d < 4 && host; d++, host = host.parentElement) {
        const hcs = getComputedStyle(host);
        if (!hcs.display.includes("grid") && !hcs.display.includes("flex")) continue;
        const kids = [...host.children].filter((k) => {
          const kcs = getComputedStyle(k);
          return kcs.display !== "none" && kcs.position !== "absolute" && kcs.position !== "fixed";
        });
        if (kids.length < 2) break;
        const mediaBox = kids.find((k) => k.contains(m));
        if (!mediaBox) break;
        const others = kids.filter((k) => k !== mediaBox);

        // The column holding the media: how much of it does the media use?
        const mbr = rect(mediaBox);
        const mcs = getComputedStyle(mediaBox);
        const padT = parseFloat(mcs.paddingTop) + parseFloat(mcs.paddingBottom);
        const padL = parseFloat(mcs.paddingLeft) + parseFloat(mcs.paddingRight);
        const contentH = mbr.height - padT;
        const contentW = mbr.width - padL;
        const usedH = mr.bottom - mbr.top;
        const usedW = mr.right - mbr.left;
        const vSlack = contentH > 0 ? (contentH - usedH) / contentH : 0;
        const hSlack = contentW > 0 ? (contentW - usedW) / contentW : 0;

        // Case A: the media shares its column with other content, and the
        // column is mostly empty space. The media floats in a void.
        if (vSlack > 0.4 || hSlack > 0.4) {
          orphanElements.push({
            media: label(m),
            column: label(mediaBox),
            siblingCount: others.length,
            slackPct: Math.round(Math.max(vSlack, hSlack) * 100),
            mediaRect: { x: Math.round(mr.x), y: Math.round(mr.y), w: Math.round(mr.width), h: Math.round(mr.height) }
          });
          break;
        }

        // Case B: the media IS the column, and the column beside it is empty.
        // The media is not floating in its own void — it is stranded beside
        // someone else's. That is the orphan.
        const emptySibling = others.find((o) => {
          const or = rect(o);
          if (or.width < 40 || or.height < 40) return false;
          const ocs = getComputedStyle(o);
          if (ocs.backgroundImage && ocs.backgroundImage !== "none") return false;
          const hasText = [...o.querySelectorAll("p,li,h1,h2,h3,h4,h5,h6,dd,dt,span,a,button")].some((e) => textOf(e).length > 0);
          const hasMedia = o.querySelector("img,svg,canvas,video");
          if (hasText || hasMedia) return false;
          return or.height > mr.height * 1.4;
        });
        if (emptySibling) {
          const or = rect(emptySibling);
          orphanElements.push({
            media: label(m),
            strandedBeside: label(emptySibling),
            kind: "media-beside-empty-column",
            mediaH: Math.round(mr.height),
            emptyColumnH: Math.round(or.height),
            mediaRect: { x: Math.round(mr.x), y: Math.round(mr.y), w: Math.round(mr.width), h: Math.round(mr.height) }
          });
          break;
        }
        // Case C: the media IS a column, and its own sibling is short. The
        // media is then taller than the thing beside it, and the leftover
        // below the short column is the void the reader sees.
        if (!emptySibling && others.length) {
          const shortest = others.reduce((a, b) => (rect(a).height <= rect(b).height ? a : b));
          const sr = rect(shortest);
          if (sr.height < mr.height * 0.7 && mr.height - sr.height > 80) {
            orphanElements.push({
              media: label(m),
              strandedBeside: label(shortest),
              kind: "media-column-taller-than-its-neighbour",
              mediaH: Math.round(mr.height),
              neighbourH: Math.round(sr.height),
              mediaRect: { x: Math.round(mr.x), y: Math.round(mr.y), w: Math.round(mr.width), h: Math.round(mr.height) }
            });
            break;
          }
        }
      }
    }
  }

  // ── 3. Scattered actions ──────────────────────────────────────────────────
  // Related buttons split across different rows, or pushed to opposite edges.
  const scatteredActions = [];
  {
    // A group is a container of related actions. Find it structurally — a
    // parent whose children are mostly buttons — rather than by a fixed class
    // list, or a real page's grouping class is missed.
    const groupCandidates = new Set();
    for (const b of document.querySelectorAll("button,a[href],[role='button']")) {
      const cs = getComputedStyle(b);
      if (!visible(b, cs)) continue;
      const r = rect(b);
      if (r.width < 4 || r.height < 4 || r.top > VH * 4) continue;
      const p = b.parentElement;
      if (!p) continue;
      const sibs = [...p.children].filter((c) => {
        const kcs = getComputedStyle(c);
        if (kcs.display === "none" || kcs.position === "absolute" || kcs.position === "fixed") return false;
        return visible(c, kcs);
      });
      const actionish = sibs.filter((c) => c.matches("button,a[href],[role='button']")).length;
      if (actionish >= 2 && actionish >= sibs.length - 1) groupCandidates.add(p);
    }
    // Named containers are groups even when they hold mixed content.
    for (const s of ["nav", "[role='toolbar']", "[role='group']", ".actions", ".toolbar", "header", "footer"]) {
      for (const el of document.querySelectorAll(s)) groupCandidates.add(el);
    }

    for (const g of groupCandidates) {
      const gcs = getComputedStyle(g);
      // A vertical rail stacks its controls on purpose. Splitting a column into
      // "rows" is the arrangement, not a failure — only a horizontal band can
      // be "split across rows" by accident.
      const isVertical = gcs.flexDirection === "column" || gcs.flexDirection === "column-reverse";
      const actions = [...g.querySelectorAll("button,a[href],[role='button']")].filter((b) => {
        const cs = getComputedStyle(b);
        if (!visible(b, cs)) return false;
        const r = rect(b);
        return r.width > 4 && r.height > 4 && r.top < VH * 4;
      });
      if (actions.length < 3) continue;
      const rows = new Map();
      for (const a of actions) {
        const r = rect(a);
        const key = Math.round(r.top / 12);
        const arr = rows.get(key) || [];
        arr.push({ el: a, r });
        rows.set(key, arr);
      }
      const rowList = [...rows.values()];
      if (rowList.length > 1 && !isVertical) {
        // Same-row actions that are far apart horizontally.
        for (const row of rowList) {
          if (row.length < 2) continue;
          const sorted = [...row].sort((x, y) => x.r.left - y.r.left);
          for (let i = 1; i < sorted.length; i++) {
            const gap = sorted[i].r.left - sorted[i - 1].r.right;
            if (gap > 180) {
              scatteredActions.push({
                kind: "same-row-opposite-edges",
                group: label(g),
                a: label(sorted[i - 1].el),
                b: label(sorted[i].el),
                gapPx: Math.round(gap),
                rowY: Math.round(sorted[i].r.top)
              });
            }
          }
        }
        // Actions in different rows that belong to the same group.
        scatteredActions.push({
          kind: "split-across-rows",
          group: label(g),
          rows: rowList.length,
          actions: actions.length,
          rowTops: rowList.map((r) => Math.round(r[0].r.top))
        });
      }
      // A single row whose actions are pushed to opposite edges of a wide
      // container: `justify-content: space-between` on related actions.
      // Navigation links are exempt: a nav spread across a header is how a
      // header works, and the reader expects to hunt for a link. Actions that
      // the reader must *choose between* are not — they belong together.
      if (rowList.length === 1 && rowList[0].length >= 3 && !isVertical) {
        const isNav = g.matches("nav,header,footer") || g.closest("nav,header,footer");
        // A wrapped chip row is exempt: the chips are one group, and the row's
        // own width is what decides they wrap. Spreading them is not a hunt.
        const isChipRow = gcs.flexWrap === "wrap" || gcs.display.includes("grid");
        if (!isNav && !isChipRow) {
          const sorted = [...rowList[0]].sort((x, y) => x.r.left - y.r.left);
          const container = rect(g);
          const span = sorted[sorted.length - 1].r.right - sorted[0].r.left;
          const fill = container.width > 0 ? span / container.width : 1;
          const gaps = [];
          for (let i = 1; i < sorted.length; i++) gaps.push(sorted[i].r.left - sorted[i - 1].r.right);
          const maxGap = Math.max(...gaps);
          // Related actions spread across most of a wide band, with a big hole
          // between them: the reader has to hunt for the sibling action.
          if (fill > 0.6 && maxGap > 160) {
            scatteredActions.push({
              kind: "related-actions-spread-across-band",
              group: label(g),
              actions: sorted.length,
              maxGapPx: Math.round(maxGap),
              bandFillPct: Math.round(fill * 100)
            });
          }
        }
      }
    }
  }

  // ── 4. False hierarchy ────────────────────────────────────────────────────
  // Everything gets equal weight, so nothing helps you choose. A heading set
  // where every level shares one size, or a body where one size carries
  // everything.
  const falseHierarchy = [];
  {
    const isVisibleInFlow = (h) => {
      const cs = getComputedStyle(h);
      if (!visible(h, cs)) return false;
      // A heading inside a closed dialog is not on the reader's screen. It
      // belongs to a different view, and is not part of this page's hierarchy.
      const dlg = h.closest("dialog");
      if (dlg && !dlg.open) return false;
      return rect(h).top < VH * 4;
    };
    const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter(isVisibleInFlow);
    // Hierarchy is judged *within a section*, not across the whole page. A
    // 38px page title and a 20px section heading are different things, and
    // comparing them proves nothing.
    const sections = new Map();
    for (const h of headings) {
      // The nearest block-level ancestor that contains more than one heading.
      let host = h.parentElement;
      for (let d = 0; d < 4 && host; d++, host = host.parentElement) {
        const hs = host.querySelectorAll("h1,h2,h3,h4,h5,h6");
        if (hs.length >= 2) break;
      }
      if (!host) host = document.body;
      const key = host;
      const arr = sections.get(key) || [];
      arr.push(h);
      sections.set(key, arr);
    }
    for (const [host, hs] of sections) {
      if (hs.length < 3) continue;
      // Peer headings at one size is CORRECT editorial hierarchy — every h3
      // in a chapter is the same size because they are the same rank. The
      // failure is the opposite: different ranks sharing one size, so the
      // level structure carries no visual information at all.
      const bySize = new Map();
      for (const h of hs) {
        const s = Math.round(parseFloat(getComputedStyle(h).fontSize));
        const arr = bySize.get(s) || [];
        arr.push(h);
        bySize.set(s, arr);
      }
      for (const [size, group] of bySize) {
        const tags = [...new Set(group.map((h) => h.tagName))];
        if (tags.length >= 2 && group.length >= 2) {
          falseHierarchy.push({
            kind: "different-ranks-share-one-size",
            section: label(host),
            size,
            ranks: tags,
            count: group.length,
            sample: group.slice(0, 4).map(label)
          });
        }
      }
      // Distinct sizes but identical weight: levels exist in size only. A
      // single weight across a whole section is common in editorial design
      // (the size does the work) — so only report it when the section has
      // three or more *different* sizes competing.
      const weights = [...new Set(hs.map((h) => getComputedStyle(h).fontWeight))];
      const sizeSet = [...new Set(hs.map((h) => Math.round(parseFloat(getComputedStyle(h).fontSize))))];
      if (sizeSet.length >= 3 && weights.length === 1 && hs.length >= 4) {
        falseHierarchy.push({
          kind: "size-ranks-without-weight-ranks",
          section: label(host),
          count: hs.length,
          sizes: sizeSet,
          weight: weights[0]
        });
      }
    }
    // A page with many headings and no h1 at all: the reader has no entry point.
    const h1s = headings.filter((h) => h.tagName === "H1").length;
    if (h1s === 0 && headings.length >= 4) {
      falseHierarchy.push({ kind: "no-h1", count: headings.length, sample: headings.slice(0, 4).map(label) });
    }
    // One font size carrying all the prose. A short page of prose at one size
    // is a choice; a long one is a page that never tells the reader what
    // matters. The threshold is deliberately high.
    const paraSizes = new Map();
    for (const p of document.querySelectorAll("p,li,dd")) {
      const cs = getComputedStyle(p);
      if (!visible(p, cs)) continue;
      const dlg = p.closest("dialog");
      if (dlg && !dlg.open) continue;
      const t = textOf(p);
      if (t.length < 40) continue;
      const r = rect(p);
      if (r.top > VH * 3) continue;
      const s = Math.round(parseFloat(cs.fontSize));
      paraSizes.set(s, (paraSizes.get(s) || 0) + t.length);
    }
    if (paraSizes.size === 1 && [...paraSizes.values()][0] > 2500) {
      falseHierarchy.push({ kind: "one-size-for-all-prose", size: [...paraSizes.keys()][0], chars: [...paraSizes.values()][0] });
    }
  }

  // ── 5. Accidental wrapping ────────────────────────────────────────────────
  // Navigation or controls break wherever they run out of room.
  const accidentalWrapping = [];
  {
    const rows = [...document.querySelectorAll("nav,header,[role='toolbar'],[role='group'],.tabs,.breadcrumb")].filter((g) => {
      const cs = getComputedStyle(g);
      return visible(g, cs) && rect(g).top < VH * 4;
    });
    for (const g of rows) {
      const cs = getComputedStyle(g);
      if (!cs.display.includes("flex") && !cs.display.includes("grid")) continue;
      // A vertical stack of controls is arranged on purpose.
      if (cs.flexDirection === "column" || cs.flexDirection === "column-reverse") continue;
      const items = [...g.children].filter((c) => {
        const kcs = getComputedStyle(c);
        if (kcs.display === "none" || kcs.position === "absolute" || kcs.position === "fixed") return false;
        const r = rect(c);
        return r.width > 2 && r.height > 2;
      });
      if (items.length < 3) continue;
      const tops = new Set(items.map((c) => Math.round(rect(c).top / 10)));
      if (tops.size > 1) {
        accidentalWrapping.push({
          kind: "nav-breaks-across-rows",
          group: label(g),
          items: items.length,
          distinctRows: tops.size,
          wrap: cs.flexWrap || cs.gridTemplateRows
        });
      }
    }
  }

  // ── 6. Spatially expensive information ────────────────────────────────────
  // A small decision requires a long scroll. Measured as screens of scroll
  // before the first meaningful content, and screens per interactive control.
  const spatiallyExpensive = [];
  {
    const screens = document.documentElement.scrollHeight / VH;
    const controls = document.querySelectorAll("button,a[href],input,select,textarea,[role='button']").length;
    if (screens > 6) {
      spatiallyExpensive.push({
        kind: "deep-scroll",
        screens: +screens.toFixed(1),
        controls
      });
    }
    // The first screen is mostly empty of content that a reader can act on.
    const firstScreenText = [...document.querySelectorAll("p,li,h1,h2,h3,dd")].filter((e) => {
      const r = rect(e);
      return r.top < VH && r.bottom > 0 && r.height > 0 && textOf(e).length > 0;
    });
    const firstChars = firstScreenText.reduce((a, e) => a + textOf(e).length, 0);
    if (firstChars < 200 && controls < 3 && screens > 2) {
      spatiallyExpensive.push({
        kind: "decision-below-the-fold",
        firstScreenChars: firstChars,
        controlsOnFirstScreen: controls,
        screens: +screens.toFixed(1)
      });
    }
    // The real cost is not length, it is distance. A long page is fine when
    // the reader can see where they are and what is next. It is expensive
    // when a small decision sits at the bottom of a page that gave no sign
    // it was there: no navigation, no headings pointing down, nothing that
    // lets the reader jump.
    const headings = [...document.querySelectorAll("h1,h2,h3")].filter((h) => {
      const r = rect(h);
      return r.height > 0 && r.top < VH * 20;
    });
    const deepHeadings = headings.filter((h) => rect(h).top > VH * 2).length;
    // A navigation that sits *above* the deep content is a way to jump to it.
    // One that sits below it is not.
    const jumpers = [...document.querySelectorAll("nav, [role='navigation'], .toc, .contents, .index")].filter((n) => {
      const r = rect(n);
      return r.height > 0 && r.top < VH * 2;
    });
    if (screens > 3 && deepHeadings >= 2 && jumpers.length === 0) {
      spatiallyExpensive.push({
        kind: "no-way-to-jump",
        screens: +screens.toFixed(1),
        headingsBelowSecondScreen: deepHeadings,
        navigationAboveTheDeepContent: 0
      });
    }
  }

  // ── The litmus test, measured ─────────────────────────────────────────────
  // "Why is this here, why this size, and why this far from that?"
  // A control whose label does not fit its own box is a control whose size
  // cannot be explained by its content.
  const unexplainedControls = [];
  {
    for (const c of document.querySelectorAll("button,[role='button'],a[href]")) {
      const cs = getComputedStyle(c);
      if (!visible(c, cs)) continue;
      const r = rect(c);
      if (r.width < 8 || r.height < 8) continue;
      const padL = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const padT = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      const tw = [...c.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join("");
      if (!tw) continue;
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;visibility:hidden;white-space:pre";
      probe.style.font = cs.font;
      probe.textContent = tw;
      document.body.appendChild(probe);
      const adv = probe.getBoundingClientRect().width / Math.max(1, tw.length);
      probe.remove();
      const naturalW = adv * tw.length;
      const innerW = r.width - padL;
      const ratio = innerW > 0 ? naturalW / innerW : 1;
      if (ratio < 0.55 && r.width > 120) {
        unexplainedControls.push({
          control: label(c),
          label: tw.slice(0, 40),
          fillPct: Math.round(ratio * 100),
          boxW: Math.round(r.width),
          naturalW: Math.round(naturalW)
        });
      }
    }
  }

  return {
    viewport: { w: VW, h: VH },
    scrollScreens: +(document.documentElement.scrollHeight / VH).toFixed(2),
    unjustifiedGaps: unjustifiedGaps.slice(0, 20),
    orphanElements: orphanElements.slice(0, 20),
    scatteredActions: scatteredActions.slice(0, 20),
    falseHierarchy: falseHierarchy.slice(0, 20),
    accidentalWrapping: accidentalWrapping.slice(0, 20),
    spatiallyExpensive: spatiallyExpensive.slice(0, 20),
    unexplainedControls: unexplainedControls.slice(0, 20)
  };
}

// The six modes, with the weight each carries in a review.
export const MODES = [
  { id: "unjustifiedGaps", mode: "Unjustified gaps", weight: 2, ask: "What is this space separating? If nothing, it is padding pretending to be a decision." },
  { id: "orphanElements", mode: "Orphan elements", weight: 2, ask: "What is this element doing beside this emptiness? Either it is placed or it is stranded." },
  { id: "scatteredActions", mode: "Scattered actions", weight: 2, ask: "Are these related actions in one place? If they are split, the reader has to hunt." },
  { id: "falseHierarchy", mode: "False hierarchy", weight: 1, ask: "What does the reader see first, and does that match what matters first?" },
  { id: "accidentalWrapping", mode: "Accidental wrapping", weight: 1, ask: "Did this break because it ran out of room, or because someone arranged it to?" },
  { id: "spatiallyExpensive", mode: "Spatially expensive information", weight: 1, ask: "How far must the reader travel to decide? Is that distance earned?" }
];

export function summarise(geometry) {
  const modes = MODES.map((m) => ({
    ...m,
    count: (geometry[m.id] || []).length,
    examples: (geometry[m.id] || []).slice(0, 3)
  }));
  const points = modes.reduce((a, m) => a + (m.count > 0 ? m.weight : 0), 0);
  return { modes, points, flagged: modes.filter((m) => m.count > 0).length };
}

// ---------------------------------------------------------------- CLI
export async function auditUrl(browser, url, { settleMs = 3000 } = {}) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(settleMs);
    const geometry = await page.evaluate(inPageGeometry);
    return { url, geometry, summary: summarise(geometry) };
  } finally {
    await page.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const settleArg = args.find((a) => a.startsWith("--settle="));
  const settleMs = settleArg ? Number(settleArg.split("=")[1]) : 3000;
  const urls = args.filter((a) => !a.startsWith("--"));
  if (!urls.length) {
    console.error("usage: node tools/spatial-audit.mjs <url> [more urls...] [--json] [--settle=ms]");
    process.exit(1);
  }
  const browser = await chromium.launch();
  const results = [];
  for (const url of urls) {
    try {
      results.push(await auditUrl(browser, url, { settleMs }));
    } catch (e) {
      results.push({ url, error: e.message });
    }
  }
  await browser.close();

  if (json) {
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  }
  for (const r of results) {
    console.log(`\nspatial-audit ${r.url}`);
    if (r.error) { console.log(`  ERROR ${r.error}`); continue; }
    const g = r.geometry;
    console.log(`  viewport ${g.viewport.w}×${g.viewport.h} · ${g.scrollScreens} screens`);
    for (const m of r.summary.modes) {
      if (!m.count) continue;
      console.log(`  ${m.count}×  ${m.mode}`);
      console.log(`        ${m.ask}`);
      for (const ex of m.examples) {
        const brief = Object.entries(ex)
          .filter(([k]) => k !== "kind")
          .slice(0, 3)
          .map(([k, v]) => `${k}=${typeof v === "object" ? JSON.stringify(v) : v}`)
          .join(" ");
        console.log(`        · ${ex.kind || ""} ${brief}`);
      }
    }
    if (r.summary.points === 0) console.log("  no spatial hallucination signals");
    console.log(`  — ${r.summary.flagged} of 6 modes flagged, ${r.summary.points} weight`);
  }
  console.log("\nA number is not a verdict. Look at the rectangles, then ask why the layout is the way it is.");
}
