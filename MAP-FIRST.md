English · [简体中文](MAP-FIRST.zh-CN.md) · [ไทย](MAP-FIRST.th.md)

# Map-first dashboards

The map is the centre and the largest area. The bars are an instrument tray you glance at and leave.

This rule is for a screen whose job is a map. It does not change the colour field. One source-verified combination still owns that viewport, and that viewport still has no visible border.

The Chinese and Thai files carry the same rule. A fluent reader has not signed them. When this text is set on a page, Thai uses a non-looped face and `lang="th"`. Chinese stays Simplified and uses `lang="zh-Hans"`.

## The table

Treat the screen as a surgical table. The map is the work on the table: it occupies the centre, and it is the largest area. The top bar and the bottom navigation are the instrument tray. A person looks at the tray, uses one instrument, and looks back at the map.

The failure this rule answers is a thick top bar and a thick bottom bar, with chunky padded buttons, so the map shrinks to a small window. Alerts, gauges, and a second panel then stack in the remaining height and shrink the map again.

## Measures

These are maxima. The map receives every pixel the bars do not use.

| Token | Custom property | Limit |
| --- | --- | --- |
| Top bar, wide screen | `--map-bar-top-desktop` | 48px |
| Top bar, phone (`max-width: 760px`) | `--map-bar-top-mobile` | 44px |
| Bottom navigation | `--map-bar-bottom` | 56px |
| Button block padding | `--map-button-pad-block` | 0px |
| Button inline padding | `--map-button-pad-inline` | 8px |
| Button border | `--map-button-border` | 1px |
| Control target | `--map-target` | 44 × 44 CSS pixels |
| Map share, phone, two bars only | `--map-share-mobile` | 0.70 of the viewport height |
| Map share, floor | `--map-share-floor` | 0.65 of the viewport height |

The 1px border belongs to the map-bar button. Corners stay square. There is no gradient, shadow, or decorative texture. The border is included in the 44 × 44 target (`box-sizing: border-box`). The colour field does not take this border.

Every control is a native button or link, reachable from the keyboard, with a visible focus outline. On a phone the top bar is 44px, so the control fills that bar. It does not sit inside a taller padded row.

## Map share

On a phone, with only the top bar and the bottom navigation open, the map is at least 70% of the viewport height. One alert line may use the gap between that 70% and the floor. The floor is 65%. Anything that would push the map under 65% opens as a drawer over the map.

The two bars on a 667px-tall phone are 44px and 56px, which is 100px. The map keeps 567px, 85% of that viewport. A second tab row, a padded search row, and a gauge panel spend that share. The map should be larger than the minimum whenever the bars allow it. 65% and 70% are floors, not a target size to shrink toward.

On a wide screen the top bar is at most 48px. The map remains the largest area. Do not add a second band for tabs.

## Overlays

Search results, alerts, gauges, place details, and filters open as a drawer or a sheet on top of the map. The map stays mounted underneath. Closing the drawer returns the eye to the same map. A stacked panel under the header steals height the map needs, so that content goes in the drawer.

## Do and don't

The words in this example are the labels from a cramped public dashboard. The specimen shows the bars. It does not load that product's map tiles, and it does not repeat that product's data.

Worked pages: [map-first.html](map-first.html) is the do. [map-first.html#failure](map-first.html#failure) is the don't. Both use the same labels.

Don't. A top region in several rows: a title row, a search row, language chips, then tabs (Nation, Water, Mobility, Sea & Air). Each row has chunky padded buttons. Under that, an alert panel and a gauge panel stack as their own bands. The bottom navigation is taller than 56px, with padded buttons for Map, Brief, Place, Alerts, and Reach. The map is the small window left between those bands.

Do. One top bar, 48px on a wide screen and 44px on a phone. The name, the search, and the language buttons (EN, BM, 中文) sit in that one bar. Buttons have a 1px border, 0px of block padding, 8px of inline padding, and a 44 × 44 target. One bottom bar, 56px: Map, Brief, Place, Alerts, Reach. Alerts, gauges, and the section tabs open in a drawer over the map. The map fills the rest. On a phone that is at least 70% of the viewport while the drawer is closed, and it stays at least 65% if one alert line is open. The drawer does not push the map down.

## Tokens

`map-first.css` holds the custom properties and the classes `.map-dashboard`, `.map-bar-top`, `.map-bar-bottom`, `.map-button`, `.map-stage`, and `.map-drawer`. `npm run build` writes the properties into the `map` set of `tokens/palette.tokens.json`. Plate themes leave that set off. Enable `map` only when the file is a map dashboard. The colour field does not load `map-first.css`.
