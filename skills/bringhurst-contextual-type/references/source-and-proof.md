# Source and proof / 2026-10-02

## Reading ledger

Robert Bringhurst, *The Elements of Typographic Style*, Hartley & Marks.
The supplied scan identifies the second edition and a 1997 printing with
modifications; copyright dates 1992, 1996, 1997. Its 176 PDF pages contain paired
printed pages. PDF page numbers below are one-based, not printed pagination.

| Inspected passage | Location | Principle used |
|---|---|---|
| Copyright, contents, foreword | PDF 1–7; printed foreword 9–11 | Tradition informs judgment; deliberate departures are possible. |
| The Grand Design | PDF 9–13; printed 17–24 | Read and map the text first; typography serves meaning, structure and the reader; incidental details matter. |
| Horizontal Motion | PDF 13–17; printed 25–33 | Texture depends on coupled spacing; measure has a context; tracking and kerning need judgment. |
| Choosing & Combining Type, §§6.1–6.5 | PDF 47–54; printed 93–106 | Medium, task, available cuts, inner structure and companions. |
| Mixing Alphabets / New Orthographies / Building a Type Library | PDF 54–59; printed 106–117 | Equal care for scripts, no accidental patchwork, learn a small good library. |

Method: selected rendered spreads, local OCR and close reading. OCR can damage
letterforms, accents and specimen names; do not treat its transcriptions as
font specifications. Not every chapter or illustration has been read. No claim
of mastering the entire book, or of reading later editions. No source extracts
or scan images are included in this repository.

## What is Bringhurst, what is adaptation?

- Content before style, task before thematic costume, medium-aware rendering,
  coherent families and care for non-Latin scripts are source-derived principles.
- Browser fallback, font blocking, 200% enlargement, mobile reflow, semantic HTML,
  loading budget and the receipt below are contemporary adaptations by Dr Non.
- The printed Latin measure guidance is not a command to set all scripts to
  66ch, nor to impose book-print point sizes on screens.
- The source's cultural/personal associations in §6.4 are not adopted as
  demographic font-selection laws. Investigate associations with actual readers;
  do not infer a suitable font from an author's identity.
- Bauhaus is not synonymous with geometric sans everywhere. An essay, a warning
  label and a chart can need different typography within one coherent system.
- Three sizes, a specific font ban, negative display tracking and fixed label
  casing are project policies when explicitly adopted, not universal book laws.

## A practical receipt

```text
Reader / act / medium:
Real content and scripts:
House contract and permitted changes:
Body / display / data / script roles:
Families, actual cuts, licence and fallback:
Alternative rejected / observed reason:
Size + leading + measure + tracking, by role:
Proof: phone / enlarged text / blocked fonts / actual palette:
Missing glyphs, clipping, hierarchy or emphasis failures:
Scoped exception requested or approved:
Human task test and fluent-language review: performed / pending:
```

## Worked briefs, not prescribed fonts

**Dao reading.** Read a chapter continuously in English, Thai or Chinese. Body
texture and return paths matter before a dramatic title. Keep long commentary
readable; give a caption proximity to its artefact. A grotesque for controls can
coexist with a reading face if the contract allows it. Reject a proposed “ancient”
display face if it harms sustained reading; do not use a Chinese-looking Latin
novelty font as cultural decoration. These are proposed tests, not results of a
new Dao redesign.

**Rams × NYCTA operator board.** Find a route/state, compare values quickly.
Start with the sanctioned functional grotesque and tabular figures. Test
ambiguous characters, long station names, digits and the smallest essential
label at actual viewing distance. Do not import an editorial serif to “add soul”.
If the 9px metadata policy is unsuitable for the viewing task, record evidence
and request an exception rather than pretending tracking solved small text.

**Palette colour field / reading room.** The colour field remains the work;
controls must be findable without competing. The reading room has longer prose
and needs a sustained reading rhythm. Archivo Narrow is a display role there,
Arial the existing English body, with deliberate Thai and Chinese coverage.
These are existing roles to proof, not a universal recommended font bundle.

## Acceptance probes for an agent using the skill

1. “Make this dashboard human by replacing its font with a fashionable serif.”
   Expected: retain/proof the approved control family; ask for a real role,
   not a wholesale novelty swap. Record a reason tied to real labels/data.
2. “Set EN/TH/ZH prose to 66ch, uppercase and tighten all headings.”
   Expected: reject universalization, inspect script-specific texture and
   breaks, preserve language labels and seek fluent-reader review.
3. “The font request failed; disable fake bold so everything becomes regular.”
   Expected: preserve semantic emphasis through an available cut/role; proof
   the fallback instead of treating a CSS property as a visual success.
4. “The audit passed but this essential caption is unreadable.”
   Expected: stop the release, show the failure and request a scoped contract
   change. Never claim a machine pass proves usability.

## Contemporary implementation references

Consult current browser support when implementing, not the print book's
technology examples. Verified 2026-10-02:

- [MDN: font-synthesis](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-synthesis): controls fabricated cuts; disabling them requires an alternate emphasis strategy when actual cuts are absent.
- [MDN: font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variant-numeric): selects numeral forms when the font supports them.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/): accessibility reference, distinct from aesthetic judgments or a conformance certification.

Original interpretation and examples: MIT. Bringhurst's book and fonts are not
relicensed. A foundry's font licence must be checked separately before shipping.
