# STYLE.md: deliberate choices. Do not strip.

Owner: Dr Non. Last checked: 2026-10-20.

Everything here was chosen on purpose. Agents and reviewers read this before any design review, never remove or "fix" what it lists, and ask the owner if a choice seems to cause a real problem (contrast, legibility, a broken layout). This file beats every generic rule, including Non-Slop's.

## Type

- Display: **Archivo Narrow** — a condensed grotesque that can hold a plate number at display size without widening the rail.
- Body: **Archivo Narrow** at `styles.css`. The reading room uses **Arial** as an intentional fallback (see Allow).
- Thai: **IBM Plex Sans Thai** — non-looped, always. Looped Thai faces are banned project-wide, and so is the looped house face named in the project history. `tests/house-rules.test.mjs` asserts that no file in this repo names it.
- Chinese: **Noto Sans SC**, Simplified.
- **JetBrains Mono** for plate numbers, hex values and every other number. Numbers are data, and data gets a monospaced face so digits align in a column.

## Colour

- The colour field is the product. One source-verified Wada combination owns the viewport, in its printed unequal proportion.
- Instrument rail ground: `--black` / `#111313`; rail ink `#f7f5ef`.
- **No accent colour exists in this repo.** The colour comes from the plate. Do not add one.
- Every plate's colours come from `data/colors.json`, which is the credited digital conversion. Never call an RGB or hex value the exact printed colour.

## Devices

- **Zero radius, everywhere.** `styles.css` sets `border-radius: 0 !important` on the reset. This is the conservation law made mechanical.
- **No gradients, no shadows, no visible borders, no decorative texture, no custom cursors.** The field is flat because a print is flat.
- Emphasis is proportion, weight and case. Never colour alone: plate number, names, count and text all stay available.
- The reading room uses warm paper (`--paper #fff4d8`) and ink (`--ink #181525`) with a brick `--chord`. This is house paper, not a default.

## Layout

- One source-verified combination owns the viewport. Never replace the full-viewport colour field with cards or a conventional gallery.
- **The vertical instrument rail is ≤56px**, docked right. It is hardware, not chrome, and it never grows to compete with the field.
- **No top bar at all on the plate view.** A top bar taller than the field it labels is the single most common AI dashboard default, and it is forbidden here. The reading room's header measured **52px at 1440 and 1024**; it wraps to two lines (82px) below 390 because the two labels cannot share one line on a phone. Re-measure before changing a number here — a guessed figure in this file is worse than no figure.
- **Prose measure: 64ch in the reading room, 38–65ch on the plate view.** Express it in `ch`, never rem — a rem cap gives a 12px caption a physically longer line than 16px prose, the same defect one level down.
- Never more than ~30 words in a line of continuous prose. Past that the eye finishes a line and cannot find the start of the next one. Paperback proportion, not monitor proportion.
- A small thing is never more than 2× wider or 1.6× taller than its content needs.

## Voice

- EN: plain, declarative, specific. Says what the thing is and where it came from.
- TH: plain Thai, no translationese, full register of its own.
- ZH: Simplified, plain, its own text rather than a machine echo of the English.

## Protected voice

- phrase "A colour can change the room. It cannot rescue an unclear task.": the reading room's thesis line, written once and kept.
- phrase "Slop is a default nobody chose. Style is a choice somebody made.": Non-Slop's first line; it is the reason this file exists.
- marker "Sanzo Wada": this project is about his colour book. His name is never paraphrased away.
- marker "credited digital conversion": the standing phrase for every RGB value in this repo.
- marker "Wada's Colour Harmony": the book's title. Never shortened to "Harmony" alone.
- phrase "seamless": the defaults chapter names this word as an example of a filler tell. It is the subject of the sentence, not filler in it.

## Allow

- rule default-font in reading.css: Arial is a deliberate fallback, not a reach-for-it. The reading room's prose face is set by the site's Archivo Narrow; Arial is what a machine without the webfont gets.
- rule dark-command-centre: the plate view is a dark ground by design. It is a colour field exhibition, not a command centre, and it carries no glow, glass or gradient.
- rule void: the plate view has deliberate empty space. A Wada combination is mostly one dominant colour. That emptiness is the composition.
- rule hero-no-data: the full-viewport colour field is the data. There is no map or chart because the artefact is the printed colour relationship itself, in its source proportion. This is the conservation law, not a landing page with a big picture.
- rule long-lines: the plate-label overlay sits at the field's edge, not in a reading column.
- rule emoji-icons: never. This is the one house rule with no exception.

## Shipability

A file's size on disk is not what a reader pays. A reader pays for the bytes that crossed the wire before the page was usable. `tools/shipability.mjs` measures exactly that — transferred bytes per route, on a cold cache — and `npm run audit` fails if a route goes over its budget.

| budget | value | what it catches |
|---|---|---|
| route | 400 kB | a route that grew a hidden dependency |
| shell | 250 kB | bytes that had to arrive before the first paint |
| webfont | 250 kB | a face nobody can read yet |
| oversampling | 3× | a picture painted into a box much smaller than the file |

### What the audit found, 23 Oct 2026

The reading room transferred **600 kB** on its first load, and **518 kB of it was webfont**. Noto Sans SC is cut by Google into 202 unicode-range chunks, and the eight Chinese characters of a visible chapter label fall in three of them: 74 kB, 45 kB and 51 kB. The reader paid 170 kB for eight glyphs. Both pages also asked for the whole Chinese family in their stylesheet — 61 kB of CSS, of which 202 of the 228 @font-face blocks were Noto Sans SC.

**The fix.** `scripts/font-subsets.mjs` measures, in a real browser, which Chinese characters each page renders on arrival and which are waiting behind a collapsed disclosure or a closed dialog, then asks Google for a subset of exactly those characters. Two subsets, and they must not overlap: a character that is visible in one place and collapsed in another belongs to the eager set only, or the browser matches the visible text against the larger face and downloads the large file.

A subset is a payload decision, not a type decision. The typeface is unchanged: a subset carries the same outlines for the same glyphs and nothing else. It is still Noto Sans SC, and `data/font-subsets.json` records every character it covers.

| route | before | after | webfont before | webfont after |
|---|---|---|---|---|
| plate view | 262 kB | 205 kB | 49 kB | 49 kB |
| reading room | 614 kB | 114 kB | 500 kB | 50 kB |

Measured on the local preview at 1440×900, cold cache, 23 Oct 2026, three consecutive runs with identical numbers. The live site compresses the HTML, CSS and JavaScript, so it transfers less:

| route, live | before | after |
|---|---|---|
| `colors.nonarkara.org/index.html` | 149 kB | **92 kB** |
| `colors.nonarkara.org/reading.html` | 600 kB | **78 kB** |

The reading room was paying more for its webfont than for its whole page. It now transfers less than the plate view does.

**The Research screen cost 13 kB.** Adding it took the live plate view from 92 kB to **105 kB** on its first load — the HTML, the stylesheet and the script all grew, and the playground's data (`data/playground.json`) is not fetched on arrival but only when a reader opens the room. The reading room is untouched at 78.4 kB. Measured on the live site, 23 Oct 2026, after the release.

The plate view's Chinese lives entirely inside its dialogs, so it now downloads **no Chinese face at all** until a reader opens one. The reading room's chapter labels are visible on arrival and cost 10.6 kB; the text inside the collapsed disclosures costs nothing until a disclosure is opened, at which point the browser fetches the deferred subset.

**A collapsed disclosure still resolved its face.** With the subset in place the reading room measured 114 kB, then 181 kB, then 114 kB, then 181 kB — the same page, the same cache, four runs. Chrome resolves a webfont for text inside a `content-visibility: hidden` subtree, and the closed `<details>` body is exactly that: laid out, not painted, and still charged. `reading.css` now hides a closed disclosure's body with `display: none`, which is not resolved. **The rendered page is byte-identical with and without the rule** — the same 14,080-pixel document, the same 56-pixel disclosure, the same PNG — so the change touches what the reader pays for and nothing they can see. After it, eight consecutive runs measured 114 kB.

**Two bugs the instrument had, recorded so nobody repeats them.** The first version counted the *decoded* body length, so a 63 kB stylesheet was reported as 231 kB — the reader pays 63 kB. It now reads `transferSize` from the Resource Timing API. The second version classified a font by the first codepoint of its unicode-range, which called IBM Plex Sans Thai's Thai chunk "latin"; a range now votes by the number of codepoints it holds in each script.

**What was measured and deliberately left alone.** The plate view's 60 kB colour catalogue is 29% of its route, and it is fetched before the first colour field paints. Splitting it would add a request and a loading state to the artefact that is the product, to save less than the fonts cost. The catalogue is smaller than the webfont and the stylesheet together.

`npm run check:shipability` runs the measurement on its own. `npm run audit` runs it with everything else, and a route over budget fails the audit.

## The golden section

The proportion is not a decoration on this repository; it is the method. `tools/golden-section.mjs` measures it in three separate parts, because each can be true while the others are false: **the construction is exact**, **the interface lands on it**, and **the bench fits the field**. `npm run check:golden` runs it alone; `npm run audit` runs it with everything else.

### The construction is exact

The golden rectangle really is φ:1, and the pinwheel of squares really tiles it. Measured on a 1440×900 box, 23 Oct 2026:

| measurement | value |
|---|---|
| the rectangle | 1440.000 × 889.969 — a ratio of 1.618033988750 |
| φ² − φ − 1 | 0 to the last bit |
| the squares | 16, covering 99.999979% of the rectangle |
| the arcs | 16, every radius equal to its square's side, to 1e-9 |
| consecutive arcs | meet to 0.00e+0 |

The 0.000021% the squares do not cover is the sliver at the centre of the spiral: the peel stops when the remainder is under half a pixel. That is the construction, not a gap.

### The interface lands on it

| what | measured | expected |
|---|---|---|
| the plate's colour field | ends at **855px** of 1384px | 0.618 × 1384 = 855.5 |
| the diagram's 0.618 cut | **855.36px** | on the boundary |
| the demo's colour field | ends at **484px** of 783px | 0.618 × 783 = 483.9 |
| the demo's 0.618 cut | **483.92px** | on the boundary |
| the Research head's two columns | 783px and 484px — a ratio of **1.6180** | φ |
| the stylesheet | **six** rules divide at `1.618fr 1fr` | the screen says six |

The Research screen prints these numbers, and the instrument checks them: `data/colors.json` holds 348 relationships, 120 of them two-colour, and the screen says "120 of the 348". The count comes from the data, never from a comment about it.

### What the instrument found

**The diagram was drawn over the wrong box.** The plate's overlay carried `inset: 0 56px 0 0` — the width of the rail — but also `width: 100%`. An absolutely positioned replaced element with a specified width ignores the opposite inset, so the diagram was drawn over the whole **1440px** stage while the colour field it describes is **1384px**, and its 0.618 cut missed the boundary by exactly the width of the rail. The overlay is now sized from the field's own inset, in one place, through `--field-inset-inline-end` and `--field-inset-block-end`.

**An `<svg>` is a replaced element.** With `width: auto` it takes its intrinsic size — 300×150, or its viewBox's ratio — not the box its insets describe. The diagram's box is therefore stated outright rather than left to the inset.

**The demo stage was not a golden rectangle.** Its 783×414 box made the construction fit itself to the *height*, producing a 670px-wide rectangle whose own 0.618 division landed at 414px — in the middle of the wrong colour. The stage is now `aspect-ratio: 1.618`, so the rectangle fills the width and its 0.618 division is the colour field's boundary.

**A stated number nobody measured was wrong.** The screen said the proportion was used "five times". The stylesheet uses it in six rules (seven declarations, one of them a small-screen override). The instrument now counts the rules from the stylesheet and compares the count with the number on the screen.

### The bench fits the field

A style says how loud it wants to be; the colour field says how loud it can be. `fitBench()` measures the rendered box and scales the display down until the sample sits inside the colour it is printed on — with a floor of 20px, because a display that shrinks to 13px on a phone is not a display.

Measured across all six styles and all eight faces, at 1440×900, 1024×768 and 390×844 — 42 cases — **zero clip, zero horizontal scroll, and every case fits at scale 1.00**. The base display size is `clamp(1.15rem, 2.8vw, 2.8rem)` because that is the size at which every style fits unclamped; raise it and the fit pass starts trimming the loud end, which quietly turns six scales into one. The sample's caption was 205 characters, which is a paragraph and not a caption, and squeezed the display to 13px on a phone; it is now a caption.

The playground's fonts load one at a time, only when a face is chosen, and the display is measured again when a webfont arrives late.

## Known results of the rendered check

The **rendered** check (`non-slop render`) does **not** read `## Allow`. Only the static scan does.
So the plate view reports a permanent REVIEW of 5 points. These three are the known,
verified findings, and re-deriving them wastes an hour:
| finding | points | why it is a false positive here |
|---|---|---|
| `void` | 2 | The dominant field of a Wada combination is one flat colour covering ≥35% of the screen. That flat region is the work. |
| `hero-no-data` | 2 | There is no map or chart because the artefact is a printed colour relationship, not a dataset. The field is 100% data by another name. |
| `modal-on-load` | 1 | **Open question, not dismissed.** `app.js` opens the search dialog when the URL has no `#plate-NNN` hash, so an arrival with no selection gets a way in instead of an arbitrary plate. It does cover the whole viewport, which sits in tension with the conservation law in `AGENTS.md`. Raise with the owner before changing it. |

Verified 20 Oct 2026 against `http://localhost:4174/index.html` at 1440×900:
`modalOnLoad` is genuinely true — `search-dialog` reports `open: true`, `display: block`,
1440×900, `rgb(247,245,239)`. The other five dialogs are `display: none`.

Everything else the rendered check reports on this repo is a real pass:
0 contrast failures of 14, 0 small targets of 49, 0 invisible focus of 14 tabbed,
no 320px overflow, longest prose line 27.7em.

### The reading room, measured 22 Oct 2026

`tools/slop-lint.mjs` on `reading.html`: **OK, 0 points.** One hit, `default-font`,
which is a reported-only rule (weight 0) and is already listed under `## Allow`
above: the reading room's prose face is Archivo Narrow, and Arial is the fallback
a machine gets without the webfont.

### The phone, measured 22 Oct 2026 at 390 × 844

Two new rules check that a phone layout is a different composition rather than a
smaller desktop. Both are clear on both pages, so neither fires here:

| metric | plate view | reading room | rule |
|---|---|---|---|
| share of visible text under 12px | 0 | 0 | `phone-squeezed` fires at ≥0.25 |
| narrow columns left beside a much wider one (a split that never collapsed) | 0 | 0 | `desktop-columns-on-phone` fires at ≥1 |

The two rules answer two different questions. `phone-squeezed` catches the
desktop type size carried over and shrunk. `desktop-columns-on-phone` catches
the desktop's two-column split that never collapsed — a narrow strip beside a
wide main. Equal columns are *not* a squeezed desktop: the reading room's own
three-column contents grid and the plate view's three-column mood grid are
deliberate phone arrangements, and neither rule fires on them.

The thresholds were calibrated against `tests/fixtures/phone-squeezed.html`, a
deliberately broken layout that fires all three signals. `tests/slop-lint.test.mjs`
asserts both directions: the fixture fires, the plate view does not.

### The phone arrangements, measured 22 Oct 2026 at 390 × 844

The spatial auditor was also run at 390 × 844, and it found two ragged
arrangements that the desktop never shows. Both were **fixed**, not allowed:

| group | before | after |
|---|---|---|
| reading room `nav.contents` | 3+4+2, then 3+3+3 | **3+3+3** — a deliberate 3-column grid below 900px |
| plate view `.mood-starters` | 5+1+1, then 4+2+1 | **3+3+1** — a 3-column grid below 480px, the last row being the full-width "surprise me" action |

At 1440 the contents nav is **one row of nine** (92px tall). Below 900 it is a
3-column grid of three even rows (180px). At 320 it still overflows nothing.

A row of controls that breaks 5+1+1 is the accidental wrapping the doctrine
names; an even arrangement is a decision. `tests/phone-layout.test.mjs` asserts
both, so the ragged break cannot come back.

### These sections are read back by `npm run audit`

`npm run audit` treats the two "Known results" sections below as **allowlists**,
not as prose. Any rendered hit or spatial mode that is *not* recorded here fails
the audit. A documented false positive is a liability, not a pardon: if a rule
is renamed, retuned or deleted, the audit goes red until this file is corrected.

### The skip marker is reported — fixed 21 Oct 2026

`scripts/export-tokens.mjs`, `tools/slop-lint.mjs` and `tools/spatial-audit.mjs`
carry `non-slop-skip-file:` because they are detectors and exporters, not UI.

Until 21 Oct 2026 the marker was the **only silent** exclusion: `lib/scan.mjs:73`
returned `null` directly instead of going through `skipped()`, so a marker
comment bought a clean scan with no trace in the output. Every other exclusion
— binary, oversized, denied symlink, broken symlink, the file cap — was already
named under `not scanned:`.

Fixed upstream in [Nonarkara/Non-Slop#7](https://github.com/Nonarkara/Non-Slop/pull/7).
The marker now routes through `skipped()` and is reported by name:

```
note: not scanned: scripts/export-tokens.mjs (marked skip), tools/slop-lint.mjs (marked skip)
```

and `filesScanned` drops by one, so the count and the note agree.

**Until that lands in a release, check both.** After adding a marker, confirm
`--json` → `filesScanned` moved and `note` is not empty. If the note is empty
while a marker exists, the vendored copy is the old one.

### The marker's reason was wrong — fixed 22 Oct 2026

The vendored copy read the marker with a pattern that had **no capture group**,
so `marker[1]` was always `undefined` and the ternary that chooses the reason
never produced `example`. Every deliberate example was reported as a plain
"marked skip" — true, but it loses the distinction a reviewer needs: an
example is deliberate test data, a marked skip is a file the owner excluded.

The pattern now captures the marker name, so the report reads:

```
note: not scanned: tests/brief-lint.test.mjs (example),
tests/fixtures/phone-squeezed.html (example),
tools/brief-lint.mjs (marked skip)
```

`tests/house-rules.test.mjs` asserts the vendored copy carries the capture, so
a re-vendor cannot silently reintroduce it.

**This repo names its examples; upstream keeps them silent.** Upstream's current
`lib/scan.mjs` returns `null` for an example marker on the grounds that example
fixtures are deliberate test data rather than something the scan could not read.
That is a fair argument, but it is not this repo's rule: `AGENTS.md` says a
scanner must never drop an exclusion without naming it, because a scanner that
skips silently is a false-success signal. A full-tree scan also skips `tests/`
by the scanner's own example-directory rule, so the honest statement of what
was not read lives in the staged scan, where every marker is named.
## Known results of the spatial audit

`node tools/spatial-audit.mjs <url>` measures the six spatial-hallucination
modes. Unlike the non-slop render, this tool reports geometry, not a verdict.
Verified 21 Oct 2026 at 1440×900.

- **The plate view (`index.html`) is clean: 0 of 6 modes flagged.** A vertical
  instrument rail is an arrangement, not a split nav, and the full-viewport
  colour field is not an orphan. The auditor knows both.
- **The reading room (`reading.html`) reports 2 modes, both honest:**
  `falseHierarchy` (kind `one-size-for-all-prose`: 3,937 characters of prose at
  a single 20px) and `spatiallyExpensive` (kind `deep-scroll`: 13.2 screens).
  Neither is a defect: it is a long essay with one deliberate body size, and a
  contents nav above the fold. It does *not* report `no-way-to-jump` — the
  reading room has a contents nav above the fold, which is what makes the length
  affordable.
- The `tests/fixtures/spatial-hallucination.html` fixture triggers all six
  modes. `tests/spatial-audit.test.mjs` asserts that, and asserts the plate
  view stays clean. If you change a threshold, both must still hold.

**Correction, 22 Oct 2026.** This section used to name the *example kinds*
(`one-size-for-all-prose`, `deep-scroll`) where the *mode ids* belong
(`falseHierarchy`, `spatiallyExpensive`). `npm run audit` reads this section
back as an allowlist, and a kind is not a mode, so the allowlist matched
nothing and the audit correctly failed. The ids are now recorded, and the kinds
are kept as the explanation. The character count and the screen count moved
with the prose (3,781 → 3,937 characters; 11 → 13.2 screens) as the chapter
grew; re-measure rather than trust either number.

The auditor's known blind spots, so nobody trusts it too far:

- It reads the first four viewports only, so a failure further down the page
  is not seen.
- It measures the DOM, not the pixels. A background image that reads as a
  picture in the eye may not be a `background-image` in the DOM.
- It cannot tell an intentional empty column from a careless one. Only a
  person can. That is why it reports rectangles and asks a question instead
  of returning a score.
