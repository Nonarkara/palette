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
