# Palette field guide

Download this file, keep it beside a project, or give it to an agent. It is a
standalone guide to using the Palette exhibition and its source data without
needing a design application, account, API key, or colour subscription.

Live room: <https://colors.nonarkara.org/>

Repository: <https://github.com/Nonarkara/palette>

## What this is

Palette is an independent interactive interpretation of Sanzo Wada's 348
historic colour combinations. It makes one relationship fill the viewport so
you can judge proportion, temperature, value, and tension at architectural
scale—not as tiny shopping swatches.

The RGB and hex values are credited digital conversions. They are useful screen
values, not claims about the exact printed inks in the book.

## Use the exhibition in two minutes

1. Open <https://colors.nonarkara.org/>. The finder welcomes people with an idea
   and people with no idea at all.
2. Choose a starting mood, type any colour, atmosphere, place, material, or use,
   or choose **NO IDEA — SURPRISE ME**.
3. Move with `←` and `→`, or press the Left and Right Arrow keys.
4. Press `⌕` or `/` at any time to search again. Try
   `ochre`, `quiet`, `poster`, `night`, `อบอุ่น`, `สงบ`, `温暖`, or `安静`.
5. Press `◐` or `C` to remove hue and inspect the value structure.
6. Choose **COPY THIS FOR YOUR AGENT** or press `⧉`. Paste the resulting brief
   into any coding agent; it already contains tokens, roles, proportions,
   contrast instructions, provenance, and the stable plate link.
7. Press `{}` or `J` to inspect and copy the current plate as portable JSON.
8. Press `i` or `I` for the English, Thai, and Simplified Chinese reading.
9. Press `A` for Dr Non's Red / Black study, research position, and two system
   diagrams.
10. Copy the URL. Every plate has a stable address such as `#plate-087`.

The complete instrument:

| Symbol | Action | Keyboard |
|---|---|---|
| `←` | Previous relationship | Left Arrow |
| `→` | Next relationship | Right Arrow |
| `↻` | Chance encounter | `R` |
| `⌕` | Search | `/` |
| `≡` | Complete index | `G` |
| `◐` | Grayscale value study | `C` |
| `A` | About, research, and system architecture | `A` |
| `{}` | View and copy portable plate JSON | `J` |
| `⧉` | Copy an agent-ready implementation brief | — |
| `i` | Principles and Dr Non's Digest | `I` |

## Turn a plate into a working interface

Do not assign colours by taste alone. Give each one a job.

### Two-colour plate

- Dominant field: approximately 61.8% of the visual area.
- Counter-field: approximately 38.2%.
- Text: black or white chosen by measured contrast, not intuition.

If that split makes text fail, the split is wrong. Precedence: [Conflict order](CONFLICT-ORDER.md).

Use the dominant colour for the main surface and the counter-colour for one
large region, navigation rail, data layer, or decisive state. Avoid sprinkling
both colours across dozens of small components; that destroys the relationship.

### Three- or four-colour plate

- First colour: atmosphere and large surfaces.
- Second colour: structural counterweight.
- Third colour: information, annotation, or secondary state.
- Fourth colour: rare signal only.

Area is part of the palette. Equal swatches do not imply equal use.

### Five-step gate

1. **Enlarge it.** Judge the pairing across a whole viewport.
2. **Remove hue.** If every region collapses into one gray, repair the value
   structure before writing components.
3. **Assign roles.** Name each colour's job in one sentence.
4. **Measure text contrast.** WCAG AA body text needs at least 4.5:1. Use the
   exact rendered foreground value in the calculation.
5. **Test without colour.** Names, state, hierarchy, and controls must remain
   understandable when hue disappears.

## MoMA rule and Mama Rule

The MoMA rule concerns judgment: let the object dominate; make labels quiet;
use scale, alignment, spacing, and position before adding boxes or decoration.

The Mama Rule concerns usability: give the working result to an older,
nontechnical first-time visitor. Offer a goal, not instructions. If they cannot
understand the purpose, perform the main action, recognize success, and recover
from one ordinary mistake without coaching, the design is not finished.

## Anti-slop checklist

When these rules disagree, follow [Conflict order](CONFLICT-ORDER.md). A ban list is not a new look. Another costume is still decoration. A familiar control that does a job is not a failure. This list does not detect authorship and it does not record a user test.

Refuse an unexamined default. Also refuse the costume that people put on to escape the default.

- No control without a named human task.
- No rounded card grid, gradient, glow, glass, drop shadow, or a card drawn twice by a hairline and a shadow.
- No purple-to-blue gradient, gradient-filled type, or a lavender field standing in for a plate.
- No second palette. Cream and terracotta, near-black with acid green, neon on dark, and a single emerald accent are costumes when they replace the verified combination.
- No colour used as the only status indicator.
- No invented history, quotation, plate number, or printed-colour claim.
- No extra type family chosen to escape a default face. Read the text first. One italic accent word is not a hierarchy. Keep body text out of capitals. Do not crush or widen tracking on prose. Do not set interface text below a readable size. A character-count rule for Latin prose is not a law for Thai or Chinese.
- Caps, mono, a chapter number, or a warm paper ground can stay when each one has a job. The exhibition's instrument labels and plate numbers are that case.
- No three identical cards, a badge stacked on a centered headline, a row of logos, pricing rings, or emoji used as navigation, unless the task itself is that content.
- No stock page order standing in for a decision: hero, logos, features, stats, pricing, call to action.
- No fade on every section, bounce on a dialog, count-up numbers, a marquee, a blinking cursor, or motion that ignores reduced motion.
- No empty praise in place of the action. Do not write elevate, seamless, powerful, supercharge, world-class, or get started when the control has a real name.
- No “AI-powered” claim: search and readings here are local and deterministic.
- No inaccessible off-black approximation hidden behind pure-black contrast math. Measure the value actually rendered.
- No component library, font catalogue, or slop scanner as a substitute for the task.

Remove the names. If the arrangement would still fit any product, the composition is unfinished.

## Clone, run, and fork

Requirements: Git and Python 3. Node.js is needed only for the checks.

```bash
git clone https://github.com/Nonarkara/palette.git
cd palette
python3 -m http.server 4173
```

Open <http://localhost:4173>. Directly opening `index.html` will not load the
JSON data in browsers that block local-file requests.

Run the integrity gates:

```bash
npm run check
```

Before publishing a fork:

1. Replace the title and original editorial writing with your own voice.
2. Preserve `THIRD_PARTY_NOTICES.md` and the upstream data attribution.
3. Keep the distinction between digital conversion and printed ink.
4. Test widths of 375, 768, and 1280 CSS pixels.
5. Navigate without a mouse and test at 200% zoom.
6. Run an automated accessibility audit, then conduct a real human walkthrough.
7. Verify the deployed URL and the actual JavaScript/CSS bytes, not only the
   deployment dashboard.

## Wallpaper downloads and search

Choose `↓` to download the current combination as a PNG: phone 1440 × 3120,
iPad/tablet 2048 × 2732, or desktop 3840 × 2160. The labelled version includes
source colour names, hex values, plate number, and Dr Non/Wada credits. Disable
labels for a plain colour field. The original colours are used even when the
exhibition is in grayscale. Your device generates the image; nothing is uploaded.
Save it to Photos or your image library, then set it as wallpaper. Your device's
crop and zoom settings may change the visible proportions.

Search accepts everyday moods, purposes, colour families in English/Thai/Chinese,
hex values and plate numbers. Try `cozy`, `romantic`, `calm ocean`, `red and black`,
`สีแดงสีดำ`, `红色黑色` or `plate 042`. Fillers such as “I want a palette” are ignored.
Simple one-letter spelling errors are tolerated when there is one clear match.
If no palette matches every meaningful word, partial matches are explicitly
labelled **related**. Unsupported words are not silently given an invented meaning.
Mood associations remain curatorial suggestions, not universal colour psychology.

<span lang="th">กด ↓ เลือกขนาดโทรศัพท์ แท็บเล็ต หรือคอมพิวเตอร์ แล้วดาวน์โหลด PNG
เลือกให้มีชื่อสีและค่าสี หรือปิดข้อความเพื่อใช้สีล้วน ลองค้น “สงบ” “ทะเล”
หรือ “สีแดงสีดำ” ผลลัพธ์ที่ตรงเพียงบางคำจะบอกว่าเป็นชุดสีที่เกี่ยวข้อง</span>

<span lang="zh-Hans">点击 ↓，选择手机、平板或电脑尺寸，下载 PNG。
可保留色名与色值，也可关闭文字，使用纯色块。试试“平静”“海洋”或“红色黑色”。
只匹配部分关键词的结果会明确标为相关配色。</span>

For the browser regression suite: `npm ci`, `npx playwright install chromium`,
then `npm run verify:browser`. It verifies real PNG downloads, names, dimensions,
search states, JSON and responsive layouts. Playwright is a development-only
dependency; the exhibition itself needs no package install or service.

## Data shape

`data/colors.json` contains 159 named colours. Each object supplies a name,
screen conversion, and the combination numbers in which it appears:

```json
{
  "name": "English Red",
  "rgb": [217, 102, 41],
  "hex": "#d96629",
  "combinations": [1, 19, 47]
}
```

The application reconstructs a plate by collecting every colour that names the
same combination number. Tests assert that this produces exactly 348 unique
plates containing two, three, or four colours.

The `{}` instrument exports a self-describing `palette-exhibition/1` object. In
addition to the colour values, it includes the plate URL, field roles and area
shares, the exhibition's computed reading, a ready-to-paste agent prompt, source attribution, and caveats that
separate software interpretation from Wada's work and screen conversion from
printed ink. The visible code can be selected manually if clipboard permission
is unavailable.

## Files worth reading

- `README.md` — public catalogue and project map.
- `ABOUT.md` — curatorial argument and research question.
- `context.md` — visual contract and conservation law.
- `CONFLICT-ORDER.md` — precedence when the contract rules disagree.
- `app.js` — reconstruction, search, classification, and interaction.
- `content.js` — multilingual search vocabulary and suggested-use language.
- `data/colors.json` — credited source data.
- `THIRD_PARTY_NOTICES.md` — licence and provenance.
- `docs/walkthroughs/` — cognitive walkthrough evidence and release roadmap.

## Reuse boundary

The application code and original writing are MIT licensed. The included data
comes from Matt DesLauriers' MIT-licensed
`dictionary-of-colour-combinations`, which credits Dain M. Blodorn Kim's
earlier compilation. The historical combinations are credited to Sanzo Wada.

This project does not reproduce book scans, cover art, publisher copy, or claim
affiliation with Seigensha, the Wada estate, or the upstream authors. Preserve
those boundaries when you fork it.
