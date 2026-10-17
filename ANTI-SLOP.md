# Anti-slop

Hard rules for Palette. Do not re-create these patterns.

They sit on the exhibition contract. One source-verified combination owns the viewport. The interface stays museum hardware. These rules do not replace that, and they do not ask for a new look on the colour field.

`npm run check` runs `scripts/check-anti-slop.mjs`. The script flags a banned face, prose past 75 characters, a missing `65ch` measure on reading text, a fixed floor under a text container, and a default stack that has drifted. A person, or a different agent, still has to look at the page for balance, hierarchy, and ornaments that only fill space.

## Where the rules are enforced

- Defaults, in the first `:root` of `styles.css` and `reading.css`: `--measure` (`65ch`), `--pad` (0.75 of the line box), `--type-body`, `--type-title`, `--type-display`, `--font-geometric`, `--font-thai-geometric`, `--font-hans`.
- Tokens, in the `interface` and `reading` sets of `tokens/palette.tokens.json`. `npm run build` writes them from those custom properties.
- Agents: `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/anti-slop.mdc`, `.github/copilot-instructions.md`.
- The brief a visitor copies from a plate (`agentBrief` in `app.js`).
- The check: `scripts/check-anti-slop.mjs`.

## Faces already proofed for this room

The colour field keeps Archivo Narrow, IBM Plex Sans Thai with `lang="th"`, Noto Sans SC with `lang="zh-Hans"`, and JetBrains Mono for figures. The reading room keeps Arial for English body text and Archivo Narrow for headings. Those faces are the exhibition. New surfaces, and any interface built from this system, use the geometric defaults.

## 1. Boxes fit their content

No text box, card, button, or panel much wider or taller than the text inside it. Padding uses `--pad`, which is 0.75 times the line box (`--leading` is 1.5, so the padding is `1.125em`). Keep padding between half a line box and one and a half. Do not invent a fixed fat padding.

No fixed height or min-height that leaves empty space under short text. The content sets the size. A 44px target is height for a control, not a tall empty box. This is the same real-estate rule as the design field guide: a control is the size of its label.

## 2. Balanced composition

Every page has a deliberate grid, and its visual weight balances. No heavy side with an empty side, and no orphan block floating alone. Check desktop, tablet, and phone, then squint. The masses should balance. The colour field is the mass on the exhibition screen. Do not add a panel to prop it up.

## 3. Readable line length

Body lines stay within an A4 or A5 line: about 45 to 75 characters, ideally 60 to 70. The default is `--measure: 65ch`. `ch` is the width of the zero, so 65ch is the house proxy, not a claim that every line holds 65 average letters. Proof the rendered line.

Thai and Chinese keep that same physical width. The column then holds fewer characters, roughly 30 to 45 Chinese characters. Do not widen it to recover the count. A wide screen gets columns or margins. It does not get a full-width paragraph.

## 4. No AI-slop fonts

Banned as a design face: Inter, Poppins, Montserrat, Roboto, Open Sans, Lato, DM Sans, Space Grotesk, Geist, Plus Jakarta Sans, Manrope, Nunito, and system-ui.

New Latin type uses `--font-geometric`. Jost is first: a free geometric face in the spirit of Futura and Bayer Universal. The licensed originals stay paid, so they are not vendored here. Josefin Sans and League Spartan are the same role when Jost is not installed. Load Jost, not all three.

New Thai uses `--font-thai-geometric`: Prompt, then Kanit. Both are non-looped. Mark the text `lang="th"`. Chinese uses `--font-hans`: Noto Sans SC, with `lang="zh-Hans"`, at the same weights as the Latin.

One Latin family on a new surface. A Thai or Chinese face is there for the script, not as a second costume. The exhibition's four faces are the exception already in the room, not a licence to add a fifth Latin family.

## 5. No lazy ornaments

No box, border, card, divider, blob, gradient, glow, or icon tile added only to fill space or balance a page. Every container groups something that belongs together. If removing it loses no meaning, remove it. No emoji as icons, no stock icons as decoration, no gradient heroes.

Palette already forbids rounded corners, gradients, drop shadows, visible borders, and decorative texture. The check fails a shadow, a gradient, glass, or a radius other than zero.

## 6. Something must win

Every page has one obvious first thing to look at, then a clear second and third. On the exhibition screen that first thing is the colour field. In the reading room it is the chapter title.

New surfaces use `--type-body`, `--type-title`, and `--type-display`. Title is 2rem against a 1.125rem body (about 1.78 times). Display is 3.5rem against the title (1.75 times). Both steps clear 1.5. Weight, colour, and space can add contrast. A grid of equal cards, where nothing competes and nothing pulls a person in, fails. Squint at a screenshot. If nothing wins, it fails.

The exhibition keeps its own `--display`, `--body`, and `--micro`. Display is already far above body. Do not restyle the instrument to the new steps.

## 7. More slop to kill

- A centred layout, or a symmetric card grid, used because it was the default.
- Fake depth: stacked shadows, glass, the same radius on everything.
- A hero with a vague slogan and no real content.
- Filler copy, and placeholder numbers that were never measured.
- Too many colours. On a product surface, one accent means something. On this exhibition, the plate is the colour and the controls stay black and white.
- Thick bars and padded chrome that shrink the main work.
- An icon or badge on every line.
- A page where all the text is the same small grey.

## Review before shipping

1. Screenshot the page at 1440, 1024, and 390 pixels wide. The house also checks 1280, 768, and 375.
2. Check rules 1 to 7. Name every hit and the element.
3. Fix the hits. Run `npm run check`. Screenshot again.
4. A different person or agent checks the result. The author of the change does not sign off alone.
