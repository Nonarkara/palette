/* WCAG 2.2 contrast, colour-vision preview, and copy formats.
   Original code. Matrices are the published Machado, Oliveira & Fernandes
   severity-1.0 figures, applied in linear sRGB. Not a clinical test. */
(() => {
  "use strict";

  const BLACK = [0, 0, 0];
  const WHITE = [255, 255, 255];
  const ROLES = ["dominant", "counter", "support", "signal"];
  const MATRICES = {
    protanopia: [
      [0.152286, 1.052583, -0.204868],
      [0.114503, 0.786281, 0.099216],
      [-0.003882, -0.048116, 1.051998]
    ],
    deuteranopia: [
      [0.367322, 0.860646, -0.227968],
      [0.280085, 0.672501, 0.047413],
      [-0.011820, 0.042940, 0.968881]
    ],
    tritanopia: [
      [1.255528, -0.076749, -0.178779],
      [-0.078411, 0.930809, 0.147602],
      [0.004733, 0.691367, 0.303900]
    ]
  };

  function fieldWeights(count) {
    if (count === 2) return [1.618, 1];
    if (count === 3) return [1.45, 0.9, 0.65];
    return [1.55, 0.85, 0.7, 0.55];
  }

  function shares(weights) {
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    const result = weights.map((weight) => Number((weight / total).toFixed(3)));
    result[result.length - 1] = Number((1 - result.slice(0, -1).reduce((sum, share) => sum + share, 0)).toFixed(3));
    return result;
  }

  function srgbChannelToLinear(value) {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  }

  function linearChannelToSrgb(value) {
    const clamped = Math.min(1, Math.max(0, value));
    const encoded = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, encoded)) * 255);
  }

  function relativeLuminance(rgb) {
    const channels = rgb.map(srgbChannelToLinear);
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  }

  function contrastRatio(a, b) {
    const lighter = Math.max(relativeLuminance(a), relativeLuminance(b));
    const darker = Math.min(relativeLuminance(a), relativeLuminance(b));
    return (lighter + 0.05) / (darker + 0.05);
  }

  function formatRatio(ratio) {
    const shown = Math.floor(ratio * 10 + 1e-9) / 10;
    return `${shown.toFixed(1)}:1`;
  }

  function verdict(ratio, minimum) {
    return ratio >= minimum ? "pass" : "fail";
  }

  function textOn(rgb) {
    const black = contrastRatio(rgb, BLACK);
    const white = contrastRatio(rgb, WHITE);
    const ink = black >= white ? "black" : "white";
    const best = ink === "black" ? black : white;
    return {
      black,
      white,
      ink,
      best,
      body: verdict(best, 4.5),
      large: verdict(best, 3),
      blackBody: verdict(black, 4.5),
      whiteBody: verdict(white, 4.5),
      blackLarge: verdict(black, 3),
      whiteLarge: verdict(white, 3)
    };
  }

  function boundary(a, b) {
    const ratio = contrastRatio(a, b);
    return {
      ratio,
      body: verdict(ratio, 4.5),
      ui: verdict(ratio, 3)
    };
  }

  function simulate(rgb, mode) {
    const matrix = MATRICES[mode];
    if (!matrix) return rgb.slice();
    const linear = rgb.map(srgbChannelToLinear);
    return matrix.map((row) => linearChannelToSrgb(row[0] * linear[0] + row[1] * linear[1] + row[2] * linear[2]));
  }

  function plateUrl(id) {
    return `https://colors.nonarkara.org/#plate-${String(id).padStart(3, "0")}`;
  }

  function plateModel(palette) {
    const weights = fieldWeights(palette.colors.length);
    const portions = shares(weights);
    return {
      id: palette.id,
      plate: String(palette.id).padStart(3, "0"),
      names: palette.colors.map((color) => color.name),
      url: plateUrl(palette.id),
      colors: palette.colors.map((color, index) => ({
        name: color.name,
        hex: color.hex.toUpperCase(),
        rgb: color.rgb,
        role: ROLES[index],
        share: portions[index],
        ink: textOn(color.rgb).ink === "black" ? "#000000" : "#FFFFFF"
      }))
    };
  }

  function cssVariables(model) {
    const lines = model.colors.flatMap((color) => {
      const percent = Math.round(color.share * 100);
      return [
        `  --palette-${color.role}: ${color.hex}; /* ${color.name} · about ${percent}% */`,
        `  --palette-${color.role}-ink: ${color.ink};`
      ];
    });
    return `/* Plate ${model.plate} — ${model.names.join(" + ")}\n   Sanzo Wada relationship. Hex values are credited digital conversions, not printed ink.\n   Roles and shares: Dr Non Arkaraprasertkul. ${model.url} */\n:root {\n${lines.join("\n")}\n}\n`;
  }

  function tailwindTheme(model) {
    const v4 = model.colors.map((color) => `  --color-palette-${color.role}: ${color.hex};`).join("\n");
    const v3 = model.colors.map((color) => `        "palette-${color.role}": "${color.hex}"`).join(",\n");
    return `/* Plate ${model.plate} — ${model.names.join(" + ")}\n   Credited digital conversions, not printed ink. ${model.url}\n   Tailwind theme conventions © Tailwind Labs (MIT). This snippet only names these colours. */\n\n/* Tailwind v4 */\n@theme {\n${v4}\n}\n\n/* Tailwind v3 — theme.extend.colors */\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${v3}\n      }\n    }\n  }\n};\n`;
  }

  function designTokens(model) {
    const palette = {};
    model.colors.forEach((color) => {
      palette[color.role] = {
        $type: "color",
        $value: color.hex,
        $description: `${color.name}. Credited digital conversion, not printed ink. About ${Math.round(color.share * 100)}% of this exhibition field.`
      };
    });
    return JSON.stringify({
      $description: `Sanzo Wada plate ${model.plate}. Roles assigned by Dr Non Arkaraprasertkul. ${model.url}`,
      palette
    }, null, 2);
  }

  const api = {
    fieldWeights,
    shares,
    relativeLuminance,
    contrastRatio,
    formatRatio,
    textOn,
    boundary,
    simulate,
    plateUrl,
    plateModel,
    cssVariables,
    tailwindTheme,
    designTokens
  };
  if (typeof module !== "undefined") module.exports = api;
  if (typeof window !== "undefined") window.PALETTE_MEASURE = api;
})();
