(() => {
  "use strict";

  const state = {
    colors: [],
    palettes: [],
    index: 0,
    grayscale: false,
    indexSize: "all"
  };

  const el = {};

  function byId(id) {
    return document.getElementById(id);
  }

  function relativeLuminance(rgb) {
    const channels = rgb.map((value) => {
      const channel = value / 255;
      return channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  }

  function readableInk(rgb) {
    const luminance = relativeLuminance(rgb);
    const lightInkLuminance = 1;
    const darkInkLuminance = 0;
    const lightContrast = (lightInkLuminance + 0.05) / (luminance + 0.05);
    const darkContrast = (luminance + 0.05) / (darkInkLuminance + 0.05);
    return darkContrast >= lightContrast ? "#000000" : "#ffffff";
  }

  function rgbToHsl(rgb) {
    const [r, g, b] = rgb.map((value) => value / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let hue = 0;
    if (delta) {
      if (max === r) hue = 60 * (((g - b) / delta) % 6);
      if (max === g) hue = 60 * ((b - r) / delta + 2);
      if (max === b) hue = 60 * ((r - g) / delta + 4);
    }
    if (hue < 0) hue += 360;
    return {
      h: hue,
      s: max === min ? 0 : delta / (1 - Math.abs(max + min - 1)),
      l: (max + min) / 2
    };
  }

  function hueWord(hue) {
    if (hue < 20 || hue >= 345) return "red";
    if (hue < 50) return "orange";
    if (hue < 75) return "yellow";
    if (hue < 165) return "green";
    if (hue < 200) return "turquoise";
    if (hue < 255) return "blue";
    if (hue < 290) return "violet";
    if (hue < 345) return "rose";
    return "red";
  }

  function buildPalettes(colors) {
    const paletteMap = new Map();
    colors.forEach((color) => {
      color.combinations.forEach((id) => {
        if (!paletteMap.has(id)) paletteMap.set(id, []);
        paletteMap.get(id).push(color);
      });
    });
    return [...paletteMap.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([id, paletteColors]) => enrichPalette(id, paletteColors));
  }

  function enrichPalette(id, colors) {
    const hsl = colors.map((color) => rgbToHsl(color.rgb));
    const luminances = colors.map((color) => relativeLuminance(color.rgb));
    const spread = Math.max(...luminances) - Math.min(...luminances);
    const averageLight = luminances.reduce((sum, value) => sum + value, 0) / luminances.length;
    const warmCount = hsl.filter(({ h }) => h < 75 || h >= 315).length;
    const coolCount = hsl.filter(({ h }) => h >= 75 && h < 315).length;
    const saturation = hsl.reduce((sum, item) => sum + item.s, 0) / hsl.length;
    const temperature = warmCount === coolCount ? "warm–cool tension" : warmCount > coolCount ? "warm-led" : "cool-led";
    const energy = saturation > 0.58 ? "electric" : saturation > 0.34 ? "clear" : "quiet";
    const light = averageLight > 0.62 ? "light" : averageLight < 0.24 ? "dark" : "mid-tone";
    const contrast = spread > 0.55 ? "high contrast" : spread > 0.28 ? "measured contrast" : "close values";
    const use = chooseUse({ temperature, energy, light, contrast });
    const tags = new Set([
      temperature,
      energy,
      light,
      contrast,
      use,
      ...window.PALETTE_COPY.uses[use],
      ...hsl.map(({ h }) => hueWord(h)),
      ...colors.flatMap((color) => color.name.toLowerCase().split(/\s+/))
    ]);
    const concepts = new Set([light]);
    if (temperature.includes("warm")) concepts.add("warm");
    if (temperature.includes("cool")) concepts.add("cool");
    if (energy === "quiet") concepts.add("quiet");
    if (energy === "electric") concepts.add("loud");
    Object.entries(window.PALETTE_COPY.terms).forEach(([key, values]) => {
      if (concepts.has(key)) values.forEach((value) => tags.add(value));
    });
    return { id, colors, temperature, energy, light, contrast, use, tags: [...tags] };
  }

  function chooseUse(reading) {
    if (reading.light === "dark") return reading.energy === "electric" ? "night instrument" : "archival room";
    if (reading.energy === "electric") return reading.temperature === "warm-led" ? "confectionery shock" : "electric argument";
    if (reading.temperature === "warm-led") return "domestic warmth";
    if (reading.temperature === "cool-led") return reading.light === "light" ? "civic daylight" : "botanical study";
    if (reading.contrast === "close values") return "quiet editorial";
    return "mineral calm";
  }

  function formatPlate(id) {
    return String(id).padStart(3, "0");
  }

  function currentPalette() {
    return state.palettes[state.index];
  }

  function fieldWeights(count) {
    if (count === 2) return [1.618, 1];
    if (count === 3) return [1.45, 0.9, 0.65];
    return [1.55, 0.85, 0.7, 0.55];
  }

  function fieldColumns(count) {
    return fieldWeights(count).map((weight) => `${weight}fr`).join(" ");
  }

  function paletteExport(palette) {
    const weights = fieldWeights(palette.colors.length);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const shares = weights.map((weight) => Number((weight / totalWeight).toFixed(3)));
    shares[shares.length - 1] = Number((1 - shares.slice(0, -1).reduce((sum, share) => sum + share, 0)).toFixed(3));
    const roles = ["dominant", "counter", "support", "signal"];
    const plate = formatPlate(palette.id);
    return {
      format: "palette-exhibition/1",
      plate: palette.id,
      url: `https://colors.nonarkara.org/#plate-${plate}`,
      source: {
        work: "A Dictionary of Color Combinations",
        author: "Sanzo Wada",
        digitalDataset: "mattdesl/dictionary-of-colour-combinations",
        note: "RGB and hex values are credited digital conversions, not exact printed colours."
      },
      interpretation: {
        by: "Dr Non Arkaraprasertkul",
        scope: "Selection, spatial proportions, interface, search vocabulary, role assignments, and editorial reading.",
        independence: "Not affiliated with or endorsed by the Wada estate, Seigensha, or linked institutions."
      },
      reading: {
        temperature: palette.temperature,
        energy: palette.energy,
        light: palette.light,
        valueInterval: palette.contrast,
        suggestedUse: palette.use,
        note: "Dr Non's deterministic reading for this exhibition; it is not attributed to Wada."
      },
      layoutNote: "Roles and shares describe this exhibition layout, not Wada's prescription.",
      colors: palette.colors.map((color, index) => ({
        name: color.name,
        hex: color.hex.toUpperCase(),
        rgb: color.rgb,
        role: roles[index],
        share: shares[index]
      }))
    };
  }

  function renderJson() {
    const palette = currentPalette();
    if (!palette) return;
    el.jsonCode.textContent = JSON.stringify(paletteExport(palette), null, 2);
    el.copyJsonButton.textContent = "COPY JSON";
  }

  function renderPalette({ announce = true } = {}) {
    const palette = currentPalette();
    if (!palette) return;
    el.fields.style.gridTemplateColumns = fieldColumns(palette.colors.length);
    el.fields.replaceChildren(...palette.colors.map((color, position) => {
      const field = document.createElement("div");
      field.className = "field";
      field.style.backgroundColor = color.hex;
      field.style.color = readableInk(color.rgb);
      const name = document.createElement("span");
      name.textContent = color.name;
      const value = document.createElement("code");
      value.textContent = color.hex.toUpperCase();
      field.append(name, value);
      field.dataset.position = String(position + 1);
      return field;
    }));
    const plate = formatPlate(palette.id);
    el.plateCount.textContent = `${plate} / 348`;
    el.plateNumber.textContent = `PLATE ${plate}`;
    el.plateNames.textContent = palette.colors.map((color) => color.name).join(" + ");
    el.plateReading.textContent = `${palette.temperature}; ${palette.energy}; ${palette.contrast}. Suggested room: ${palette.use}.`;
    document.documentElement.style.setProperty("--primary-ink", readableInk(palette.colors[0].rgb));
    document.documentElement.style.setProperty("--last-ink", readableInk(palette.colors.at(-1).rgb));
    document.documentElement.style.setProperty("--dominant-share", ({ 2: 0.618, 3: 0.483, 4: 0.425 })[palette.colors.length]);
    document.body.classList.toggle("is-grayscale", state.grayscale);
    history.replaceState(null, "", `#plate-${plate}`);
    renderAnalysis(palette);
    if (el.jsonDialog?.open) renderJson();
    if (announce) el.status.textContent = `Plate ${plate}. ${el.plateNames.textContent}.`;
  }

  function renderAnalysis(palette) {
    const rows = [
      ["Relationship", palette.temperature],
      ["Energy", palette.energy],
      ["Value interval", palette.contrast],
      ["Possible room", palette.use],
      ["Colour count", String(palette.colors.length)]
    ];
    el.analysis.replaceChildren(...rows.flatMap(([term, description]) => {
      const dt = document.createElement("dt");
      dt.textContent = term;
      const dd = document.createElement("dd");
      dd.textContent = description;
      return [dt, dd];
    }));
  }

  function goToIndex(index) {
    state.index = (index + state.palettes.length) % state.palettes.length;
    renderPalette();
  }

  function goToPlate(id, closeDialog) {
    const index = state.palettes.findIndex((palette) => palette.id === Number(id));
    if (index < 0) {
      history.replaceState(null, "", `#plate-${formatPlate(currentPalette().id)}`);
      el.status.textContent = "That plate does not exist. The current plate remains open.";
      return;
    }
    state.index = index;
    renderPalette();
    if (closeDialog?.open) closeDialog.close();
    el.stage.focus();
  }

  function openDialog(dialog, focusTarget) {
    if (!dialog.open) dialog.showModal();
    requestAnimationFrame(() => focusTarget?.focus());
  }

  function renderSearch(query) {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const results = terms.length
      ? state.palettes.filter((palette) => {
          const haystack = [
            ...palette.tags,
            ...palette.colors.map((color) => color.name)
          ].join(" ").toLowerCase();
          return terms.every((term) => haystack.includes(term));
        }).slice(0, 48)
      : state.palettes.slice(0, 24);
    el.searchResults.replaceChildren(...results.map((palette) => paletteResult(palette, el.searchDialog)));
    el.searchExplainer.textContent = `${results.length}${results.length === 48 ? "+" : ""} relationships shown. Search names, temperature, energy, medium, or use.`;
  }

  function paletteResult(palette, dialog) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "result-button";
    button.addEventListener("click", () => goToPlate(palette.id, dialog));
    const swatches = document.createElement("span");
    swatches.className = "mini-fields";
    palette.colors.forEach((color) => {
      const swatch = document.createElement("i");
      swatch.style.backgroundColor = color.hex;
      swatches.append(swatch);
    });
    const label = document.createElement("span");
    const number = document.createElement("strong");
    number.textContent = formatPlate(palette.id);
    const names = document.createElement("span");
    names.textContent = palette.colors.map((color) => color.name).join(" / ");
    label.append(number, names);
    button.append(swatches, label);
    item.append(button);
    return item;
  }

  function renderIndex() {
    const palettes = state.indexSize === "all"
      ? state.palettes
      : state.palettes.filter((palette) => palette.colors.length === Number(state.indexSize));
    el.paletteIndex.replaceChildren(...palettes.map((palette) => paletteResult(palette, el.indexDialog)));
  }

  async function copyPalette() {
    const palette = currentPalette();
    const value = palette.colors.map((color, index) => `--palette-${index + 1}: ${color.hex}; /* ${color.name} */`).join("\n");
    try {
      await navigator.clipboard.writeText(value);
      el.status.textContent = `Copied plate ${formatPlate(palette.id)} CSS values.`;
    } catch {
      el.status.textContent = "Copy was blocked by the browser. Open the digest to read the values.";
    }
  }

  async function copyJson() {
    const palette = currentPalette();
    const value = JSON.stringify(paletteExport(palette), null, 2);
    try {
      await navigator.clipboard.writeText(value);
      el.copyJsonButton.textContent = "COPIED";
      el.status.textContent = `Copied plate ${formatPlate(palette.id)} JSON.`;
    } catch {
      el.copyJsonButton.textContent = "COPY BLOCKED";
      el.status.textContent = "Copy was blocked by the browser. The JSON remains visible for manual selection.";
    }
  }

  function action(name) {
    if (name === "previous") goToIndex(state.index - 1);
    if (name === "next") goToIndex(state.index + 1);
    if (name === "random") goToIndex(Math.floor(Math.random() * state.palettes.length));
    if (name === "search") openDialog(el.searchDialog, el.searchInput);
    if (name === "index") {
      renderIndex();
      openDialog(el.indexDialog, el.indexDialog.querySelector("button"));
    }
    if (name === "digest") openDialog(el.digestDialog, el.digestDialog.querySelector("button"));
    if (name === "about") openDialog(el.aboutDialog, el.aboutDialog.querySelector("button"));
    if (name === "json") {
      renderJson();
      openDialog(el.jsonDialog, el.jsonDialog.querySelector("button"));
    }
    if (name === "contrast") {
      state.grayscale = !state.grayscale;
      document.querySelector('[data-action="contrast"]').setAttribute("aria-pressed", String(state.grayscale));
      renderPalette();
    }
    if (name === "copy") copyPalette();
  }

  function bindEvents() {
    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => action(button.dataset.action));
    });
    el.searchInput.addEventListener("input", () => renderSearch(el.searchInput.value));
    el.copyJsonButton.addEventListener("click", copyJson);
    el.indexDialog.querySelectorAll("[data-size]").forEach((button) => {
      button.addEventListener("click", () => {
        state.indexSize = button.dataset.size;
        el.indexDialog.querySelectorAll("[data-size]").forEach((candidate) => {
          candidate.setAttribute("aria-pressed", String(candidate === button));
        });
        renderIndex();
      });
    });
    document.addEventListener("keydown", (event) => {
      const dialogOpen = document.querySelector("dialog[open]");
      const typing = /input|textarea/i.test(document.activeElement?.tagName || "");
      if (dialogOpen || typing) return;
      if (event.key === "ArrowLeft") action("previous");
      if (event.key === "ArrowRight") action("next");
      if (event.key === "/") { event.preventDefault(); action("search"); }
      if (event.key.toLowerCase() === "r") action("random");
      if (event.key.toLowerCase() === "g") action("index");
      if (event.key.toLowerCase() === "i") action("digest");
      if (event.key.toLowerCase() === "a") action("about");
      if (event.key.toLowerCase() === "j") action("json");
      if (event.key.toLowerCase() === "c") action("contrast");
    });
    window.addEventListener("hashchange", () => {
      const match = location.hash.match(/plate-(\d{1,3})/);
      if (match) goToPlate(match[1]);
    });
  }

  async function init() {
    Object.assign(el, {
      stage: byId("palette-stage"),
      fields: byId("fields"),
      plateCount: byId("plate-count"),
      plateNumber: byId("plate-number"),
      plateNames: byId("plate-names"),
      plateReading: byId("plate-reading"),
      status: byId("status"),
      searchDialog: byId("search-dialog"),
      searchInput: byId("search-input"),
      searchResults: byId("search-results"),
      searchExplainer: byId("search-explainer"),
      indexDialog: byId("index-dialog"),
      paletteIndex: byId("palette-index"),
      digestDialog: byId("digest-dialog"),
      jsonDialog: byId("json-dialog"),
      jsonCode: byId("json-code"),
      copyJsonButton: byId("copy-json"),
      aboutDialog: byId("about-dialog"),
      analysis: byId("current-analysis")
    });
    try {
      const response = await fetch("data/colors.json");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      state.colors = await response.json();
      state.palettes = buildPalettes(state.colors);
      const requested = location.hash.match(/plate-(\d{1,3})/);
      const requestedIndex = requested
        ? state.palettes.findIndex((palette) => palette.id === Number(requested[1]))
        : -1;
      state.index = requestedIndex >= 0 ? requestedIndex : 0;
      bindEvents();
      renderSearch("");
      renderPalette({ announce: false });
    } catch (error) {
      el.plateNumber.textContent = "THE ROOM COULD NOT OPEN";
      el.plateNames.textContent = "Colour data is unavailable.";
      el.plateReading.textContent = "Serve this repository over HTTP and try again.";
      el.status.textContent = `Palette failed to load: ${error.message}`;
    }
  }

  init();
})();
