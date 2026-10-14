# Layout field guide

Palette's checks for lines, columns, spacing and balance. Adopted 2026-10-14.

The colour field is unchanged. One combination still owns that viewport. These checks are for pages that set text, rules and a grid. The specimen is `specimen.html`.

The numbered checks are Palette's. The sources in Credits prompted them. They are not quotations from those books, and they are not a tracing of the Desizn Circle pictures.

## Tokens

They live in the `interface` set of `tokens/palette.tokens.json`. Values come from the `:root` in `layout.css`, except the dominant share, which is the existing exhibition token.

| Token | Value | Job |
|---|---|---|
| `space-4` | 4px | Half-module. |
| `space-8` | 8px | Rhythm unit. |
| `space-16` | 16px | Two units. Gap under text that comes before a rule. |
| `space-24` | 24px | Three units. |
| `space-32` | 32px | Four units. One baseline. |
| `space-48` | 48px | Six units. |
| `space-64` | 64px | Eight units. |
| `space-96` | 96px | Twelve units. |
| `gutter` | 24px | Grid gutter. The 24px minimum of `reading.gutter`. |
| `grid-columns` | 12 | Desktop. |
| `grid-columns-mobile` | 4 | Mobile. |
| `baseline` | 2rem | Reading body is 1.25rem at line-height 1.6. |
| `rule-1`, `rule-2`, `rule-3` | 1px, 2px, 3px | The only rule weights. |
| `rule-max` | 3 | Most distinct weights on one page. |
| `optical-centre-offset` | 4% | Optical centre above the geometric centre. |
| `font.geometric` | Jost, Archivo Narrow, Arial, sans-serif | Display and wordmarks only. |
| `number.dominant-share` | 0.618 | Reused for the heavy mass. Already in the interface set. |

Vertical gaps are multiples of 8px, so they also land on the 32px baseline.

## Lines

A rule is a bar of 1, 2 or 3 pixels. It is not a border around a box.

**L1.** A rule separates levels, not items.

Pass: the rule sits between a label and a title, or between a title and a credit. Fail: a rule between the English, Thai and Chinese lines, or between the two red forms.

**L2.** A rule starts and ends on column edges.

Pass: the start and end sit on column lines of the 12-column or 4-column grid. Fail: the rule stops at an arbitrary width.

**L3.** A rule sits 1 unit above the text after it and 2 units below the text before it.

The unit is 8px. Pass: 16px under the earlier text, 8px above the later text. Fail: equal gaps, or the larger gap on the wrong side.

**L4.** At most three rule weights on a page.

Pass: every rule is 1, 2 or 3 pixels, and the page uses no fourth weight. Fail: a 4 pixel rule, or a fourth weight beside these three.

On the specimen the 3 pixel rule marks the jump into the display, the 2 pixel rule marks the jump into the explanation, and the 1 pixel rule marks the jump into the plate. The axis reuses the 1 pixel weight. It is part of the diagram, not a separator between items.

## Grid

**G1.** Text and rules share left alignment lines.

Pass: those blocks start on column 1. Fail: each block picks its own left edge.

**G2.** Display type width snaps to columns.

Pass: the display box starts and ends on column lines. Fail: the display box uses a width that misses the columns.

**G3.** Desktop is 12 columns. Mobile is 4. The gutter is 24px, the same minimum as `reading.gutter`.

Pass: those three numbers. Fail: a different column count or a gutter off the scale.

The switch is at 760px, the same width the exhibition uses for the rail.

## Spacing

**S1.** Spacing comes from the scale, and the rhythm steps by 8px.

Pass: margins, padding and gaps are the scale, the gutter, the baseline, or zero. Fail: a one-off length such as 12px or 18px.

**S2.** Vertical rhythm locks to the baseline.

Pass: a text line box is 2rem, or a whole multiple of 2rem. The display line box is 96px, which is three baselines. Fail: a line box that cannot meet the baseline grid.

**S3.** Inner spacing is at most half the outer spacing.

Pass: the gap inside a group is at most half the gap around that group. On the specimen, a script row's inner gap is 8px and the gap between rows is 16px. Fail: equal gaps that make separate groups look like one group, or a tighter gap outside than inside.

The 1:2 ratio is Palette's check. It was prompted by Wertheimer's 1923 account of proximity. It is not a number from that paper.

## Balance

**B1.** Visual weight comes from area, darkness, saturation and isolation.

Pass: the heavy thing is heavy for one of those reasons, and the caption says which. Fail: weight that depends on a shadow, a gradient, or a picture.

**B2.** Asymmetric balance. The dominant mass is 60–70% of the width.

Pass: the mass uses `interface.number.dominant-share` (0.618). Fail: a centred mirror, or a mass outside that range.

**B3.** The optical centre is about 4% above the geometric centre.

Pass: the axis uses `optical-centre-offset`. Fail: the axis on the geometric middle when the brief asked for the optical shift.

**B4.** At least one negative-space field is roughly the size of the main form.

Pass: the ivory field to the right of the mass has the same area as the mass. The red forms sit inside that field and do not fill it. Fail: a leftover sliver, or empty space with no relation to the main form.

**B5.** One focal point per screen.

Pass: the first screen is led by the wordmark; the second screen is led by the black mass. Fail: two equal heroes on one screen.

## The balance plate

The plate is drawn in CSS. It is not a copy of the Desizn Circle images, and those images are not embedded.

The ink is Plate 190 from the catalogue search used for this brief: Ivory Buff `#ebd3a2`, English Red `#d96629`, Black `#111314`. These are credited digital conversions, not the printed ink. Open it at `index.html#plate-190`.

The black rectangle is the mass. Its width and its height are the dominant share, so its area matches the ivory field on the right. Its vertical centre sits on the axis. The axis is a 1 pixel line with a dot at each end. The left dot and the left half of the line are Ivory Buff, so they stay visible on the black. The right half and the right dot are Black, so they stay visible on the ivory. Two English Red rectangles, one larger and one smaller, sit in the ivory field, off the axis, and not as a mirror pair.

## This page against the checks

`tests/layout.test.mjs` checks that rules end on column lines, that spacing comes from the scale, and that no more than three rule weights are used. Looking at the screenshot is still required for clipping, apparent size and the balance. That look is not a user test.

## Credits

- Desizn Circle (@desizncircle), as prompts only: [DeYHElAEoM8](https://www.instagram.com/p/DeYHElAEoM8/) and [Ddx-GPxEkBi](https://www.instagram.com/p/Ddx-GPxEkBi/). The pictures were not copied.
- OMORO, named with those prompts. No separate OMORO image is reproduced here.
- Herbert Bayer, Universal alphabet, 1925. [Letterform Archive](https://letterformarchive.org/news/bauhaus-typefaces-part-two/). [Design Reviewed](https://designreviewed.com/designer/herbert-bayer/).
- P22, and The Foundry (Freda Sack and David Quay), for the Bayer revivals that were not shipped.
- Christian Holm, CTAN `universa`, not shipped.
- Owen Earl / indestructible type*, Jost, SIL Open Font License. [Repository](https://github.com/indestructible-type/Jost).
- IBM Plex Sans Thai. Noto Sans SC.
- Anuphan by Cadson Demak (Mint Tantisuwanna), SIL Open Font License, trial line only. [Repository](https://github.com/cadsondemak/Anuphan).
- Josef Müller-Brockmann, *Grid Systems in Graphic Design*, 1981. The column checks are Palette's, prompted by that grid tradition. This file is not a reading of the book.
- Robert Bringhurst, *The Elements of Typographic Style*. See `TYPOGRAPHY-FIELD-GUIDE.md`. The measure and the script care come from that method. This file does not add a new reading of the book.
- Rudolf Arnheim, *Art and Visual Perception*. B1's factors were prompted by that account of visual weight. No page is cited, because this file is not a reading of the book.
- Max Wertheimer, 1923, on grouping by proximity. The 1:2 ratio is Palette's.
- Sanzo Wada, Plate 190, via the credited digital conversion in `data/colors.json`.

## Receipt

Person: someone setting type, rules and a grid on a Palette page. Situation: the token file had no spacing, grid, baseline, rule or balance values. Outcome: the specimen can be checked against L1–B5. Obstacle: prose rules drift unless a test can see column edges, the scale and the weight count.

The colour field, the eleven rail controls, and the reading-room body are conserved.

Chosen composition: two screens on one page, sharing column 1. The first screen is the type specimen. The second is the balance plate. Rejected: a card gallery of the rules, and rejected: drawing the plate on top of the colour field.

A fluent reader has not signed `LAYOUT-FIELD-GUIDE.th.md` or `LAYOUT-FIELD-GUIDE.zh-CN.md`.
