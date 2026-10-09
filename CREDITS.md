# Credits

Palette is an independent exhibition. It borrows ideas on purpose and names them here.
Nothing on this list is an endorsement by the people or organisations named.

Original exhibition code and writing are [MIT](LICENSE), copyright 2026 Non Arkaraprasertkul.
The colour data is not relicensed by that file. It stays under the upstream MIT terms in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
Books, paintings, font files, papers, and other sites keep their own rights.

## Colour source

- **Sanzo Wada** (1883–1967). The 348 relationships come from his colour research, including *Haishoku Sōkan* (1933–34), later republished as *A Dictionary of Color Combinations*. Publisher: [Seigensha](https://en.seigensha.com/books/978-4-86152-247-5/). Further records already used in the exhibition: [Art Platform Japan](https://artplatform.go.jp/artists/A2089), [Seigensha publication history](https://en.seigensha.com/books/978-4-86152-772-2/). This site does not reproduce book scans, cover art, or publisher text. RGB and hex values are credited digital conversions, not measurements of printed ink.
- **Matt DesLauriers**, [`dictionary-of-colour-combinations`](https://github.com/mattdesl/dictionary-of-colour-combinations). MIT, copyright 2020 Matt DesLauriers. This is the digital dataset in `data/colors.json`.
- **Dain M. Blodorn Kim**, [`dblodorn/sanzo-wada`](https://github.com/dblodorn/sanzo-wada). MIT, copyright 2024 Dain Blodorn. The earlier interactive compilation that the DesLauriers dataset corrected and repackaged. His code is not copied into this repository.

## This exhibition

- **Dr Non Arkaraprasertkul**. Selection, unequal field proportions, interface, search vocabulary, role names, diagrams, editorial readings, and the contrast study. The temperature, energy, value, and suggested-room labels are computed here. They are not Wada’s words.
- **Conflict-order gate**. When a design rule and a human task disagree, measured contrast and the task win, and decoration loses. That gate is this project’s, written into the Bauhaus design skill. The contrast sheet follows it: ratios and copy formats are present; a second visual theme is not.

## Design ideas already in the room

These shaped the existing exhibition. They are references, not templates.

- **Mark Rothko**. The field is large enough to occupy the viewer. We do not reproduce a painting.
- **Bauhaus**. Geometry has a job. Book context: Magdalena Droste / Bauhaus-Archiv, *Bauhaus 1919–1933*. Our reading is a modern interpretation, not a quotation from the school.
- **MoMA collection interfaces**. The object dominates; labels wait nearby.
- **Golden section**. Two-colour plates split at about 61.8 / 38.2. Trios and quartets keep one dominant field and compress the others.
- **Photographic framing**. The title sits off-centre in the dominant field, which is the habit of not centering the subject (rule of thirds and related framing). A thirds grid is not drawn on the screen.
- **IDEO human-centred design**. The task brief — person, situation, intended outcome, likely obstacle — follows that practice. No IDEO text, kit, or workshop material is included. IDEO has not endorsed this site.
- **Robert Bringhurst**, *The Elements of Typographic Style* (supplied second edition, 1997 printing). Selected close reading, not a completed book. The reading room and `skills/bringhurst-contextual-type/` are Dr Non’s interpretation.
- **Steve Krug**, *Don't Make Me Think, Revisited* (2014). Clarity, hierarchy, and watching a task.
- **Jeffrey Zeldman with Ethan Marcotte**, *Designing with Web Standards*, third edition. Accessibility as part of the structure. Old browser notes in that book are not treated as current rules.
- **Joel Sklar**, *Principles of Web Design*, fifth edition. Active space and one navigation grammar.
- **The Responsive Web Design Handbook, volume II**. Noah Stokes, Steve Fisher, Dan Tello, and Clarissa Peterson, each for the chapter named in the [design field guide](DESIGN-FIELD-GUIDE.md).

Repository studies already credited in the reading room, ideas only, no packs installed: [Impeccable](https://github.com/pbakaus/impeccable) (Apache-2.0), [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), [Taste](https://github.com/leonxlnx/taste-skill), [Hallmark](https://github.com/nutlope/hallmark), and [Avoid AI Design](https://github.com/funboy322/avoid-ai-design) (MIT unless noted there).

## Ideas studied for the contrast sheet

Code was not copied from these sites. Where a licence would have allowed a library, the behaviour was still rewritten so the room stays free of a framework.

- **[WCAG 2.2](https://www.w3.org/TR/WCAG22/) (W3C)**. The pass/fail badges use the published relative-luminance contrast formula. Body text fails under 4.5:1. Large text and non-text boundaries fail under 3:1. Ratios are not rounded up into a pass.
- **Gustavo M. Machado, Manuel M. Oliveira, and Leandro A. F. Fernandes**, “A Physiologically-based Model for Simulation of Color Vision Deficiency” (2009). The protanopia, deuteranopia, and tritanopia previews multiply the published severity-1.0 matrices in linear sRGB. This is a simulation, not a clinical test, and it does not represent every person with a colour-vision deficiency.
- **[APCA](https://github.com/Myndex/apca-w3) (Myndex / Andrew Somers)**. Studied as perceptual contrast research. The on-screen pass/fail stays with WCAG 2.2 because that is the conformance test. APCA code is not included.
- **[Coolors](https://coolors.co)**. The idea of copying one palette as CSS, a Tailwind theme, and tokens. Proprietary. Their interface is not copied.
- **[Adobe Color](https://color.adobe.com)**. The idea of a colour-vision preview and an accessibility note beside a palette. Proprietary. Their interface is not copied.
- **[Huemint](https://huemint.com)**. The idea that a palette should be ready for an interface. Our version is the agent brief plus role tokens. We do not generate new colours.
- **[Realtime Colors](https://www.realtimecolors.com)**. The idea of judging colours by living with them, not only as swatches. Our version is the full-viewport plate, not a sample website.
- **[Leonardo](https://github.com/adobe/leonardo) (Apache-2.0)**. The idea of judging a palette by contrast targets. We measure Wada’s colours. We do not generate a new ramp, and we do not copy Leonardo’s code.
- **[Design Tokens Format](https://www.designtokens.org/) (Design Tokens Community Group)**. The JSON export uses `$type`, `$value`, and `$description`.
- **[Tailwind](https://tailwindcss.com) (MIT, Tailwind Labs)**. The Tailwind copy block follows v4 `@theme` colour variables and v3 `theme.extend.colors`. Tailwind itself is not bundled.
- **[Mobbin](https://mobbin.com)**, **[Dark Design](https://dark.design)**, **[Saaspo](https://saaspo.com)**, **[Curated](https://curated.design)**. Proprietary galleries of real flows, dark pages, landing pages, and editorial sites. What we took: one obvious task, a legible black instrument, and no marketing hero on top of the colour. No screenshots or templates are reused.
- **[Open Design](https://github.com/nexu-io/open-design) (Apache-2.0)**. The idea of a local, inspectable handoff for a coding agent. Our version is the on-device CSS, Tailwind, JSON token, and link copy. Their program is not installed.

## Type

Loaded from Google Fonts, which is a font host, not an analytics script. There is no other third-party script. Each face is used under the SIL Open Font License; the licence belongs to the font, not to this repository.

- **Archivo Narrow** — Omnibus-Type. Exhibition instrument and reading-room display.
- **IBM Plex Sans Thai** — IBM. Thai text, non-looped.
- **Noto Sans SC** — Google. Simplified Chinese (`lang="zh-Hans"`).
- **JetBrains Mono** — JetBrains. Plate numbers and digital values.

## Tools that do not ship in the page

- **[Playwright](https://github.com/microsoft/playwright)** (Apache-2.0). Browser checks.
- **[axe-core](https://github.com/dequelabs/axe-core)** (MPL-2.0), through `@axe-core/playwright`. Accessibility checks in the test run only.
- **GitHub Actions** `checkout`, `setup-node`, `configure-pages`, `upload-pages-artifact`, and `deploy-pages`, pinned to commit SHAs.
- **Dependabot** for npm and Actions updates.

## What is not claimed

This exhibition is not affiliated with Seigensha, the Wada estate, the data authors, IDEO, MoMA, Adobe, or the other names above.
A contrast pass is not a statement that the printed book matches the screen.
A colour-vision preview is not a diagnosis.
