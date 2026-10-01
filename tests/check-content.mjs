import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const files = ["index.html", "styles.css", "app.js", "README.md", "context.md", "PALETTE-FIELD-GUIDE.md"];
const contents = Object.fromEntries(await Promise.all(files.map(async (file) => [file, await readFile(new URL(`../${file}`, import.meta.url), "utf8")])));
const joined = Object.values(contents).join("\n");

for (const banned of ["border-radius: 8", "linear-gradient", "box-shadow", "#3b82f6", "<meta name=\"generator\"", "api.openai.com", "localhost:5173"]) {
  assert.ok(!joined.toLowerCase().includes(banned.toLowerCase()), `banned design/provenance tell: ${banned}`);
}

for (const required of [
  "lang=\"th\"",
  "lang=\"zh-Hans\"",
  "aria-live",
  "prefers-reduced-motion",
  "THIRD_PARTY_NOTICES.md",
  "https://github.com/Nonarkara/palette",
  "PALETTE-FIELD-GUIDE.md",
  "download=\"palette-field-guide.md\"",
  "https://colors.nonarkara.org/",
  "About Dr Non and the research",
  "View and copy palette JSON",
  "Portable palette JSON",
  "palette-exhibition/1",
  "classy and dangerous",
  "How verified colour data becomes an inhabitable, accessible room.",
  "LEGIBLE<br>≠<br>SIMPLE"
]) {
  assert.ok(joined.includes(required), `missing required content: ${required}`);
}

const controls = [...contents["index.html"].matchAll(/data-action=/g)].length;
assert.equal(controls, 10, "the instrument rail must expose ten working controls");

console.log("OK: exhibition copy, multilingual markup, interaction hooks, provenance, and anti-slop gates are present");
