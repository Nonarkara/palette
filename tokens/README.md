# Design tokens

`tokens/palette.tokens.json` is the Wada catalogue in the design-token JSON that Penpot's Tokens panel imports. Tokens Studio for Figma reads the same file.

`npm run build` writes the file from `data/colors.json`, the first `:root` in `styles.css`, the `:root` in `reading.css`, and the typefaces those stylesheets already load. `npm run check` fails when the file is missing or stale.

The file has 159 colours and 348 combinations. Hex values are the credited digital conversion from `data/colors.json`. Printed ink remains its own object.

## Sets

`catalogue` holds one colour token per named colour. A plate set does not copy the hex. It points at the catalogue token, for example `{colour.yellow-orange}`.

`plate/001` through `plate/348` are one set per combination. The roles are `dominant`, `counter`, `support`, and `signal`, in the same order as the exhibition. The shares are the exhibition proportions from `app.js`. Those roles and shares are Dr Non's layout, not a prescription from Wada.

`interface` is the first `:root` in `styles.css`: the rail, the type sizes, the focus colour, and the instrument colours. Where a custom property uses a catalogue hex, the token is an alias. `reading` is the reading room's `:root` in `reading.css`. Yellow Orange and Dark Tyrian Blue on that page are the Plate 002 conversions.

Both sets also carry the anti-slop defaults from [`ANTI-SLOP.md`](../ANTI-SLOP.md): `--measure` at `65ch`, `--pad` as a fraction of the line box, a type scale whose steps are at least 1.5 times apart, and the geometric stacks. `font.geometric` starts with Jost. `font.thaiGeometric` starts with Prompt, then Kanit. Chinese stays Noto Sans SC. The exhibition faces stay on `font.display`, `font.thai`, `font.hans`, and `font.data`. Banned design faces — Inter, Poppins, Montserrat, Roboto, Open Sans, Lato, DM Sans, Space Grotesk, Geist, Plus Jakarta Sans, Manrope, Nunito, and system-ui — are not in those stacks.

## Import into Penpot

Penpot documents this file under Design Tokens, in [Importing and Exporting Tokens](https://help.penpot.app/user-guide/design-systems/design-tokens/). A single JSON file is imported from the Tokens tab: **Tools**, then **Import**. The first-level keys are the set names because `$metadata.tokenSetOrder` lists them. [Laura Kalbag's guide](https://penpot.app/blog/a-practical-guide-to-the-design-tokens-json-format/) (14 April 2026) shows the same shape: `$value`, `$type`, and `$description` on every token, with `$themes` and `$metadata` beside the sets.

Import replaces the tokens already in that Penpot file.

1. Open a Penpot file and the Tokens tab.
2. At the bottom, choose Tools, then Import.
3. Choose `tokens/palette.tokens.json`.
4. Check `catalogue`, `interface`, `reading`, and `plate/001` through `plate/348`.
5. The active theme is `Plate/001`. Switch the Plate theme to another number to open that combination. Each Plate theme enables `catalogue`, `interface`, `reading`, and one plate. Penpot keeps one theme in a group active.

A colour `$value` in this file is a hex string, as in Penpot's import example. Penpot applies that string. The later DTCG colour object (`colorSpace` and `components`) is not what this file uses. Penpot issue [9305](https://github.com/penpot/penpot/issues/9305) records that the tokens feature does not apply that object.

## Import into Tokens Studio

Tokens Studio for Figma reads this same multi-set file. In the plugin, use Import and choose `tokens/palette.tokens.json`. Top-level keys become sets. `$themes` becomes the theme list. `$metadata.tokenSetOrder` is the set order.

Enable `catalogue` with one `plate/NNN` set. Leave the other plate sets off. Tokens that share a name resolve from the later active set, so two active plates would leave only the later plate's roles.

## Credit

Penpot is [github.com/penpot/penpot](https://github.com/penpot/penpot). The develop branch README states the Mozilla Public License 2.0 and `Copyright (c) KALEIDOS SUBSIDIARY SL`. The repository `LICENSE` is MPL 2.0 and includes Exhibit B, Incompatible With Secondary Licenses. Checked 12 October 2026 against `develop`.

This repository does not vendor Penpot source. The token file is Palette's data in the JSON shape Penpot's tokens panel imports. No endorsement is implied.

The colour data remains the upstream MIT set named in `THIRD_PARTY_NOTICES.md`. Palette's MIT licence covers this export script and this note. It does not relicense the colour data, and the MPL does not cover this repository.
