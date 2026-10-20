# CLAUDE.md

> **Read [ANTI-SLOP.md](ANTI-SLOP.md) before any design or frontend work.** These are Dr Non's hard rules against AI design slop: empty space is a decision, subtract before you add, and the map comes first. Run `tools/slop-lint.mjs` on any page you ship.

Then read [AGENTS.md](AGENTS.md); it is the main instructions file for this repo.

@.non-slop/AGENTS.md
@STYLE.md

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