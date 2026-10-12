English · [简体中文](README.zh-CN.md) · [ไทย](README.th.md)

# Palette

One of Sanzo Wada’s 348 colour combinations fills the screen. The instrument stays at the edge.

![Plate 002 as the exhibition renders it. The left field is Yellow Orange, the right field is Dark Tyrian Blue, and a black instrument rail stands at the right. The plate reads warm–cool tension, electric, measured contrast, suggested room night instrument. Black text on the largest field is 9.8:1, AA body pass.](assets/readme/plate-002.png)

Plate 002, Yellow Orange and Dark Tyrian Blue, from a local render of this repository. The hex values on the fields are the credited digital conversion, not a measurement of printed ink.

The public address is <https://colors.nonarkara.org/>. GitHub Pages keeps a mirror at <https://nonarkara.github.io/palette/>.

## Enter

Open the room with a word, a mood, or no plan.

The door asks for a feeling: a colour, a place, a material, or a use. `calm ocean`, `red and black`, `minimalist website`, `สีแดงสีดำ`, `红色黑色`, a hex value, or a plate number are all ordinary searches. Six moods are already on the door: quiet, warm, punk, night, airy, earthy. **NO IDEA — SURPRISE ME** opens a room at random, and so does `↻`.

Search runs on the device. It does not call a model. A plate number, with or without the word “plate”, returns that plate. A hex value returns the plates that use it. English, Thai, and Chinese colour words are listed in the vocabulary; some traditional Chinese glyphs are accepted there as aliases. The Chinese prose in the room is Simplified. English words of four letters or more tolerate a one-letter misspelling only when one alias fits. Thai and Chinese are matched as written, including when two colour names are run together. If every meaningful word matches, those plates lead. If only some match, the result says they are related. A word with no match can return nothing.

When a relationship is the one you want, **COPY THIS FOR YOUR AGENT** copies a brief: named CSS variables, roles, unequal shares, a contrast instruction, the source boundary, the MIT line, and the stable URL `https://colors.nonarkara.org/#plate-NNN`. The `⧉` control copies the same brief. Paste it into a coding agent.

`{}` opens the same plate as JSON (`palette-exhibition/1`): names, RGB, hex, the shares used in this room, the computed reading, an agent prompt, and the URL. If the clipboard is blocked, the JSON can still be selected.

`↓` builds a PNG on the device. Nothing is uploaded. Phone 1440 × 3120, tablet 2048 × 2732, computer 3840 × 2160. Labels can stay (names, hex, plate, credit) or go. Portrait files stack the fields. Landscape files set them side by side. The file uses the original conversions even while the room is in grayscale. A phone may still crop the picture after download.

`1:1` opens the contrast sheet on the lower part of the screen, so the fields stay visible. It reports WCAG 2.2 ratios in words: black and white text on each field (4.5:1 for body, 3:1 for large) and each place two fields meet (4.5:1 for body, 3:1 for a non-text boundary). The shown figure is floored to one decimal. Pass and fail use the unrounded ratio, so a value is not rounded up into a pass. The same sheet can preview protanopia, deuteranopia, and tritanopia with the Machado, Oliveira and Fernandes 2009 severity-1.0 matrices in linear sRGB, or grayscale. Names and hex values stay the original conversions. The preview is not a clinical test. Exports copy the originals, not the preview: CSS custom properties, Tailwind v4 `@theme` and v3 `theme.extend.colors`, Design Tokens JSON (`$type`, `$value`), or the plate link.

`Aa` leaves this tab for the [reading room](reading.html): composition, type, and a record of what was actually read. The long form is [DESIGN-FIELD-GUIDE.md](DESIGN-FIELD-GUIDE.md) and [TYPOGRAPHY-FIELD-GUIDE.md](TYPOGRAPHY-FIELD-GUIDE.md). Those two guides are in English.

The working method, in three languages:

- [PALETTE-FIELD-GUIDE.md](PALETTE-FIELD-GUIDE.md)
- [PALETTE-FIELD-GUIDE.zh-CN.md](PALETTE-FIELD-GUIDE.zh-CN.md)
- [PALETTE-FIELD-GUIDE.th.md](PALETTE-FIELD-GUIDE.th.md)

## The instrument

The rail is the only chrome. At widths up to 760px it moves to the bottom and can scroll sideways. Every control is a button or a link, at least 44 × 44 CSS pixels, with a name for assistive technology. The plate change animates for 260ms. `prefers-reduced-motion` cuts animation and transition to a negligible duration.

| Mark | What it does | Key |
|---|---|---|
| `Aa` | Reading room, same tab | — |
| `←` | Previous relationship | Left arrow |
| `→` | Next relationship | Right arrow |
| `↻` | Chance | `R` |
| `⌕` | Search | `/` |
| `1:1` | Contrast, colour-vision preview, copy formats | `K` |
| `◐` | Grayscale. Hue is removed. Names, hex, and ratios stay with the original conversions | `C` |
| `↓` | Wallpaper PNG | — |
| `≡` | Index, filtered to 2, 3, or 4 colours | `G` |
| `A` | Dr Non, the research, the Red / Black study | `A` |
| `{}` | Portable JSON | `J` |
| `⧉` | The same agent brief as the labelled button | — |
| `i` | Principles and Dr Non’s Digest | `I` or `?` |

Arrow keys, `/`, and letters are ignored while a sheet is open, while you are typing, or while Command, Control, or Alt is held. The browser keeps those shortcuts.

Colour is not the only carrier. Plate number, names, the reading, and the contrast line remain text.

## What this edition adds

Wada’s unit is the relationship. This edition makes the relationship large, and it gives the two, three, and four colours unequal areas. Two colours are weighted 1.618 to 1, about 61.8 / 38.2. Three use 1.45, 0.9, and 0.65. Four use 1.55, 0.85, 0.7, and 0.55. One field stays dominant. Those shares belong to this room. They are not a rule taken from the printed plates.

The page then computes a reading in the browser:

- temperature: warm-led, cool-led, or warm–cool tension
- energy: quiet, clear, or electric
- value: light, mid-tone, or dark
- contrast: close values, measured contrast, or high contrast
- a suggested room, from a closed list: quiet editorial, domestic warmth, night instrument, botanical study, electric argument, mineral calm, confectionery shock, civic daylight, archival room

Plate 002, the picture above, shows this line: warm–cool tension; electric; measured contrast. Suggested room: night instrument. Value is computed too, and for this plate it is dark. That word is not in the one-line reading. The readings are Dr Non’s, deterministic, and not Wada’s words. They do not call an API.

`A` is the research room. It includes a personal study, Red `#A72144` and Black `#111314`, described there as classy and dangerous. That pair is not presented as one of the 348. The same room keeps a short, sourced chronology of Sanzo Wada (1883–1967): *South Wind*; the Japan Standard Color Association in 1927; *Haishoku Sōkan* (1933–34), later republished as *A Dictionary of Color Combinations*; Costume Design (Color) for *Gate of Hell* at the 27th Academy Awards; Person of Cultural Merit in 1958. The links are [Art Platform Japan](https://artplatform.go.jp/artists/A2089), [the Academy Awards record](https://www.oscars.org/oscars/ceremonies/1955/C), and [Seigensha](https://en.seigensha.com/books/978-4-86152-247-5/). The argument is also written out, more briefly, in [ABOUT.md](ABOUT.md), [ABOUT.zh-CN.md](ABOUT.zh-CN.md), and [ABOUT.th.md](ABOUT.th.md).

The Digest, behind `i`, is written three times: English, Thai (`lang="th"`, IBM Plex Sans Thai, non-looped), and Simplified Chinese (`lang="zh-Hans"`, Noto Sans SC). The instrument labels are English. Wallpaper labels repeat in all three.

## Credit

Sanzo Wada supplied the relationships. [Matt DesLauriers’ `dictionary-of-colour-combinations`](https://github.com/mattdesl/dictionary-of-colour-combinations) (MIT, copyright 2020) is the file in `data/colors.json`. It corrected and repackaged the earlier MIT compilation by [Dain M. Blodorn Kim](https://github.com/dblodorn/sanzo-wada) (copyright 2024). Kim’s code is not in this repository. RGB and hex values are that dataset’s screen conversions.

Dr Non Arkaraprasertkul supplied the selection, the unequal areas, the interface, the search words, the roles, the diagrams, and the readings. There is no affiliation with Seigensha, the Wada estate, or the data authors. The site does not reproduce scans, cover art, or publisher text.

Type is Archivo Narrow (Omnibus-Type), IBM Plex Sans Thai (IBM), Noto Sans SC (Google), and JetBrains Mono (JetBrains), SIL Open Font License, requested from Google Fonts. That request is a font host. The pages carry a Content-Security-Policy and no analytics script.

The contrast math is the WCAG 2.2 relative-luminance formula. The colour-vision matrices are Machado, Oliveira and Fernandes, 2009. Neither is a claim about the printed book, and the preview is not a diagnosis.

Books, papers, and the sites that were studied and not copied are named in [CREDITS.md](CREDITS.md) and on [the credits page](credits.html). Nothing in that list is an endorsement.

The visual contract for people changing the room is [context.md](context.md). It is in English.

## Run

Python 3 serves the room. Opening `index.html` as a file will not load the JSON.

```bash
python3 -m http.server 4173
```

`npm run dev` runs that command. Open <http://127.0.0.1:4173>. Stop the server with Ctrl-C.

Node.js is for the checks:

```bash
npm run check
```

The checks hold the dataset at 159 unique named colours and 348 plates, each plate two, three, or four colours: 120, 120, and 108. They also hold the multilingual markup, the provenance lines, and the bans on gradients, shadows, and a few other tells. They do not judge the room.

Before a release, also walk it without a mouse, at 200% zoom, at 375, 768, and 1280 CSS pixels, with reduced motion, and search in English, Thai, and Chinese. `npm run verify:browser` is the scripted pass. It needs `npm ci` and Playwright’s Chromium. The exhibition itself does not.

## Status

This public edition is `0.1.0`, made by Dr Non Arkaraprasertkul with Codex. The Mama Rule — an older, nontechnical person, first visit, no coaching — is the gate for a `1.0` tag. It has not been run. A fluent reader has not signed the Thai or the Chinese in this repository; the three texts were written to carry the same facts, and that review is still open.

## Licence

Two MIT grants. They do not relicense each other.

- **This exhibition’s code and writing** — [LICENSE](LICENSE). Copyright 2026 Non Arkaraprasertkul. Use it, fork it, change it, ship your own.
- **The colour file** — `data/colors.json` stays under Matt DesLauriers’ MIT licence. The notice is copied in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Keep the digital-conversion caveat.
- **Everything else** — books, font files, papers, and other sites keep their own rights. [CREDITS.md](CREDITS.md).

## Closing plate

![A flat-colour closing plate. A black cat with an umbrella stands on Yellow Orange. A smaller paper-white robot stands on Dark Tyrian Blue, holding a card that reads 1:1. The black instrument rail is at the right.](assets/readme/closing-panel.png)

Drawn for this repository. Flat colour, hard edges, no ink wash. The cat is the catalogue Black; the inner ears are Hermosa Pink; the nose is the catalogue Red. The collar reads 348. The robot’s chest is the JSON mark, its flag is 002, and the backpack is Plate 001, English Red and Cerulian Blue, spelled as the dataset spells it. The ticket says NO IDEA. None of these details is a new Wada combination. The drawing’s source is [assets/readme/closing-panel.svg](assets/readme/closing-panel.svg).
