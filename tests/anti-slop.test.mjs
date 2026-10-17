import test from "node:test";
import assert from "node:assert/strict";
import { auditRepository, lintStylesheet } from "../scripts/check-anti-slop.mjs";

test("the exhibition passes the anti-slop check", async () => {
  assert.deepEqual(await auditRepository(), []);
});

test("the check flags a banned face, a long line, and a text-box floor", () => {
  const css = `
    .card { min-height: 14rem; font-family: "Poppins", sans-serif; }
    .prose p { font-size: var(--body); max-width: 96ch; font-family: Inter, system-ui, sans-serif; }
  `;
  const hits = lintStylesheet(css, "fixture.css").join("\n");
  assert.match(hits, /Poppins/);
  assert.match(hits, /Inter/);
  assert.match(hits, /system-ui/);
  assert.match(hits, /96ch/);
  assert.match(hits, /min-height/);
});

test("a measured paragraph and a 44px target pass", () => {
  const css = `
    p { font-size: var(--body); max-width: var(--measure); }
    a { min-height: 44px; }
    * { border-radius: 0 !important; }
  `;
  assert.deepEqual(lintStylesheet(css, "fixture.css"), []);
});
