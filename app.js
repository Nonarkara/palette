(() => {
  "use strict";

  const state = {
    colors: [],
    palettes: [],
    index: 0,
    grayscale: false,
    indexSize: "all",
    golden: false,
    playground: { data: null, font: null, style: null, paletteId: null }
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
      ...hsl.flatMap(({ h, s, l },i) => {
        const name=colors[i].name.toLowerCase();
        const family=l<.10?'black':s<.12?(l>.82?'white':'gray'):hueWord(h);
        return [family,...(/pink|rose|corinthian/.test(name)?['rose']:[]),...(/brown|umber|ochr|sienna|buff|fawn/.test(name)?['earth','brown']:[])];
      }),
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

  // ── The golden section ────────────────────────────────────────────────────
  // The construction is drawn, not approximated. A golden rectangle is broken
  // into squares; each square records the corner it shares with the next; a
  // quarter arc is drawn in each square between the corner it shares with the
  // previous one and the corner it shares with the next one. The radius is the
  // side of the square, so every arc is exact, and consecutive arcs meet
  // because the shared corner is literally the same point.
  const SVG_NS = "http://www.w3.org/2000/svg";

  function drawGolden(svg, width, height, { double = true } = {}) {
    const golden = window.PALETTE_TOOLS.golden;
    const rect = golden.rectangle(width, height);
    const squares = golden.squares(rect);
    const arcs = golden.arcs(squares);
    const cuts = golden.cuts(width, height);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const layer = (className, transform) => {
      const group = document.createElementNS(SVG_NS, "g");
      group.setAttribute("class", className);
      if (transform) group.setAttribute("transform", transform);

      const frame = document.createElementNS(SVG_NS, "rect");
      frame.setAttribute("x", rect.x);
      frame.setAttribute("y", rect.y);
      frame.setAttribute("width", rect.width);
      frame.setAttribute("height", rect.height);
      group.append(frame);

      squares.forEach((square) => {
        const box = document.createElementNS(SVG_NS, "rect");
        box.setAttribute("class", "golden-square");
        box.setAttribute("x", square.x);
        box.setAttribute("y", square.y);
        box.setAttribute("width", square.side);
        box.setAttribute("height", square.side);
        group.append(box);
      });

      arcs.forEach((arc) => {
        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("class", "golden-arc");
        // The turn sense of an arc is the sign of the cross product of the two
        // radii, so every arc in the spiral turns the same way.
        const cross = (arc.start[0] - arc.centre[0]) * (arc.end[1] - arc.centre[1]) -
          (arc.start[1] - arc.centre[1]) * (arc.end[0] - arc.centre[0]);
        const radius = arc.radius.toFixed(3);
        path.setAttribute("d", `M ${arc.start[0].toFixed(3)} ${arc.start[1].toFixed(3)} A ${radius} ${radius} 0 0 ${cross > 0 ? 1 : 0} ${arc.end[0].toFixed(3)} ${arc.end[1].toFixed(3)}`);
        group.append(path);
      });

      [
        [cuts.vertical[0], 0, cuts.vertical[0], height],
        [cuts.vertical[1], 0, cuts.vertical[1], height],
        [0, cuts.horizontal[0], width, cuts.horizontal[0]],
        [0, cuts.horizontal[1], width, cuts.horizontal[1]]
      ].forEach(([x1, y1, x2, y2]) => {
        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("class", "golden-cut");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        group.append(line);
      });
      return group;
    };

    const parts = [layer("golden-ink golden-ink-dark")];
    // The dark pass and a light pass one pixel off. The diagram has to read
    // on a pale field and on a dark one, and this repository does not use a
    // blend mode to fake it.
    if (double) parts.push(layer("golden-ink golden-ink-light", "translate(1 1)"));
    svg.replaceChildren(...parts);
  }

  function paintGolden() {
    // The box each diagram describes. The overlay's own box is set by CSS and
    // matches the box it is drawn over; the diagram is measured from the thing
    // it explains, never from its own canvas.
    const viewport = {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    };
    const instances = [
      [el.goldenOverlayStage, el.fields, true],
      [el.goldenOverlayDemo, el.goldenStage, true],
      [el.pgOverlay, el.pgStage, true],
      [el.goldenOverlaySheet, viewport, false]
    ];
    instances.forEach(([svg, target, double]) => {
      if (!svg) return;
      svg.style.display = state.golden ? "block" : "none";
      if (!state.golden) return;
      const box = target && target.getBoundingClientRect
        ? target.getBoundingClientRect()
        : { width: target.width, height: target.height };
      const width = Math.round(box.width);
      const height = Math.round(box.height);
      if (!width || !height) return;
      drawGolden(svg, width, height, { double });
    });
  }

  function toggleGolden(force) {
    state.golden = force === undefined ? !state.golden : Boolean(force);
    if (el.goldenToggle) {
      el.goldenToggle.setAttribute("aria-pressed", String(state.golden));
      el.goldenToggle.textContent = state.golden ? "ERASE THE DIAGRAM" : "DRAW THE DIAGRAM";
    }
    if (el.goldenStatus) {
      el.goldenStatus.textContent = state.golden
        ? "The diagram is drawn on the plate view, behind the words, and behind this text. Press P on the plate view to erase it."
        : "The diagram is off. On the plate view, P draws it there.";
    }
    paintGolden();
    el.status.textContent = state.golden
      ? "The golden section is drawn."
      : "The golden section is hidden.";
  }

  // ── The playground ────────────────────────────────────────────────────────
  // A bench, not a dashboard. Type, style and palette are three separate
  // choices, and the reader can change any of them and see the other two
  // answer.
  function radioGroup(container, items, onPick) {
    const buttons = items.map((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", String(index === 0));
      button.tabIndex = index === 0 ? 0 : -1;
      button.dataset.value = item.id;
      button.textContent = item.name;
      button.addEventListener("click", () => pick(item.id));
      return button;
    });
    container.replaceChildren(...buttons);

    function pick(id) {
      const index = items.findIndex((item) => item.id === id);
      if (index < 0) return;
      buttons.forEach((button, position) => {
        button.setAttribute("aria-checked", String(position === index));
        button.tabIndex = position === index ? 0 : -1;
      });
      onPick(items[index]);
    }

    container.addEventListener("keydown", (event) => {
      const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
      if (!step) return;
      event.preventDefault();
      const current = buttons.findIndex((button) => button.getAttribute("aria-checked") === "true");
      const next = (current + step + buttons.length) % buttons.length;
      buttons[next].focus();
      pick(items[next].id);
    });
  }

  function loadPlaygroundFont(font) {
    if (!font?.google) return;
    if (document.querySelector(`link[data-pg-font="${font.id}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
    link.dataset.pgFont = font.id;
    // A face that arrives late changes the headline's metrics, and the headline
    // was measured against the field. Measure again when it lands.
    link.addEventListener("load", () => fitBench());
    document.head.append(link);
  }

  async function loadPlayground() {
    if (state.playground.data) {
      renderPlayground();
      return;
    }
    const response = await fetch("data/playground.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    state.playground.data = data;
    state.playground.font = data.fonts[0];
    state.playground.style = data.styles[0];
    state.playground.paletteId = currentPalette().id;

    radioGroup(el.pgFonts, data.fonts, (font) => {
      state.playground.font = font;
      loadPlaygroundFont(font);
      renderPlayground();
    });
    radioGroup(el.pgStyles, data.styles, (style) => {
      state.playground.style = style;
      renderPlayground();
    });

    el.pgPalette.replaceChildren(...state.palettes.map((palette) => {
      const option = document.createElement("option");
      option.value = String(palette.id);
      option.textContent = `${formatPlate(palette.id)} · ${palette.colors.map((color) => color.name).join(" + ")}`;
      return option;
    }));
    el.pgPalette.value = String(state.playground.paletteId);
    el.pgPalette.addEventListener("change", () => {
      state.playground.paletteId = Number(el.pgPalette.value);
      renderPlayground();
    });
    el.pgSurprise.addEventListener("click", () => {
      const palette = state.palettes[Math.floor(Math.random() * state.palettes.length)];
      state.playground.paletteId = palette.id;
      el.pgPalette.value = String(palette.id);
      renderPlayground();
    });

    loadPlaygroundFont(state.playground.font);
    renderPlayground();
  }

  function paintFields(container, palette) {
    container.style.gridTemplateColumns = fieldColumns(palette.colors.length);
    container.replaceChildren(...palette.colors.map((color) => {
      const field = document.createElement("div");
      field.style.backgroundColor = color.hex;
      return field;
    }));
  }

  // ── The bench fits the field ───────────────────────────────────────────────
  // A style says how loud it wants to be. The colour field says how loud it can
  // be. When the two disagree, the field wins — and the display size is
  // measured down until the sample sits inside the colour it is printed on.
  //
  // A bench that clips the sample it is showing is a bench lying about the
  // style, so this is measured against the rendered box, not estimated from a
  // character count.
  //
  // The floor is absolute, not a fraction: a display that shrinks to 13px on a
  // phone is not a display, it is a smudge, and no scale ratio is worth that.
  // When the floor is reached and the sample still does not fit, the bench
  // overflows and says so — that is a finding for the instrument, not a
  // licence to print unreadable type.
  const FIT_MIN_PX = 20;
  const FIT_MIN_RATIO = 0.55;

  function fitBench() {
    const stage = el.pgStage;
    const copy = el.pgCopy;
    const head = el.pgHeadline;
    if (!stage || !copy || !head) return 1;
    copy.style.setProperty("--pg-fit", "1");
    const box = stage.getBoundingClientRect();
    if (!box.width || !box.height) return 1;

    // The copy is bottom-aligned in the field, so a sample that is too tall
    // pushes its top past the field's padding, not past its bottom.
    const overflows = () => {
      const padding = parseFloat(getComputedStyle(copy).paddingTop) || 0;
      const ceiling = copy.getBoundingClientRect().top + padding;
      const first = copy.firstElementChild;
      if (!first) return false;
      return first.getBoundingClientRect().top < ceiling - 0.5;
    };

    if (!overflows()) {
      stage.dataset.fit = "1";
      return 1;
    }
    const natural = parseFloat(getComputedStyle(head).fontSize) || 1;
    const floor = Math.min(1, Math.max(FIT_MIN_RATIO, FIT_MIN_PX / natural));
    let low = floor;
    let high = 1;
    for (let step = 0; step < 7; step += 1) {
      const middle = (low + high) / 2;
      copy.style.setProperty("--pg-fit", String(middle));
      if (overflows()) high = middle;
      else low = middle;
    }
    copy.style.setProperty("--pg-fit", String(low));
    stage.dataset.fit = String(Number(low.toFixed(3)));
    stage.dataset.fitFloor = String(Number(floor.toFixed(3)));
    return low;
  }

  function renderPlayground() {
    const data = state.playground.data;
    if (!data) return;
    const font = state.playground.font;
    const style = state.playground.style;
    const palette = state.palettes.find((item) => item.id === state.playground.paletteId) || currentPalette();
    if (!palette) return;

    paintFields(el.pgFields, palette);
    paintFields(el.goldenFields, palette);

    const weights = fieldWeights(palette.colors.length);
    const share = weights[0] / weights.reduce((sum, weight) => sum + weight, 0);
    el.pgStage.style.setProperty("--pg-share", String(share));

    el.pgCopy.style.setProperty("--pg-family", font.stack);
    el.pgCopy.style.color = readableInk(palette.colors[0].rgb);
    Object.entries(style.tokens).forEach(([name, value]) => el.pgCopy.style.setProperty(name, value));

    el.pgPlate.textContent = `PLATE ${formatPlate(palette.id)}`;
    el.pgFontWhy.textContent = `${font.name} — ${font.role}. ${font.why}`;
    el.pgStyleWhy.textContent = `${style.name} — ${style.mood}. ${style.changes}`;
    el.pgPaletteWhy.textContent = `Plate ${formatPlate(palette.id)} — ${palette.colors.map((color) => color.name).join(" + ")}. ${palette.temperature}; ${palette.energy}; ${palette.contrast}. Suggested room: ${palette.use}.`;
    fitBench();
    paintGolden();
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
      license: "MIT",
      reading: {
        temperature: palette.temperature,
        energy: palette.energy,
        light: palette.light,
        valueInterval: palette.contrast,
        suggestedUse: palette.use,
        note: "Dr Non's deterministic reading for this exhibition; it is not attributed to Wada."
      },
      agentPrompt: agentBrief(palette),
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
    const {results:matches,related,terms}=window.PALETTE_TOOLS.search(state.palettes,query);
    const results=matches.slice(0,terms.length?48:24);
    el.searchResults.replaceChildren(...results.map((palette) => paletteResult(palette, el.searchDialog)));
    el.searchExplainer.textContent = terms.length
      ? !matches.length ? `No match for “${query.trim()}”. Try a colour, mood, purpose, hex value, or plate number. The mood buttons below can start another search.`
        : `${matches.length} ${related?'related relationships (not every word matched)':'relationships'} for “${query.trim()}”. Showing ${results.length}. Choose one to enter the room.`
      : "Browse everything below, choose a mood, or type your own words. Search stays on this device.";
  }

  function paletteResult(palette, dialog) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "result-button";
    if (palette.id === state.palettes[state.index]?.id) {
      button.setAttribute("aria-current", "true");
    }
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
    if (el.indexCount) {
      const size = palettes.length;
      const sizeWord = state.indexSize === "all" ? "" : ` with ${state.indexSize} colours`;
      el.indexCount.textContent = `${size} relationships${sizeWord}.`;
    }
  }

  function agentBrief(palette) {
    const roles = ["dominant", "counter", "support", "signal"];
    const weights = fieldWeights(palette.colors.length);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const tokens = palette.colors.map((color, index) => {
      const share = Math.round((weights[index] / totalWeight) * 100);
      return `--palette-${roles[index]}: ${color.hex.toUpperCase()}; /* ${color.name} · about ${share}% */`;
    }).join("\n");
    return `Use this colour system for the work.\n\nPalette: Plate ${formatPlate(palette.id)} — ${palette.colors.map((color) => color.name).join(" + ")}\nMood: ${palette.temperature}; ${palette.energy}; ${palette.contrast}.\nSuggested direction: ${palette.use}.\n\n:root {\n${tokens.split("\n").map((line) => `  ${line}`).join("\n")}\n}\n\nKeep the roles and unequal proportions. Choose black or white text by measured contrast on each actual background. Do not treat the digital values as exact printed ink.\n\nSource relationship: Sanzo Wada. Digital interpretation, roles, and reading: Dr Non Arkaraprasertkul.\nReference: https://colors.nonarkara.org/#plate-${formatPlate(palette.id)}\nLicense: MIT.`;
  }

  async function copyPalette() {
    const palette = currentPalette();
    const value = agentBrief(palette);
    try {
      await navigator.clipboard.writeText(value);
      el.copyAgentButton.textContent = "COPIED — GIVE IT TO YOUR AGENT";
      el.status.textContent = `Copied plate ${formatPlate(palette.id)} instructions for your agent.`;
      window.setTimeout(() => { el.copyAgentButton.textContent = "COPY THIS FOR YOUR AGENT"; }, 2400);
    } catch {
      el.copyAgentButton.textContent = "COPY BLOCKED — OPEN JSON";
      el.status.textContent = "Copy was blocked by the browser. Open the JSON room to select the palette manually.";
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
    if (name === "about") {
      openDialog(el.aboutDialog, el.aboutDialog.querySelector("button"));
      // The bench is only paid for when it is opened: the faces load, and
      // the diagram is drawn, once a reader goes in.
      loadPlayground().catch((error) => {
        el.status.textContent = `The playground could not load: ${error.message}`;
      });
      requestAnimationFrame(paintGolden);
    }
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
    if (name === "wallpaper") {
      renderWallpaper();
      openDialog(el.wallpaperDialog, el.wallpaperDevice);
    }
  }

  function paintWallpaper(canvas,device,labels) {
    const palette=currentPalette();
    const plan=window.PALETTE_TOOLS.wallpaperPlan(palette,device);
    canvas.width=plan.width; canvas.height=plan.height;
    const ctx=canvas.getContext('2d');
    const unit=Math.min(plan.width,plan.height)/30;
    plan.fields.forEach((field,i)=>{
      ctx.fillStyle=field.color.hex;
      ctx.fillRect(field.x,field.y,field.width,field.height);
      if(!labels) return;
      ctx.fillStyle=readableInk(field.color.rgb);
      ctx.font=`${unit*.7}px monospace`;
      const name=field.color.name;
      const maxWidth=field.width-unit*2;
      const words=name.split(' '); const lines=[''];
      words.forEach(word=>{const last=lines.length-1;const next=(lines[last]+' '+word).trim();if(ctx.measureText(next).width>maxWidth&&lines[last])lines.push(word);else lines[last]=next;});
      const bottom=field.y+field.height-unit;
      ctx.fillText(field.color.hex.toUpperCase(),field.x+unit,bottom);
      lines.reverse().forEach((line,j)=>ctx.fillText(line,field.x+unit,bottom-unit*(j+1)));
      if(i===0) {
        ctx.font=`${unit}px monospace`;
        ctx.fillText(`PLATE ${formatPlate(palette.id)}`,field.x+unit,field.y+unit*2);
        ctx.font=`${unit*.5}px monospace`;
        ctx.fillText('WADA / DR NON’S INTERPRETATION',field.x+unit,field.y+unit*3,maxWidth);
        ctx.fillText('CREDITED DIGITAL COLOURS / NOT PRINT PROOFS',field.x+unit,field.y+unit*3.8,maxWidth);
      }
    });
  }
  function renderWallpaper() {
    paintWallpaper(el.wallpaperPreview,el.wallpaperDevice.value,el.wallpaperLabels.checked);
    const size=window.PALETTE_TOOLS.sizes[el.wallpaperDevice.value];
    el.wallpaperInfo.textContent=`Plate ${formatPlate(currentPalette().id)} · ${size.width} × ${size.height} PNG. Portrait fields stack; desktop fields stand side by side. Downloads use original colours, even in grayscale study.`;
    el.wallpaperStatus.textContent='';
  }
  function downloadWallpaper() {
    const canvas=document.createElement('canvas');
    const device=el.wallpaperDevice.value;
    const plate=formatPlate(currentPalette().id);
    paintWallpaper(canvas,device,el.wallpaperLabels.checked);
    el.wallpaperDownload.disabled=true;
    canvas.toBlob(blob=>{
      el.wallpaperDownload.disabled=false;
      if(!blob){el.wallpaperStatus.textContent='PNG could not be created. Try again.';return;}
      const url=URL.createObjectURL(blob);
      const link=document.createElement('a');
      link.href=url;link.download=`palette-${plate}-${device}-${canvas.width}x${canvas.height}.png`;
      document.body.append(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),60000);
      el.wallpaperStatus.textContent='PNG prepared. Check your browser’s downloads. On mobile, save the image to Photos before setting your wallpaper.';
    },'image/png');
  }

  function bindEvents() {
    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => action(button.dataset.action));
    });
    el.searchInput.addEventListener("input", () => renderSearch(el.searchInput.value));
    el.wallpaperDevice.addEventListener('change',renderWallpaper);
    el.wallpaperLabels.addEventListener('change',renderWallpaper);
    el.wallpaperDownload.addEventListener('click',downloadWallpaper);
    el.searchDialog.querySelectorAll("[data-query]").forEach((button) => {
      button.addEventListener("click", () => {
        el.searchInput.value = button.dataset.query;
        renderSearch(button.dataset.query);
        el.searchInput.focus();
      });
    });
    el.surpriseButton.addEventListener("click", () => {
      goToIndex(Math.floor(Math.random() * state.palettes.length));
      el.searchDialog.close();
      el.stage.focus();
    });
    el.copyAgentButton.addEventListener("click", copyPalette);
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
      // Never steal Cmd/Ctrl/Alt shortcuts — the browser, OS, and assistive
      // tools own those (Cmd+R reload, Ctrl+G find-next, Cmd+I italic, …).
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "ArrowLeft") action("previous");
      if (event.key === "ArrowRight") action("next");
      if (event.key === "/") { event.preventDefault(); action("search"); }
      if (event.key === "?") { event.preventDefault(); action("digest"); }
      const letter = event.key.length === 1 ? event.key.toLowerCase() : "";
      if (letter === "r") action("random");
      if (letter === "g") action("index");
      if (letter === "i") action("digest");
      if (letter === "a") action("about");
      if (letter === "j") action("json");
      if (letter === "c") action("contrast");
      if (letter === "p") toggleGolden();
    });
    window.addEventListener("hashchange", () => {
      const match = location.hash.match(/plate-(\d{1,3})/);
      if (match) goToPlate(match[1]);
    });
    // The diagram is drawn in real pixels, so it has to be drawn again when
    // the box it describes changes size.
    let repaint = null;
    window.addEventListener("resize", () => {
      if (repaint) return;
      repaint = requestAnimationFrame(() => {
        repaint = null;
        paintGolden();
      });
    });
    el.goldenToggle?.addEventListener("click", () => toggleGolden());
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
      indexCount: byId("index-count"),
      digestDialog: byId("digest-dialog"),
      jsonDialog: byId("json-dialog"),
      jsonCode: byId("json-code"),
      copyJsonButton: byId("copy-json"),
      copyAgentButton: byId("copy-agent"),
      surpriseButton: byId("surprise-me"),
      aboutDialog: byId("about-dialog"),
      analysis: byId("current-analysis"),
      wallpaperDialog: byId('wallpaper-dialog'),
      wallpaperDevice: byId('wallpaper-device'),
      wallpaperPreview: byId('wallpaper-preview'),
      wallpaperLabels: byId('wallpaper-labels'),
      wallpaperDownload: byId('wallpaper-download'),
      wallpaperInfo: byId('wallpaper-info'),
      wallpaperStatus: byId('wallpaper-status'),
      goldenOverlayStage: byId('golden-overlay-stage'),
      goldenOverlaySheet: byId('golden-overlay-sheet'),
      goldenOverlayDemo: byId('golden-overlay-demo'),
      goldenStage: byId('golden-stage'),
      goldenFields: byId('golden-fields'),
      goldenToggle: byId('golden-toggle'),
      goldenStatus: byId('golden-status'),
      pgFonts: byId('pg-fonts'),
      pgStyles: byId('pg-styles'),
      pgPalette: byId('pg-palette'),
      pgSurprise: byId('pg-surprise'),
      pgStage: byId('pg-stage'),
      pgFields: byId('pg-fields'),
      pgOverlay: byId('pg-overlay'),
      pgCopy: byId('pg-copy'),
      pgPlate: byId('pg-plate'),
      pgHeadline: byId('pg-headline'),
      pgFontWhy: byId('pg-font-why'),
      pgStyleWhy: byId('pg-style-why'),
      pgPaletteWhy: byId('pg-palette-why')
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
      if (!requested) openDialog(el.searchDialog, el.searchInput);
    } catch (error) {
      el.plateNumber.textContent = "THE ROOM COULD NOT OPEN";
      el.plateNames.textContent = "Colour data is unavailable.";
      el.plateReading.textContent = "Serve this repository over HTTP and try again.";
      el.status.textContent = `Palette failed to load: ${error.message}`;
    }
  }

  init();
})();
