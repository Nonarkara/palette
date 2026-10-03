import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const files = ["index.html", "styles.css", "app.js", "README.md", "context.md", "AGENTS.md", "CONFLICT-ORDER.md", "PALETTE-FIELD-GUIDE.md", "reading.html", "reading.css", "DESIGN-FIELD-GUIDE.md"];
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
  "Start with a feeling.<br>Or don’t.",
  "NO IDEA — SURPRISE ME",
  "COPY THIS FOR YOUR AGENT",
  "MIT LICENSE · FORK IT · MAKE IT YOURS",
  "Copy palette instructions for an agent",
  "License: MIT.",
  "agentPrompt: agentBrief(palette)",
  "palette-exhibition/1",
  "SANZO<br>WADA",
  "1883",
  "1967",
  "Japan Standard Color Association",
  "Haishoku Sōkan",
  "Gate of Hell",
  "https://artplatform.go.jp/artists/A2089",
  "https://www.oscars.org/oscars/ceremonies/1955/C",
  "CURATORIAL REGISTER / PAL–WADA–001",
  "Dr Non Arkaraprasertkul: selection, spatial proportions",
  "Dr Non’s interpretation of that method",
  "INTERPRETATION: DR NON",
  "Dr Non's deterministic reading for this exhibition",
  "classy and dangerous",
  "How verified colour data becomes an inhabitable, accessible room.",
  "LEGIBLE<br>≠<br>SIMPLE"
]) {
  assert.ok(joined.includes(required), `missing required content: ${required}`);
}

const controls = [...contents["index.html"].matchAll(/data-action=/g)].length;
assert.equal(controls, 11, "the instrument rail must expose eleven working controls");

const gate = contents["CONFLICT-ORDER.md"];
const precedence = [
  "Name the human task before adding a control. If you cannot name the task, do not add the control.",
  "Contrast and legibility beat proportion. A golden-section split that makes text fail is wrong.",
  "Decoration loses. If a rule only makes the surface prettier, delete it.",
  "One combination still owns the viewport. Do not invent a second visual system.",
];
let cursor = -1;
for (const line of precedence) {
  const at = gate.indexOf(line);
  assert.ok(at > cursor, `conflict order missing or out of sequence: ${line}`);
  cursor = at;
}
assert.doesNotMatch(gate, /user-tested|usability study passed|Mama Rule passed/i, "the conflict order must not claim a user test");
for (const file of ["context.md", "README.md", "PALETTE-FIELD-GUIDE.md", "AGENTS.md", "reading.html"]) {
  assert.ok(contents[file].includes("CONFLICT-ORDER.md"), `${file} must point at the conflict order`);
}

console.log("OK: exhibition copy, multilingual markup, interaction hooks, provenance, and anti-slop gates are present");
