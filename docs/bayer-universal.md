# Bayer's Universal (1925)

Herbert Bayer drew Universal, also called a proposal for a universal type, in 1925 while he was working at the Bauhaus. [Letterform Archive](https://letterformarchive.org/news/bauhaus-typefaces-part-two/) describes an original drawing from that year: pencil, ink, circles used as the basis of several letters, and a lowercase alphabet. The same archive notes that the design was not cast as a font. A later state appeared in *Offset*, no. 7 (1926). Bayer kept revising it. A maquette associated with the Museum of Modern Art's 1938 Bauhaus catalogue is captioned, in the Swann record of that sheet, "Universal type, characters at base show bold, medium and light weights, 1925. Improved 1928."

This section is a display trial for Palette. It does not change the colour field, the reading-room body, or the exhibition wordmark.

## Why it is lowercase

The 1925 proposal uses one set of letters, drawn as lowercase, instead of a separate capital alphabet. Letterform Archive states that Bayer sought to reduce the alphabet to lowercase letters and to forms that could be drawn with ruler and compass. That is a proposal about the Latin alphabet. It is not an instruction for Thai or Chinese, which do not have Latin capitals.

Bayer-Type, issued by Berthold in 1933, is a different face and did include capitals. It is not the alphabet this trial refers to.

## The licence situation

These are not open webfonts we can ship:

- P22 Bauhaus Bayer Universal, from P22 Type Foundry, is a paid revival.
- Architype Bayer, from The Foundry, designed by Freda Sack and David Quay, is a paid revival.
- `universa` on CTAN, by Christian Holm, is a GPL METAFONT source, not a webfont licence we are using.

Palette does not add those files, and it does not add an unofficial "free Bayer" download.

## Why Jost is the stand-in

[Jost](https://github.com/indestructible-type/Jost) is drawn and maintained by Owen Earl of indestructible type*. The repository ships it under the SIL Open Font License, version 1.1. Copyright 2020 The Jost Project Authors. The author's own description calls it an original face inspired by 1920s German sans-serifs, not a precise copy of one historical alphabet. An earlier name, Renner*, was changed because of a name conflict. Jost is therefore a geometric sans from that broad idea. It is not Bayer's compass construction, and it is not a revival of Universal.

Palette self-hosts a Latin subset of Jost Medium (weight 500) as `fonts/jost/jost-latin.woff2`, with `fonts/jost/OFL.txt` beside it. The face is loaded with `font-display: swap`. The token `interface.font.geometric` is Jost, Archivo Narrow, Arial, sans-serif. Use it for display and wordmarks. Do not set body text in it.

The class `lowercase-display` applies that stack and lowercase. It is the nod to Bayer's single alphabet. It is not used on body text, on Thai, or on Chinese. If it is ever placed on those scripts, the stylesheet puts the house face back and turns the lowercase transform off.

Thai stays IBM Plex Sans Thai, a non-looped face, with `lang="th"`. Chinese stays Noto Sans SC, Simplified, with `lang="zh-Hans"`.

Anuphan, by Mint Tantisuwanna at Cadson Demak, was checked before any trial. The source repository is [cadsondemak/Anuphan](https://github.com/cadsondemak/Anuphan). `OFL.txt` there is the SIL Open Font License 1.1, copyright 2019 The Anuphan Project Authors. The project describes Anuphan as a loopless Thai drawn to accompany IBM Plex Latin, and it says the Thai drawings are not a modification of IBM Plex Sans Thai. The specimen shows one trial line in a subset of Anuphan Medium. That line does not replace the house Thai face.

The specimen is `specimen.html`. English, Thai and Chinese share a line box. Sizes are adjusted so the letter bodies look close. Equal CSS pixels are not treated as equal size.

## Receipt

```text
Reader / act / medium:
  A person comparing a Latin display trial with Thai and Chinese on a screen.
Real content and scripts:
  "Palette", "Read the interval", "อ่านระยะห่างระหว่างสี", "阅读色彩之间的间距".
House contract and permitted changes:
  Body stays Arial on this page. Exhibition and reading-room faces stay as they are.
  New use is display and wordmarks only.
Body / display / data / script roles:
  Body: Arial. Display: Jost Medium, lowercase for Latin only.
  Thai: IBM Plex Sans Thai. Chinese: Noto Sans SC.
  Trial, not a role change: Anuphan Medium.
Families, actual cuts, licence and fallback:
  Jost Medium 500, SIL OFL, subset woff2, fallback Archivo Narrow, Arial, sans-serif.
  Anuphan Medium 500, SIL OFL, Thai subset, fallback IBM Plex Sans Thai.
Alternative rejected / observed reason:
  P22 Bayer Universal, Architype Bayer, and CTAN universa. They are not open webfonts we can ship.
  Jost rejected as a body face: it is a display stand-in, not a reading face for this room.
Size + leading + measure + tracking, by role:
  Latin display 64px, 96px line box (wordmark 96px from 760px up, four baselines).
  Chinese display 3.5rem in the same 96px line box, tuned after looking.
  Body 1.25rem, line box 2rem. No extra tracking on the lowercase display.
Proof: phone / enlarged text / blocked fonts / actual palette:
  Phone and desktop screenshots of specimen.html. Plate 190 inks.
  Blocked Jost falls back to Archivo Narrow, then Arial. The lowercase class remains.
Missing glyphs, clipping, hierarchy or emphasis failures:
  Recorded with the screenshots. Jost subset is Latin, not Thai or Chinese.
Scoped exception requested or approved:
  lowercase-display is Latin display only.
Human task test and fluent-language review: performed / pending:
  Mechanical checks run in tests/layout.test.mjs. A person has not done the task test.
  A fluent reader has not signed the Thai or Chinese.
```
