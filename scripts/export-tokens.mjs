// non-slop-skip-file: token export source, not UI. It contains the string
// "font-family:" inside a regex, which the static scan reads as a declaration.
// Writes tokens/palette.tokens.json for Penpot and Tokens Studio.
// Colour values are the credited digital conversions in data/colors.json.
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const OUTPUT = new URL("../tokens/palette.tokens.json", import.meta.url);
const ROLES = ["dominant", "counter", "support", "signal"];
const TOKEN_NAME = /^[a-zA-Z0-9_-][a-zA-Z0-9$_-]*(\.[a-zA-Z0-9$_-]+)*$/;
const PENPOT_TYPES = new Set([
  "color",
  "dimension",
  "number",
  "string",
  "fontFamilies",
]);

const EXHIBITION_FONTS = [
  ["display", "Archivo Narrow"],
  ["thai", "IBM Plex Sans Thai"],
  ["hans", "Noto Sans SC"],
  ["data", "JetBrains Mono"],
];

const READING_FONTS = [
  ["body", "Arial"],
  ["display", "Archivo Narrow"],
  ["thai", "IBM Plex Sans Thai"],
  ["hans", "Noto Sans SC"],
];

export function slug(name) {
  const value = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!TOKEN_NAME.test(value)) throw new Error(`colour name is not a token name: ${name}`);
  return value;
}

export function plateId(id) {
  return String(id).padStart(3, "0");
}

// Same weights as fieldWeights in app.js. The last share absorbs rounding
// so the parts sum to 1, matching paletteExport.
export function sharesFor(count) {
  const weights = count === 2
    ? [1.618, 1]
    : count === 3
      ? [1.45, 0.9, 0.65]
      : [1.55, 0.85, 0.7, 0.55];
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const shares = weights.map((weight) => Number((weight / total).toFixed(3)));
  shares[shares.length - 1] = Number(
    (1 - shares.slice(0, -1).reduce((sum, share) => sum + share, 0)).toFixed(3)
  );
  return shares.map((share) => share.toFixed(3));
}

function token(value, type, description) {
  if (!PENPOT_TYPES.has(type)) throw new Error(`unsupported token type: ${type}`);
  if (typeof description !== "string" || description.length === 0) {
    throw new Error("Penpot import expects a description on every token");
  }
  return { $value: value, $type: type, $description: description };
}

function themeUuid(plate) {
  const hex = createHash("sha256").update(`palette:plate:${plate}`).digest("hex").slice(0, 32);
  const chars = hex.split("");
  chars[12] = "5";
  if (!"89ab".includes(chars[16])) chars[16] = "a";
  const text = chars.join("");
  return `${text.slice(0, 8)}-${text.slice(8, 12)}-${text.slice(12, 16)}-${text.slice(16, 20)}-${text.slice(20)}`;
}

function rootBlock(css, label) {
  const start = css.indexOf(":root");
  if (start < 0) throw new Error(`${label} has no :root`);
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    else if (css[index] === "}") {
      depth -= 1;
      if (depth === 0) return css.slice(open + 1, index);
    }
  }
  throw new Error(`${label} :root is unclosed`);
}

/**
 * The body of a media query, found by walking its braces.
 *
 * A regular expression cannot do this. The first version of the --rail check
 * looked for the declaration with `[^}]*` between the opening brace and the
 * property, which meant it only found the property when the declaration was
 * the first thing in the block. Adding a rule to the top of the phone query
 * silently broke it, and the token export lost a sentence nobody noticed.
 */
function mediaBlock(css, query, label) {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`@media\\s*\\(\\s*${escaped}\\s*\\)`).exec(css);
  if (!match) return null;
  const open = css.indexOf("{", match.index);
  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    else if (css[index] === "}") {
      depth -= 1;
      if (depth === 0) return css.slice(open + 1, index);
    }
  }
  throw new Error(`${label} @media (${query}) is unclosed`);
}

function declarations(block) {
  const found = [];
  for (const match of block.matchAll(/--([A-Za-z0-9_-]+)\s*:\s*([^;]+);/g)) {
    found.push([match[1], match[2].trim()]);
  }
  if (found.length === 0) throw new Error("a :root block had no custom properties");
  return found;
}

function fontStacks(css) {
  return [...css.matchAll(/font-family:\s*([^;}{]+)/g)].map((match) =>
    match[1].split(",").map((part) => part.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean)
  );
}

function stackFor(css, family, label) {
  const stack = fontStacks(css).find((parts) => parts[0] === family);
  if (!stack) throw new Error(`${label} has no font-family stack beginning with ${family}`);
  return stack;
}

function isHex(value) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function isNumber(value) {
  return /^-?\d+(?:\.\d+)?$/.test(value);
}

function isLength(value) {
  return /^-?\d+(?:\.\d+)?(?:px|rem|em|vw|vh|%)$/.test(value);
}

function clampParts(value) {
  const match = value.match(/^clamp\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)$/);
  return match ? [match[1].trim(), match[2].trim(), match[3].trim()] : null;
}

function lengthToken(value, description) {
  if (!isLength(value)) return token(value, "string", description);
  return token(value, "dimension", description);
}

function addCustomProperty(tree, name, value, origin, catalogueByHex, place) {
  const base = `Custom property --${name} from ${origin}.`;
  if (isHex(value)) {
    const match = catalogueByHex.get(value.toLowerCase());
    tree.color[name] = match
      ? token(
        `{colour.${match.slug}}`,
        "color",
        `${base} Alias of catalogue colour ${match.name}. The hex is the credited digital conversion.`
      )
      : token(
        value.toLowerCase(),
        "color",
        `${base} ${place} colour, outside the 159 catalogue colours.`
      );
    return;
  }
  if (isNumber(value)) {
    tree.number[name] = token(value, "number", base);
    return;
  }
  const parts = clampParts(value);
  if (parts) {
    tree.string[name] = token(
      value,
      "string",
      `${base} The stylesheet uses this clamp(). The min, preferred, and max lengths are dimension tokens beside it.`
    );
    tree.dimension[name] = {
      min: lengthToken(parts[0], `${base} Minimum of the clamp().`),
      preferred: lengthToken(parts[1], `${base} Preferred length of the clamp().`),
      max: lengthToken(parts[2], `${base} Maximum of the clamp().`),
    };
    return;
  }
  if (isLength(value)) {
    tree.dimension[name] = lengthToken(value, base);
    return;
  }
  tree.string[name] = token(
    value,
    "string",
    `${base} Kept as written. Penpot does not apply this as a colour or a dimension.`
  );
}

function fontGroup(css, pairs, origin) {
  const font = {};
  for (const [name, family] of pairs) {
    const stack = stackFor(css, family, origin);
    const script = family === "IBM Plex Sans Thai"
      ? " Thai uses this non-looped stack with lang=\"th\"."
      : family === "Noto Sans SC"
        ? " Simplified Chinese uses this stack with lang=\"zh-Hans\"."
        : "";
    font[name] = token(
      stack,
      "fontFamilies",
      `Typeface stack from ${origin}. First family: ${family}.${script}`
    );
  }
  return font;
}

function emptyTree() {
  return { color: {}, number: {}, dimension: {}, string: {} };
}

function compact(tree) {
  const out = {};
  for (const [key, value] of Object.entries(tree)) {
    if (value && typeof value === "object" && !("$value" in value) && Object.keys(value).length === 0) continue;
    out[key] = value;
  }
  return out;
}

export function combinationsFrom(colors) {
  const map = new Map();
  for (const color of colors) {
    for (const id of color.combinations) {
      if (!map.has(id)) map.set(id, []);
      map.get(id).push(color);
    }
  }
  return [...map.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([id, paletteColors]) => ({ id, colors: paletteColors }));
}

export function buildTokenDocument({ colors, stylesCss, readingCss, appJs }) {
  if (colors.length !== 159) throw new Error(`expected 159 colours, received ${colors.length}`);
  const slugs = new Map();
  const byHex = new Map();
  const colour = {};
  for (const color of colors) {
    const name = slug(color.name);
    if (slugs.has(name)) throw new Error(`duplicate colour slug: ${name}`);
    slugs.set(name, color);
    const hex = color.hex.toLowerCase();
    if (!isHex(hex)) throw new Error(`invalid hex for ${color.name}`);
    if (byHex.has(hex)) throw new Error(`duplicate hex ${hex}`);
    byHex.set(hex, { ...color, slug: name });
    colour[name] = token(
      hex,
      "color",
      `${color.name}. Credited digital conversion ${hex}. Printed ink remains its own object.`
    );
  }

  const plates = combinationsFrom(colors);
  if (plates.length !== 348) throw new Error(`expected 348 combinations, received ${plates.length}`);

  const catalogue = {
    colour,
    note: {
      source: token(
        "159 named colours and 348 combinations from data/colors.json. Digital data: Matt DesLauriers, dictionary-of-colour-combinations, MIT, after Dain M. Blodorn Kim. Historical combinations: Sanzo Wada. Export: Dr Non Arkaraprasertkul. Palette does not copy Penpot source.",
        "string",
        "Attribution carried inside the token file. Penpot keeps $description, so this note stays with the set."
      ),
      conversion: token(
        "RGB and hex values are credited digital conversions, not exact printed colours.",
        "string",
        "Do not describe these hex values as the printed ink."
      ),
    },
  };

  const interfaceTree = emptyTree();
  for (const [name, value] of declarations(rootBlock(stylesCss, "styles.css"))) {
    addCustomProperty(interfaceTree, name, value, "styles.css", byHex, "Exhibition");
  }
  const phoneBlock = mediaBlock(stylesCss, "max-width: 760px", "styles.css");
  if (
    interfaceTree.dimension.rail &&
    phoneBlock &&
    /--rail\s*:\s*100%/.test(phoneBlock)
  ) {
    interfaceTree.dimension.rail.$description += " At max-width 760px, styles.css sets --rail to 100%.";
  }
  if (interfaceTree.number["dominant-share"] && appJs.includes('setProperty("--dominant-share"')) {
    interfaceTree.number["dominant-share"].$description +=
      " This is the two-colour split. app.js changes it for three- and four-colour plates. The proportion is the exhibition layout, not a Wada prescription.";
  }
  if (interfaceTree.color["primary-ink"] && appJs.includes('setProperty("--primary-ink"')) {
    interfaceTree.color["primary-ink"].$description +=
      " app.js replaces this with black or white from measured contrast on the dominant field.";
  }
  if (interfaceTree.color["last-ink"] && appJs.includes('setProperty("--last-ink"')) {
    interfaceTree.color["last-ink"].$description +=
      " app.js replaces this with black or white from measured contrast on the last field.";
  }
  const interfaceSet = compact(interfaceTree);
  interfaceSet.font = fontGroup(stylesCss, EXHIBITION_FONTS, "styles.css");

  const readingTree = emptyTree();
  for (const [name, value] of declarations(rootBlock(readingCss, "reading.css"))) {
    addCustomProperty(readingTree, name, value, "reading.css", byHex, "Reading-room");
  }
  if (readingTree.color.paper) {
    readingTree.color.paper.$description += " Reading ground.";
  }
  if (readingTree.color.ink) {
    readingTree.color.ink.$description += " Reading ink.";
  }
  const readingSet = compact(readingTree);
  readingSet.font = fontGroup(readingCss, READING_FONTS, "reading.css");

  const document = {
    catalogue,
    interface: interfaceSet,
    reading: readingSet,
  };
  const setNames = ["catalogue", "interface", "reading"];
  const themes = [];

  for (const plate of plates) {
    const label = plateId(plate.id);
    const setName = `plate/${label}`;
    const shares = sharesFor(plate.colors.length);
    const role = {};
    const share = {};
    plate.colors.forEach((color, index) => {
      const roleName = ROLES[index];
      role[roleName] = token(
        `{colour.${slug(color.name)}}`,
        "color",
        `Plate ${label}, ${roleName}. ${color.name}. Exhibition role, in the order of data/colors.json. The hex is the credited digital conversion.`
      );
      share[roleName] = token(
        shares[index],
        "number",
        `Plate ${label}, ${roleName} share of the viewport. Exhibition proportion from the weights in app.js. Not a Wada prescription.`
      );
    });
    document[setName] = { role, share };
    setNames.push(setName);
    const names = plate.colors.map((color) => color.name).join(", ");
    themes.push({
      id: themeUuid(label),
      name: label,
      group: "Plate",
      description: `Plate ${label}. ${names}. ${plate.colors.length} colours. Enables catalogue, interface, reading, and this plate.`,
      isSource: false,
      selectedTokenSets: {
        catalogue: "enabled",
        interface: "enabled",
        reading: "enabled",
        [setName]: "enabled",
      },
    });
  }

  document.$themes = themes;
  document.$metadata = {
    tokenSetOrder: setNames,
    activeThemes: ["Plate/001"],
    activeSets: ["catalogue", "interface", "reading", "plate/001"],
  };
  return document;
}

export function serializeTokenDocument(document) {
  return `${JSON.stringify(document, null, 2)}\n`;
}

export async function loadTokenSources() {
  const [colors, stylesCss, readingCss, appJs] = await Promise.all([
    readFile(new URL("../data/colors.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../reading.css", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
  ]);
  return { colors, stylesCss, readingCss, appJs };
}

export async function renderedTokens() {
  return serializeTokenDocument(buildTokenDocument(await loadTokenSources()));
}

async function main() {
  const check = process.argv.includes("--check");
  const next = await renderedTokens();
  if (check) {
    const current = await readFile(OUTPUT, "utf8").catch(() => "");
    if (current !== next) {
      console.error("tokens/palette.tokens.json is missing or stale. Run npm run build.");
      process.exit(1);
    }
    console.log("tokens/palette.tokens.json matches the catalogue and the stylesheets.");
    return;
  }
  await writeFile(OUTPUT, next);
  console.log("Wrote tokens/palette.tokens.json");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await main();
}
