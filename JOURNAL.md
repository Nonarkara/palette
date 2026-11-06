# Journal

## 2026-10-02 — Open the room

**What changed:** Built the first public exhibition: 348 source-verified colour
relationships, full-viewport fields, multilingual interpretation, local search,
an index, grayscale study, keyboard navigation, and copyable digital values.

**Why:** A swatch grid explains a catalogue but cannot reproduce the bodily
experience of adjacent colour at scale. The interface needed to behave like an
exhibition room rather than a palette picker.

**Key decision:** One combination owns the viewport. The UI is confined to a
black instrument rail; grouping comes from geometry and space, never cards or
visible borders.

**Correction:** The first plate-label treatment used blend modes. It was
replaced with luminance-derived black or white ink so contrast is computed and
testable instead of merely dramatic.

**Evidence:** Data and content checks pass locally; live deployment evidence is
recorded in the repository's GitHub Actions history.

Tags: `colour`, `exhibition`, `wada`, `accessibility`, `bauhaus`, `moma`

## 2026-10-02 — Give the room a front door

**What changed:** Added an explicit repository link and a one-file field guide
to the exhibition, connected the GitHub `main` branch to Cloudflare Pages, and
made `colors.nonarkara.org` the canonical public address. GitHub Pages remains
as a mirror.

**Why:** An exhibition that teaches a method should let a visitor leave with
the method. The site now points back to its source and offers a Markdown guide
that can be downloaded, copied into another project, or read without the app.

**Key decision:** Cloudflare Pages deploys directly from GitHub with no build
step. The repository is the source of truth; the custom domain is only the
front door.

**Evidence:** Content and interaction tests pass; both the Pages origin and the
custom hostname are checked against the committed bytes during release.

Tags: `cloudflare`, `github`, `field-guide`, `reuse`, `deployment`

## 2026-10-02 — Put the researcher inside the room

**What changed:** Added an `A` instrument for Dr Non's biography, research
position, personal Red / Black interval, and two responsive Bauhausian diagrams.
One diagram joins architecture, anthropology, and civic systems around the
legibility test; the other traces the real software path from source data to
the accessible exhibition room.

**Why:** The exhibition showed the method but not the person or the research
practice that produced it. Red and black supply the personal note—classy and
dangerous—without pretending to be a historical Wada combination.

**Correction:** The first desktop pass let the word `DANGEROUS` overrun its
narrower field. The black-field type was scaled independently. The first tablet
pass also held the desktop three-column prose too long, so the About room now
turns vertical at 900px while leaving the exhibition's own breakpoint intact.

**Evidence:** Content and data checks pass; axe reports zero automated
violations; the dialog opens by button and `A`, closes with Escape, focuses its
close control, has no horizontal overflow at 375/768/1280, and renders without
console warnings or errors.

Tags: `about`, `research`, `red-black`, `bauhaus`, `architecture`, `accessibility`

## 2026-10-02 — Let every plate leave the room

**What changed:** Added a dedicated JSON instrument and keyboard shortcut. Every
plate now opens as readable, copyable code carrying colour names and values,
field roles and proportions, the computed reading, provenance, caveats, and its
stable public address.

**Why:** Seeing a relationship should not trap it inside the exhibition. A
visitor who finds a useful plate can now move it into code, a design brief, an
agent, or another tool without reverse-engineering the interface.

**Key decision:** The export records both evidence and interpretation, but keeps
them explicitly separate. Source attribution and digital-conversion limits sit
beside the application’s computed reading rather than disappearing in prose.

**Evidence:** Source, interaction, accessibility, responsive, clipboard, live
deployment, and byte-delivery checks are recorded with the release commit.

Tags: `json`, `portability`, `colour`, `provenance`, `accessibility`

## 2026-10-02 — Give the source a room of his own

**What changed:** Added a full Sanzo Wada tribute inside About: an authored
Yellow Orange / Dark Tyrian Blue field, a curatorial statement, five documented
milestones, and direct links to Art Platform Japan, MOMAT, the Academy Awards,
and Seigensha.

**Why:** Attribution in a footer names a source but does not show the life that
made the system possible. Wada’s colour catalogue belongs inside his wider work
across painting, teaching, research, textiles, print, stage, and film.

**Key decision:** The tribute distinguishes documented biography from this
exhibition’s interpretation. It honours the relational method without turning
digital values into historical claims or Wada into a decorative brand name.

**Evidence:** Historical claims were checked against institutional records. The
rendered room, responsive sequence, links, accessibility tree, and deployed
bytes are verified with the release.

Tags: `sanzo-wada`, `tribute`, `provenance`, `plate-002`, `history`

## 2026-10-02 — Make interpretation auditable

**What changed:** Recast the Wada room as an explicit Dr Non interpretation and
added a six-part curatorial register covering historic source, digital data,
interpretive scope, computed readings, independence, and licence. The same
credit now travels inside every JSON export.

**Why:** Tribute without a visible authorship boundary can blur source and
interpretation. The exhibition must credit Wada’s work while owning its own
proportions, interface, role assignments, classifications, and prose.

**Design law:** Fine print is evidence architecture. It uses one numeric face,
stable identifiers, ordered labels, strict alignment, and solid fields. It does
not imitate legal clutter or add decorative lines.

**Evidence:** The register is checked at 375, 768, and 1280 pixels; the export
credit is parsed; accessibility, deployment, and live-byte gates are recorded
with the release.

Tags: `interpretation`, `authorship`, `fine-print`, `provenance`, `design-dna`

## 2026-10-02 — Welcome the idea and the blank page

**What changed:** Turned the finder into the front door for root visitors. A
person can type a free-form idea, choose a common mood, browse the relationships,
or ask for a chance encounter. Every chosen plate now exposes one plain action
that copies an agent-ready implementation brief; the same brief travels inside
the JSON export.

**Why:** The original instrument made every action possible but expected a new
visitor to decipher its symbols. The revised path welcomes both kinds of
visitor: the person trying to refine a direction and the person who has no
direction yet.

**Key decision:** Discovery is a door, not another permanent layer. Root visits
open the finder; stable plate links still open directly into the colour field.
After selection, one modeless action completes the handoff to any coding agent.

**Evidence:** Mood filtering, chance selection, direct plate entry, the visible
copy action, exported agent prompt, 376px layout, content checks, accessibility,
and production bytes are verified with the release.

Tags: `onboarding`, `search`, `agent-handoff`, `mit`, `interaction`

**Date:** 2026-10-02
**What:** Added phone/tablet/desktop PNG wallpaper downloads for every plate, with optional colour labels and credits; expanded local multilingual search and labelled partial matches.
**Why:** Visitors should be able to live with a colour relationship and find it using ordinary words, without learning the catalogue's narrow tag vocabulary.
**Diff:** [Search and geometry](palette-tools.js), [download flow](app.js), [regression tests](tests/browser.mjs), [downloadable guide](PALETTE-FIELD-GUIDE.md).
**Tags:** `wallpaper · search · multilingual · local-first`

## 2026-10-02 — A reading room, not another surface finish

**What:** Added a same-tab Aa doorway to an independent design reading room,
Thai/Chinese summaries, original source credits and a portable agent-ready
Markdown guide with the reusable `bauhaus-human-design` skill.
**Why:** A catalogue of tasteful defaults cannot determine what a person needs
to understand. The new method tests task, real content, structural alternatives,
communication and preservation before surface finish.
**Boundary:** Selected close reading is documented honestly; the five books are
not yet read cover to cover. Books stay private. Automated checks do not prove
human usability, fluent translations or full WCAG conformance.
**Review:** A fresh review found and corrected a small footer target and an
unnecessary eight-size type hierarchy. The reading room now uses three sizes;
weight and grouping distinguish its finer roles.
**Tags:** `bauhaus · communication · standards · provenance · anti-slop`

## 2026-10-12 — References made by people, on call

**What:** Added a stdio MCP (`mcp/`) and the `humanized-nostalgia-design` skill.
`design_brief` returns era-matched references from CARI, Design Reviewed,
Gurafiku, Artvee and eMuseum, the humanized-design rules with house overrides,
and three Wada plates found by the site's own search.
**Why:** A ban list alone converges on the average. A named, dated, credited
artefact gives an agent something to reason about.
**Boundary:** The snapshot stores metadata and links only. Artvee (robots
disallows AI crawlers) and the eMuseum demo (challenge) are link lists that were
never fetched. Design Reviewed artefact records were blocked and not bypassed.
**Tags:** `mcp · references · nostalgia · provenance · anti-slop`


## 2026-10-23 — The room where the method is visible

**What changed:** The plate view's research dialog became a Research screen. It
tells the story of how this came about — eleven dated entries from finding
Sanzo Wada's book to this one — and then does two things it did not do before.
It is a **playground**: eight faces, six design styles and all 348
relationships, each choice explained, each one loadable and comparable against
the others. And it carries **the golden section as a method**, not as a
decoration: one toggle draws the classical construction behind the plate
view, behind the Research screen's own text, and behind the playground's
preview.

Added `tools/golden-section.mjs`, a sixth instrument, which measures three
separate claims — that the construction is exact, that the interface lands on
the proportion, and that the playground's bench fits the field — and fails the
audit if any of them stops being true. Added `data/playground.json`, which
holds the faces, the styles and the reasons for both.

**Why:** The house law was a set of rules in a file, and a set of rules in a
file is a set of rules nobody can see working. The screen now shows the
proportion drawn over the thing it describes, so a reader can check the claim
instead of taking it.

**Key decision:** The diagram is drawn over the colour and under the words. It
z-indexes below the identity block and the plate label, and above the field, so
it explains the composition and never competes with it. One state, shared: the
button on the Research screen and `P` on the plate view are the same switch.

**What was measured:** The 0.618 cut the diagram draws lands at 855.36px
against a colour field that ends at 855px. The Research head's two columns
divide at 1.6180. The stylesheet uses the proportion in six rules. The screen
prints the first three, and the instrument checks them against the page.

**Three bugs the instrument found, recorded so nobody repeats them.** The
plate's overlay carried `inset: 0 56px 0 0` and `width: 100%`; an absolutely
positioned replaced element with a specified width ignores the opposite inset,
so the diagram was drawn over the whole 1440px stage while the field it
describes is 1384px, and its cut missed the boundary by exactly the width of
the rail. An `<svg>` is a replaced element, so with `width: auto` it takes its
intrinsic size rather than the box its insets describe. And the demo stage was
not a golden rectangle, so the construction fitted itself to the height and its
0.618 division landed in the middle of the wrong colour.

**Tags:** `research · golden-section · playground · typography · method`

## 2026-10-23 — Weigh the route, not the file

**What changed:** Added `tools/shipability.mjs`, a fifth instrument that weighs
each route by the bytes that crossed the wire on a cold cache, and wired it
into `npm run audit`. Added `scripts/font-subsets.mjs`, which measures in a
real browser which Chinese characters each page renders on arrival and which
are waiting behind a collapsed disclosure, and asks Google for a subset of
exactly those. The reading room's first load fell from 600 kB to 114 kB.

On the live site, where the HTML, CSS and JavaScript are compressed, the same
two routes went from 149 kB and 600 kB to **92 kB and 78 kB**. The reading room
was paying more for its webfont than for its whole page; it now transfers less
than the plate view does.

**Why:** The reading room was paying 518 kB of webfont for a 600 kB page.
Noto Sans SC is cut into 202 unicode-range chunks, and the eight characters of
a visible chapter label fell in three of them: 74 kB, 45 kB and 51 kB. A
reader paid 170 kB for eight glyphs, and paid them before reading a word.

**Key decision:** A subset is a payload decision, not a type decision. The
typeface is unchanged — a subset carries the same outlines for the same glyphs
and nothing else — so the house choice of Noto Sans SC stands. What changed is
which glyphs are shipped and when.

**Correction:** The first version of the instrument counted the decoded body
length and reported a 63 kB stylesheet as 231 kB, because the response carried
no content-length. It now reads `transferSize` from the Resource Timing API.
The second version classified a font by the first codepoint of its
unicode-range and called IBM Plex Sans Thai's Thai chunk "latin"; a range now
votes by the number of codepoints it holds in each script. A third error was
mine: the eager and deferred subsets overlapped, so the browser matched the
visible text against the larger face and downloaded the 74 kB file for eight
visible characters. The sets must be disjoint.

**A fourth finding, and the one that mattered.** The reading room measured
114 kB, then 181 kB, then 114 kB, then 181 kB — the same page, the same cache.
Chrome resolves a webfont for text inside a `content-visibility: hidden`
subtree, and a closed `<details>` body is exactly that: laid out, not painted,
and still charged. A closed disclosure's body is now hidden with
`display: none`, which is not resolved. The rendered page is byte-identical
with and without the rule — the same 14,080-pixel document, the same 56-pixel
disclosure, the same PNG — so the change touches what the reader pays for and
nothing they can see. Eight consecutive runs then measured 114 kB.

**Evidence:** Five consecutive cold-cache runs of each route: the plate view
transfers 49 kB of webfont and no Chinese face at all; the reading room
transfers 49 kB, of which 10.6 kB is the eager Chinese subset. Opening a
Chinese disclosure on the reading room fetches the deferred subset and the
text computes to `Noto Sans SC`. Opening the digest dialog on the plate view
fetches the deferred subset and the Chinese computes to `Noto Sans SC`.
`tests/shipability.test.mjs` covers the budgets, the classifier, the subset
coverage and the wire measurement.

Tags: `shipability`, `performance`, `fonts`, `subsetting`, `audit`

## 2026-10-22 — Give the reader the bench, not the verdict

**What changed:** The playground arrived as a comparison instead of a gallery.
Eight faces — three house, four study, and Inter, marked as the one that
arrived by default — and six styles, each with the reason it is in the set.
Every entry says why it is there, so the difference is visible rather than
argued.

**Why:** A bench that shows a style without saying why the style is there is a
catalogue. The reason is the content.

**Key decision:** The stylesheet's own `--pg-rule` token was set by the data
and read by nothing. Either the rules are drawn or the stylesheet is lying
about the styles, so the bench draws them: one hairline under the headline, or
one above and one below, and a style that draws no rule draws no space for
one.

## 2026-10-21 — Let the field decide how loud the type may be

**What changed:** The playground's display size is measured against the colour
field it sits on. `fitBench()` renders the sample, checks whether it fits
inside the field's padding, and scales the display down until it does.

**Why:** The loudest style in the set was set at 86px and pushed its headline
**172px past the top of the field**, where the stage clipped it. A bench that
clips the sample it is showing is a bench lying about the style.

**Key decision:** The floor is absolute — 20px — not a ratio. A display that
shrinks to 13px on a phone is not a display, it is a smudge, and no scale
ratio is worth that. The sample's caption was 205 characters, which is a
paragraph and not a caption; shortened, the loudest style fits at scale 1.00
on every viewport measured, and six styles keep six different sizes.

## 2026-10-20 — Give spatial decisions a contract

**What changed:** Added the anti-spatial-hallucination guide and linked agent, anti-slop and composition entrypoints.
**Why:** Alignment alone cannot explain an image’s role or justify unused space. Narrative heroes are one option, with a contrast and responsive fallback gate.
**Conservation:** No product UI, colour field, tokens or rail changed. The guide explicitly preserves Palette’s field-first constraints.
**Evidence:** Documentation/link and repository checks are recorded with this change; no UI render is claimed for a documentation-only update.
Tags: `composition`, `spatial-hallucination`, `documentation`
