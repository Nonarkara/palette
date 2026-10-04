# AI design slop — what colour got wrong in 44 flood apps

> Filed 4 Oct 2026 from a study of 44 citizen-built, mostly AI-assisted flood apps and from FloodDash's own corrections. Complements the anti-slop checklist in [`PALETTE-FIELD-GUIDE.md`](../PALETTE-FIELD-GUIDE.md). The same guide lives in `dr-non-vibecoding-skills`, MoMA Rules, Axiom Design Core and Rams × NYCTA Design Core.

**The colour finding (pattern D1).** The slop was not ugly colour; it was colour without a job. One neon accent (chroma 201 of 255) carried brand, links, focus, chips, markers and bands at once; danger red decorated headings. When everything shouts, a warning stops standing out.

**A worked repair from this exhibition's data.** FloodDash took one combination — **plate #139: Deep Indigo #051230 · Salvia Blue #97ACC8 · Neutral Gray #B6BFC1** — for everything that is *not* a warning, laid out by this exhibition's own method (one dominant field, compressed support), with Calamine Blue #78CDD0 as the single action colour (chroma 88). The choice rule was functional: all three are cool, so none can be read as a warning hue. Measured, not eyeballed: Deep Indigo panels *raised* every severity colour's contrast (normal-band green 4.46 → 4.61 : 1, across the 4.5 floor) and quiet text rose from 5.2 to 8.0 : 1. Warning colours were deliberately left outside the palette — a recoloured warning is a lie. Plate numbers and hex values are the credited digital conversion, not measurements of printed ink.

---


*From FloodDash's study of citizen-built, mostly AI-assisted flood tools (Thailand, 27 Sep – 3 Oct 2026) and from FloodDash's own corrections — FloodDash is AI-built too. Apps are described by type and place only.*

## Definition

AI design slop is output that **looks finished and authoritative but is not grounded**: not in data (a green "safe" banner drawn when the feed returned nothing), not in the reader's task (a national average shown to someone asking about their street), not in the design's own rules (danger red used as a decorative rule). It is not ugliness: most slop here was clean, dark and confident. It is the toolchain's default — an empty array renders as zero, a fallback renders as live — and cheap to fix once named. Each pattern below carries a test a machine or reviewer can run.

---

## A. Truth and data

### A1. No data shown as "safe"
- **Looks like:** A failed feed shows "0 sensors, no water detected", a green "area is safe" banner, or an empty layer that does not say it is empty.
- **Seen:** Critical in 2 of 30 audited apps: a Bangkok road-sensor panel reading a 40-hour-old feed, and a forecast map whose data flag defaulted to the "safe" branch. At least 7 of 30 had an explicit guard. FloodDash shipped it too, including a false all-clear outlook during a quota incident.
- **Danger:** "No data" reads as "no flood", and people act on it.
- **Test:** Render each status component empty, null, upstream-5xx and stale. Fail if a safe token appears (lowest-severity colour, "safe", "clear", a bare 0) without a distinct no-data state.
- **Fix:** Three states — no data, old data, measured low — each naming its reason.

### A2. Fallback data shown as live
- **Looks like:** When the API fails, a days-old snapshot or a browser-rebuilt forecast appears, styled as live.
- **Seen:** 2 of 30 audited apps (a canal map's 4½-day-old fallback; a provincial map's silent client-side rebuild). In FloodDash, a credential-less agent script wrote a made-up polygon labelled "Sentinel-1 SAR · confidence high" into the deploy folder (caught before deploy). One audited app badged every sample record.
- **Danger:** A false picture of the present, with nothing on screen to show its age.
- **Test:** Grep deploy-bound code for `mock|sample|synthetic|fallback`; `git status --short public/` before deploy; a credential-less script must exit non-zero.
- **Fix:** On failure write nothing; label fallback "last known · N h old"; mark dry-run output synthetic.

### A3. Live-looking but not live
- **Looks like:** "Realtime", "LIVE", "updated just now" — driven by the browser clock or the response time, not the observation time.
- **Seen:** About 7 of 30 audited apps used live wording that measurement contradicted (a camera wall 85% stills; "every 2 minutes" over 70-hour-old sensors). In 4 of 30 the shown time was the browser or response clock. FloodDash showed "LIVE" over a failed camera player.
- **Danger:** A false "now" at the moment someone decides whether to move.
- **Test:** Lint displayed timestamps sourced from `new Date()` or headers; freeze fixtures six hours old and assert no "live/now" text renders.
- **Fix:** Observation time plus age ("14:02 · 6 h ago"); fade by age.

### A4. Credited sources that deliver nothing
- **Looks like:** Source lists and blurbs promising disabled layers; a green health check with zero rows.
- **Seen:** About 7 of 30 audited apps credited or advertised something undelivered (~25 citations over 4 working feeds; a credited feed with a null fetch time in every payload; 46 dams advertised, 35 with data). In 4 of 30 a "success" status covered an empty pipe. FloodDash's own metadata claimed radar, push alerts and a highways feed it never used.
- **Danger:** Readers trust the whole list.
- **Test:** CI maps every credit in UI and meta/OG text to a fetcher with `rows_kept > 0` inside its window. Accept a new source only on a query returning a row, never a service description.
- **Fix:** Publish `rows_kept` per source, including 0.

### A5. Unsourced thresholds turned into advice
- **Looks like:** 15/30/45 cm bands decide "cars cannot pass"; copy says *passable*, *safe*, *clear*.
- **Seen:** 2 of 44 cards flagged; in one, a centimetre flips "struggle" to "cannot pass". FloodDash deleted its own "avoid water deeper than 30 cm", later printed "passable — be cautious" for a 3 cm reading 6 km away, and had a legend saying pickups pass at 20–40 cm, unsourced. Four builders used states ("cannot pass / flooded / caution") instead.
- **Danger:** An unsourced number becomes permission to drive in.
- **Test:** Fail the build when an advice threshold lacks a `source`; block-list *passable/safe/clear/ผ่านได้/ปลอดภัย* unless a sourced rule emits them; no street verdict from a reading >1 km away.
- **Fix:** "No deep water where measured — check your street first."

### A6. Countdowns that outlive their window
- **Looks like:** "May overtop in ~6 h (around 19:40)" still showing at 21:35.
- **Seen:** FloodDash's place card and Alerts tab (QA finding). 2 of 30 audited apps: a hand-edited alert still red two days later; a frozen snapshot still saying "still flooded".
- **Danger:** A passed window reads as an all-clear.
- **Test:** Messages carry `issued_at`/`valid_until`; render at `valid_until + 1 min` and assert the "window passed" label; lint stored relative-time strings.
- **Fix:** "The warned window has passed — this is not an all-clear."

### A7. Numbers without units, nulls printed as numbers
- **Looks like:** Red "161%" badges that are reservoir storage, "(null%)", a fabricated 0.0 mm hour, "0 people" for unpublished capacity.
- **Seen:** 3 cards cited for unclear units (storage %, km² inundated read as depth, reports vs places). In one audited app a percent field could not be derived for any station, and 25 of 73 over-bank flags contradicted its own bank field. FloodDash had `Number(null) === 0` latent in three functions.
- **Danger:** A unitless number is read as whatever the reader fears.
- **Test:** Lint `Number(x)`, `?? 0`, `|| 0` on upstream values; render nulls and fail on "null/NaN/undefined" or a bare 0; figure components require `unit`.
- **Fix:** Carry absence to the screen; unit and meaning on the number's line.

## B. Reader and task

### B1. Dashboard before the answer
- **Looks like:** Report buttons, logins, KPI tiles or a national average first; verdict and call buttons three screens down.
- **Seen:** 19 of 44 cards solicit contributions; the owner's critique, made into a six-test rubric, is that most "ask too much". Of 7 rubric-scored apps, 2 were ready on arrival. FloodDash had hotlines three screens down on a phone and led with a national average while 75 of 79 sampled comments asked about their own place.
- **Danger:** Stressed, one-handed readers leave first.
- **Test:** Zero-tap screenshot at 375×812 must show place, one-sentence verdict, one action and a call button; input requests follow the answer in DOM order.
- **Fix:** Answer, action, call; evidence behind a disclosure; operators get their own mode.

### B2. A measurement where a consequence was asked for
- **Looks like:** Level above sea level, WQI, millimetres in 48 h — for someone asking "should I fetch the children?"
- **Seen:** 1 of 41 systems answered the 0–12 h "leave now?" question. FloodDash's 48 h clock was silent on an 86%-chance afternoon because it keyed on 20 mm. Few builders turned depth into bodily consequence (ankle, knee, stalled motorbike).
- **Danger:** The reader does hydrology under stress.
- **Test:** Every headline figure carries a consequence sentence or a "this is not…" line; every term (msl, WQI, %) has an inline gloss.
- **Fix:** Consequence first, measurement one tap away.

### B3. Every line written twice
- **Looks like:** Thai and English stacked everywhere, repeated labels, English mode still showing Thai.
- **Seen:** FloodDash's own (corpus not counted): four home blocks in both languages at once, a provenance strip stuck in Thai, ten bilingual tabs filling 58% of a phone at large text, analysis present in one language only.
- **Danger:** Halved reading speed; a language gap means two audiences read different claims.
- **Test:** Per mode, count other-script codepoints outside a whitelist; key-parity test; flag identical adjacent strings.
- **Fix:** One language per mode, plus a deliberate whitelist.

### B4. Wrong place, wrong scope
- **Looks like:** Another city's advice on this city's card; a same-named district in the wrong province.
- **Seen:** FloodDash showed Bangkok's downstream guidance on Hat Yai for 20 s+, opened the wrong Bang Khen from search, and phrased a distant gauge as local. About 3 of 30 audited apps: national totals on a provincial app, pins geocoded from names with no stored coordinates, a nearest station across a levee.
- **Danger:** Correct data for the wrong place is wrong advice.
- **Test:** Each block carries the place id it was computed for, late responses are dropped; off-scope figures print scope and distance; search rows show province; machine-placed pins flagged approximate.
- **Fix:** "~16 km away (not here)"; "straight-line, not a route".

## C. Layout and interaction

*The corpus study did not audit layout; this evidence is FloodDash's own.*

### C1. Layout that only works at the builder's viewport
- **Looks like:** Tabs off-screen without a cue, a pane sized against another component's header, one button on top of another, sideways-scrolling code inside a vertical pane.
- **Seen:** 7 of 11 About tabs off-screen at every width; the last 63 px of a paper unreachable on a phone; "change place" over "share", so share changed the place; a timeline over the map attribution.
- **Danger:** Controls you cannot find do not exist; overlaps trigger the wrong action.
- **Test:** Playwright at 320–1920 px, both languages, 24 px root font: `scrollWidth ≤ innerWidth`; controls in viewport or in a cued scroller; no intersecting interactive boxes; `elementFromPoint` at each control's centre returns it; tags balance. Skip ancestor-clipped elements.
- **Fix:** Wrap, don't overflow; size panes from their own parent.

### C2. Targets too small, or icon-only
- **Looks like:** 11 px labels in 24 px tabs, diagram text at 3–4 px on phones, a 🔗 mistaken for "change place", a ✓ on a non-verdict, chips rendering blank.
- **Seen:** All FloodDash, fixed 4.120–4.145.
- **Danger:** Wrong taps by wet hands.
- **Test:** Interactive elements ≥44×44 CSS px (or the repo floor; FloodDash's is 40); rendered text ≥11 px after SVG scaling; primary buttons carry words; lookups throw on unknown keys.
- **Fix:** Full-width labelled primary buttons; ticks only on verdicts.

## D. Colour and identity

### D1. Colours without a defined job
- **Looks like:** One neon accent doing brand, links, focus, chips, markers and bands; danger red as decoration.
- **Seen:** FloodDash's `#29E0F2` (chroma 201/255) did six jobs; replaced by Wada's Calamine Blue (chroma 88). 3 px danger-red rules ran across About and Library headings, and the active tab used danger red. The wave-1 notes list a default dark theme ("hides polish gaps") as standard. Gradients and glow were not recorded as findings.
- **Danger:** When everything shouts, warnings stop standing out; decorative red teaches readers to ignore red.
- **Test:** Freeze severity tokens; accent ≥30° in hue from every severity and lower in chroma; any colour literal outside tokens fails (closed palette); severity tokens only in hazard components; measured severity contrast ≥4.5:1 on every surface.
- **Fix:** One job per colour; warning colours stay outside the decorative palette.

### D2. The template app
- **Looks like:** Map, attribution panel, KPI tiles, report button, dark theme; React + Vite + Leaflet + Tailwind on a free subdomain in 24–72 h.
- **Seen:** 41 independent builders built structurally one app: map 100%, attribution 83%, aggregation 68%, reports 44%, routing 17%, 0–12 h nowcast 2%. 38% sat on platform subdomains, 2 of 41 published a repository, two were already dead when checked. FloodDash copied the KPI bar.
- **Danger:** Indistinguishable apps, irreconcilable numbers, and the unasked questions (when, here, what next) stay unanswered.
- **Test:** Write the first screen's question and diff it against existing tools; logo-off review; measure cold start on the hosting tier.
- **Fix:** Build the missing question; pool hosting and data.

## E. Build and process

### E1. The agent's report doesn't match the diff
- **Looks like:** "Configured", "verified", "shipped" — against an untouched file.
- **Seen:** In FloodDash, an agent reported configuring a module it never touched, and reading a table that does not exist. An agent-written commit published an unverified claim about another system on the public page; no session log supported it, and it was withdrawn. "Shipped" claims for 4 cards lacked code; hand-typed counts drifted. In the corpus, 4 of 30 audited apps had headline counts their own API contradicted (1,242 vs 2,355 cameras).
- **Danger:** Confident prose published as fact, in someone's name.
- **Test:** Each claim cites file:line or command output and is re-run by a reviewer; fail on literal numerals beside count words in copy; corrections append, never overwrite.
- **Fix:** Verify against the diff, not the summary.

### E2. Security by obscurity, and publishing the exploit
- **Looks like:** Data masked in one view but served by another; browser-only checks; client-reachable admin keys. Mirror failure: publishing the method.
- **Seen:** 92 findings across 30 audited apps, 8 critical in 6 apps; 15 findings in 9 apps withheld until fixed, several involving rescue requests. FloodDash's research tab had published paths, parameters, table names and a delete route for 16 findings across 11 apps before developers were told; now withheld, with a policy test.
- **Danger:** People awaiting rescue are in the exposed table.
- **Test:** CI hits every personal-data route unauthenticated and expects 401; grep the bundle for keys and admin paths; server-side rate limits; lint published findings for paths, parameters and schema names while unfixed.
- **Fix:** Server-side checks; publish severity and harm, withhold method until fixed; audits of others' systems are GET-only.

### E3. Tests that check the string, not the claim
- **Looks like:** Tests assert code exists, not that it runs; lookups miss a key and render blank; guards removable with the suite still green.
- **Seen:** All FloodDash: a dossier crash shipped because its guard only matched source text, and one throwing block blanked all 14; an honesty badge rendered empty for a missing "mixed" key; removing a guard left the suite green; the deploy guard ran after upload. One corpus builder ran 162 mock chat questions before launch.
- **Danger:** Green builds certify the failure.
- **Test:** Mutation-verify every guard (revert the fix, watch it fail); execute components in a headless browser; lookup tables exhaustive over their enum; per-block error boundaries.
- **Fix:** Test the claim the reader sees, rendered.

---

## Pre-ship checklist

1. Empty, null, 5xx or stale feeds render "no data", never the lowest severity. (A1)
2. No credential-less script writes to the deploy folder; `git status public/` is clean. (A2)
3. Every fallback shows "last known · age". (A2)
4. No displayed time comes from `new Date()` or a header; every clock time shows its age. (A3)
5. Every credited source has `rows_kept > 0` in window; meta/OG matches enabled layers. (A4)
6. Every advice threshold cites a source; no unsourced "passable/safe/clear". (A5)
7. Time-bounded messages expire into "window passed — not an all-clear". (A6)
8. No `?? 0`/`Number()` on upstream values; every figure has a unit; no "null/NaN" renders. (A7)
9. Zero taps at 375 px: place, verdict, one action, call button. (B1)
10. Every headline number has a consequence or "this is not…" line. (B2)
11. No stray other-language script per mode; key parity holds. (B3)
12. Every place-scoped figure matches the selected place id or prints scope and distance. (B4)
13. No horizontal scroll, no intersecting controls, `elementFromPoint` hits each control, 320–1920 px, large text. (C1)
14. Targets ≥44 px (or repo floor), text ≥11 px rendered, primary buttons have words, lookups throw. (C2)
15. Closed palette; accent ≥30° from and less chromatic than every severity; severity contrast ≥4.5:1. (D1)
16. You can name the question your first screen answers that existing tools do not. (D2)
17. Every report claim cites file:line or output; no hand-typed counts. (E1)
18. Personal-data routes return 401 unauthenticated; no keys in the bundle; findings carry no method. (E2)
19. Every guard mutation-verified; every component executed in a real browser. (E3)

## Method and limits

- **Corpus:** FloodDash's catalogue, 44 cards at 4 Oct 2026 (41 at the 2 Oct convergence paper), gathered in nine waves, 27 Sep – 3 Oct 2026; a convenience sample.
- **Not all citizen-built:** it includes one government service, one global tech-company model, one GIS-company map, one system described second-hand and never opened, and one known only from press. AI-assisted building is stated by the builder or a public post for roughly 10–14 of 44; elsewhere "vibe-coded" is the owner's framing, not a verified fact.
- **What "studied" meant:** 44 cards record function, data and honesty about limits (22 high, 14 medium, 2 mixed, 6 unrated, none low); 30 apps had an architecture and vulnerability audit (26 code + endpoints, 2 code only, 1 API metadata, 1 rendered page); 7 were scored on the six-test rubric. Each audit is a read-only snapshot on a stated date.
- **Counts:** from FloodDash's own fields and findings, one reader, one pass. Assigning findings to patterns is this guide's classification ("about" marks those). Builders' self-reports, press figures and usage numbers were not independently verified.
- **Layout and colour** evidence is mostly FloodDash's own, since the corpus study did not audit either.
- **FloodDash is not exempt:** it is AI-built, and its slop is evidence on the same terms.
