import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const files = ["index.html", "styles.css", "app.js", "README.md", "context.md", "PALETTE-FIELD-GUIDE.md", "reading.html", "reading.css", "DESIGN-FIELD-GUIDE.md", "credits.html", "CREDITS.md"];
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
  "LEGIBLE<br>≠<br>SIMPLE",
  "Open contrast, colour-vision preview, and copy formats",
  "COPY CSS",
  "COPY TAILWIND",
  "COPY JSON TOKENS",
  "COPY LINK",
  "credits.html",
  "WCAG 2.2",
  "Machado, Oliveira and Fernandes, 2009",
  "Original exhibition code and writing are",
  "Don't make users do the backend's job.",
  "Could the system already know this?",
  "Could it be a default?",
  "Does this need a save step?"
]) {
  assert.ok(joined.includes(required), `missing required content: ${required}`);
}

const controls = [...contents["index.html"].matchAll(/data-action=/g)].length;
assert.equal(controls, 12, "the instrument rail must expose twelve working controls");

const creditNames = [
  "Sanzo Wada",
  "Seigensha",
  "mattdesl/dictionary-of-colour-combinations",
  "dblodorn/sanzo-wada",
  "Bringhurst",
  "IDEO",
  "MoMA",
  "Bauhaus",
  "Machado",
  "WCAG 2.2",
  "APCA",
  "Coolors",
  "Adobe Color",
  "Huemint",
  "Realtime Colors",
  "adobe/leonardo",
  "Mobbin",
  "Dark Design",
  "Saaspo",
  "Curated",
  "nexu-io/open-design",
  "Tailwind",
  "Design Tokens",
  "Archivo Narrow",
  "IBM Plex Sans Thai",
  "Noto Sans SC",
  "JetBrains Mono",
  "axe-core"
];
for (const name of creditNames) {
  assert.ok(contents["CREDITS.md"].includes(name), `CREDITS.md missing ${name}`);
  assert.ok(contents["credits.html"].includes(name), `credits.html missing ${name}`);
}

console.log("OK: exhibition copy, multilingual markup, interaction hooks, provenance, and anti-slop gates are present");
