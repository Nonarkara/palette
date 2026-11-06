# REMEDIES: where to go instead

**Read this when a limit in [ANTI-SLOP.md](ANTI-SLOP.md) fires and you need to know what to do about it.**

The repo had two halves and no third. `ANTI-SLOP.md` says what is wrong — thirteen
limits, measured against 46 citizen-built flood apps.
`ANTI-SPATIAL-HALLUCINATION.md` says when a layout is arranged without an
intention. `STYLE.md` says what *this* repo chose instead, for itself.

What was missing is the middle: **the destinations.** A rule that only says "no"
leaves the reader to invent the alternative, and inventing an alternative under
time pressure is how you get a purple gradient. This file names the alternative,
and names a real place to look for it.

Three columns, in this order:

1. **The failure** — what it looks like on screen.
2. **The destination** — what to do instead, in words you can act on.
3. **The source** — a real, named place to look, with its address.

## How to use a link in this file

A reference is not a style. If you copy a site's composition, you have a page
that could belong to anyone, which is the disease this repo exists against. Look
at **one** thing: the grid, the type, the density, the motion, the way a state
is signalled. Then build your own.

Every entry carries a **verdict for this repo**, because this repo has rules that
the wider web does not:

| Verdict | Meaning |
|---|---|
| **Reference** | Look at it. Do not paste its artefacts into Palette. |
| **Banned here** | It fights a house rule. The rule is named in the row. |
| **Usable** | Safe to use in this repo as it stands. |

Nothing here is a substitute for the doctrine. A tool does not make a decision
for you; it gives you something to decide with.

---

## 1. "It looks like AI slop"

**The failure.** A competent page that could belong to any product. Default
font, default corner radius, three identical cards, a gradient behind a headline.

**The doctrine.** Limits 1–13, and the whole of `ANTI-SLOP.md`. There is no
single remedy for this one, which is why it is first: this file cannot save a
brief that never decided anything.

**The destination.** Decide the thing itself before the page. Name the subject's
abstract core in one sentence a competitor could not use, then find the
tension you will not negotiate, then pick two or three styles that serve it
([DESIGN-STYLES.md](DESIGN-STYLES.md)), then break one of their rules on
purpose. Then measure the geometry with `tools/spatial-audit.mjs`.

**The source.**

| Site | What it is | Verdict here |
|---|---|---|
| [Awwwards](https://awwwards.com/) | Award-winning site designs | Reference |
| [Godly](https://godly.website/) | Unusual layouts and creative ideas | Reference |
| [Minimal Gallery](https://minimal.gallery/) | Clean, minimal websites | Reference |
| [Land-book](https://land-book.com/) | SaaS and landing-page inspiration | Reference |
| [SiteInspire](https://siteinspire.com/) | Websites organised by style | Reference |
| [Refs.Gallery](https://refs.gallery/) | Curated design references | Reference |
| [Site of Sites](https://siteofsites.co/) | Site gallery, organised by vibe and collection | Reference |

**The trap.** A gallery is a mood board, not a specification. If you leave with
"the dark one feels premium", you have learned nothing and shipped a default.

---

## 2. "It feels like a PowerPoint from 2007"

**The failure.** Every section fades up on scroll. Three entrances, four
transitions, a bounce on the button, a counter that ticks to 99.9%. Motion
everywhere means motion nowhere.

**The doctrine.** `effect-library`, `fade-up-everything`, `bounce-easing`,
`count-up` (Non-Slop); `reduced-motion` is never allowed off. A motion rule in
`ANTI-SLOP.md`: motion should answer an action.

**The destination.** Pick **one** moment that deserves motion, and let it answer
a question — where did this come from, what just changed, what happens next.
Everything else stays still. Every non-essential animation lives behind
`prefers-reduced-motion`. Duration 150–250 ms, ease-out, transform and opacity
only. If you cannot name what the motion is telling the reader, delete it.

**The source.**

| Site | What it is | Verdict here |
|---|---|---|
| [60fps.design](https://60fps.design/) | Micro-interactions taken from real apps | Reference |
| [Ripplix](https://ripplix.com/) | UI animations with AI prompts | Reference |
| [Motion](https://motion.dev/) | Animation library for React | Reference |
| [LottieFiles](https://lottiefiles.com/) | Ready-made animated assets | Reference |
| [GSAP](https://gsap.com/) | Advanced scrolling and motion | Reference |
| [Animista](https://animista.net/) | CSS animation playground, copy only the keyframes you configured | Reference |

**The trap.** Stock effect libraries are named in the doctrine as
`effect-library`: spotlight, meteors, beams, aurora. One orchestrated moment
beats a kit of effects. Copying keyframes from a playground is fine; copying a
whole page of them is a kit.

---

## 3. "AI keeps changing the font every two minutes"

**The failure.** The agent picks a different face each run. Nothing is wrong
with any single choice; the product simply has no voice, and no two screens
agree.

**The doctrine.** `default-font`, `tasteful-font`, `type-scale`,
`font-not-loaded`. `STYLE.md` names this repo's faces.

**The destination.** Write the type decisions down **before** the screens, in a
file the agent reads every time — a plain-text design system at the project
root. One body face, one display face if it earns a second role, one monospaced
face for every number. A scale with a stated ratio, ≤8 sizes. Proof the real
paragraphs, the real controls and the real scripts before changing anything.

**The source.**

| Site | What it is | Verdict here |
|---|---|---|
| [Google's `design.md` spec](https://github.com/google-labs-code/design.md) | The plain-text design-system format for coding agents | Reference — read the format, write your own file |
| [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) | `DESIGN.md` files analysed from real brand design systems | Reference |
| [Tokens Studio](https://tokens.studio/) | Consistent colours, fonts and spacing | Reference |
| [Design Systems Repo](https://designsystemsrepo.com/) | Real brand design systems | Reference |
| [Component Gallery](https://component.gallery/) | UI patterns from design systems | Reference |
| [designmd.app](https://designmd.app/) | AI-readable design references | Reference |
| [FreeDesignMD](https://freedesignmd.com/) | Free design systems for AI | Reference |
| [DesignMD.co](https://designmd.co/) | Ready-to-use `DESIGN.md` references | Reference |

**The trap.** A `DESIGN.md` copied from someone else's site gives your product
someone else's decisions. This repo's equivalent is `STYLE.md` — and it is
already written, with the reason for each choice.

---

## 4. "It feels like a website squeezed into a phone"

**The failure.** The desktop layout, narrower. Three columns that never
collapsed. Body copy at 9px so it fits. A sidebar that is now a 90px strip.
Nothing broke, and nothing works.

**The doctrine.** New rules in `tools/slop-lint.mjs`: `phone-squeezed` (≥25% of
the visible text on a 390px screen set below 12px) and
`desktop-columns-on-phone` (a narrow column left beside a much wider one — the
desktop's two-column split that never collapsed). `mobile-overflow` catches the
sideways scroll, which is the visible part, not the disease.

**The destination.** A phone layout is a different composition, not a smaller
one. Re-decide the order of things: what is the one thing this person came for,
what can wait, what can be a list instead of a grid. Type size does not go
down — it goes up, or it stays. Targets are at least 44 × 44 CSS pixels, which
is a thumb, not a cursor. Check the phone layout by hand, not by shrinking the
desktop window.

**The source.**

| Site | What it is | Verdict here |
|---|---|---|
| [Mobbin](https://mobbin.com/) | Screens from popular mobile apps | Reference |
| [Pageflows](https://pageflows.com/) | Real onboarding and user flows | Reference |
| [Banani](https://banani.co/) | App UI references | Reference |
| [ScreensDesign](https://screensdesign.com/) | Mobile screen inspiration | Reference |
| [Appshots](https://appshots.design/) | App screens and UX patterns | Reference |
| [Apple Design Resources](https://developer.apple.com/design/resources/) | Official Apple UI assets | Reference |

**The trap.** Looking at other apps' screens teaches you their composition, not
yours. Ask what the person is doing on the phone, not what the phone looks like.

---

## 5. "Not every section needs a random rocket emoji"

**The failure.** 🚀 in the nav, ✨ on the button, 🎨 on the feature heading.
Usually a rendered emoji standing in for an icon set nobody chose.

**The doctrine.** Limit 5: **0** emoji as icons. Non-Slop's `emoji-icons` rule,
sev P1. `STYLE.md`: "never. This is the one house rule with no exception."

**The destination.** Use a word, or one real icon set used sparingly. Most
interface icons are unnecessary: the label already says it. When an icon does
earn its place, take the whole set from one source so the strokes, the grid and
the optical weight agree.

**The source.**

| Site | What it is | Verdict here |
|---|---|---|
| [Figma Community](https://www.figma.com/community) | Free icons, kits and assets | Reference |
| [unDraw](https://undraw.co/) | Customisable SVG illustrations | Reference |
| [Open Peeps](https://openpeeps.com/) | Mix-and-match people illustrations | Reference |
| [DrawKit](https://drawkit.com/) | 2D and 3D illustration packs | Reference |
| [3dicons.co](https://3dicons.co/) | Free 3D icon packs | Reference |
| [Lummi](https://lummi.ai/) | AI-generated visuals and photos | **Banned here** — house law: no AI-generated visuals |

**The trap.** "No emoji" is not "no personality". It means the personality is in
the drawing, the words and the colour — not in a glyph the operating system
picked for you.

---

## 6. "Every section is just another boring rectangle"

**The failure.** Section after section in the same flat grey box, separated by
nothing, so the page reads as a stack of equal slabs.

**The doctrine.** Limit 6: ≤15 boxes. Limit 1: ≤3 shadows. Limit 3: one radius.
`ANTI-SPATIAL-HALLUCINATION.md`: unjustified gaps, false hierarchy, accidental
wrapping.

**The destination.** Do not fill the space — **arrange** it. Decide what
separates one group from the next and let that do the work: a rule, a change of
ground, a change of scale, or nothing at all when nothing separates them.
Repetition is fine when the items really are parallel; a rank board of three
things may be equal height on purpose.

**The source.**

| Site | What it is | Verdict here |
|---|---|---|
| [Haikei](https://haikei.app/) | SVG waves, blobs and shapes | Reference — but a decorative texture is banned in this repo |
| [MagicPattern](https://magicpattern.design/) | Mesh gradients and patterns | **Banned here** — 0 decorative gradients |
| [Texturelabs](https://texturelabs.com/) | Grain, paper and other textures | **Banned here** — no decorative texture |
| [Subtle Patterns](https://subtlepatterns.com/) | Clean, repeating backgrounds | **Banned here** — no decorative texture |
| [GradientsHub](https://gradientshub.com/) | Gradient and texture library | **Banned here** — 0 decorative gradients |
| [Pexels](https://pexels.com/) | Free photos and videos | Reference — only where a real photograph is the data |

**The trap.** Every one of these is a way to add texture. Texture is not
structure. The problem with a stack of identical rectangles is not that they are
grey; it is that nothing tells the reader which one matters.

---

## 7. "It looks like a plain screenshot"

**The failure.** A raw screen grab dropped into a marketing page, or worse, a
mockup with a fake phone frame around a design that was never on a phone.

**The doctrine.** `placeholder-content` and `ai-visual` (sev P0). House rule:
real content early, including long labels and missing data.

**The destination.** Show the thing in the place it lives. If it is a phone
app, show it on a phone — but render the actual interface, with the real
content, at the real size. If you have no real capture, do not fake one: build
the surface.

**The source.**

| Site | What it is | Verdict here |
|---|---|---|
| [Shots.so](https://shots.so/) | Screenshots and device mockups | Reference |
| [Rotato](https://rotato.app/) | 3D device mockups and animations | Reference |
| [Smartmockups](https://smartmockups.com/) | Mockups for apps and websites | Reference |
| [Mockuuups Studio](https://mockuuups.studio/) | Device mockups and scene generators | Reference |
| [Screen.studio](https://screen.studio/) | Screen recordings | Reference |
| [Placeit](https://placeit.net/) | Mockups, videos and branded assets | Reference |

**The trap.** A mockup is a photograph of a fiction. It makes a guess look
finished. Use it to show a thing that exists, not to make a thing look as
though it exists.

---

## 8. "Purple gradients and Inter"

**The failure.** Two colours that nobody chose, a gradient nobody asked for, and
the font that ships with the framework.

**The doctrine.** Limits 1 and 11, `default-font`, `purple-gradient`,
`default-purple`, `gradient-text`. The house rule: one flat brand colour from
the subject's world, and a gradient only with a job.

**The destination.** Take the colour from the subject — a flag, a material, a
map layer, a printed plate — and give it one job. Take the face from the
subject's world too, and be able to say why. If the answer is "because it is
the one everyone uses", you have not chosen; you have arrived.

**The source.**

| Site | What it is | Verdict here |
|---|---|---|
| [Coolors](https://coolors.co/) | Generate matching colour palettes | Reference |
| [Adobe Color](https://color.adobe.com/) | Find colour combinations | Reference |
| [Google Fonts](https://fonts.google.com/) | Free website fonts | Reference |
| [Fontshare](https://fontshare.com/) | Modern fonts | Reference |
| [Grabient](https://grabient.com/) | Customisable gradients | **Banned here** — 0 decorative gradients |
| [CSS Gradient](https://cssgradient.com/) | Generate gradients and CSS | **Banned here** — 0 decorative gradients |

**The trap.** A palette generator hands you five colours that go well together
and nothing else. It cannot tell you which one is the subject's. This repo's
colours are the credited digital conversion of Sanzo Wada's combinations, named
and numbered in `data/colors.json` — a palette with a provenance, which is the
whole point.

---

## 9. "Make it more premium"

**The failure.** The brief. "Make it more premium", "make it modern", "clean it
up". An agent receives adjectives with no subject and produces a generic page
that satisfies none of them, because there is nothing to satisfy.

**The doctrine.** `generic-promise` (sev P2, hit is REVIEW — a person reads the
sentence), `hype-copy`, `generic-cta`. And the file-level gap: **Non-Slop does
not scan Markdown**, so a brief written in Markdown is never checked at all.

**The destination.** Replace the adjective with an anchor. A vague directive
must carry something specific on the same line: a number with a unit, a named
material, a named reference, a file, or a real quote. "More premium" becomes
"the header band is 52px, not 92px, because the field it labels is the work" or
"Archivo Narrow, because the rail is 56px wide and the plate number has to fit
in it." Then say what it is *for*: the reader, the task, the constraint.

**This repo now has an instrument for it:** `tools/brief-lint.mjs` reads design
briefs and reports every vague directive that carries no anchor. It is the only
check in this repo that looks at the words *before* the screen.

**The source.**

| Site | What it is | Verdict here |
|---|---|---|
| [Vibe Code Source](https://vibecodesource.com/) | AI coding prompts and guides | Reference |
| [nxcode](https://nxcode.io/) | Structured app prompts | Reference |
| [Notion templates](https://www.notion.com/templates) | Organising reusable prompts | Reference |
| [Google's `design.md` spec](https://github.com/google-labs-code/design.md) | Design instructions for AI agents | Reference |

**The trap.** A prompt library is a catalogue of other people's decisions.
Take the *shape* of a good brief — core, constraint, anchor, reason — and write
your own.

---

## 10. "Reinventing the hero section for the fiftieth time"

**The failure.** The same centred headline, subhead and two buttons, above the
fold, on a product that has something better to show.

**The doctrine.** `centered-hero` (sev P1), `hero-no-data` (a hero over half the
screen with nothing to look at). Limit 13.

**The destination.** Open with the most characteristic thing in the subject —
the map, the number, the photo, the table, the artefact itself — and give it
one primary action. If the hero *is* the artefact, let it fill the screen, which
is what this repo does with a Wada plate.

**The source.**

| Site | What it is | Verdict here |
|---|---|---|
| [Supahero](https://supahero.io/) | Real hero-section inspiration | Reference |
| [Shuffle.dev](https://shuffle.dev/) | Thousands of UI components | Reference |
| [Untitled UI](https://untitledui.com/) | Clean UI sections | Reference |
| [One Page Love](https://onepagelove.com/) | One-page sites and templates | Reference |
| [Preline](https://preline.co/) | Ready-to-use website sections | Reference |
| [DaisyUI](https://daisyui.com/) | Components with built-in themes | Reference |
| [21st.dev](https://21st.dev/) | Components built for modern apps | Reference |
| [Uiverse](https://uiverse.io/) | Buttons, toggles and loaders | Reference |
| [Aceternity UI](https://aceternity.com/) | Fancy, animated components | **Banned here** — the stock effect kit |
| [Magic UI](https://magicui.design/) | Animated React components | **Banned here** — the stock effect kit |
| [Page UI](https://pageui.com/) | Ready-made landing-page sections | Reference |
| [shadcn/ui](https://ui.shadcn.com/) | Clean components for real apps | Reference — but set the radius and the neutrals yourself |

**The trap.** A section library hands you the section and its arrangement, which
is the arrangement you did not decide. Lift the *pattern* — a comparison table, a
price strip, a spec list — not the composition.

---

## 11. "It works on my laptop"

**The failure.** Shipped and true. The page is fine on a 1440px monitor with a
mouse, and broken at 390px, at 320px, with the fonts blocked, with the keyboard
only, in Thai, and in Chinese.

**The doctrine.** `viewport`, `html-lang`, `lang-th`, `lang-zh`, `img-alt`,
`unnamed-button`, `focus-removed`, `low-contrast` (all `noAllow`), plus the
house rules: every action keyboard-operable, every target ≥44 × 44 CSS pixels,
Thai non-looped, Simplified Chinese.

**The destination.** Test the things a linter cannot see. The full task by
keyboard. The phone at 390 and at 320. The failure states: no match, no data,
error, slow. The three scripts. And the last gate: a different agent or person
reviews. Never self-review — you have already decided what the page means.

**The source.**

| Site | What it is | Verdict here |
|---|---|---|
| [PageSpeed Insights](https://pagespeed.web.dev/) | Find website speed problems | Usable |
| [WebPageTest](https://www.webpagetest.org/) | Analyse loading performance | Usable |
| [GTmetrix](https://www.gtmetrix.com/) | See what makes your pages slow | Usable |
| [Design Lint](https://www.figma.com/community/plugin/801195587640428208/design-lint) | Figma plugin that flags layers not using styles | Reference — a Figma file, not a web page |

**The trap.** A speed score is not a usability test, and a passing audit is not
a working page. `tools/slop-lint.mjs` and `tools/spatial-audit.mjs` are screens,
not judges; they tell you where to look.

---

## 12. "It needs a picture"

**The failure.** The page has a hole where an image should be, so a decorative
gradient blob or an AI-generated illustration goes in.

**The doctrine.** `ai-visual` (sev P0) and `placeholder-content` (sev P1). House
law: no AI-generated visuals, no placeholder media.

**The destination.** The honest options, in order: a real photograph, a real
drawing, real data, or nothing. Nothing is a legitimate answer and often the
best one. A page that needs an image to look finished is a page that is not
finished.

**The source.**

| Site | What it is | Verdict here |
|---|---|---|
| [Pexels](https://pexels.com/) | Free photos and videos | Reference — a real photograph is real |
| [Apple Design Resources](https://developer.apple.com/design/resources/) | Official Apple UI assets | Reference |
| [Lummi](https://lummi.ai/) | AI-generated visuals | **Banned here** — sev P0 house rule |

**The trap.** An AI image is a placeholder with better manners.

---

## What this list is not

Honest limits, so nobody trusts it further than it goes.

- **It is not a style authority.** Some of these sites are good. Some are
  catalogues of the thing this repo exists to argue against. Read them for
  reference, never for permission.
- **A reference library does not know your subject.** Every remedy here has to
  be applied to *your* core, and the core is the hard part. This file can only
  point at the material.
- **Most of these tools are visual.** None of them help with the three things
  the doctrine says matter most: the subject's core, the constraint you will not
  negotiate, and the reason a reviewer would approve.
- **Free is not the same as free to use.** Check each site's licence before
  anything of theirs ends up in a shipped product, and keep the credit.
- **It is not a substitute for the doctrine.** `ANTI-SLOP.md` and
  `ANTI-SPATIAL-HALLUCINATION.md` decide. This file tells you where to walk.

## Cross-reference: the 13 limits, and where each one goes

| # | Limit | Remedy section |
|---|---|---|
| 1 | Shadows on everything | [6](#6-every-section-is-just-another-boring-rectangle) |
| 2 | Lines too long to read | [Typography](TYPOGRAPHY-FIELD-GUIDE.md) · [FIGMA-PRINCIPLES.md](FIGMA-PRINCIPLES.md) |
| 3 | Everything rounded | [6](#6-every-section-is-just-another-boring-rectangle) · `STYLE.md` |
| 4 | No type scale | [3](#3-ai-keeps-changing-the-font-every-two-minutes) |
| 5 | Emoji as icons | [5](#5-not-every-section-needs-a-random-rocket-emoji) |
| 6 | Box soup | [6](#6-every-section-is-just-another-boring-rectangle) |
| 7 | Pills and badges everywhere | [10](#10-reinventing-the-hero-section-for-the-fiftieth-time) |
| 8 | Dark command centre | [1](#1-it-looks-like-ai-slop) · `STYLE.md` |
| 9 | Stretch-to-fill | [1](#1-it-looks-like-ai-slop) · `tools/spatial-audit.mjs` |
| 10 | Pop-up on first load | [1](#1-it-looks-like-ai-slop) |
| 11 | Gradients, gradient text, glass | [6](#6-every-section-is-just-another-boring-rectangle) · [8](#8-purple-gradients-and-inter) |
| 12 | Dead empty space | [1](#1-it-looks-like-ai-slop) · `tools/spatial-audit.mjs` |
| 13 | A hero with no data | [10](#10-reinventing-the-hero-section-for-the-fiftieth-time) |

## Cross-reference: the six spatial-hallucination modes

| Mode | Remedy |
|---|---|
| Unjustified gaps | [1](#1-it-looks-like-ai-slop) · `tools/spatial-audit.mjs` |
| Orphan elements | [12](#12-it-needs-a-picture) — remove the element, or give it a job |
| Scattered actions | [10](#10-reinventing-the-hero-section-for-the-fiftieth-time) — one row, one order |
| False hierarchy | [6](#6-every-section-is-just-another-boring-rectangle) — change scale, not colour |
| Accidental wrapping | [4](#4-it-feels-like-a-website-squeezed-into-a-phone) — re-compose for the width |
| Spatially expensive information | [4](#4-it-feels-like-a-website-squeezed-into-a-phone) · [11](#11-it-works-on-my-laptop) |

---

## Where this list came from

The twelve failure phrases above are the parentheticals from a public Instagram
carousel by **Aashish Pahwa (@okaashish)**, "60+ Free Websites Every Vibe Coder
Should Know About", posted 21 Oct 2026. Each slide names a category of site and
then, in brackets, the AI failure it prevents. Those twelve phrases are the
best plain-language statement of the failure list I have found, so this file
adopts them as its headings.

The catalogue of sites came from that carousel too. **The carousel's own
mockups are textbook slop** — a slide showing "Build faster with AI / Turn your
ideas into real products" is a purple gradient with a pill button and a centred
hero, which is precisely what section 1 of this file tells you to delete. So it
is used as a **map of destinations**, never as an authority on style. The
descriptions here are ours, not theirs.

**Every address in this file was checked by hand on 22 Oct 2026** with an HTTP
request and the result recorded. Three names in the original list have since
moved or died, and one resolves to a parked domain rather than the tool:

| Name as published | Address published here | What happened |
|---|---|---|
| Animista | `animista.net` | `animista.io` no longer resolves |
| Placeit | `placeit.net` | `placeit.me` no longer resolves |
| Site of Sites | `siteofsites.co` | `siteofsites.com` does not resolve |
| Refs.Gallery | `refs.gallery` | `refsgallery.com` does not resolve |
| Design Lint | Figma Community plugin | `designlint.com` is a parked domain, not the tool |

If a link here is dead when you read it, it is dead. That is the cost of a
directory, and it is why the doctrine — not this file — is the law.

## Attribution

Tool names and addresses are the property of their owners, listed here as
attribution for a public directory. Nothing was copied from any of them. The
carousel images are not reproduced here. Upstream attribution for everything
vendored into this repo is in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
