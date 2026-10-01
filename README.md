# Palette

![Five adjoining colour fields arranged as an exhibition wall](assets/exhibition-strip.svg)

Palette turns Sanzo Wada's 348 colour combinations into an interactive room.
The current combination fills the screen. Search changes the room by colour,
temperature, energy, medium, or intended use. A black instrument rail holds the
few controls needed to move, search, compare, copy, and read.

**Live exhibition:** `https://nonarkara.github.io/palette/`

## The idea

Colour books often become grids of small swatches. The grid is useful and keeps
the body at a distance. Palette removes that distance. Each combination becomes
architecture for one screen.

Wada's catalogue treats colour as relationship. A colour changes beside another
colour, and it changes again when its share of the field becomes smaller. This
edition keeps that idea and makes the proportions deliberately unequal. Two
colours divide the room at roughly 61.8 / 38.2. Trios and quartets retain one
dominant field, then compress the supporting colours.

The site is an independent interpretation. It does not reproduce scans, cover
art, publisher copy, or printed colour claims.

## How the room works

| Symbol | Action | Keyboard |
|---|---|---|
| `←` | Previous relationship | Left arrow |
| `→` | Next relationship | Right arrow |
| `↻` | Chance encounter | `R` |
| `⌕` | Search names, readings, and uses | `/` |
| `≡` | Complete index and 2/3/4-colour filters | `G` |
| `◐` | Grayscale value study | `C` |
| `⧉` | Copy CSS values with colour names | — |
| `i` | Principles, provenance, and Dr Non's Digest | `I` |

Every control is a real button. Every state change is announced to assistive
technology. Colour names, plate numbers, and text readings remain available, so
colour is never the only carrier of information.

## Dr Non's Digest

> A colour is not a property. It is an event between surfaces.

The phrase “natural gastronomy” is useful here. Appetite is relational: salt
changes fruit; bitterness gives sugar an edge; temperature changes texture.
Colour behaves in a similar way. The eye wants tension, rest, temperature, and
proportion. Harmony does not mean that every colour agrees. A good combination
keeps a small disagreement alive.

The application computes a plain reading for every plate:

- temperature: warm-led, cool-led, or warm–cool tension;
- energy: quiet, clear, or electric;
- value interval: close, measured, or high contrast;
- possible room: editorial, civic, domestic, botanical, archival, musical, or spatial.

These readings are original editorial metadata. They are deterministic and run
inside the browser. They are not claims made by Wada and do not call an AI API.

## Three languages, one argument

The principles are written in English, Thai, and Simplified Chinese. The three
texts carry the same argument but are typeset for their own scripts:

- Archivo Narrow for the exhibition instrument;
- IBM Plex Sans Thai for non-looped modern Thai, with room for tone marks;
- Noto Sans SC for region-correct Simplified Chinese;
- JetBrains Mono only for plate numbers and digital values.

## Design law

The page follows four references: Wada's plates, Rothko's scale, Bauhaus
geometry, and MoMA's object-first exhibition hierarchy. The result is governed
by a short contract:

1. One source-verified combination owns the viewport.
2. The interface behaves like museum hardware.
3. No rounded corners, gradients, drop shadows, visible borders, custom cursors, or decorative texture.
4. Grouping comes from position, scale, negative space, and solid fields.
5. Motion confirms a plate change and stops within 280 milliseconds.
6. Digital values are conversions. Printed ink remains its own object.

Read [`context.md`](context.md) for the full design contract.
Read [`ABOUT.md`](ABOUT.md) for the curatorial argument and
[`JOURNAL.md`](JOURNAL.md) for the build record. The latest structured usability
pass is recorded in
[`docs/walkthroughs/2026-10-02-blueprint.md`](docs/walkthroughs/2026-10-02-blueprint.md).

## Data and provenance

The repository includes 159 named colours that reconstruct 348 combinations of
two, three, and four colours. The digital data comes from Matt DesLauriers'
MIT-licensed
[`dictionary-of-colour-combinations`](https://github.com/mattdesl/dictionary-of-colour-combinations),
which credits Dain M. Blodorn Kim's earlier interactive compilation. The historic
combinations are credited to Sanzo Wada.

RGB and hex values are colour-managed conversions supplied by the dataset. They
may differ from the printed book. See [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)
for the full notice.

## Architecture

The exhibition has no framework and no backend:

```text
index.html          semantic structure, dialogs, multilingual essay
styles.css          field geometry, typography, motion, responsive rules
app.js              palette reconstruction, search, readings, navigation
content.js          search vocabulary and editorial-use modules
data/colors.json    credited MIT-licensed source data
tests/              source integrity and anti-slop checks
.github/workflows/  verification and GitHub Pages publication
```

Search and classification run locally. No account, analytics service, cookie,
database, or remote model is involved.

## Run it

```bash
npm run dev
```

Open `http://localhost:4173`. Directly opening `index.html` will not load the JSON
dataset because browsers block local file requests.

## Verify it

```bash
npm run check
```

The checks prove that the source still contains 159 unique colours and all 348
plates, that every plate has two to four colours, and that the interface retains
its multilingual, accessibility, provenance, and anti-slop invariants.

Automated checks cannot judge the room. Before a release, also test:

- keyboard-only navigation;
- 200% zoom;
- widths of 375, 768, and 1280 pixels;
- reduced-motion mode;
- search in English, Thai, and Chinese;
- the deployed GitHub Pages URL, not only localhost.

## Status

This is an initial public edition built by Dr Non Arkaraprasertkul with Codex.
It is independent and has no affiliation with Seigensha, the Wada estate, or
the upstream data authors. Automated and structured browser gates pass. The
real-human Mama Rule remains a release gate for a future `1.0` tag; this public
edition is deliberately numbered `0.1.0` until that first-time-user test occurs.

Code and original writing: MIT. Source data: upstream MIT terms retained.
