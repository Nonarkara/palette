---
name: humanized-nostalgia-design
description: Ground a visual design in human-curated archives (CARI, Design Reviewed, Gurafiku, Artvee, eMuseum) and a Wada palette before drawing anything. Use when a surface looks templated, needs an era or nostalgia, or has no named reference.
license: MIT
---

# Humanized / Nostalgia Design

Start from things people made and catalogued, not from what a model thinks a
design looks like. Five archives curated by people supply the references, the
`humanized-design` MCP returns them in one call, and Sanzo Wada's 1930s plates
supply the ink.

## When this changes the decision

Use before the first line of CSS on a poster, landing page, cover, social card,
reading surface or any page that has no named reference. `no-design-tells` lists
what to avoid. This skill gives the positive starting point it lacks.
`bauhaus-human-design` tests whether the result communicates.
`bringhurst-contextual-type` chooses and proofs the face. `wada-colour-chords`
explains the plate. Skip it for dense operator consoles, where the Console
register already decides.

Production trigger: agents with a ban list and no reference converge on the
average of whatever remains (CLAUDE.md §14.2.3). A named artefact gives an agent
something to reason about. An adjective such as "clean" does not.

## 1. Ask for a brief

Call `design_brief` with `intent`, plus `era` (a decade) and `mood` when known.
It returns:

- the rules and house overrides
- CARI aesthetics that overlap the era
- Design Reviewed decade, movements and designers
- Gurafiku posts
- Artvee and eMuseum links
- three Wada plates

Without the MCP, run `node mcp/index.mjs` from this repo, or read
`mcp/data/references.json` directly.

## 2. Commit to one era and one artefact

Pick one aesthetic or movement and one concrete artefact. Open its link and look
at it. Write one sentence in the project's `context.md` naming the artefact and
the decision it makes, for example: *"Polish School of Posters: one hand-lettered
word fused with one flat image, three inks."* If the sentence could describe
another page in the estate, pick again.

## 3. Compose from the reference

Translate the artefact's decision, not its surface:

- **Ink:** 3–5 flat colours from the Wada plate.
- **Type:** one typeface carrying every role.
- **Space:** one focal element on an active empty field.
- **Metadata:** a catalogue-card layout with dates in human form ("Mid 1960s").
- **Credit:** a maker credit on every artefact shown, with "Not listed" when the maker is unknown.

Era gloss (Frutiger Aero chrome, Y2K bevels, CARI's own rounded tiles) is
history to cite, never a style to reproduce. House law wins: no radius, gradient
or shadow, and at most three text sizes.

## 4. Audit before shipping

Call `humanize_rules` and check the draft against each rule. Write a short
receipt containing:

- the reference
- the plate
- the typeface
- which rules the draft meets
- which rules don't apply, and why
- what still needs a human eye

Then run `npx axiom-audit . --strict` where the project has it.

To see how a reference site is actually built (its runtime, scripts and
network), use the `reverse-engineer-anything` skill (REA). Use passive
observation only, and only for sites whose terms allow it.

## Source boundary

This is Dr Non's selection and interpretation of five public archives, read on
2026-10-12. The snapshot stores names, dates, counts, captions, tags and links.
It stores no images and no prose.

- **Artvee:** link only. Its robots.txt disallows AI crawlers.
- **eMuseum demo:** link only. It sits behind a challenge.

See the [source and proof ledger](references/source-and-proof.md). Each archive
and each work keeps its own rights. No endorsement is claimed. The original
skill text is MIT.
