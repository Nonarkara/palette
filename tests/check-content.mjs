import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const files = ["index.html", "styles.css", "app.js", "palette-tools.js", "README.md", "context.md", "AGENTS.md", "CONFLICT-ORDER.md", "PALETTE-FIELD-GUIDE.md", "reading.html", "reading.css", "DESIGN-FIELD-GUIDE.md"];
const contents = Object.fromEntries(await Promise.all(files.map(async (file) => [file, await readFile(new URL(`../${file}`, import.meta.url), "utf8")])));
const joined = Object.values(contents).join("\n");

for (const banned of ["border-radius: 8", "linear-gradient", "radial-gradient", "box-shadow", "backdrop-filter", "background-clip: text", "#3b82f6", "<meta name=\"generator\"", "api.openai.com", "localhost:5173"]) {
  assert.ok(!joined.toLowerCase().includes(banned.toLowerCase()), `banned design/provenance tell: ${banned}`);
}

const surfaces = ["index.html", "styles.css", "app.js", "reading.html", "reading.css"].map((file) => contents[file]).join("\n");
for (const tell of ["rounded-2xl", "shadow-lg", "get started", "supercharge", "world-class"]) {
  assert.ok(!surfaces.toLowerCase().includes(tell), `product surface carries a slop tell: ${tell}`);
}
assert.doesNotMatch(contents["styles.css"] + contents["reading.css"], /font-family:[^;}]*Inter/i, "type must not fall through to Inter");
for (const radius of (contents["styles.css"] + contents["reading.css"]).matchAll(/border-radius:\s*([^;!]+)/g)) {
  assert.equal(radius[1].trim(), "0", `radius must stay zero, found ${radius[1].trim()}`);
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
assert.ok(gate.includes("Another costume is still decoration."), "the conflict order must refuse a replacement costume");
assert.ok(gate.includes("It does not detect authorship."), "the conflict order must not pretend to detect authorship");
const guide = contents["PALETTE-FIELD-GUIDE.md"];
for (const refusal of [
  "Another costume is still decoration.",
  "A familiar control that does a job is not a failure.",
  "This list does not detect authorship and it does not record a user test.",
  "Cream and terracotta",
  "acid green",
  "Read the text first.",
  "motion that ignores reduced motion",
  "No component library, font catalogue, or slop scanner",
  "Do not replace this plate with a gradient, glass, shadow, or a second palette.",
]) {
  const haystack = refusal.startsWith("Do not replace") ? contents["app.js"] : guide;
  assert.ok(haystack.includes(refusal), `missing anti-slop refusal: ${refusal}`);
}
for (const mark of ["Source Serif 4", "Source Sans 3", "Not a Wada typeface. Not a user test.", "Thai stays IBM Plex Sans Thai.", "--plate-display"]) {
  assert.ok(joined.includes(mark), `missing type system mark: ${mark}`);
}
for (const file of ["context.md", "README.md", "PALETTE-FIELD-GUIDE.md", "AGENTS.md", "reading.html"]) {
  assert.ok(contents[file].includes("CONFLICT-ORDER.md"), `${file} must point at the conflict order`);
}

console.log("OK: exhibition copy, multilingual markup, interaction hooks, provenance, and anti-slop gates are present");
