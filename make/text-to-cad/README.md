# make · text-to-cad

`cad.sh` sends a written part to `cadgen` and keeps the STEP it writes,
plus an STL when the part will be printed. This directory is the wrapper.
The upstream tree stays in its own repository.

Upstream is [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad).
The licence is MIT. Copyright (c) 2026 Thompson Labs LLC. The text is the
`LICENSE` file in that repository, checked 12 Oct 2026.

## Where it runs

Run it on an M5 or a cloud machine, not the M3. The M3 is short of memory,
and the first run downloads a CAD runtime.

## Telemetry

Upstream sends usage counts and crash reports by default, under a random
install id. It does not send file names, paths, or prompts. Full account:
<https://www.texttocad.dev/privacy-policy>.

`DO_NOT_TRACK=1` and `CADGEN_TELEMETRY=0` turn that off for one process.
The build daemon, and a viewer started apart from that process, do not
inherit those variables. They follow the saved choice.

`cad.sh` keeps the saved choice off:

- It exports `DO_NOT_TRACK=1` and `CADGEN_TELEMETRY=0`.
- On first use it runs `uvx cadgen telemetry off` and records the time in
  `$XDG_STATE_HOME/palette-make/telemetry-off` (or
  `~/.local/state/palette-make/telemetry-off` when `XDG_STATE_HOME` is unset).
- It refuses `telemetry on`. That subcommand would save telemetry on for
  the daemon. The script does not test `$CADGEN_TELEMETRY` after exporting
  it: that test cannot fail.

Call `cadgen` through `cad.sh`. A direct `uvx cadgen` can leave the saved
choice on, and the daemon will follow it.

`cad.sh telemetry` reports this process off because of the environment.
That line is not the saved choice. The saved choice is what the first-run
`telemetry off` writes.

## Setup

1. Install [uv](https://docs.astral.sh/uv/).
2. Run `./make/text-to-cad/cad.sh --help`. The first run turns telemetry off.
3. For an agent (Claude Code, Cursor, Codex), install the upstream plugin
   or skills as its README says, then run
   `./make/text-to-cad/cad.sh telemetry off` once before its server starts.

## Asking for a part

Say what the part is, its size in millimetres, how it is held or mounted,
the material, and the process: FDM, CNC, or laser. Ask for STEP and STL,
and for a snapshot. Read the dimensions in the viewer before a file goes
to a fabricator.

Name files `<project>-<part>-v<n>.step`. Write the dimensions beside the
part. A part for a municipal partner is labelled in Thai and English.
Thai on a page uses a non-looped face and `lang="th"`.

## Example

This is a prompt. The part is not in this repository.

```text
Make a wall bracket for a 60 mm flood-gauge sensor.
Base plate 80 × 50 × 4 mm with two 5 mm countersunk screw holes 60 mm apart.
A 62 mm inner-diameter ring, 3 mm wall, 20 mm tall, standing 40 mm off the plate on a ribbed arm.
PETG, FDM, 0.4 mm nozzle; no overhangs over 45°.
Export bracket.step and bracket.stl, and render a 3/4 snapshot.
```

## Credit

text-to-cad: Thompson Labs LLC, 2026, MIT,
<https://github.com/earthtojake/text-to-cad>.
Wrapper: Dr Non Arkaraprasertkul, Palette.
