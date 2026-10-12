# Source and proof ledger

Read 2026-10-12. The snapshot comes from `scripts/snapshot-references.mjs` and is written to `mcp/data/references.json`.

| Archive | What it is | How it was read | Stored | Not taken, and why |
|---|---|---|---|---|
| [CARI](https://cari.institute/aesthetics) | 90 named, dated consumer aesthetics, 1950s to now | Public JSON `/api/aesthetics?page=0..4`. Robots allows all | Name, period, decade, link | Images and descriptions. Terms: "research and reference … not a source of free assets" |
| [Design Reviewed](https://designreviewed.com/) | 11,000+ graphic-design artefacts, 1850s–2020s | WP taxonomy JSON (movement, decade, country, format, designer), 2s between calls | Name, count, link | The artefacts endpoint returned a Cloudflare block, which was not bypassed. Images are rights-reserved and reproduced by request |
| [Gurafiku](https://www.tumblr.com/gurafiku) | Ryan Hageman's survey of Japanese graphic design | Public RSS (only 20 posts, 2018–19) | Caption, designer, year, bilingual tags, link | The blog HTML sits behind a challenge. Works are the designers' copyright |
| [Artvee](https://artvee.com/) | Public-domain paintings, posters, illustration | Not fetched. robots.txt disallows Anthropic, Claude and other AI crawlers | 29 hand-written collection and movement links | Everything else. Check public-domain status per image |
| [eMuseum demo](https://demo.emuseum.com/collections) | Gallery Systems' collections-online product | Not fetched. Cloudflare challenge | 2 links, plus the documented API shape | Live records. Each institution sets its own rights |

## Example artefacts

- Forum, Vol 20, No. 02 (1967), Kees Nieuwenhuijzen, Netherlands. Design Reviewed.
- Die Reklame, Leipzig Advertising Fair issue (1925), Lucian Bernhard & Fritz Rosen. Design Reviewed.
- Peace: Love, Peace, and Happiness (1986), Shin Matsunaga. Gurafiku.
- Kobo Abe: Starving Unions (2009), Yu Miyazaki. Gurafiku.
- Absinthe Mugnier (1898), Lucien Lefèvre. Artvee.
- Supergraphic Ultramodern (Late 1960s – Late 1970s). CARI.

## What is source and what is adaptation

- **Source:** names, dates, counts, captions and tags from each archive.
- **Adaptation:**
  - the 14 rules in `mcp/index.mjs`, inferred from metadata, page structure and design history
  - the house overrides
  - the Wada pairing

Visual claims about curated work are inferred. The images were not machine-read.

## Receipt

`tests/mcp.test.mjs` starts the server over stdio and checks the following for a 1960s calm poster brief:

- CARI and Design Reviewed entries match the era.
- Every Wada plate exists in `data/colors.json`.
- Artvee appears as links only.
