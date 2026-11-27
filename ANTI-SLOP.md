# ANTI-SLOP: read this before you design or build any screen


Read [Decision geometry](DECISION-GEOMETRY.md) before accepting a composition:
measure the expansion chain and the information/action relationship, preserve
working content, and prove a task-specific regression budget fails the old fault.
A palette or source-lint pass cannot substitute for rendered task evidence.


These are Dr Non's hard rules against AI design slop, and they apply to every agent (Grok Bot, Claude, Cursor, ChatGPT, Copilot) and every person. They sit on top of the house design system (Palette). If a rule here conflicts with a habit of your model, this file wins.

## The principle: empty space is a decision, and subtract before you add

AI slop comes from not deciding what the space is for. It goes wrong in one of two ways. Either it **stretches small things to fill the space** (stat tiles, chips and buttons blown up to fit the grid), or it **leaves the space dead** (a phone-width column floating on a desktop, half the page blank while something loads). Decide what the space is for, which is usually the map or the data, and give the space to it.

The clean apps in our study differ from the slop ones mainly by **what they leave out**. Before you add a box, shadow, corner radius, badge or emoji, remove one.

## Hard limits per screen

The measured examples come from the study below. "Slop" means the median slop or mixed app, and "clean" means the median clean app.

| # | Pattern (by how often it appeared) | Hard limit | Measured |
|---|---|---|---|
| 1 | Shadows on everything (fake depth) | **≤3 drop shadows.** Separate with space and rules, not shadows. | 68% of slop apps had ≥8 shadows and no clean app did. Median 14 vs 1, and up to 176 on one screen. |
| 2 | Lines too long to read | **≤65ch for prose** (about 30–45 Chinese characters). Wide screens get columns or margins. | 64% of slop apps went over 40em. Median line 61em vs 26em. |
| 3 | Everything rounded, with no radius system | **One corner radius (or none)** for the whole product, used on fewer than half the boxes. | Slop: 5 radii, 93% of boxes rounded. Clean: 1 radius, 33% rounded. |
| 4 | No type scale | **≤8 font sizes** from a stated scale, with a 1.5–2× step between levels. | 55% of slop apps had ≥9 sizes, one had 22. |
| 5 | Emoji used as icons | **0.** Use a word, or one real icon set used sparingly. | 50% of slop apps vs 0% of clean. Up to 52 on one screen. |
| 6 | Box soup (everything in its own card) | **≤15 boxes or cards.** If text can sit on the page or the map, it does. | Median 45 boxes vs 9. |
| 7 | Pills and badges everywhere | **≤5 pills or badges.** | 45% of slop apps had ≥10, and one had 53. |
| 8 | Dark "command centre" by default (navy, neon borders, glow, glass) | **Light by default.** Dark only when the product is used in the dark, and even then no glow or glass. | 36% of slop apps vs 0% of clean. Every clean app was light. |
| 9 | Stretch-to-fill | **No small thing is wider than 2× (or taller than 1.6×) what its content needs.** Stat tiles go in a ruled strip sized to their text, never equal grid tracks, and a lone last tile never spans the row. Buttons are content-width on desktop. Full-width buttons only in a phone column or a narrow side panel. | 36% of slop apps. Tile "8" at 241px when it needs 73px. A single stat card stretched to 466px when it needs 177px. A "View map" button at 478px when it needs 82px. |
| 10 | Pop-up or wall on first load | **None.** Answer the question first. Onboarding, disclaimers and leaderboards come after, inline or on demand. | 27% of slop apps. |
| 11 | Gradients, gradient text, glass blur | **0 decorative gradients, 0 gradient text, 0 glass.** | 27% of slop apps. |
| 12 | Dead empty space | **No flat region over a third of the first screen**, no phone column centred on a desktop, and no blank half while loading (show the real layout skeleton or the last good data, with its time). | Up to 81% of a first screen blank. |
| 13 | A hero with no data | **No hero over half the screen** unless it *is* the map or the number. | 18% of slop apps. |

The earlier rules still apply: boxes fit their content, the composition balances, banned slop fonts are out (use Jost or Josefin/League Spartan, with Prompt/Kanit for Thai), there's one accent colour that means something, something on the page clearly wins, there's no filler copy, and there are no fake or placeholder numbers.

## Eight giveaways, banned as a default

Mitchell Romney's graphic "Ban these before AI designs your site". He credits Johannes Nagl, Phil Whitehouse, Austin Ballard, sadeeqah S. and Bryce Galbraith. Recorded here 27 Nov 2026.

These eight are banned as a default. They are the template, not a material, a document, or a decision. A product may keep one when `STYLE.md` names that rule and says why. Non's own signature is not slop. Judge the page. Do not strip a voice someone chose.

The scanner id is in parentheses. Source is `.non-slop` scan. The rendered page is `tools/slop-lint.mjs`, at 1 point each, the same weight as the other component tells. Inter stays on `default-font`: P1 in the source scan, reported only on the rendered page, because the static scan judges faces. `eyebrow-caps` still fires at three or more tracked labels anywhere. `accent-border-card` still fires when a left stripe is repeated. Neither threshold was lowered.

1. **Eyebrows** (`eyebrow`). A small tracked, all-caps kicker above a heading. "FEATURES" is not a heading. Drop it, or let the heading say the thing.
2. **Colour down one side** (`side-stripe`). An accent bar or left-hand stripe on a card, a callout or a list item. Separate with space or a rule that runs the full edge. If the stripe encodes a state, say the state in words. One is the ban. `accent-border-card` still marks the repeat.
3. **One italic word** (`italic-word`). A single italic, gradient or accent-coloured word inside a headline. "Build faster with AI", with one word set off, is the template. The headline is one voice. A foreign word, a title or a name can stay when `STYLE.md` says so.
4. **All caps for looks** (`tracked-caps`). Uppercase plus letter-spacing on a heading, a button or a label. Capitals are for a real acronym or a code. Tightening a condensed face (negative tracking) is not this ban.
5. **Inter on everything** (`default-font`). Inter, and the other reach-for-it faces already named in this file. Choose a face for this product and write the reason in `STYLE.md`.
6. **Too many cards** (`stat-card-row`). A row of equal stat or feature cards, the 24 / 3 / 99% row. Put the numbers in a ruled strip, or in the sentence they belong to.
7. **A blurb under every title** (`title-blurb`). A grey one-line subtitle under every heading, section, card or settings group. One line of real information may follow a title. The same muted line under every title may not. The scanner fires at three.
8. **Blinking status dots** (`status-dot`). A pulsing or glowing dot, and the badges "All Systems Operational" and "AI Engine Active". Status is plain text, with a time, and only when it is real, live and actionable.

## Map-first "surgical table" rule

On any map or data product the map is the operating table, and everything else is an instrument at its edge.
- The map or data takes **≥60% of the first desktop screen** and the first full screen on a phone. Clean apps averaged 89%, slop apps 41%.
- Panels are compact, collapsible and sized to their content, docked at the edges. Nothing covers the map on load.
- Numbers sit next to the place they describe. They don't go in a separate card grid.

## Check it: slop-lint

`tools/slop-lint.mjs` lives in Nonarkara/palette and Nonarkara/dr-non-vibecoding-skills.

```bash
npm i -D playwright pngjs && npx playwright install chromium
node tools/slop-lint.mjs https://your-site.example   # add --json or --shots=dir
```

It loads the page at 1440×900 and 390×844 and scores the rules above in points:
- **≥6 = SLOP**: fix it before shipping.
- **3–5 = REVIEW**: a person checks each hit.
- **<3 = OK.**

It's a screen, not a judge. On our study set it caught 91% of slop with 95% precision at the REVIEW line, but those numbers are in-sample and optimistic. It sent 2 of 5 professional map apps to REVIEW, and it misses a centred phone column that has a full-width header. After the linter, still screenshot at 1440, 1024 and 390, squint at the screenshots, and have a different agent or person check. Never self-review.

## Evidence base and credit

These rules come from measuring the 46 citizen-built flood apps listed on FloodDash's *About → Citizen-built apps* page (flood.nonarkara.org) on 18 Oct 2026. Of those, 37 were reachable, and 31 were labelled by eye and checked with DOM and pixel metrics. People built these tools during a flood, often overnight and for free. Many of them help people, and we're grateful to every builder. The study is about visual patterns only, not about people or how useful the tools are.

Apps whose maps show victims' or reporters' personal data were not pictured or quoted. The clean exceptions worth learning from are Thailand Flooder, พิกัดน้ำท่วมสมุทรปราการ (paddypure), น้ำคลอง (namkhlong), Floodboard, น้ำบนถนน บางมด (taokaetech), Floraville Flood Forecast and Meanam. They let the map win, use few boxes and one radius, keep lines short, and each has a point of view.

## Composition and image placement

Read [Anti-spatial-hallucination](ANTI-SPATIAL-HALLUCINATION.md) when layout is aligned but still feels arbitrary. Preserve the colour field as the subject; narrative-image patterns apply only where the page’s task and STYLE.md permit them.
