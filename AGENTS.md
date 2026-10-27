> **Read [ANTI-SLOP.md](ANTI-SLOP.md) before any design or frontend work.** These are Dr Non's hard rules against AI design slop: empty space is a decision, subtract before you add, and the map comes first. Run `tools/slop-lint.mjs` on any page you ship.

> **Read [REMEDIES.md](REMEDIES.md) when a rule fires.** The doctrine says what is wrong; this says where to go instead, and names a real place to look for each destination. A rule that only says "no" leaves you to invent the alternative, and inventing an alternative under time pressure is how you get a purple gradient.

> **Check the brief before you build from it.** `node tools/brief-lint.mjs <file>` reports every vague directive that carries no anchor — no number, no material, no named reference. "Make it more premium" is the cause of most slop, and no other check in this repo reads Markdown.

For composition and image-placement reviews, read [Anti-spatial-hallucination](ANTI-SPATIAL-HALLUCINATION.md). Its hero patterns do not override Palette’s full-viewport colour field, instrument rail or prohibition on decorative effects.
Measure the geometry with `node tools/spatial-audit.mjs <url>` before shipping a page. It reports the six failure modes as rectangles; the numbers are not a verdict, but a mode that never fires is a mode nobody looked at.

For a visual register, read [Fifty design styles](DESIGN-STYLES.md) — but name the abstract core **before** the style, never after. A style chosen before the subject produces the same page for everyone.

# Palette — agent contract

<!-- decision-geometry:v1 -->
## Task geometry before styling

Read [Decision geometry](DECISION-GEOMETRY.md) for every UI composition change.
Trace oversized introductions, sibling-stretched maps and separated controls to
the first unnecessary expansion. Keep the task, its evidence and its next action
legible together. Color, typography, alignment and zero horizontal overflow do
not clear a failed composition. Preserve earned content and operating regions;
use task-specific budgets, real viewport/state captures, a failing regression
mutation and independent review. The guide's fixture numbers are not universal.
<!-- /decision-geometry:v1 -->


For typography decisions, read `skills/bringhurst-contextual-type/SKILL.md`.
Proof actual content, role and script before changing fonts. The reading-room
chapter and `TYPOGRAPHY-FIELD-GUIDE.md` teach the method without changing the
colour-field product or granting automatic house-rule exceptions.

For era, nostalgia or any surface without a named reference, read
`skills/humanized-nostalgia-design/SKILL.md` and call the `humanized-design`
MCP (`mcp/index.mjs`) before styling.

## Purpose

Palette is an interactive exhibition of Sanzo Wada's 348 colour combinations.
The colour field is the product. The interface is museum hardware.

For authored-design work, read `skills/bauhaus-human-design/SKILL.md`. It adds
content-led composition, communication and observed-task gates above style
compliance; it does not override these conservation laws. Longer design writing
lives in `reading.html`, not over the colour field. Source-book files stay private.

## Conservation law

One source-verified combination owns the viewport. Interface chrome never
competes with it.

## Commands

```bash
npm test
npm run check
npm run dev
npm run audit
```

## Sacred constraints

- Never replace the full-viewport colour field with cards or a conventional gallery.
- No rounded corners, gradients, drop shadows, visible borders, custom cursors, or decorative texture.
- Keep every action keyboard-operable and every target at least 44 × 44 CSS pixels.
- Colour is never the only carrier: plate number, names, count, and text remain available.
- Thai uses non-looped faces and `lang="th"`; Chinese is Simplified and uses `lang="zh-Hans"`.
- Do not call RGB/hex values the exact printed colours. They are the credited digital conversion.
- Do not invent Wada plate numbers, names, quotations, or historical claims.
- User-facing prose must stay plain. No AI marketing language.
- Preserve upstream attribution in `THIRD_PARTY_NOTICES.md` and `data/colors.json`.

## Ship

Commit with `Agent: codex`, push to `main`, deploy through GitHub Pages, then
exercise search, navigation, dialogs, copy, keyboard controls, and mobile layout
on the live URL.

<!-- non-slop:start -->
## Design quality: Non-Slop
Before any UI, page, dashboard, deck or visual work, read `.non-slop/AGENTS.md` and follow it.
`STYLE.md` lists this repo's deliberate choices: it wins over every generic rule, and nothing listed there is stripped.
Check with `node .non-slop/bin/non-slop.mjs scan .` (and `render <url>` when Playwright is installed). A different agent or person reviews; never self-review.
<!-- non-slop:end -->
