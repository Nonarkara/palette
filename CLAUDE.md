# Palette — Claude

Follow `AGENTS.md` and `ANTI-SLOP.md`. The colour field stays the product. Do not redesign the exhibition to apply the defaults below.

- Prose measure is `--measure` (`65ch`). Padding is `--pad`, a fraction of the line box. No fixed min-height on a text container.
- New Latin type is Jost (`--font-geometric`). New Thai is Prompt, then Kanit (`--font-thai-geometric`, `lang="th"`). Chinese is Noto Sans SC (`--font-hans`, `lang="zh-Hans"`).
- Banned as a design face: Inter, Poppins, Montserrat, Roboto, Open Sans, Lato, DM Sans, Space Grotesk, Geist, Plus Jakarta Sans, Manrope, Nunito, and system-ui.
- One thing on the page must win. New type steps are `--type-body`, `--type-title`, `--type-display`, at least 1.5 times apart. No equal cards, no ornaments added to fill space.
- The exhibition keeps Archivo Narrow, IBM Plex Sans Thai, Noto Sans SC, JetBrains Mono, and the reading room's Arial.

`npm run check` runs `scripts/check-anti-slop.mjs`.
