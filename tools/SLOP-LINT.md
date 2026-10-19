# tools/slop-lint.mjs: usage

This scores any URL against the rules in [ANTI-SLOP.md](../ANTI-SLOP.md), using Playwright at 1440×900 and 390×844.

```bash
npm i -D playwright pngjs && npx playwright install chromium   # once (or set CHROME=/path/to/chrome)
node tools/slop-lint.mjs https://example.org                   # one line per URL: verdict, points, rules hit
node tools/slop-lint.mjs https://a.example https://b.example --json --shots=shots
```

Add `--strict` to exit with code 1 on a SLOP verdict or a ship-basics FAIL, so it can gate a deploy script. `--no-basics` runs only the slop score.

Slop verdicts:
- **≥6 points = SLOP**: fix before shipping.
- **3–5 = REVIEW**: a person checks each rule that was hit.
- **<3 = OK.**

Treat it as a screen, not a judge. In the Oct 2026 study it had precision 0.95 and recall 0.91 at the REVIEW line, and those numbers are in-sample. It sent 2 of 5 professional map apps to REVIEW. Pages behind a login, a bot check, or text drawn in canvas are not measured.

## Ship basics

`tools/basics-lint.mjs` runs in the same pass and prints `basics=PASS|WARN|FAIL`, with one line per hit. It never changes the slop score. The checks and budgets are listed in [ANTI-SLOP.md](../ANTI-SLOP.md#ship-basics-the-things-we-keep-forgetting).

- FAIL: contrast, tap targets under 44 px on the phone, `img` with no `alt`, unnamed buttons or links, unlabelled fields, invisible keyboard focus, no `<html lang>`, no viewport meta, LCP over 4 s on both loads, layout shift over 0.25.
- warn: one slow load, layout shift over 0.1, heavy or oversized images, blocked zoom, no hover change, no home link at the top, no EN/TH/ZH switch.

Limits: contrast is skipped for text over images, gradients, outlined text and positioned overlays (counted as `contrastUnknown`). Map internals are skipped. LCP and CLS are measured in a lab on one load each, and CLS is the sum of all shifts, so it reads high. Focus is checked on the first 15 Tab stops and hover on the first 8 visible links and buttons; a full-screen overlay stops the hover check. Tests: `tests/basics.test.mjs` in palette and `scripts/test-basics-lint.mjs` in dr-non-vibecoding-skills, run with `node --test`. The browser cases skip when Chromium isn't installed.
