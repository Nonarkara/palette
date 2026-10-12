#!/usr/bin/env bash
# Palette make — wrapper for cadgen (https://github.com/earthtojake/text-to-cad, MIT).
# DO_NOT_TRACK and CADGEN_TELEMETRY cover this process. The build daemon and a
# detached viewer follow the saved choice and do not inherit those variables,
# so the first run writes that choice with `cadgen telemetry off`.
set -euo pipefail

# Refuse the subcommand that saves telemetry on. A test of $CADGEN_TELEMETRY
# after the export below cannot fail: this script has just set it to 0.
case "${1-}" in
  telemetry)
    case "${2-}" in
      [Oo][Nn])
        echo "refusing: telemetry must stay off" >&2
        exit 2
        ;;
    esac
    ;;
esac

export DO_NOT_TRACK=1
export CADGEN_TELEMETRY=0

if ! command -v uvx >/dev/null 2>&1; then
  echo "Needs uv: https://docs.astral.sh/uv/" >&2
  exit 1
fi

stamp="${XDG_STATE_HOME:-$HOME/.local/state}/palette-make/telemetry-off"
if [ ! -f "$stamp" ]; then
  uvx cadgen telemetry off
  mkdir -p -- "$(dirname -- "$stamp")"
  date -u +%Y-%m-%dT%H:%M:%SZ >"$stamp"
fi

exec uvx cadgen "$@"
