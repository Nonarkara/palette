English · [简体中文](EDITORIAL.zh-CN.md) · [ไทย](EDITORIAL.th.md)

# Editorial

Every edit should help a reader do something or understand the subject better. Preserve meaningful choices; question generic ones.

This is the editing method for Palette. It does not change the colour field. Exhibition sentences flagged below stay as they are until a later edit applies one sentence at a time.

The Chinese and Thai files carry the same method. A fluent reader has not signed them. If this text is set in the exhibition, Thai uses a non-looped face and `lang="th"`. Chinese stays Simplified and uses `lang="zh-Hans"`.

## Credit

The procedure below is Palette’s own writing. Two MIT sources were read on 12 October 2026 and adapted. Their text is not copied into this file.

- Peter Yang, [no-ai-slop](https://github.com/petergyang/no-ai-slop), commit [`000650b`](https://github.com/petergyang/no-ai-slop/commit/000650b156983f5159695b441477f4e63b25dc85), MIT. Copyright (c) 2026 Peter Yang. [LICENSE](https://github.com/petergyang/no-ai-slop/blob/000650b156983f5159695b441477f4e63b25dc85/LICENSE).
- Jakub Krehel, [make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better), commit [`35545ea`](https://github.com/jakubkrehel/make-interfaces-feel-better/commit/35545ea1512ad59fa463e6b1f95ca9c052981fe6), MIT. Copyright (c) 2026 Jakub Krehel. [LICENSE](https://github.com/jakubkrehel/make-interfaces-feel-better/blob/35545ea1512ad59fa463e6b1f95ca9c052981fe6/LICENSE).

From Yang: quote the sentence, say why it fails the reader, and propose the smallest change. Do not score the draft. From Krehel: check the small interactions a person actually hits, including the label, the icon’s alignment, focus, and the hit area. The same notice is in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md). Neither author is asked to endorse this exhibition.

## Refused

**Rounded corners and shadows.** Krehel’s skill treats concentric corner radius and layered shadows as polish. Palette forbids rounded corners, gradients, drop shadows, visible borders, custom cursors, and decorative texture. One combination owns the viewport. Grouping comes from position, scale, negative space, and solid fields. A radius or a shadow would compete with that field.

**Blanket word bans.** Yang’s skill bans a list of words outright, among them delve, leverage, tapestry, and realm. Palette does not keep that list. A word is a problem when the sentence could move to another product with no noun changed. The same word can stay inside a quotation, a historical sentence, or a project story. A ban list would eventually correct lines that were chosen, including Dr Non’s.

**AI-likeness percentage meters.** Yang’s detect mode already refuses to score a draft or to guess that a model wrote it. A percentage is that guess. Name the sentence. A reader can check a sentence. A reader cannot check a score.

**Deliberate mistakes, added so the writing seems human.** Yang keeps unevenness that is already in a writer’s voice. He does not ask for new errors, and Krehel’s skill does not either. Invented typos, broken grammar, and fake asides do not make a sentence truer. Here they can falsify a plate number, a colour name, or a credit. Leave the real voice in place.

## 1. Review before rewriting

Read the whole passage first.

For each weak sentence:

1. Quote it exactly, and name where it appears.
2. Say why a reader cannot act on it or learn the subject from it.
3. Propose the smallest edit. Change that sentence. Leave the paragraph.

Stop. Rewrite only after the list is accepted. A strong sentence stays, including one whose shape a detector would mark.

## 2. Preserve voice

Keep these when they are doing work:

- Historical text, with its dates, names, and sources.
- Quotations.
- Metaphors that belong to this project: “A colour is not a property. It is an event between surfaces.” Natural gastronomy. Classy and dangerous.
- Project stories, including the personal red and black study. That study is labelled outside the 348 combinations.

Question a sentence that could be pasted onto another product without changing a noun. Question a promise that names no object, no count, and no next action.

Do not smooth a sourced fact into a mood. Do not invent a Wada plate number, a colour name, a quotation, or a historical claim in order to sound specific.

## 3. Replace an empty promise with a specific

“Unlock a vibrant world of colour” tells the reader nothing they can do.

The same job, with the count from this repository: “Explore 348 colour combinations by Sanzo Wada.”

That count was checked against `data/colors.json` on 12 October 2026. The file holds 159 named colours. The `combinations` arrays contain the ids 1 through 348, each id once. 348 is that count. If the file changes, change the sentence. Do not estimate it, and do not take it from a blurb.

The RGB and hex values in that file are the credited digital conversion. They are not the exact printed colours.

## 4. Task-based navigation, the Mama Rule

Give the working exhibition to an older, nontechnical person on a first visit. Offer the goal. Do not coach, and do not point at the control.

The three goals for this room:

1. Find a combination.
2. Download a wallpaper.
3. Return, to the plate they just left or to another plate they can name.

The pass is all three, with no hints. Watch the first click, the hesitation, and the recovery from one ordinary mistake. One person is an early source of failures. One person is not a sample of everyone.

This test has not been run. The public edition stays `0.1.0` until it has. Writing this file does not count as the test.

## 5. Small-interaction checklist

Check these on a control before shipping it. The label, alignment, focus, and hit-area items are adapted from Krehel. The loading and repeated-click items come from the three tasks above. They are checks. They are not a new visual style.

- **Labels.** The visible word, or the accessible name when the control is only a mark, says what will happen. “Download PNG” is a label. A bare arrow needs an accessible name that says download. Decorative marks stay hidden from assistive technology.
- **Icon alignment.** If an icon sits beside a word and looks off-centre, nudge the icon. Do not cover the gap with a border, a radius, or a shadow.
- **Focus.** Keyboard focus lands on the control and is visible. Tab order follows the task. The focus mark stays inside the existing contract: a solid edge, or the inversion the instrument already uses. No glow, gradient, or drop shadow.
- **Loading.** The waiting line names what is loading. The failure line says what failed and what to do next. A spinner with no sentence is not a state.
- **Repeated clicks.** A second click does not start a second download, a second copy, or a second navigation while the first result is still outstanding. The control shows that the first action landed.

Every target stays at least 44 × 44 CSS pixels. Motion confirms a plate change and stops within 280 milliseconds. `prefers-reduced-motion` still cuts it.

## Exhibition copy, flagged and not rewritten

Read on 12 October 2026 from `index.html` and the visitor-facing lines in `app.js`. The sentences below are still on the site. The proposed edit is not applied.

| Where | Sentence | Why it fails the reader | Smallest edit |
|---|---|---|---|
| Search sheet, kicker | `348 HISTORIC RELATIONSHIPS · FREE TO EXPLORE` | “Free to explore” does not say free of charge, free of an account, or free to copy. “Explore” names no action. | `348 HISTORIC RELATIONSHIPS · NO ACCOUNT` |
| Search sheet, title | `Find your palette` | “Your” implies a personal palette. The room opens one of the 348 combinations. | `Find a combination` |
| Search sheet, lead | `We will find related colour schemes.` | The sentence promises a result. A query can return no match, and the search state already says so. “Colour schemes” is vaguer than combination. | `Matching combinations are listed below. A search can also return nothing.` |
| Plate, while the data loads | `Loading colour relationship` and `The field is preparing itself.` | A wait with no object. If the line remains, the reader does not know what is loading. The failure lines in `app.js` already say the data is unavailable and that the page must be served over HTTP. | `Loading the colour combination.` and `Still loading the colour data.` |
| JSON sheet, heading | `Take the plate with you.` | The heading names a feeling. The button already says `COPY JSON`, and the next sentence lists the file’s contents. | `Copy this plate as JSON.` |
| Wallpaper sheet, title | `Take the colours with you` | The task is a download. The heading under it already says Wallpaper. | `Download a wallpaper` |
| Wallpaper sheet, first sentence | `Download this plate as a full-resolution PNG.` | “Full-resolution” has no pixel size. The control under it lists 1440 × 3120, 2048 × 2732, and 3840 × 2160. | `Download this plate as a PNG at the size you choose.` |

Kept on purpose, and not proposed for replacement:

- `Start with a feeling. Or don’t.` The visitor may arrive with a mood or without one. The surprise control is on the same sheet.
- `A colour is not a property. It is an event between surfaces.`
- `Red has the appetite. Black has the nerve.` And `classy and dangerous.`
- The digest’s natural-appetite paragraph, in English, Thai, and Simplified Chinese.
- `He did not leave us a trend. He left a way of seeing relationships.` It is signed as interpretation. The dated chronology beside it keeps the sources.
- `NO IDEA — SURPRISE ME` and `COPY THIS FOR YOUR AGENT`.
- `Colour data is unavailable.` `Serve this repository over HTTP and try again.` `No match for “…”` and the copy-blocked lines. Those already tell the reader what happened and what to do.
