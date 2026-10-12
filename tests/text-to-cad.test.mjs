import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, chmodSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("../make/text-to-cad/cad.sh", import.meta.url));

function run(args, env) {
  return spawnSync(script, args, { encoding: "utf8", env });
}

test("cad.sh refuses telemetry on before calling cadgen", () => {
  for (const word of ["on", "ON", "On"]) {
    const result = run(["telemetry", word], { PATH: "/usr/bin:/bin", HOME: "/tmp" });
    assert.equal(result.status, 2, result.stderr);
    assert.match(result.stderr, /refusing: telemetry must stay off/);
    assert.equal(result.stdout, "");
  }
});

test("cad.sh forces telemetry off and records the first run", () => {
  const bin = mkdtempSync(join(tmpdir(), "palette-uvx-"));
  const state = mkdtempSync(join(tmpdir(), "palette-state-"));
  const log = join(state, "uvx.log");
  writeFileSync(
    join(bin, "uvx"),
    `#!/bin/sh\nprintf '%s\\n' "DO_NOT_TRACK=$DO_NOT_TRACK" "CADGEN_TELEMETRY=$CADGEN_TELEMETRY" "args:$*" >> ${JSON.stringify(log)}\n`,
  );
  chmodSync(join(bin, "uvx"), 0o755);
  const env = {
    PATH: `${bin}:/usr/bin:/bin`,
    HOME: "/tmp",
    XDG_STATE_HOME: state,
    CADGEN_TELEMETRY: "1",
    DO_NOT_TRACK: "0",
  };

  const first = run(["--help"], env);
  assert.equal(first.status, 0, first.stderr);
  const firstLog = readFileSync(log, "utf8");
  assert.match(
    firstLog,
    /^DO_NOT_TRACK=1\nCADGEN_TELEMETRY=0\nargs:cadgen telemetry off\nDO_NOT_TRACK=1\nCADGEN_TELEMETRY=0\nargs:cadgen --help\n$/,
  );
  assert.match(readFileSync(join(state, "palette-make/telemetry-off"), "utf8"), /^\d{4}-\d{2}-\d{2}T/);

  const second = run(["--help"], env);
  assert.equal(second.status, 0, second.stderr);
  const secondLog = readFileSync(log, "utf8");
  assert.equal(
    secondLog,
    `${firstLog}DO_NOT_TRACK=1\nCADGEN_TELEMETRY=0\nargs:cadgen --help\n`,
  );
});

test("cad.sh exits 1 when uv is missing", () => {
  const result = run(["--help"], { PATH: "/usr/bin:/bin", HOME: "/tmp" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Needs uv: https:\/\/docs\.astral\.sh\/uv\//);
});
