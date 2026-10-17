// Flags AI design-slop in Palette stylesheets: banned faces, prose past
// an A4/A5 line, and fixed floors on text containers. Balance, hierarchy,
// and ornaments that only fill space still need a person looking at the page.
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export const BANNED_FAMILIES = [
  "Inter",
  "Poppins",
  "Montserrat",
  "Roboto",
  "Open Sans",
  "Lato",
  "DM Sans",
  "Space Grotesk",
  "Geist",
  "Plus Jakarta Sans",
  "Manrope",
  "Nunito",
];

const SYSTEM_FAMILIES = [
  "system-ui",
  "ui-sans-serif",
  "-apple-system",
  "blinkmacsystemfont",
  "segoe ui",
];

const AGENT_FILES = [
  "AGENTS.md",
  "CLAUDE.md",
  ".cursor/rules/anti-slop.mdc",
  ".github/copilot-instructions.md",
];

function cssRules(css) {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = [];
  function walk(source) {
    let index = 0;
    while (index < source.length) {
      const open = source.indexOf("{", index);
      if (open < 0) break;
      let depth = 0;
      let close = -1;
      for (let cursor = open; cursor < source.length; cursor += 1) {
        if (source[cursor] === "{") depth += 1;
        else if (source[cursor] === "}") {
          depth -= 1;
          if (depth === 0) {
            close = cursor;
            break;
          }
        }
      }
      if (close < 0) break;
      const prelude = source.slice(index, open).trim();
      const body = source.slice(open + 1, close);
      if (prelude.startsWith("@") && body.includes("{")) walk(body);
      else if (prelude && !prelude.startsWith("@")) {
        rules.push({ selector: prelude.replace(/\s+/g, " "), body });
      }
      index = close + 1;
    }
  }
  walk(text);
  return rules;
}

function familyList(value) {
  return value
    .split(",")
    .map((part) => part.trim().replace(/^['"]|['"]$/g, "").replace(/['"]$/g, ""))
    .filter(Boolean);
}

function isBannedFamily(name) {
  const value = name.toLowerCase();
  if (SYSTEM_FAMILIES.includes(value)) return name;
  return BANNED_FAMILIES.find((family) => {
    const banned = family.toLowerCase();
    return value === banned || value.startsWith(`${banned} `);
  });
}

function fontValues(text) {
  const values = [];
  for (const match of text.matchAll(/font-family\s*:\s*([^;}{]+)/g)) values.push(match[1]);
  for (const match of text.matchAll(/--font-[\w-]+\s*:\s*([^;}{]+)/g)) values.push(match[1]);
  for (const match of text.matchAll(/family=([^&"' ]+)/g)) {
    values.push(decodeURIComponent(match[1].split(":")[0].replace(/\+/g, " ")));
  }
  return values;
}

function selectsReadingBlock(selector) {
  return selector.split(",").some((part) =>
    /(?<![\w-])(p|dd|article)(?![\w-])/.test(part)
    || /(?<![\w-])\.(prose|colophon)(?![\w-])/.test(part)
  );
}

function isReadingSize(body) {
  if (/font-size\s*:\s*var\(--micro\)/.test(body)) return false;
  if (/font-size\s*:\s*var\(--body\)/.test(body)) return true;
  const fixed = body.match(/font-size\s*:\s*(\d+(?:\.\d+)?)rem/);
  if (fixed && Number(fixed[1]) >= 1) return true;
  const clampMin = body.match(/font-size\s*:\s*clamp\(\s*(\d+(?:\.\d+)?)rem/);
  return Boolean(clampMin && Number(clampMin[1]) >= 1);
}

function hasMeasure(body) {
  const match = body.match(/max-width\s*:\s*([^;]+)/);
  if (!match) return false;
  const value = match[1];
  if (value.includes("var(--measure)")) return true;
  const ch = value.match(/(\d+(?:\.\d+)?)ch/);
  if (ch && Number(ch[1]) <= 75) return true;
  const rem = value.trim().match(/^(\d+(?:\.\d+)?)rem$/);
  return Boolean(rem && Number(rem[1]) <= 36);
}

function isTextContainer(selector) {
  return selector.split(",").some((part) =>
    /(?<![\w-])(p|h[1-6]|blockquote|figcaption|dd)(?![\w-])/.test(part)
    || /(?<![\w-])\.(prose|colophon|lede|card|panel|hero|stat|tile|blurb)(?![\w-])/.test(part)
  );
}

function floorIsFixed(value) {
  const text = value.trim().toLowerCase();
  if (["auto", "0", "none", "min-content", "max-content", "unset", "initial", "inherit"].includes(text)) {
    return false;
  }
  const px = text.match(/^(\d+(?:\.\d+)?)px(?:\s*!important)?$/);
  if (px) return Number(px[1]) > 48;
  const rem = text.match(/^(\d+(?:\.\d+)?)rem(?:\s*!important)?$/);
  if (rem) return Number(rem[1]) > 3;
  return /[\d.]/.test(text);
}

function rootMap(css) {
  const start = css.indexOf(":root");
  if (start < 0) return null;
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    else if (css[index] === "}") {
      depth -= 1;
      if (depth === 0) {
        const block = css.slice(open + 1, index);
        return Object.fromEntries([...block.matchAll(/--([A-Za-z0-9_-]+)\s*:\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]));
      }
    }
  }
  return null;
}

export function lintStylesheet(css, filename = "styles.css") {
  const violations = [];
  for (const value of fontValues(css)) {
    for (const family of familyList(value)) {
      const banned = isBannedFamily(family);
      if (banned) violations.push(`${filename}: banned design face "${family}"`);
    }
  }
  for (const match of css.matchAll(/max-width\s*:\s*(\d+(?:\.\d+)?)ch\b/g)) {
    const width = Number(match[1]);
    if (width > 75) violations.push(`${filename}: max-width ${width}ch is past the 75-character line`);
  }
  for (const rule of cssRules(css)) {
    if (selectsReadingBlock(rule.selector) && isReadingSize(rule.body) && !hasMeasure(rule.body)) {
      violations.push(`${filename}: reading text has no 65ch measure — ${rule.selector}`);
    }
    if (!isTextContainer(rule.selector)) continue;
    for (const match of rule.body.matchAll(/min-height\s*:\s*([^;]+)/g)) {
      if (floorIsFixed(match[1])) {
        violations.push(`${filename}: fixed min-height on a text container (${match[1].trim()}) — ${rule.selector}`);
      }
    }
    if (/box-shadow\s*:\s*(?!none\b)/.test(rule.body)) {
      violations.push(`${filename}: drop shadow — ${rule.selector}`);
    }
    if (/linear-gradient|radial-gradient|backdrop-filter\s*:/.test(rule.body)) {
      violations.push(`${filename}: gradient or glass — ${rule.selector}`);
    }
    const radius = rule.body.match(/border-radius\s*:\s*([^;]+)/);
    if (radius && !/^0(?:px|rem|em)?(?:\s*!important)?\s*$/.test(radius[1].trim())) {
      violations.push(`${filename}: rounded corner — ${rule.selector}`);
    }
  }
  return violations;
}

export function lintDefaults(css, filename) {
  const root = rootMap(css);
  if (!root) return [`${filename}: missing :root`];
  const violations = [];
  if (root.measure !== "65ch") violations.push(`${filename}: --measure must be 65ch`);
  if (root.leading !== "1.5") violations.push(`${filename}: --leading must be 1.5`);
  if (!/calc\(\s*0\.75\s*\*\s*var\(--leading\)\s*\*\s*1em\s*\)/.test(root.pad ?? "")) {
    violations.push(`${filename}: --pad must scale with the line box`);
  }
  const body = Number.parseFloat(root["type-body"]);
  const title = Number.parseFloat(root["type-title"]);
  const display = Number.parseFloat(root["type-display"]);
  if (!(title / body >= 1.5)) violations.push(`${filename}: --type-title must be at least 1.5 times --type-body`);
  if (!(display / title >= 1.5)) violations.push(`${filename}: --type-display must be at least 1.5 times --type-title`);
  const geometric = familyList(root["font-geometric"] ?? "");
  const thai = familyList(root["font-thai-geometric"] ?? "");
  const hans = familyList(root["font-hans"] ?? "");
  if (geometric[0] !== "Jost") violations.push(`${filename}: --font-geometric must start with Jost`);
  if (!["Prompt", "Kanit"].includes(thai[0])) violations.push(`${filename}: --font-thai-geometric must start with Prompt or Kanit`);
  if (hans[0] !== "Noto Sans SC") violations.push(`${filename}: --font-hans must start with Noto Sans SC`);
  for (const family of [...geometric, ...thai, ...hans]) {
    if (isBannedFamily(family)) violations.push(`${filename}: banned face in a default stack (${family})`);
  }
  return violations;
}

function lintDocs(files) {
  const violations = [];
  const needles = ["65ch", "Jost", "Prompt", "Kanit", "Noto Sans SC", ...BANNED_FAMILIES, "system-ui"];
  for (const [name, text] of Object.entries(files)) {
    for (const needle of needles) {
      if (!text.includes(needle)) violations.push(`${name}: missing anti-slop rule "${needle}"`);
    }
  }
  for (const name of AGENT_FILES) {
    if (!files[name]?.includes("ANTI-SLOP.md")) violations.push(`${name}: must point at ANTI-SLOP.md`);
  }
  if (!files["ANTI-SLOP.md"]?.includes("scripts/check-anti-slop.mjs")) {
    violations.push("ANTI-SLOP.md: must name the check script");
  }
  return violations;
}

export async function auditRepository(root = new URL("../", import.meta.url)) {
  const read = (name) => readFile(new URL(name, root), "utf8");
  const styles = await read("styles.css");
  const reading = await read("reading.css");
  const pages = await Promise.all(["index.html", "reading.html", "app.js"].map(async (name) => [name, await read(name)]));
  const docs = Object.fromEntries(await Promise.all(
    ["ANTI-SLOP.md", ...AGENT_FILES].map(async (name) => [name, await read(name)])
  ));
  const violations = [
    ...lintStylesheet(styles, "styles.css"),
    ...lintStylesheet(reading, "reading.css"),
    ...lintDefaults(styles, "styles.css"),
    ...lintDefaults(reading, "reading.css"),
    ...lintDocs(docs),
  ];
  for (const [name, text] of pages) violations.push(...lintStylesheet(text, name));
  if (!/font-family:\s*"Archivo Narrow"/.test(styles)) violations.push("styles.css: exhibition face Archivo Narrow is missing");
  if (!styles.includes("IBM Plex Sans Thai")) violations.push("styles.css: exhibition Thai face is missing");
  if (!styles.includes("JetBrains Mono")) violations.push("styles.css: exhibition figure face is missing");
  if (!/font-family:\s*Arial/.test(reading)) violations.push("reading.css: reading-room Arial body is missing");
  return violations;
}

async function main() {
  const violations = await auditRepository();
  if (violations.length > 0) {
    for (const violation of violations) console.error(violation);
    console.error(`${violations.length} anti-slop violation${violations.length === 1 ? "" : "s"}`);
    process.exit(1);
  }
  console.log("OK: anti-slop defaults, banned faces, prose measure, and text-container floors");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await main();
}
