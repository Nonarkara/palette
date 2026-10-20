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

### The skip marker is silent upstream

`scripts/export-tokens.mjs` and `tools/slop-lint.mjs` carry `non-slop-skip-file:`
because they are detectors and exporters, not UI. The marker works, but it is the
one exclusion that does **not** appear in the scan's `not scanned:` line:
`lib/scan.mjs:73` returns `null` directly instead of going through `skipped()`.
Verified against upstream commit `99a6215` (19 Oct 2026) — still open.

So a marker comment buys a clean scan with no trace. That is the highest-risk
exclusion in the tool, because it is the one a person or agent can use to silence
a finding. Until it is fixed upstream, check `--json` → `filesScanned` after adding
a marker and confirm the count moved.
## Known results of the spatial audit

`node tools/spatial-audit.mjs <url>` measures the six spatial-hallucination
modes. Unlike the non-slop render, this tool reports geometry, not a verdict.
Verified 21 Oct 2026 at 1440×900.

- **The plate view (`index.html`) is clean: 0 of 6 modes flagged.** A vertical
  instrument rail is an arrangement, not a split nav, and the full-viewport
  colour field is not an orphan. The auditor knows both.
- **The reading room (`reading.html`) reports 2 modes, both honest:**
  `one-size-for-all-prose` (3,781 characters of prose at a single 20px) and
  `deep-scroll` (11 screens). Neither is a defect: it is a long essay with one
  deliberate body size. It does *not* report `no-way-to-jump` — the reading
  room has a contents nav above the fold, which is what makes the length
  affordable.
- The `tests/fixtures/spatial-hallucination.html` fixture triggers all six
  modes. `tests/spatial-audit.test.mjs` asserts that, and asserts the plate
  view stays clean. If you change a threshold, both must still hold.

The auditor's known blind spots, so nobody trusts it too far:

- It reads the first four viewports only, so a failure further down the page
  is not seen.
- It measures the DOM, not the pixels. A background image that reads as a
  picture in the eye may not be a `background-image` in the DOM.
- It cannot tell an intentional empty column from a careless one. Only a
  person can. That is why it reports rectangles and asks a question instead
  of returning a score.
