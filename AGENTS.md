# Palette — agent contract

For typography decisions, read `skills/bringhurst-contextual-type/SKILL.md`.
Proof actual content, role and script before changing fonts. The reading-room
chapter and `TYPOGRAPHY-FIELD-GUIDE.md` teach the method without changing the
colour-field product or granting automatic house-rule exceptions.

## Purpose

Palette is an interactive exhibition of Sanzo Wada's 348 colour combinations.
The colour field is the product. The interface is museum hardware.

For authored-design work, read `skills/bauhaus-human-design/SKILL.md`. It adds
content-led composition, communication and observed-task gates above style
compliance; it does not override these conservation laws. When the rules
disagree, apply `CONFLICT-ORDER.md` in the order written there. Longer design
writing lives in `reading.html`, not over the colour field. Source-book files
stay private.

## Conservation law

One source-verified combination owns the viewport. Interface chrome never
competes with it.

## Commands

```bash
npm test
npm run check
npm run dev
```

## Sacred constraints

- Never replace the full-viewport colour field with cards or a conventional gallery.
- No rounded corners, gradients, drop shadows, visible borders, custom cursors, or decorative texture.
- Anti-slop bans do not license a replacement font, palette, or component library. Another costume is still decoration. Read `PALETTE-FIELD-GUIDE.md` before generating a surface from a plate.
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
