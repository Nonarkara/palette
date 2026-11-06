# Twelve principles, one page

Dr Non's field note on the twelve neighbouring design principles, read from
[Figma's "13 Graphic Design Principles + How To Apply Them"](https://www.figma.com/resource-library/graphic-design-principles/),
retrieved 20 October 2026.

The reading room's chapter *Slop is a default nobody chose* teaches five rules that
recur in AI output. This file is the shorter vocabulary around them, so a critique
can name the thing it is describing instead of saying "it feels off".

**Source and standing.** Figma's article is a company resource-library page, not a
citable text with an author and edition. It teaches nothing original; the principles
are the common language of graphic-design teaching. We list them because the names
make a review precise, and because a named principle can be disagreed with. Where our
reading room departs from the article's advice, the departure is stated. No Figma
text is reproduced; this is a paraphrase with a link, and Figma claims no
relationship to this project.

## The twelve

1. **Alignment** — arranging elements to a common edge, centre or baseline so order is visible. Their advice: use a layout grid and auto layout.
2. **Contrast** — a noticeable difference between elements, so the eye lands on what matters. Their advice: contrast with colour, but also with size, weight, texture and shape. Their warning is worth keeping: *too much* contrast becomes jarring.
3. **Balance** — distributing visual weight, either symmetrical (even) or asymmetrical (a heavier element answered by a different weight). Their advice: grid lines as a guide; use white space so it does not read as cluttered.
4. **Hierarchy** — arranging and emphasising in order of importance, so a viewer understands the content quickly.
5. **Colour** — colour theory (how colours relate on the wheel) and colour psychology (how they affect behaviour), with accessibility considered so palettes stay distinguishable for people with colour-vision deficiencies.
6. **White space** — the empty area between and around elements. It creates breathing room, balance and readability. Their advice: the amount should follow the purpose.
7. **Proportion** — the size and weight of elements relative to one another. Large objects read as more important.
8. **Repetition** — reusing identical or similar elements to create cohesion, balance and rhythm, and to establish a brand.
9. **Rhythm** — repetition plus *placement and spacing*, giving movement and flow. Their four types: regular, random, flowing, progressive.
10. **Movement** — how the eye travels through the design. Their advice: follow common eye-tracking patterns such as the Z-pattern and F-pattern.
11. **Emphasis** — highlighting the single focal point, using the other principles to make it stand out.
12. **Proximity** — how objects are grouped to show relationship. Closer means connected; farther means unrelated. **Unity** closes the list as the property that makes all of the above feel like one piece.

## Where we depart

Three places, on purpose.

**Proportion is a physical fact here, not a relative one.** The article treats
proportion as the size of elements *relative to each other*. On a page of running
prose there is a second, harder constraint: the line itself. A line longer than about
65 characters, or roughly 30 words, breaks the return sweep — the eye finishes the
line and cannot find the start of the next one. Set measure in `ch`, not `rem`, so a
12-pixel caption gets the same number of characters as 16-pixel body text. Figma's
Principle 6 (white space) is about the gap between blocks; the measure is about the
width of the block itself, and the article does not reach it.

**Proximity fails when the gap lies.** The article assumes proximity is honest. In an
interface it can be inverted: a value separated from its label by more air than
separates it from the neighbouring value has announced a relationship that does not
exist. If proximity would mislead, the grouping must change before the spacing does.

**Movement is not always Z-shaped.** The Z-pattern and F-pattern describe reading
order for Latin-script prose on a page. They do not describe a map, a colour field, or
a table, where the eye goes where the data is densest. The principle survives — the
eye must travel somewhere on purpose — but the named patterns do not generalise, and
we do not apply them automatically.

## Our additions, from practice rather than from this source

- **The box may not be much bigger than its text.** A small thing stretched past about
  2× its width or 1.6× its height is a default, not a layout.
- **The top bar may not outrank the work.** Chrome that becomes the subject of the
  screen is the most reliable single tell. 56 pixels is the ceiling.
- **The font must be a choice.** Inter, Roboto and `system-ui` are flagged because they
  mean *unanswered*, not because they are bad. Naming the face and the reason is the
  fix; the system face is legitimate when the goal is to disappear into the device.

These three come from the [Non-Slop](../.non-slop/AGENTS.md) ruleset and from Dr Non's
own review practice, not from Figma's article. See `STYLE.md` for how they are enforced
in this repository.

## Licence and reuse

Figma's article is quoted by principle name and paraphrased, with a link, under the
fair-dealing provisions for criticism, review and teaching. No Figma text is
reproduced. The examples the article gives (The North Face logo, a restaurant social
ad) are its own and are not copied here. This file is original writing, MIT licensed
with the rest of this repository.