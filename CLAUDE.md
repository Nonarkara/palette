# CLAUDE.md

<!-- decision-geometry:v1 -->
## Task geometry before styling

Read [Decision geometry](DECISION-GEOMETRY.md) for every UI composition change.
Trace oversized introductions, sibling-stretched maps and separated controls to
the first unnecessary expansion. Keep the task, its evidence and its next action
legible together. Color, typography, alignment and zero horizontal overflow do
not clear a failed composition. Preserve earned content and operating regions;
use task-specific budgets, real viewport/state captures, a failing regression
mutation and independent review. The guide's fixture numbers are not universal.
<!-- /decision-geometry:v1 -->

<!-- glance-path:v1 -->
## Glance path and kinetic grid

Enforce these on every composition. Canonical text:
[Nonarkara/Non-Slop MSH.md](https://github.com/Nonarkara/Non-Slop/blob/main/MSH.md),
read with [ANTI-SLOP.md](ANTI-SLOP.md). If this pointer and `MSH.md` disagree,
`MSH.md` wins. [STYLE.md](STYLE.md) still beats both.

- **Visual gravity.** Put the headline and the primary action on the exit of the dominant visual. Critical text does not sit in a dead zone above a heavy hero.
- **No leapfrog.** Related copy does not jump a massive image to reach the thing it describes.
- **Kinetic grid.** Use extreme scale contrast. When a layout breaks a rule, break it on the grid. Negative space stays active. Keep one or two accents, and no third shout.
- **Motion.** Snap, or show the skeleton first. Do not float or morph. `prefers-reduced-motion` still removes non-essential motion.

On Palette the dominant visual is the full-viewport colour field. Plate number, names and the copy action sit on its exit, the instrument edge, not in a band above it. Do not add an accent: the plate is the colour. The empty field is the composition (`void` in STYLE.md), not a dead zone.
<!-- /glance-path:v1 -->

> **Read [ANTI-SLOP.md](ANTI-SLOP.md) before any design or frontend work.** These are Dr Non's hard rules against AI design slop: empty space is a decision, subtract before you add, and the map comes first. Run `tools/slop-lint.mjs` on any page you ship.

Then read [AGENTS.md](AGENTS.md); it is the main instructions file for this repo.

When a rule fires, read [REMEDIES.md](REMEDIES.md) — it says where to go instead,
and names a real place to look for each destination. Before building from a
brief, check it: `node tools/brief-lint.mjs <file>`.

@.non-slop/AGENTS.md
@STYLE.md
@REMEDIES.md

<!-- non-slop:start -->
## Design quality: Non-Slop
Before any UI, page, dashboard, deck or visual work, read `.non-slop/AGENTS.md` and follow it.
`STYLE.md` lists this repo's deliberate choices: it wins over every generic rule, and nothing listed there is stripped.
Check with `node .non-slop/bin/non-slop.mjs scan .` (and `render <url>` when Playwright is installed). A different agent or person reviews; never self-review.
<!-- non-slop:end -->

## Two rule sets, one law

[ANTI-SLOP.md](ANTI-SLOP.md) is the **doctrine**: 13 hard limits, each with the measured
evidence behind it, taken from 31 labelled citizen-built flood apps.

[`.non-slop/`](.non-slop/AGENTS.md) is the **tool**: a scanner and renderer that measure
those limits mechanically, plus four layers of process (direction, detect, review, writing).

[STYLE.md](STYLE.md) is the **exception list**: this repo's deliberate choices. It beats
both. Nothing listed there is ever stripped.

Use the doctrine to decide, the tool to check, and STYLE.md to stop the tool from
mistaking a choice for a default.