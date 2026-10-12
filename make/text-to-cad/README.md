# make · text-to-cad

This directory is the shared reference for a written part that has to leave
as geometry. Two places use it.

The live in-browser implementation is
[designon](https://designon.nonarkara.org/). Commit
[d4605d7](https://github.com/Nonarkara/luma-house/commit/d4605d785c67494cb3e11fed9368df2e1ba50b3b)
in [Nonarkara/luma-house](https://github.com/Nonarkara/luma-house) writes
GLB, STL, and 3MF, and runs the printability check.
[docs/TEXT-TO-CAD-REVIEW.md](https://github.com/Nonarkara/luma-house/blob/d4605d785c67494cb3e11fed9368df2e1ba50b3b/docs/TEXT-TO-CAD-REVIEW.md)
lists what that commit took.

The CLI is `cad.sh`, for an M5 or a cloud machine, not the M3. The M3 is
short of memory, and the first run downloads a CAD runtime. `cad.sh` asks
cadgen for STEP, and for STL or 3MF when the part will be printed. It does
not apply the printability numbers itself.

Upstream is [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad),
MIT. Credit: earthtojake. The copyright line is in that repository's
LICENSE. This directory does not vendor the upstream tree.

## Printability

The numbers live in [`limits.json`](limits.json). That file is the only
copy in this repository. designon's check at d4605d7 uses these same
values, written out in its own source. Further changes to the numbers
belong here. When you ask through `cad.sh`, point the agent at this
file. `cad.sh` does not reimplement the check.

A freestanding model wall is an unsupported wall. For a home filament
printer (FDM) the minimum is 1.6 mm. Under that, the wall may break or
not print. Thickening it so it prints means the model is not true to
scale in wall thickness. designon says this when a 0.15 m wall at 1:100
is 1.5 mm. A resin printer (SLA) uses its own minimum in the same file.

The beam over a door or window prints as a bridge. For FDM the limit is
10 mm. Over that limit is a warning, not a blocker: turn on supports in
the slicer. Slicers add them. The file still downloads. The same warning
applies to the SLA bridge limit.

Suggest the biggest model that prints: walls hold and it fits the plate.
The scale list runs from the largest model. Take the first scale that
passes. A bridge warning does not reject a scale. On designon's sample
plan that suggestion is 1:50 (198 × 137 × 57 mm). The 256 mm plate is a
common Bambu Lab A1 / P1 / X1 size, an assumption; check the printer.
The printed model sits on a 2 mm base.

The note in `limits.json` is the sentence designon shows: limits are
conservative defaults from the design-for-printing guide in text-to-cad
(Hubs and Formlabs guides, ISO/ASTM 52910).

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
the material, and the process: FDM, CNC, or laser. Ask for STEP, and for
STL or 3MF when it will be printed, and for a snapshot. Read the dimensions
before a file goes to a fabricator. Judge a print against `limits.json`.

Name files `<project>-<part>-v<n>.step`. Write the dimensions beside the
part. A part for a municipal partner is labelled in Thai and English.
Thai on a page uses a non-looped face and `lang="th"`.

## Example

This is a prompt. The part is not in this repository.

```text
Make a wall bracket for a 60 mm flood-gauge sensor.
Base plate 80 × 50 × 4 mm with two 5 mm countersunk screw holes 60 mm apart.
A 62 mm inner-diameter ring, 3 mm wall, 20 mm tall, standing 40 mm off the plate on a ribbed arm.
PETG, home filament printer (FDM).
Check walls and bridges against make/text-to-cad/limits.json.
A wall under the FDM minimum may be thickened; say that the wall is then not true to scale.
A bridge over the FDM limit is a warning, not a blocker: say to turn on supports in the slicer.
Suggest the biggest scale that still fits the plate.
Export bracket.step and bracket.stl, and render a 3/4 snapshot.
```

## Credit

text-to-cad: earthtojake, MIT,
<https://github.com/earthtojake/text-to-cad>.
Browser: [designon](https://designon.nonarkara.org/).
Wrapper: Dr Non Arkaraprasertkul, Palette.
