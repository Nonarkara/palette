# Design brief — Palette

The brief an agent should read before it touches a screen in this repo. It is
written in the anchored style: every instruction names a number, a material, a
file, or a source, because an instruction with none of those cannot be met.

`node tools/brief-lint.mjs docs/design-brief.md` checks that it stays that way.

## The subject

An interactive exhibition of Sanzo Wada's 348 colour combinations. The colour
field is the product. The interface is museum hardware — it sits at the edge of
the field and does not compete with it.

## The core

One sentence, and it must be a sentence a competitor could not use:

> A room where one source-verified Wada combination owns the whole viewport, and
> the interface never competes with it.

## The constraint we will not negotiate

One combination owns the viewport. Chrome never competes with it. This is the
conservation law, and every other decision is downstream of it.

## What the reader is doing

Choosing a colour relationship and carrying it away as a brief an agent can
build from. The primary action is **Copy this for your agent**, because that is
what the visitor came for.

## The decisions, and why

- **The instrument rail is 56px wide** and never grows. It is hardware, not
  chrome. See `styles.css`.
- **There is no top bar on the plate view.** The reading room's header measures
  52px at 1440 and 1024, and wraps to 82px below 390 — re-measure before
  quoting a number, and see STYLE.md.
- **Prose measure is 64ch in the reading room** and 38–65ch on the plate view,
  expressed in `ch` so a 12px caption gets the same physical line as 16px
  prose.
- **Body type is Archivo Narrow**, chosen because a plate number has to fit a
  56px rail. Thai is IBM Plex Sans Thai, non-looped; Chinese is Noto Sans SC.
  See `STYLE.md`.
- **Numbers are JetBrains Mono**, because data in a column has to align.
- **Zero radius, no gradients, no shadows, no visible borders, no decorative
  texture.** The field is flat because a print is flat.
- **There is no accent colour.** The colour comes from the plate. Adding one
  would be inventing a decision the subject does not have.
- **The reading room's ground is warm paper** (`#fff4d8`) with ink `#181525` and
  a brick `--chord`. This is house paper, not a default.
- **Colour is never the only carrier.** Plate number, names, count and text
  stay available at all times.

## The colours

Every value comes from `data/colors.json`, which is the credited digital
conversion of Sanzo Wada's combinations. Never call an RGB or hex value the
exact printed colour. Never invent a plate number, a name, a quotation or a
historical claim.

## What the tools check

| Check | Command | What it proves |
|---|---|---|
| Static source rules | `node .non-slop/bin/non-slop.mjs scan .` | The source does not reach for a default nobody chose |
| Rendered screen rules | `node tools/slop-lint.mjs http://127.0.0.1:4173/index.html` | The screen is not slop at 1440 and 390 |
| Layout geometry | `node tools/spatial-audit.mjs http://127.0.0.1:4173/index.html` | The layout can explain its own geometry |
| This brief | `node tools/brief-lint.mjs docs/design-brief.md` | The instructions name something |
| All four | `npm run audit` | One report, and anything not recorded in STYLE.md fails it |

## The last gate

A different agent or person reviews. Never self-review — you have already
decided what the page means, and you will see what you meant.

See also: [ANTI-SLOP.md](../ANTI-SLOP.md),
[ANTI-SPATIAL-HALLUCINATION.md](../ANTI-SPATIAL-HALLUCINATION.md),
[REMEDIES.md](../REMEDIES.md), [STYLE.md](../STYLE.md).
