# Palette

Follow `AGENTS.md` and `ANTI-SLOP.md`. One colour combination owns the viewport. Do not redesign the exhibition.

- Prose uses `--measure` (`65ch`). Padding uses `--pad` and scales with the line box. No fixed min-height on a text container.
- New Latin type is Jost. New Thai is Prompt, then Kanit, with `lang="th"`. Chinese is Noto Sans SC, with `lang="zh-Hans"`.
- Banned as a design face: Inter, Poppins, Montserrat, Roboto, Open Sans, Lato, DM Sans, Space Grotesk, Geist, Plus Jakarta Sans, Manrope, Nunito, and system-ui.
- One element must win. New type steps are `--type-body`, `--type-title`, and `--type-display`, at least 1.5 times apart. No equal cards and no ornaments added only to balance a page.
- Keep Archivo Narrow, IBM Plex Sans Thai, Noto Sans SC, JetBrains Mono, and the reading room's Arial on the existing screens.

`npm run check` runs `scripts/check-anti-slop.mjs`.
