# Journal

## 2026-10-09 — Don't make users do the backend's job

**What changed:** The reading room, the palette field guide, and the Bauhaus skill now carry one rule. The system infers, defaults, and saves. The screen shows exceptions and the decisions only a person can make. Three questions sit with it, and a short do/don't for forms and lists. The example is a Thai teacher attendance card.

**Evidence:** `npm run check` and `npm run verify:browser` passed on this change. Fluent-reader review of the new Thai and Chinese sentences was not performed.

Tags: `guidance`, `anti-slop`

## 2026-10-08 — Measure the plate, then name the sources

**Human task:** A designer or developer stands in front of one combination and needs to know whether type will read, how the fields shift under a colour-vision preview, and how to leave with CSS, Tailwind, JSON tokens, or a link.

**What changed:** A contrast sheet reports WCAG 2.2 ratios and pass/fail in words, previews grayscale and three Machado simulations on the fields, and copies CSS variables, a Tailwind theme, design tokens, and the plate URL. Credits are a page and `CREDITS.md`. Focus rings were corrected where amber sat on a light ground. Actions are pinned to commit SHAs. A static-site content security policy is set. No tracker was added.

**Conserved:** One combination still owns the viewport. The rail, search, three scripts, and the anti-slop bans stay. The sheet sits on the lower part of the screen so the fields remain visible.

**Rejected:** A card dashboard over the colour, a Coolors-like marketing page, and a second contrast number from APCA that would disagree with the WCAG badge.

**Evidence:** `npm run check` and the browser script. Fluent-reader review of the short Thai and Chinese credit notes was not performed. The Mama Rule was not run.

Tags: `contrast`, `credits`, `accessibility`, `wcag`

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
