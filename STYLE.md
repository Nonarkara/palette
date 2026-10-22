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
