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

test("limits.json is the only printability table, worded as designon", () => {
  const limits = JSON.parse(readFileSync(new URL("../make/text-to-cad/limits.json", import.meta.url), "utf8"));
  const readme = readFileSync(new URL("../make/text-to-cad/README.md", import.meta.url), "utf8");
  const root = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  assert.equal(limits.processes.fdm.minUnsupportedWallMm, 1.6);
  assert.equal(limits.processes.fdm.maxBridgeMm, 10);
  assert.equal(limits.processes.sla.minUnsupportedWallMm, 1.0);
  assert.equal(limits.processes.sla.maxBridgeMm, 5);
  assert.equal(limits.bridge.blocksDownload, false);
  assert.equal(limits.wall.blocksDownload, true);
  assert.equal(limits.fit.blocksDownload, true);
  assert.deepEqual(limits.scales, [50, 75, 100, 150, 200, 250]);
  assert.equal(limits.buildPlateMm, 256);
  assert.equal(limits.basePrintMm, 2);
  assert.equal(limits.credit.handle, "earthtojake");
  assert.equal(limits.browser.url, "https://designon.nonarkara.org/");
  assert.equal(limits.browser.commit, "d4605d785c67494cb3e11fed9368df2e1ba50b3b");
  assert.match(readme, /1\.6 mm/);
  assert.match(readme, /10 mm/);
  assert.match(readme, /warning, not a blocker/);
  assert.match(readme, /biggest model that prints/);
  assert.match(readme, /https:\/\/designon\.nonarkara\.org\//);
  assert.match(readme, /limits\.json/);
  assert.doesNotMatch(readme, /Thompson Labs/);
  assert.doesNotMatch(readme, /\bJake\b/);
  assert.match(root, /https:\/\/designon\.nonarkara\.org\//);
  assert.match(root, /Credit: earthtojake/);
  assert.doesNotMatch(root, /Thompson Labs/);
});
