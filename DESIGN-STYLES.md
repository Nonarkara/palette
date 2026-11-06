# Fifty design styles — a toolbox, not a menu

A catalogue of named visual languages, for an agent or a designer who has already
decided *what the thing is* and now needs to decide *how it looks*.

**Read [ANTI-SPATIAL-HALLUCINATION.md](ANTI-SPATIAL-HALLUCINATION.md) first.**
A style is a set of choices about type, colour and layout. It is not a licence to
stop asking why each choice is there.

---

## The order matters, and the order is not "pick a style"

The source article for this list tells you to *start your prompt with a style
name* — "Ethereal UI design", "Neo-Brutalist web layout". That is a fast way to
get a plausible picture out of a model, and it is backwards for real work.

A style chosen before the subject is known produces the same page for everyone.
The genre of the content decides the style, not the other way round. So:

**1. Name the abstract core first.** What is this, in one sentence, that could
not be a different product? "A room for 348 colour relationships, each one the
whole viewport." Not "a colour palette app". If your sentence could be pasted
onto a competitor's site, it is not yet the core.

**2. Find the tension.** Every good exhibition has a constraint it will not
negotiate — one source-verified combination owns the viewport, and interface
chrome never competes with it. Write yours down. This is what makes the design
yours rather than a genre.

**3. Then choose from the toolbox.** Two or three styles, not one. One style is
a costume; two in tension is a composition. "Bauhaus meets Wada's colour book" is
a real brief. "Bauhaus" alone is a swatch.

**4. Break one of them on purpose.** A style copied whole reads as a pastiche.
The interesting move is to take a style and refuse one of its rules — keep the
grid, lose the symmetry; keep the serif, lose the gold. Say which rule you are
breaking and why.

**5. Check the geometry.** Run the spatial auditor. A style can be chosen and
still be laid out without an intention. See `tools/spatial-audit.mjs`.

### What to write down before you start

```
Core:        one sentence, specific enough that a competitor could not use it
Tension:     the constraint you will not negotiate
Styles:      two or three, named
Break:       which rule of one of them you are deliberately breaking, and why
Ground:      what the reader is looking at, in one line
```

---

## The catalogue

Fifty styles, grouped by the kind of decision each one makes. Grouping is ours —
the source article is a flat list, and its own author describes it as a personal
compilation from YouTube, chat and Pinterest, not a sourced taxonomy. Treat it
as a vocabulary, not as design history. Where a style is a real movement with
real scholarship, use it as such; where it is an internet label, use it as a
mood word.

### Structure and geometry — how the page is put together

**Bauhaus** — German school, 1920s. Form follows function. Grid systems, sans-serif
type, a red-blue-yellow palette, circles and triangles and squares, minimal text.
Rational, structured, modern. *Core elements as given:* "Grid systems, sans-serif
fonts, red-blue-yellow palette, circles/triangles/squares, minimal text."

**Brutalism** — raw, bold, purposefully unrefined; borrowed from architecture, rejects
polish, breaks interface norms. "Monospaced fonts, grayscale palettes, harsh edges,
solid blocks, default buttons." Bold, disruptive, honest.

**Neo-Brutalism** — "a cleaner, more structured evolution of classic Brutalism". Keeps the
raw honesty, adds better interface practice. "Bold colors, large type, stark layouts,
minimal UI components, purposeful asymmetry." Confident, bold, raw-yet-usable.

**Utilitarian** — function first, clean, direct; clarity over aesthetics, with a rugged
military-industrial feel. "Grid layout, monospaced or industrial fonts, muted tones,
absence of decoration." Used in manuals, signage, and technical interfaces.

**Modular Typography** — type broken into grids and building blocks; a flexible system
with its own visual rhythm. "Geometric letterforms, typographic grids, uniform spacing,
variable layouts." Structural, modern, playful.

**Bento Box** — content in neatly organised block-like sections, like compartments.
"Rounded modular blocks, subtle shadows, icons with labels, micro-animations, neutral
palettes." Organised, friendly, clean. *Note:* its own element list — rounded blocks,
subtle shadows — is on this project's ban list. Use the structure, not the devices.

**Mid-Century** — 1940s–60s. Form, function, organic simplicity. "Clean lines, retro colors,
boomerangs, mod patterns, sans-serif fonts." Nostalgic, modernist, optimistic.

**Swiss / International Typographic** *(not in the source list; a caution)* — the source
catalogue omits it, and its absence is worth noticing rather than filling. Do not
substitute a style you know into a list you are citing.

### Period and revival — borrowing a historical register

**Neoclassical** — Greco-Roman antiquity revived for order, symmetry and refined elegance.
"Serif fonts, columns, laurel wreaths, marble textures, gold accents, symmetry, muted
palettes." Formal, timeless, noble.

**Baroque** — opulent, emotional, theatrical; 17th-century Europe, thriving on excess.
"Flourishes, deep shadows, gold leaf, religious or mythological motifs, rich textiles, high
contrast." Regal, ornate, celebratory.

**Art Deco** — sleek, geometric, sophisticated, "born from the glamour of the 1920s".
"Gold accents, sunbursts, symmetry, angular shapes, rich jewel tones, sans-serifs with flair."
Glamorous, upscale, jazzy.

**Art Nouveau** — nature-inspired, fluid, highly decorative; organic and floral.
"Curving lines, floral motifs, hand-lettered type, earthy palettes, stained glass patterns."
Romantic, poetic, organic.

**Victorian** — grand, elaborate, deeply ornate, from "the aesthetics of the 19th-century
British monarchy". "Ornate serif fonts, damask patterns, deep reds and greens, gilded frames,
heavy florals." Opulent, historical, romantic.

**Acanthus** — classical architectural ornament from the acanthus plant's foliage, seen on
Corinthian columns. "Leaf motifs, flowing curves, symmetrical vines, stone textures, natural
greens and golds." Regal, organic, classical.

**Filigree** — intricate delicate ornament in gold or silver; fine linework and lacy
embellishment. "Delicate line patterns, metallic inks, curves, lace textures, monogram fonts."
Luxurious, vintage, ceremonial.

### Light, surface and atmosphere — how the page feels in the hand

**Tenebrism** — dramatic lighting, intense light-and-dark contrast, giving depth and
emotional weight. "High contrast chiaroscuro, black backgrounds, spotlighting, oil textures."
Intense, emotional, moody.

**Pointillism** — small dots of colour forming an image; adds texture, detail, grain.
"Dot clusters, optical mixing, pastel or impressionist palettes, fade transitions." Artistic,
textured, tranquil.

**Mixed Media** — several visual styles and techniques in one cohesive piece; layers and
depth. "Cutouts, overlays, analog + digital collage, hand-drawn + photo elements, paper
textures." Eclectic, expressive, avant-garde.

**Gothic** — medieval architecture and dark romanticism. "Blackletter fonts, stained glass
textures, stone motifs, deep purples and blacks." Dark, dramatic, historic.

**Dark Magic Academia** — gothic academia blended with mysticism, "like Harry Potter meets
occult". "Candles, spellbooks, antique etchings, black/gold palette, serif calligraphy."
Mysterious, scholarly, magical.

**Light Academia** — soft, poetic, classical, "like walking through a European library in
summer". "Creamy neutrals, serif fonts, books, sunlight, linen textures." Scholarly, calm,
refined.

**Tenebrism's neighbour, Aurora** — northern lights: flowing iridescent gradients, dreamy
abstraction, futuristic yet soft. "Iridescent gradients, blur effects, soft glows, translucent
overlays, organic wave forms." Dreamy, futuristic, meditative.

**Ethereal** — delicate, weightless, otherworldly, "made of mist or light". "Light pastels,
gauzy overlays, minimal serif fonts, low contrast, feathered shadows." Calm, mystical, romantic.

**Wabi Sabi** — Japanese philosophy of embracing imperfection and impermanence.
"Earthy tones, rough pottery textures, natural light, organic forms, minimal sans-serif."
Humble, calm, contemplative.

**Japandi** — Japanese minimalism fused with Scandinavian functionality. "Light woods,
beige/gray palettes, clean sans-serif fonts, minimal icons, natural materials." Calm,
peaceful, intentional.

### Print and craft — handmade registers

**Conceptual Sketch** — rough hand-drawn look for ideation. "Pencil/ink lines,
crosshatching, greyscale tones, annotations, sketch paper texture." Experimental, informal,
idea-driven.

**Scrapbook** — handmade collaging of memories; tape, torn edges, handwritten notes. "Paper
textures, washi tape, Polaroid frames, hand lettering, stickers." Sentimental, warm, nostalgic.

**Pixel Art** — nostalgic, from early computer and video-game graphics. "Grid-based visuals,
low-res icons, limited color palettes, 8-bit/16-bit look." Nostalgic, geeky, fun.

**Anthropomorphic** — human traits given to objects and interface elements. "Expressive eyes,
limbs on objects, character-based icons, rounded friendly shapes." Fun, quirky, friendly.

**Kawaii** — Japanese culture of cuteness; childlike, cheerful, charming. "Pastel colors,
rounded icons, baby faces, blushing cheeks, handwritten type." Sweet, innocent, joyful.

**Rebus** — communicates through symbols that stand for sounds or words. "Pictograms, visual
puns, image-type hybrids, clean layouts." Witty, playful, intellectual.

### Pop, subculture and internet — the loud registers

**Pop Art** — from mass media, advertising and comics; 1950s–60s. "Ben-Day dots, bold
outlines, primary colors, comic sans or display fonts, speech bubbles." Loud, fun, energetic.

**Memphis** — 1980s, bold and unapologetically fun, throwing rules out. "Squiggles, bright
primaries, grids, clashing colors, block shapes, cartoonish motifs." Youthful, quirky,
anti-establishment.

**Graffiti** — rebellious, raw, rooted in street culture. "Spray paint textures, dripping
letters, concrete backgrounds, neon colors, freestyle typography." Urban, defiant, expressive.

**Kitsch** — "bad taste" embraced ironically. "Clashing prints, outdated fonts, shiny plastic
textures, retro advertising visuals, excess." Campy, fun, ironic.

**Y2K** — late 1990s / early 2000s tech culture. "Chrome textures, pixel fonts, metallic
finishes, iridescent gradients, matrix grids." Futuristic, nostalgic, edgy.

**Vaporwave** — surreal and satirical; consumerism critiqued, 80s/90s nostalgia celebrated.
"Pastel pinks and purples, VHS glitch, Greek busts, MS Paint elements, Japanese text, lo-fi
textures." Ironic, dreamy, nostalgic.

**Synthwave** — retro-futuristic, 1980s sci-fi and synth music. "Think 'Tron' meets 'Blade
Runner' with a pink-purple glow." "Grid horizons, VHS textures, neon gradients, 3D chrome type,
purple and cyan palettes."

**Cybercore** — hacker aesthetics, sci-fi, the underground internet. "Neon lights, glitch
effects, code patterns, green/black themes, tech symbology." Futuristic, chaotic, dystopian.

**Neo Frutiger Aero** — Y2K revival: glossy interface elements, rounded sans-serifs like
Frutiger, bubble-like gradients. "Aqua blues, semi-transparent bubbles, gloss overlays,
friendly icons, rounded UI." The one proprietary typeface the source names is Frutiger.

**Glassmorphism** — frosted glass: transparent with blur and depth. "Frosted backgrounds,
blur effects, semi-transparency, soft shadows, neon tints." Futuristic, elegant, sleek.
*On this project's ban list:* the doctrine forbids glass panels.

**Luxury Typography** — refined letterforms carry the identity. "Serif fonts, high letter
spacing, gold foil, monochrome palettes, bespoke ligatures." Elegant, elite, timeless.

**Farmhouse / Cottagecore** — one entry in the source. Cottagecore romanticises rural life;
Farmhouse adds "a more rustic, American countryside twist". "Florals, gingham, wood textures,
antique finishes, serif or hand-drawn type." Cozy, nostalgic, wholesome.

**Shabby Chic** — vintage charm with feminine elegance; distressed finishes, florals, pastels.
"Whitewashed textures, faded florals, cursive typography, lace, soft pinks and blues." Romantic,
cozy, nostalgic.

**Bohemian** — artistic freedom and earthy charm; globally inspired and layered. "Rich
textures, mandalas, jewel tones, ethnic prints, script fonts, organic materials." Free,
soulful, eclectic.

**Coquette** — ultra-feminine and flirty with vintage undertones, "draws from early 2000s
romantic aesthetics — think lace, bows, soft filters, and love letters". "Baby pinks, pearls,
ribbon motifs, dainty serif fonts, heart shapes." Delicate, girly, nostalgic.

**Surrealism** — breaks logic and realism; dreamlike juxtapositions. "Collage, disjointed
objects, melting forms, metaphors, unexpected scale." Dreamy, unsettling, thought-provoking.

**Steampunk** — Victorian aesthetics fused with industrial machinery and sci-fi fantasy.
"Copper tones, cogwheels, leather, top hats, serif type, steam and smoke motifs." Adventurous,
vintage-futuristic, imaginative.

**Mystical Western** — cowboy westerns fused with occult mysticism. "Tarot symbols, cacti,
western serif fonts, sun/moon motifs, earthy tones, leather textures." Mystical, rugged,
folklore-driven.

**South West / Wild West** — American desert landscapes, cowboy culture. "Terracotta, cacti,
denim textures, cowboy boots, serif western fonts." Rugged, adventurous, nostalgic.

**Nautical** — sea life, ships, coastal living; fresh and orderly. "Navy and white, anchors,
ropes, stripes, brass, serif or stencil fonts." Fresh, structured, maritime.

---

## Two cautions the source does not give

**It names almost no typefaces.** Only Frutiger and Comic Sans appear by name;
everything else is a class — serif, sans-serif, monospaced, blackletter, script,
stencil, display, pixel, "western serif". So "Art Deco" is not a font spec. You
still have to choose the face, and that choice is yours, not the style's.

**It names no designers and no sources.** The author says the list was curated by
"diving into YouTube, chatting with AI, and going down Pinterest rabbit holes". It
is a personal compilation. Bauhaus, Art Deco and Victorian are movements with
real scholarship behind them; Kitsch, Rebus and Neo Frutiger Aero are internet
labels asserted without citation. Do not cite this file as design history.

**Its own advice inverts the method.** The article recommends starting a prompt
with a style name, mixing styles, and generating "3–4 styles for the same concept"
to build moodboards. That is good for a moodboard. It is wrong for a page you
have to defend, because a style chosen before the core produces the same page
for everyone. Core first, then style — that is the order here.

---

## Source

- "50 Design Styles Every Designer Should Know For Better Prompting", Himanshu
  Bhardwaj, UX Planet, 1 August 2025.
  <https://uxplanet.org/50-design-styles-every-designer-should-know-for-better-prompting-56c09d55db62>
- Read 20 October 2026. The article's own three-part structure per entry — origin
  and intent, core elements, mood and occasion — is preserved above in its own
  words where it can be quoted. Style names and order are the article's. The
  grouping, the cautions, the "core first" method, and every note about this
  project's own constraints are ours.

Licensed for quotation under fair dealing for criticism, review and teaching. No
Figma or UX Planet text is reproduced beyond the short quoted element lists.
