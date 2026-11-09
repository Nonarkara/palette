# DESIGN-CANON.md — one front door for dense, balanced, beautiful, slop-free surfaces

**Status:** v1.0 · 2026-11-09 · DRAFT for owner ruling (provisional rulings marked ◐; vote on them in [CANON-BALLOT.md](CANON-BALLOT.md))
**Reads for:** every agent and every human on every Non codebase.
**Origin:** `ULTIMATE-DESIGN-SYSTEM-CANON.md` (classical composition + 40 commandments), reconciled with the laws already in force here.
**What this file does not do:** replace anything. It composes. Where it names a deeper file, that file stays canonical for its topic.

**Authority order (first wins):** `AGENTS.md` → project `CLAUDE.md` / `context.md` / `STYLE.md` → `CLAUDE.md` §11–§14 → this file → `_reference/MSH.md` → raw evidence.
Two things sit above the order and never lose: **contrast and the task** (a person must be able to read it and finish the job), and **preservation** (never fix a surface by deleting the product).

---

## 0. The creed

> Compact first. Scroll only for interesting depth. Boxes fit content. Logos never boxed. Something must win. The eye enters on weight; the payload sits on the exit. Name a grid or stay quiet. Whitespace has a job or it is hallucinated. Pick a register before you style. Honest numbers, honest pins. Builder is not auditor. No slop ships.

---

## 1. Definitions

**Layout spatial hallucination (MSH).** An interface invents a reason for things to occupy space instead of arranging them around how people read, choose and act. It looks composed and cannot explain its own geometry. Ask of every region: *why is this here, why this size, why this far from that?* "The grid put it there" fails.
The tells: chrome that does nothing · boxes bigger than their words · stretch-to-fill · scroll as default · equal weight · hierarchy lost to scroll · unjustified gaps, orphans, scattered actions, accidental wrapping · spatially expensive information · things on top of things.
Full operating law: `_reference/MSH.md`, `AGENTS.md` §3, `CLAUDE.md` §11.12–11.12.1.

**Geographic spatial hallucination (GSH).** A system invents where something happened or how deep it was. Prefer no pin over a wrong pin. Full law: `_reference/GEO-SPATIAL-HALLUCINATION.md`, `CLAUDE.md` §11.13. §6 below is the summary.

**AI design slop.** A default nobody chose: the statistical average of the training set. Single tells (Inter, a purple gradient, three identical cards) matter less than the **stack**; ask whether someone who has seen thirty agent-built sites would place this one among them (`CLAUDE.md` §14.2).

**The trap.** Restraint is now the generated default (cream ground, hairlines, tracked caps, one muted accent). Obeying every ban is necessary and no longer sufficient. Distinction comes from a specific Design Read and a named reference (§7).

---

## 2. Composition laws (new to the house, adopted from the canon)

These five answer *how a surface feels balanced*. The older files answer *what is banned*. Use both.

### 2.1 Fill or Breathe
Every region commits to one state.
- **Fill:** the element hugs its content. Padding ≈ 0.5–1.5× line height. A control is ≤ 2× its content width and ≤ 1.6× its content height. Desktop buttons are `width: max-content`.
- **Breathe:** space exists only where the eye or the subject's gaze travels, and it has a named job: separate groups, pace reading, frame the focal point, push.
- **The slop middle:** padded too loosely to read as intent, too tight to be breathing room, stretched to balance a grid track. Massacre the first expansion; do not decorate its consequences.
- **Intentional voids push.** An empty grid module is structure. Never plug it with a filler card or badge.

### 2.2 Fulcrum (asymmetric balance)
Visual weight = mass × distance from the centre of vision. A large quiet mass (low contrast, muted, big area) sits near the centre. A small dense accent (high chroma, bold, the key number) balances it from the perimeter. The failure is the seesaw: a heavy block on one side and dead padding on the other, with no counterweight chosen.

### 2.3 Harmonic armatures
Divide the viewport on a ratio, never a convenient percentage. √1 (1:1), √2 (1:1.414), √3 (1:1.732), golden (61.8 / 38.2). Never 50/50; use golden or 2/3 + 1/3 (`CLAUDE.md` §14.2.4). Horizontals rest, verticals carry dignity, diagonals are action. A diagonal or rotated element is forbidden unless a kinetic grid is named (`_reference/KINETIC-GRIDS-FOR-AI.md`). Dense forms, tables and map/ops screens stay `column` or `modular`.

### 2.4 Glance path
The eye enters on visual weight, not DOM order. The heaviest visual (the map, on map products) is the entry; the headline, key number and primary action sit on its exit; related copy never leapfrogs a heavy visual. Tab order matches what the eye sees. A headline may lead only when it is itself the dominant visual. Full law: `_reference/GLANCE-PATH-FOR-AI.md`.

```
FAIL (Omega)                         PASS (Mustang)
 small headline        <- skipped     HEAVY VISUAL / MAP     <- eye enters
 HEAVY VISUAL          <- eye enters  HEADLINE, large        <- exit
 copy + action         <- leapfrog    key number + action    <- payload
```

### 2.5 Silhouette
Reduce the screen to flat black and white. The focal point, the primary action and the groups must still be identifiable. A silhouette of identical rounded rectangles is certified slop.

---

## 3. Geometry and box hygiene (numbers)

1. **Box fit.** Rule 2.1 numbers. No `min-height`, `width:100%`, equal-height stretch or `1fr` used to fill. A box with more than ~3× its text's area is guilty until justified.
2. **No void.** No flat empty region over ⅓ of the first screen. No phone-width column floating on desktop. No blank half while loading: skeleton, or last-good data with a timestamp.
3. **Compact first.** If the task fits one screen at **390×844** and **1440×900**, it fits one screen. Scroll is for depth that adds a fact or an action. It is never the place where things get put.
4. **Chrome budget.** All fixed bars together: ≤ ~12–15 % of viewport height on phone, ≤ 20 % on desktop. Phone nav bars ≤ 56 px. A bar is as tall as what it holds. Test: delete it; if no decision is lost, it stays deleted. ◐ (canon said 20 % flat; stricter wins on phone)
5. **Short records are comparison rows.** Name + value on one line, metadata on a second. Four short fields do not earn four stacked lines. Do not repeat identity that the row already contains (`AGENTS.md` §3).
6. **Stat tiles** sit in a ruled strip, sized to their text. Never equal stretched tracks. A lone last tile never spans the row.
7. **One primary action per screen**, written `Verb + Object`, sized to its text.
8. **Related actions group.** Space inside a group is smaller than space between groups. No pager at one edge and its list at the other.
9. **Things never sit on top of things.** No panel over the label that explains a layer. Hidden information is a lie by occlusion.
10. **Map-first surgical table.** On map/ops products the map is ≥ 60 % of the first screen on phone and desktop; panels dock as thin edge instruments; nothing covers the map on load.
11. **Touch targets.** Isolated primary actions and map/icon controls: real 44 × 44 px. A dense group of text controls keeps label-plus-padding boxes: ≥ 32 px high on touch, never under the 24 px WCAG 2.2 floor, ≥ 4 px apart. Reach 44 by layout and by having fewer controls, never by padding every box. ◐ (canon said 44 flat; `CLAUDE.md` §11.12 wins)
12. **Planar alignment.** Every edge resolves to another edge: a sibling's edge, a module line, a shared margin or the page boundary. Grid, gutters and max-width are tokens declared once. Spacing sits on the declared scale (4 / 8 px); `mt-[13px]` fails.
13. **No first-load modal.** Answer the user's question first. Onboarding and disclaimers wait.

---

## 4. Type, colour, motion, imagery

### Type
- **Sizes.** Three per page in Dr Non projects: Display 32, Body 14, Micro 11 (`CLAUDE.md` §11.7). A lone hero numeral may use Display. Other codebases without a declared scale: ≤ 8, and treat 8 as a ceiling, not a target. ◐ (canon and `MSH.md` said ≤ 8; house law says 3. Ballot Q1)
- **Step.** Adjacent hierarchy levels differ by ≥ 1.5–2×. Poster-scale 5–10× display is allowed only for a hero numeral or an Editorial/Institutional cover.
- **Measure.** Running text 45–75 ch, aim ≤ 65. Thai and Chinese: ~30–45 characters.
- **Banned as primary face:** Inter, Poppins, Montserrat, Roboto, Open Sans, Lato, DM Sans, Space Grotesk, Geist, Plus Jakarta Sans, Manrope, Nunito, naked `system-ui` as the design face. Unexplained primary use is a defect.
- **Approved:** Josefin Sans, Jost, League Spartan for display; Source Sans 3 for body; JetBrains Mono for data. Thai: IBM Plex Sans Thai, Noto Sans Thai, Prompt, Kanit, never Sarabun or any looped face. Chinese: a geometric sans such as Noto Sans SC. ≤ 2 families. Project files may override, but may not adopt a banned face without Dr Non's written approval in the same session.
- Heading polish: `text-wrap: balance` on h1–h3; letter-spacing ≥ −0.04em; semantic z-index scale (dropdown → sticky → backdrop → modal → toast → tooltip), never `9999`.

### Colour
- **One signal accent, one job.** Amber `#f59e0b` is the live signal in the Console register. Other registers may name their own single signal accent (`design.md` §XV). A data colour spends an accent. ◐ (canon said ≤ 2; ballot Q2)
- Quiet ground. Colours come from the Wada palette (`palette/`), with named roles: field, ink, rule, signal. Never Tailwind blue `#3B82F6`.
- **Zero** decorative gradients, glass, glow, drop shadows. Allowed: a dark vertical overlay on a photo for legibility; `inset` hairlines; `:focus-visible` rings. Radius is 0 except a true circle.
- **Contrast** ≥ 4.5:1 body, ≥ 3:1 large text and icons. Verify on the rendered element, on every ground it crosses.
- **Light vs dark follows the register**, not a global default. Light for Index, Civic, Editorial, Institutional. Dark only for Console, where the room is dark and the palette is disciplined. No neon command-room cosplay. ◐ (canon: light by default; ballot Q3)

### Motion
- Decide first: 100+ actions a day → no animation. Occasional → standard. Rare, first-time or milestone → delight allowed (`CLAUDE.md` §14.1.1).
- Every animation has one job: spatial consistency, state, feedback, explanation, or softening a jarring cut. Otherwise delete it.
- Animate `transform` and `opacity` only. Ease-out `cubic-bezier(0.22, 1, 0.36, 1)` for entrances; never ease-in on UI. ≤ 300 ms (modals ≤ 500). Press = `scale(.97)` with no delay. Hard cut for pure state swaps. No `transition-all`, no hover-scale on cards, no idle pulse on static chrome. Gate hover behind `(hover: hover)`. `prefers-reduced-motion` = gentler, not zero. ◐ (canon said "hard cut"; both survive: cut for state, ease-out for entry. Ballot Q7)
- Gamified or game surfaces: skill `gamification-motion`.

### Imagery
- Real photography, real plates, raw data. No AI-generated hero art unless the project's intent calls for it (Horizon 45) or Dr Non names the request. Credited, beautiful stock is allowed; filler stock is not. One photo, one place per site.
- Logos sit directly on the ground: no chip, border, pill, shadow or backing plate.
- Symbols over prose when one glance teaches them (▲▼ → ✓ ▶). Never emoji as UI icons. A label that restates its control is deleted.
- Commissioned art is used where the drawing reads, on the grid, or not at all (`CLAUDE.md` §11.12.1).

---

## 5. Registers and the Divergence Protocol

Pick the register before the first line of CSS (`design.md` §XV): **Console · Index · Civic · Editorial · Institutional**. The twelve invariants in `design.md` §XIV never bend. Everything else may diverge when the divergence is **named, load-bearing and written down** in the project's `context.md` (`design.md` §XVII).

This is how the canon's "style is not slop" is honoured here: a deliberate choice is protected, a drift is not. A protected choice is never allowed to waive contrast, honest numbers, geographic honesty, keyboard parity or preservation.

Required in `context.md` before layout: the Design Read (one sentence specific to this surface), a named real reference (never an adjective), the one dominant element per section, and line weights that differ by role.

---

## 6. Honesty (data, places, claims)

- **Every number** shows `{source, tier, age}`. Fallback or demo data is visibly labelled. A fake number shown as live is worse than an error. No placeholder statistics. Ever. (`CLAUDE.md` §16.1 Law 3)
- **Pins.** Never invent latitude/longitude. No centroid of a province, amphoe or tambon. No midpoint, no 0,0, no vibe pin. No silent geocode swap: ambiguous means `null` plus a flag for hand-pin.
- **Depth.** Never invent a depth. "Knee-deep" stays words. Rain mm is not flood depth. Gauge levels come only from the official series.
- **Instruments.** A localised flood is not moved onto the nearest river gauge.
- **Sources.** Corroborate tips; show source age; never present an archived snapshot as live.
- **When unsure of a pin or a value: null.** A blank state is honest. A hallucinated one is a permanent scar.
- **Copy.** Banned filler: unlock, seamless, revolutionize, streamline, optimize, boost, leverage, synergy. No possessive copy ("your dashboard"). No quantified happiness. Plain words, short sentences (Dr-Non-Write).
- **A hero over half the screen fails** unless it is the data, the map or the number.

---

## 7. Preserve the product

Never fix a surface by deleting it. Live maps, canvases, tickers, HUDs, rotating text and earned content are the product (`CLAUDE.md` §11.1). No edit collapses a file by more than 30 %. Before any design-surface edit, say in one line what is being kept. A mess in a 500-line file is often where the personality lives; ask before flattening it. A "fix" that raises the score by removing a feature is a regression.

---

## 8. Procedure

**Builder**
1. Brief: who reads this, in what physical condition, for what one job. Pick the register (§5). Write the Design Read and the named reference.
2. Write the one-screen composition: focal element, second, third, the named grid, what is **not** on the screen. Set the chrome budget.
3. Build 390×844 and 1440×900 first. Add scroll only where the composition said a reading surface needs it.
4. Real content: long Thai/Chinese strings, empty state, error state, 10× rows.
5. Run `npx axiom-audit . --strict` (and against `dist`), the project's rendered geometry audit, and capture screenshots at 390 / 1024 / 1440.
6. Hand to a different agent.

**Triage first:** Heavy (structure is wrong) / Light (geometry is right, polish is off) / None. Fix geometry before cosmetics. Never polish a hallucinated layout.

**Auditor** is a different agent (ideally a different model family, `CLAUDE.md` §16.4) or a human. The auditor reads the screenshots blind, before the builder's rationale. Source-text scans do not count as a visual audit.

---

## 9. Ship gate

Run at **390 · 1024 · 1440**. Any FAIL blocks unless Dr Non waives in writing.

| # | Check | Pass | Fail |
|---|---|---|---|
| B1 | First-screen task | Core fact + primary action visible together | Scroll through empty chrome to act |
| B2 | Chrome cost | Within §3.4 budget | Stacked identity/title/status bands |
| B3 | Box fit | Boxes hug text | Text ≪ box |
| B4 | Void purpose | Every void has a named job | Dead thirds, orphan columns, stretch-to-fill |
| B5 | Scroll honesty | Each extra screen adds a fact or action | Scrolling through padding or duplicate cards |
| B6 | Hierarchy | One focal point, step ≥ 1.5–2× | Equal-weight mush |
| B7 | Glance vector | Heavy visual = entry; payload on exit; Tab order matches | Omega pattern, leapfrog |
| B8 | Proximity | Groups tighter inside than between | Scattered actions |
| B9 | Map/data | Map ≥ 60 % where applicable, panels docked | Map buried or covered |
| B10 | Logos | On the surface, unboxed | Boxed, chipped, shadowed |
| B11 | Alignment | Every edge meets an edge; spacing on scale | Near-miss edges, off-scale values |
| B12 | Type | Banned faces absent, measure ≤ 75 ch, sizes within §4 | Banned primary face, full-width paragraphs |
| B13 | Language | `lang` set, Thai/ZH have room, no filler copy | "Unlock/seamless", fake stats |
| B14 | Access | Contrast, §3.11 targets, visible focus, keyboard parity | Sub-spec targets, focus trap |
| B15 | Silhouette + template swap | Flat-black outline shows focal point; pasting a rival's name on it would not fit | Identical-rectangle skyline; layout works for any brand |
| B16 | Register + honesty | Register declared; every number carries source/tier/age; no invented pin/depth | Undeclared register, unlabelled fallback data, centroid pin |
| B17 | Preservation | Earned content and interactions still work | "Fixed" by deleting the product |
| B18 | Independence | Auditor ≠ builder, named | Self-review |

B15 is advisory (REVISE) until Ballot Q9 is ruled.

**Verdict block**
```text
Verdict: PASS / REVISE / BLOCK
Auditor (≠ builder, model family):
URL / PR:
Widths / languages checked:
Register + Design Read:
Fails (id → element → repair):
Scanner: axiom-audit clean / hits
Measured: chrome % of viewport · page height ÷ viewport · box-to-text area · H1 distance from top
Kept on purpose:
Unverified:
```
PASS = no B-fail, scanner clean or explained, independent auditor named. REVISE = fixable without product loss. BLOCK = first-screen void, self-review only, or a hallucinated pin on a live surface.

---

## 10. Refusal duty (say these without softening)

1. *"Boxes must fit content. This element expands without a task reason. Massacre the first expansion."*
2. *"Compact first. I will not ship a forever-scroll through empty space."*
3. *"Logos are never boxed."*
4. *"Nothing wins. Pick a focal point with a real type step."*
5. *"The payload must sit on the exit of the heavy visual. Reorder; do not rewrite first."*
6. *"Headline and copy stay on the same side of the dominant visual."*
7. *"Name radial, axial, column or modular, or stay orthogonal."*
8. *"That face is banned as an unexplained primary. Use the declared face or write the exception."*
9. *"No filler, no fake stats."*
10. *"Builder is not auditor. A different agent walks the gate."*
11. *"Map first: 60 % of the first screen; panels are thin instruments."*
12. *"No transition-all, hover-scale on cards, or idle pulse on static chrome."*
13. *"'More premium' is not a directive. Give me a number, a material or a named reference."*
14. *"No coordinates without an exact geocode of the named place. Null."*
15. *"Which register is this? I will not style before it is named."*
16. *"That fix deletes the product. Show me what is preserved."*
17. *"A void without a job is a hallucination. Name the job or remove the void."*

---

## 11. Changing this file

Agents propose and vote in [CANON-BALLOT.md](CANON-BALLOT.md). The owner rules. Only then is this file edited, append-only: add a dated line to the changelog, never rewrite a ruling.

| Date | Version | Change |
|---|---|---|
| 2026-11-09 | v1.0 draft | Canon composed from `ULTIMATE-DESIGN-SYSTEM-CANON.md` + `MSH.md` + `AGENTS.md` §3 + `CLAUDE.md` §11–§14, §16 + `design.md` registers. Adopted: Fill or Breathe, Fulcrum, Harmonic armatures, Silhouette, template-swap test, 17 refusal lines. Dropped: Mermaid and LaTeX decoration (agents read plain text). Seven rulings marked ◐ pending owner. |
