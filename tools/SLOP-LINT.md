# tools/slop-lint.mjs: usage

This scores any URL against the rules in [ANTI-SLOP.md](../ANTI-SLOP.md), using Playwright at 1440×900 and 390×844.

```bash
npm i -D playwright pngjs && npx playwright install chromium   # once (or set CHROME=/path/to/chrome)
node tools/slop-lint.mjs https://example.org                   # one line per URL: verdict, points, rules hit
node tools/slop-lint.mjs https://a.example https://b.example --json --shots=shots
```

Verdicts:
- **≥6 points = SLOP**: fix before shipping.
- **3–5 = REVIEW**: a person checks each rule that was hit.
- **<3 = OK.**

Treat it as a screen, not a judge. In the Oct 2026 study it had precision 0.95 and recall 0.91 at the REVIEW line, and those numbers are in-sample. It sent 2 of 5 professional map apps to REVIEW. Pages behind a login, a bot check, or text drawn in canvas are not measured.
