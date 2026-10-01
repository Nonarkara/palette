# Palette — design contract

## Design read

A colour plate becomes the entire room: one hard cut, one enormous plate number,
and one black instrument rail that explains itself only when asked.

## References

- Sanzo Wada's printed colour plates — colour as a relationship, never a loose swatch.
- Mark Rothko — the field is large enough to change the viewer's breathing.
- Bauhaus geometry — every division has a reason and every control has one job.
- MoMA collection interfaces — the object dominates; museum text waits nearby.

These are references, not styles to imitate literally.

## Dials

- `DESIGN_VARIANCE: 9` — asymmetric fields and changing palette geometry.
- `MOTION_INTENSITY: 5` — a short physical wipe when the plate changes.
- `VISUAL_DENSITY: 2` — colour occupies more than 90% of the first view.

## Geometry

- Zero radius.
- No visible borders or boxed cards.
- Grouping comes from alignment, scale, negative space, solid fields, and text position.
- Two colours split at 61.8 / 38.2. Trios and quartets keep one dominant field.
- Controls live in one black instrument rail. Symbols lead; text is available to assistive technology.

## Typography

- Display: Archivo Narrow.
- Thai: IBM Plex Sans Thai, non-looped.
- Chinese: Noto Sans SC.
- Data: JetBrains Mono.
- Three sizes: display, body, micro.

## Colour contract

The exhibition changes palette by design, so no single accent can govern the
room. Functional controls remain black/white. Palette colours never encode
status or navigation. Foreground text is chosen from black or white by computed
contrast. Every digital value is identified as a conversion, not printed truth.

## Motion

Plate changes use opacity and transform only, under 280ms. Reduced-motion users
get an immediate cut. Motion confirms a state change and does nothing else.

