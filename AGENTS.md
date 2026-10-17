# Palette — agent contract

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

## Anti-slop

Read `ANTI-SLOP.md` before designing, building, or reviewing a surface. These patterns must not be re-created. `npm run check` runs `scripts/check-anti-slop.mjs`.

- A text box fits its text. Padding uses `--pad`, which scales with the line box. No fixed min-height on a text container. A 44px target is the height of a control.
- Prose uses `--measure` (`65ch`). Thai and Chinese keep that physical width.
- New Latin type uses `--font-geometric` (Jost, then Josefin Sans or League Spartan). New Thai uses `--font-thai-geometric` (Prompt, then Kanit) with `lang="th"`. Chinese uses `--font-hans` (Noto Sans SC) with `lang="zh-Hans"`.
- Banned as a design face: Inter, Poppins, Montserrat, Roboto, Open Sans, Lato, DM Sans, Space Grotesk, Geist, Plus Jakarta Sans, Manrope, Nunito, and system-ui.
- No ornament added only to balance a page. One thing on the page must win. New surfaces step type with `--type-body`, `--type-title`, and `--type-display` (at least 1.5 times between steps).
- The colour field keeps Archivo Narrow, IBM Plex Sans Thai, Noto Sans SC, and JetBrains Mono. The reading room keeps Arial and Archivo Narrow. Do not restyle them to apply the new defaults.

## Ship

Commit with `Agent: codex`, push to `main`, deploy through GitHub Pages, then
exercise search, navigation, dialogs, copy, keyboard controls, and mobile layout
on the live URL.
