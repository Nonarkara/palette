// Layout gates for the colour field. A failure is a placement fault.
// It is not a taste score. Source note: CREDITS.md.

export const GATES = {
  latinMeasureMin: 50,
  latinMeasureMax: 75,
  bodyLeadingMin: 1.4,
  bodyLeadingMax: 1.6,
  focalRatioMin: 1.15,
  clusterMaxOfFocal: 0.42,
  anchorInset: 112,
  edgeSlack: 0.5,
  alignSlack: 1,
};

export function srgbLuminance(hex) {
  const value = String(hex).replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(value)) throw new Error(`expected a 6-digit hex, received ${hex}`);
  const channel = (byte) => {
    const s = byte / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const r = channel(Number.parseInt(value.slice(0, 2), 16));
  const g = channel(Number.parseInt(value.slice(2, 4), 16));
  const b = channel(Number.parseInt(value.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Darker and brighter both weigh more than a middle value. Density is how
// much information is packed into the same area. Area still dominates, so a
// quiet field stays heavier than its label.
export function visualWeight(region) {
  const area = region.width * region.height;
  const punch = 0.25 + Math.abs(region.luminance - 0.5) * 1.5;
  return area * punch * (region.density ?? 1);
}

function area(region) {
  return region.width * region.height;
}

function nearly(a, b, slack) {
  return Math.abs(a - b) <= slack;
}

export function lineRunsToFrame(line, frame, slack = GATES.edgeSlack) {
  const vertical = nearly(line.x1, line.x2, slack);
  const horizontal = nearly(line.y1, line.y2, slack);
  if (vertical === horizontal) return false;
  if (vertical) {
    const x = line.x1;
    const top = Math.min(line.y1, line.y2);
    const bottom = Math.max(line.y1, line.y2);
    return x >= frame.x - slack
      && x <= frame.x + frame.width + slack
      && nearly(top, frame.y, slack)
      && nearly(bottom, frame.y + frame.height, slack);
  }
  const y = line.y1;
  const left = Math.min(line.x1, line.x2);
  const right = Math.max(line.x1, line.x2);
  return y >= frame.y - slack
    && y <= frame.y + frame.height + slack
    && nearly(left, frame.x, slack)
    && nearly(right, frame.x + frame.width, slack);
}

export function groupSharesEdge(boxes, slack = GATES.alignSlack) {
  if (boxes.length < 2) return true;
  const left = boxes.every((box) => nearly(box.x, boxes[0].x, slack));
  const top = boxes.every((box) => nearly(box.y, boxes[0].y, slack));
  return left || top;
}

export function interiorGap(boxes, slack = GATES.alignSlack) {
  if (boxes.length < 2) return 0;
  const shareLeft = boxes.every((box) => nearly(box.x, boxes[0].x, slack));
  const sorted = [...boxes].sort((a, b) => (shareLeft ? a.y - b.y : a.x - b.x));
  let max = 0;
  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1];
    const gap = shareLeft
      ? sorted[index].y - (previous.y + previous.height)
      : sorted[index].x - (previous.x + previous.width);
    max = Math.max(max, gap);
  }
  return max;
}

function bounds(boxes) {
  const x = Math.min(...boxes.map((box) => box.x));
  const y = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.width));
  const bottom = Math.max(...boxes.map((box) => box.y + box.height));
  return { x, y, width: right - x, height: bottom - y };
}

function separation(a, b) {
  const dx = a.x > b.x + b.width ? a.x - (b.x + b.width) : b.x > a.x + a.width ? b.x - (a.x + a.width) : 0;
  const dy = a.y > b.y + b.height ? a.y - (b.y + b.height) : b.y > a.y + a.height ? b.y - (a.y + a.height) : 0;
  return Math.hypot(dx, dy);
}

export function proximityHolds(boxes, others, slack = GATES.alignSlack) {
  if (boxes.length < 2 || others.length === 0) return true;
  const inside = interiorGap(boxes, slack);
  const outside = Math.min(...others.map((box) => separation(bounds(boxes), box)));
  return inside < outside;
}

function overlaps(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export function sitsOnAnchor(boxes, anchors, inset = GATES.anchorInset, slack = GATES.alignSlack) {
  if (boxes.length === 0) return false;
  const shareLeft = boxes.length < 2 || boxes.every((box) => nearly(box.x, boxes[0].x, slack));
  const shareTop = boxes.length < 2 || boxes.every((box) => nearly(box.y, boxes[0].y, slack));
  const edge = shareLeft ? boxes[0].x : shareTop ? boxes[0].y : null;
  const lines = shareLeft ? anchors.x : shareTop ? anchors.y : null;
  if (edge == null || !lines) return false;
  return lines.some((line) => Math.abs(edge - line) <= inset + slack);
}

export function latinBodyFits(measureCh, leading) {
  return measureCh >= GATES.latinMeasureMin
    && measureCh <= GATES.latinMeasureMax
    && leading >= GATES.bodyLeadingMin
    && leading <= GATES.bodyLeadingMax;
}

export function plateFrame({ width, height, rail, shares, luminance = 0.5, density = 1 }) {
  const frame = { x: 0, y: 0, width: width - rail, height };
  let cursor = 0;
  const fields = shares.map((share, index) => {
    const last = index === shares.length - 1;
    const fieldWidth = last ? frame.width - cursor : Math.round(frame.width * share);
    const field = {
      id: `field-${index}`,
      x: cursor,
      y: 0,
      width: fieldWidth,
      height,
      luminance,
      density,
    };
    cursor += fieldWidth;
    return field;
  });
  const lines = [];
  for (let index = 0; index < fields.length - 1; index += 1) {
    const cut = fields[index].x + fields[index].width;
    lines.push({ x1: cut, y1: frame.y, x2: cut, y2: frame.y + frame.height });
  }
  return { frame, fields, lines, groups: [] };
}

export function balanceExample({
  fieldShare = 0.618,
  width = 640,
  height = 352,
  inset = 16,
  clusterWidth = 180,
  clusterHeight = 112,
} = {}) {
  const dominantWidth = Math.round(width * fieldShare);
  const fields = [
    { id: "dominant", x: 0, y: 0, width: dominantWidth, height, luminance: 0.55, density: 1 },
    { id: "counter", x: dominantWidth, y: 0, width: width - dominantWidth, height, luminance: 0.06, density: 1 },
  ];
  const cluster = {
    x: inset,
    y: height - inset - clusterHeight,
    width: clusterWidth,
    height: clusterHeight,
    luminance: 0.08,
    density: 2,
  };
  return {
    frame: { x: 0, y: 0, width, height },
    fields,
    lines: [{ x1: dominantWidth, y1: 0, x2: dominantWidth, y2: height }],
    cluster,
    groups: [{
      id: "names",
      boxes: [0, 1, 2, 3].map((index) => ({
        x: inset,
        y: cluster.y + index * 26,
        width: clusterWidth - 8,
        height: 22,
      })),
    }],
  };
}

function anchorsFor(model) {
  const x = [model.frame.x, model.frame.x + model.frame.width];
  const y = [model.frame.y, model.frame.y + model.frame.height];
  for (const field of model.fields) {
    x.push(field.x, field.x + field.width);
    y.push(field.y, field.y + field.height);
  }
  return { x, y };
}

export function reviewComposition(model) {
  const failures = [];
  const areas = model.fields.map(area).sort((left, right) => right - left);
  if (areas.length === 0 || model.fields.filter((field) => area(field) === areas[0]).length !== 1) {
    failures.push("focal-mass");
  } else if (areas.length > 1 && areas[0] < areas[1] * GATES.focalRatioMin) {
    failures.push("focal-mass");
  }
  for (const line of model.lines) {
    if (!lineRunsToFrame(line, model.frame)) failures.push("line-to-edge");
  }
  const anchors = anchorsFor(model);
  for (const group of model.groups ?? []) {
    if (!groupSharesEdge(group.boxes)) failures.push(`alignment:${group.id}`);
    if (!sitsOnAnchor(group.boxes, anchors)) failures.push(`anchor:${group.id}`);
    const others = (model.groups ?? [])
      .filter((item) => item.id !== group.id)
      .flatMap((item) => item.boxes);
    if (!proximityHolds(group.boxes, others)) failures.push(`proximity:${group.id}`);
  }
  if (model.cluster) {
    const focal = model.fields.reduce((best, field) => (area(field) > area(best) ? field : best));
    if (area(model.cluster) >= area(focal) * GATES.clusterMaxOfFocal) failures.push("cluster-too-large");
    if (!overlaps(model.cluster, focal)) failures.push("cluster-off-focal");
    if ((model.cluster.density ?? 1) <= (focal.density ?? 1)) failures.push("cluster-not-denser");
    if (visualWeight(focal) <= visualWeight(model.cluster)) failures.push("field-not-heavier");
  }
  return { ok: failures.length === 0, failures: [...new Set(failures)] };
}
