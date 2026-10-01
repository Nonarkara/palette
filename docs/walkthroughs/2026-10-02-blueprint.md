# Palette — walkthrough blueprint

## Scope

- Build: local `0.1.0` candidate, 2026-10-02.
- Browser: clean public state at 375, 768, and 1280 CSS pixels; console captured.
- Journeys: find a quiet relationship, return to a numbered plate and use a
  keyboard study tool, then probe invalid links and hostile search text.
- Boundary: these are structured cognitive walkthroughs, not a real-human Mama
  test. No claim is made that an older first-time visitor has passed the gate.
  Network throttling was not available in the test browser.

## Findings by persona

### Persona 1 — first-time visitor

Goal: understand the room and find a quiet relationship on a phone.

- The purpose is visible through the full colour relationship, plate number,
  names, reading, and `PALETTE` identity.
- Search opens from the `⌕` instrument and returns 48 matching relationships;
  choosing one closes the sheet and changes the plate and URL.
- **Unverified failure point — Q2/Q3, severity 1, effort S:** a real visitor may
  not recognize every symbol without opening it. The symbols are an intentional
  exhibition constraint; the smallest future fix is a first-visit legend that
  does not compete with the plate.
- Verdict: analytical path completed; human recognition remains unverified.

### Persona 2 — returning visitor

Goal: reopen plate 087, inspect value structure, then advance without reaching
for the instrument rail.

- The hash link restores the numbered plate.
- Grayscale changes `aria-pressed` to `true` and preserves the plate.
- Right Arrow advances from plate 087 to 088 and updates the hash.
- Verdict: completed. No confirmed failure point.

### Persona 3 — extreme visitor

Goal: break routing and search without executing supplied text.

- Searching for `<script>` returns zero results; the value is treated as text.
- An invalid `#plate-999` initially left plate 088 visible while the URL claimed
  999. This was a real Q4 failure, severity 2, effort S.
- The route now normalizes to `#plate-001` on a fresh invalid link or restores
  the current valid plate after an invalid hash change. A live announcement
  explains the recovery.
- The console remained free of warnings and errors.
- Verdict: completed after the routing correction.

## Patterns across personas

- Plate number, visible state, and URL must always agree.
- Symbols preserve the room's quietness, but first-time recognition is the main
  question for the eventual real-human test.
- Local deterministic search gives immediate feedback and safely treats input
  as text.
- Responsive geometry survives the tested widths without horizontal overflow
  or touch targets smaller than 44 by 44 pixels.
