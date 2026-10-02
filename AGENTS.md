# Palette — agent contract

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
