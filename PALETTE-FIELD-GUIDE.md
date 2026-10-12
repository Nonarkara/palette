English · [简体中文](PALETTE-FIELD-GUIDE.zh-CN.md) · [ไทย](PALETTE-FIELD-GUIDE.th.md)

# Palette field guide

Download this file, keep it beside a project, or give it to a coding agent. It explains the Palette exhibition and its source data without a design application, an account, an API key, or a colour subscription.

Live room: <https://colors.nonarkara.org/>

Repository: <https://github.com/Nonarkara/palette>

## What this is

Palette is an independent interactive reading of Sanzo Wada’s 348 colour combinations. One relationship fills the viewport, so proportion, temperature, value, and tension can be judged at the scale of a room.

The RGB and hex values are credited digital conversions. They are useful on a screen. They are not claims about the printed inks.

## Use the room

1. Open <https://colors.nonarkara.org/>. The door is for a person with an idea and a person with none.
2. Choose a mood, type a colour, atmosphere, place, material, or use, or choose **NO IDEA — SURPRISE ME**.
3. Move with `←` and `→`, or the arrow keys.
4. Press `⌕` or `/` to search again. Try `ochre`, `quiet`, `poster`, `night`, `อบอุ่น`, `สงบ`, `温暖`, or `安静`.
5. Press `◐` or `C` to remove hue and look at value.
6. Press `1:1` or `K` for WCAG 2.2 contrast, a colour-vision preview, and copyable CSS variables, a Tailwind theme, JSON tokens, or the plate link.
7. Choose **COPY THIS FOR YOUR AGENT** or press `⧉`. The brief already has tokens, roles, proportions, a contrast instruction, provenance, and the stable plate link.
8. Press `{}` or `J` for the current plate as portable JSON.
9. Press `i` or `I` (or `?`) for the English, Thai, and Simplified Chinese reading.
10. Press `A` for the Red / Black study, the research position, and the two diagrams.
11. Press `↓` for a PNG wallpaper. Copy the URL. Every plate has an address such as `#plate-087`.

| Mark | What it does | Key |
|---|---|---|
| `←` | Previous relationship | Left arrow |
| `→` | Next relationship | Right arrow |
| `↻` | Chance | `R` |
| `⌕` | Search | `/` |
| `1:1` | Contrast ratios, colour-vision preview, and copy formats | `K` |
| `≡` | Index | `G` |
| `◐` | Grayscale value study | `C` |
| `↓` | Wallpaper PNG | — |
| `A` | About, research, and the Red / Black study | `A` |
| `{}` | Portable plate JSON | `J` |
| `⧉` | Agent brief | — |
| `i` | Principles and Dr Non’s Digest | `I` |

On a narrow screen the rail sits along the bottom.

## Give each colour a job

Do not assign the colours by taste alone.

### Two colours

Weighted 1.618 to 1, about 61.8 / 38.2. The copied brief rounds those shares to whole percents. Text is black or white by measured contrast on the actual field.

Use the dominant colour for the main surface and the other for one large region: a rail, a data layer, or one decisive state. Sprinkling both colours across dozens of small components ends the relationship.

### Three or four colours

Weights for three: 1.45, 0.9, 0.65. For four: 1.55, 0.85, 0.7, 0.55.

- First colour: atmosphere and large surfaces.
- Second: the structural counterweight.
- Third: information, annotation, or a secondary state.
- Fourth: a rare signal only.

Area is part of the palette. Equal swatches do not mean equal use. These shares are this exhibition’s layout, not Wada’s instruction.

### Five checks

1. **Enlarge it.** Judge the pairing across a whole viewport.
2. **Remove hue.** If every region falls into one gray, repair the value structure before drawing components.
3. **Name the job.** One sentence for each colour.
4. **Measure the text.** WCAG 2.2 AA body text needs at least 4.5:1 against the rendered background. The `1:1` sheet does this for the plate and does not round a failure up into a pass.
5. **Turn colour off.** Names, state, hierarchy, and controls still have to make sense.

## Two rules for judgment

**MoMA.** Let the object dominate. Keep labels quiet. Use scale, alignment, spacing, and position before adding boxes.

**Mama.** Hand the working result to an older, nontechnical first-time visitor. Offer a goal, not a manual. If they cannot see the purpose, do the main action, recognise success, and recover from one ordinary mistake without coaching, the design is not finished. This visit has not been run for Palette. The edition stays `0.1.0` until it has.

## Don't make users do the backend's job.

The system infers, defaults, and saves. The screen shows exceptions and the decisions only a person can make. No button for a thing that should already have happened. No decoration without a job. Lead with the real benefit; do not bury it in a footnote.

Dr Non’s example of the failure is a Thai teacher attendance card: a tap per student per status, a manual save, stat tiles that restate the counts, solemn stock 3D icons, and the real benefit left in a footnote.

Before a control is added, ask three questions:

1. Could the system already know this?
2. Could it be a default?
3. Does this need a save step?

Forms and lists. Do: show the rows that need a decision, assume the rest, and save as the person works. Don't: one control per status per row, a save button, summary tiles that repeat the list, and an icon that does not name a state.

## What not to add

The field notes are in [docs/design-slop-field-guide.md](docs/design-slop-field-guide.md). Short form:

- No card grid between the visitor and the colour.
- No gradient, shadow, glass, fake texture, or decorative dashboard.
- No colour as the only status.
- No invented history, quotation, plate number, or printed-ink claim.
- No extra type family because one paragraph feels difficult.
- No button for work the system should already have done.
- No animation without a state change. The plate animation is 260ms, and reduced motion nearly removes it.
- No “AI-powered” claim. Search and readings here are local and deterministic.
- No off-black passed off as pure black. Measure the value that is actually rendered.

## Run a fork

Git and Python 3 are enough to look. Node.js is for the checks.

```bash
git clone https://github.com/Nonarkara/palette.git
cd palette
python3 -m http.server 4173
```

`npm run dev` runs the same Python command. Open <http://127.0.0.1:4173>. Opening `index.html` as a file will not load the JSON.

```bash
npm run check
```

Before publishing a fork: replace the title and the editorial writing with your own voice; keep [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and the upstream attribution; keep the difference between digital conversion and printed ink; test 375, 768, and 1280 CSS pixels; navigate without a mouse at 200% zoom; run an automated accessibility check, then a real walkthrough; verify the deployed URL and the actual JavaScript and CSS, not only the dashboard.

`npm run verify:browser` needs `npm ci` and Playwright’s Chromium. It checks PNG downloads, names, dimensions, search, JSON, and layout. Playwright does not ship in the exhibition.

## Search and wallpapers

Search takes moods, uses, colour families in English, Thai, and Chinese, hex values, and plate numbers. Try `cozy`, `romantic`, `calm ocean`, `red and black`, `สีแดงสีดำ`, `红色黑色`, or `plate 042`. Filler such as “I want a palette” is ignored. A one-letter English misspelling is tolerated only when one alias fits. Partial matches are labelled related. An unsupported word is not given an invented meaning. Mood links are curatorial suggestions, not universal colour psychology.

`↓` downloads the current combination: phone 1440 × 3120, tablet 2048 × 2732, desktop 3840 × 2160. Labels include the source names, hex values, plate number, and the Wada / Dr Non credit. Turn labels off for a plain field. Original colours are used even in grayscale. The image is made on the device. A phone’s crop may change what you see.

## Data

`data/colors.json` holds 159 named colours. Each object has a name, a screen conversion, and the combination numbers it belongs to. English Red, as it actually appears:

```json
{
  "name": "English Red",
  "rgb": [217, 102, 41],
  "hex": "#d96629",
  "combinations": [1, 131, 190, 308, 339]
}
```

A plate is every colour that lists the same combination number. The tests require exactly 348 unique plates of two, three, or four colours: 120, 120, and 108.

`{}` exports `palette-exhibition/1`. Besides the colours it carries the plate URL, field roles and area shares, the computed reading, an agent prompt, attribution, and the caveat that separates this software from Wada’s work and the screen conversion from printed ink. The visible code can be selected if the clipboard is blocked.

## Files

- `README.md`, `README.zh-CN.md`, `README.th.md` — the public entrance.
- `ABOUT.md` and its Chinese and Thai siblings — the question.
- `context.md` — the visual contract, in English.
- `app.js` — reconstruction, search, classification, interaction.
- `palette-measure.js` — contrast, colour-vision preview, copy formats.
- `palette-tools.js` — search and wallpaper geometry.
- `content.js` — search vocabulary and suggested-use words.
- `data/colors.json` — the credited source.
- `THIRD_PARTY_NOTICES.md` and `CREDITS.md` — licence and the borrowed-idea list.
- `credits.html` — the same credit, as a page.

## Reuse

Application code and original writing are MIT, copyright 2026 Non Arkaraprasertkul, in [LICENSE](LICENSE). That file does not relicense the colour data. The data stays under Matt DesLauriers’ MIT licence (copyright 2020), via Dain M. Blodorn Kim’s earlier MIT compilation (copyright 2024). Historical combinations are credited to Sanzo Wada.

No book scans, cover art, or publisher copy. No affiliation with Seigensha, the Wada estate, or the upstream authors. Keep those boundaries in a fork.
