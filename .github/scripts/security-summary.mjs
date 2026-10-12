import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SEVERITIES = ["critical", "high", "medium", "low", "unknown"];
const TOP_LIMIT = 20;

const SECRET_VALUE =
  /-----BEGIN [A-Z ]*PRIVATE KEY-----|\bAKIA[0-9A-Z]{16}\b|\bghp_[A-Za-z0-9]{20,}\b|\bgithub_pat_[A-Za-z0-9_]{20,}\b|\bxox[baprs]-[A-Za-z0-9-]{10,}\b|\bsk_live_[A-Za-z0-9]{8,}\b/i;

function secretId(id) {
  const text = String(id || "").toLowerCase();
  return (
    text.includes("secret") ||
    text.includes("private-key") ||
    text.includes("private_key") ||
    text.includes("access-key") ||
    text.includes("access_key") ||
    text.includes("api-key") ||
    text.includes("api_key") ||
    text.includes("passwd") ||
    text.includes("password") ||
    text.includes("credential")
  );
}

function tagsOf(value) {
  const tags = value?.properties?.tags;
  if (!Array.isArray(tags)) return [];
  return tags.map((tag) => String(tag).toLowerCase());
}

export function isSecretRule(rule) {
  if (!rule) return false;
  const tags = tagsOf(rule);
  if (tags.includes("secret") || tags.includes("secrets")) return true;
  const name = String(rule.name || "").toLowerCase();
  if (name === "secret" || name === "secrets") return true;
  return secretId(rule.id);
}

export function isSecretResult(result, rule) {
  if (isSecretRule(rule)) return true;
  if (secretId(result?.ruleId)) return true;
  const tags = tagsOf(result);
  if (tags.includes("secret") || tags.includes("secrets")) return true;
  const message = result?.message?.text || "";
  if (/\nMatch:/.test(message) && /secret/i.test(message)) return true;
  return false;
}

export function severityOf(result, rule) {
  const scoreText =
    result?.properties?.["security-severity"] ?? rule?.properties?.["security-severity"];
  if (scoreText !== undefined && scoreText !== null && String(scoreText) !== "") {
    const score = Number(scoreText);
    if (!Number.isNaN(score)) {
      if (score >= 9) return "critical";
      if (score >= 7) return "high";
      if (score >= 4) return "medium";
      if (score > 0) return "low";
      return "unknown";
    }
  }
  const level = String(result?.level || rule?.defaultConfiguration?.level || "").toLowerCase();
  if (level === "error") return "high";
  if (level === "warning") return "medium";
  if (level === "note" || level === "none") return "low";
  const tags = [...tagsOf(result), ...tagsOf(rule)];
  for (const name of ["critical", "high", "medium", "low"]) {
    if (tags.includes(name)) return name;
  }
  return "unknown";
}

export function relativize(uri, root) {
  let value = String(uri || "");
  if (value.startsWith("file://")) value = value.slice("file://".length);
  try {
    value = decodeURIComponent(value);
  } catch {
    // Keep the raw URI if it is not encoded.
  }
  const roots = [root, "/src", "/github/workspace"].filter(Boolean);
  for (const candidate of roots) {
    const normalized = candidate.replace(/\/+$/, "");
    if (!normalized) continue;
    if (value === normalized) return ".";
    if (value.startsWith(`${normalized}/`)) return value.slice(normalized.length + 1);
  }
  return value.replace(/^\.\//, "");
}

function rulesFor(run) {
  const rules = [];
  const driverRules = run?.tool?.driver?.rules;
  if (Array.isArray(driverRules)) rules.push(...driverRules);
  const extensions = run?.tool?.extensions;
  if (Array.isArray(extensions)) {
    for (const extension of extensions) {
      if (Array.isArray(extension?.rules)) rules.push(...extension.rules);
    }
  }
  return rules;
}

function ruleFor(run, result) {
  const rules = rulesFor(run);
  if (Number.isInteger(result?.ruleIndex) && rules[result.ruleIndex]) {
    const indexed = rules[result.ruleIndex];
    if (!result.ruleId || indexed.id === result.ruleId) return indexed;
  }
  return rules.find((rule) => rule.id === result?.ruleId) || null;
}

function locationOf(result, root) {
  const physical = result?.locations?.[0]?.physicalLocation;
  const uri = physical?.artifactLocation?.uri || "(unknown file)";
  const line = physical?.region?.startLine;
  const file = relativize(uri, root);
  return {
    file,
    line: Number.isInteger(line) ? line : null,
    label: Number.isInteger(line) ? `${file}:${line}` : file,
  };
}

function plainMessage(text) {
  const collapsed = String(text || "").replace(/\s+/g, " ").trim();
  if (!collapsed) return "";
  if (SECRET_VALUE.test(collapsed) || /\bMatch:/.test(collapsed)) return "";
  if (collapsed.length <= 280) return collapsed;
  return `${collapsed.slice(0, 277)}...`;
}

function emptyCounts() {
  return Object.fromEntries(SEVERITIES.map((name) => [name, 0]));
}

function scrubLocation(location, root, secret) {
  if (!location?.physicalLocation) return location;
  const copy = structuredClone(location);
  const physical = copy.physicalLocation;
  if (physical.artifactLocation?.uri) {
    physical.artifactLocation.uri = relativize(physical.artifactLocation.uri, root);
    delete physical.artifactLocation.uriBaseId;
  }
  if (secret && physical.region) delete physical.region.snippet;
  if (secret && physical.contextRegion) delete physical.contextRegion;
  if (secret && copy.message) delete copy.message;
  return copy;
}

function scrubRule(rule) {
  if (!isSecretRule(rule)) return rule;
  const copy = structuredClone(rule);
  const replacement = { text: "Secret rule. The matched value was omitted." };
  copy.fullDescription = replacement;
  copy.help = { text: replacement.text };
  if (copy.shortDescription?.text && SECRET_VALUE.test(copy.shortDescription.text)) {
    copy.shortDescription = { text: "Secret type omitted." };
  }
  return copy;
}

function scrubResult(result, rule, root) {
  const secret = isSecretResult(result, rule);
  if (!secret) {
    const copy = structuredClone(result);
    copy.locations = (copy.locations || []).map((location) => scrubLocation(location, root, false));
    return copy;
  }
  const properties = {};
  if (result.properties?.["security-severity"] != null) {
    properties["security-severity"] = result.properties["security-severity"];
  }
  if (Array.isArray(result.properties?.tags)) properties.tags = result.properties.tags;
  const scrubbed = {
    ruleId: result.ruleId,
    level: result.level,
    message: { text: "Secret finding. The matched value was omitted." },
    locations: (result.locations || []).map((location) => scrubLocation(location, root, true)),
    properties,
  };
  if (Number.isInteger(result.ruleIndex)) scrubbed.ruleIndex = result.ruleIndex;
  return scrubbed;
}

export function sanitizeSarif(sarif, root) {
  const copy = structuredClone(sarif);
  for (const run of copy.runs || []) {
    const rules = rulesFor(run);
    if (Array.isArray(run.tool?.driver?.rules)) {
      run.tool.driver.rules = run.tool.driver.rules.map((rule) => scrubRule(rule));
    }
    if (Array.isArray(run.tool?.extensions)) {
      for (const extension of run.tool.extensions) {
        if (Array.isArray(extension.rules)) {
          extension.rules = extension.rules.map((rule) => scrubRule(rule));
        }
      }
    }
    run.results = (run.results || []).map((result) => {
      const rule = ruleFor({ tool: { driver: { rules } } }, result);
      return scrubResult(result, rule, root);
    });
  }
  return copy;
}

function collect(sarif, toolName, root) {
  const findings = [];
  const counts = emptyCounts();
  for (const run of sarif?.runs || []) {
    for (const result of run.results || []) {
      const rule = ruleFor(run, result);
      const severity = severityOf(result, rule);
      counts[severity] += 1;
      const location = locationOf(result, root);
      const secret = isSecretResult(result, rule);
      findings.push({
        tool: toolName,
        severity,
        location: location.label,
        file: location.file,
        line: location.line,
        rule: result.ruleId || rule?.id || "(unknown rule)",
        secret,
        message: secret ? "" : plainMessage(result.message?.text),
      });
    }
  }
  return { counts, findings };
}

function countTable(counts) {
  const lines = ["| Severity | Count |", "| --- | ---: |"];
  for (const name of SEVERITIES) {
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    lines.push(`| ${label} | ${counts[name]} |`);
  }
  return lines.join("\n");
}

function findingLine(finding) {
  if (finding.secret) {
    return `- **${finding.severity}** \`${finding.location}\` \`${finding.rule}\``;
  }
  const detail = finding.message ? ` — ${finding.message}` : "";
  return `- **${finding.severity}** \`${finding.location}\` \`${finding.rule}\`${detail}`;
}

function scanStatus(ok) {
  if (ok === true) return "Scan finished.";
  if (ok === false) return "Scan did not finish. No SARIF uploaded for this tool.";
  return "Scan status was not recorded.";
}

export function summarize({ semgrep, trivy, semgrepOk, trivyOk, root }) {
  const semgrepReport = semgrep
    ? collect(semgrep, "Semgrep OSS", root)
    : { counts: emptyCounts(), findings: [] };
  const trivyReport = trivy ? collect(trivy, "Trivy", root) : { counts: emptyCounts(), findings: [] };
  const findings = [...semgrepReport.findings, ...trivyReport.findings];
  const ranked = findings
    .filter((finding) => finding.severity === "critical" || finding.severity === "high")
    .sort((a, b) => {
      if (a.severity !== b.severity) return a.severity === "critical" ? -1 : 1;
      return a.location.localeCompare(b.location) || a.rule.localeCompare(b.rule);
    });
  const shown = ranked.slice(0, TOP_LIMIT);
  const hidden = ranked.length - shown.length;

  const lines = [
    "# Security scan",
    "",
    "Report only. Findings do not fail this job. Secret values are omitted.",
    "",
    "## Semgrep OSS",
    "",
    scanStatus(semgrepOk),
    "",
    countTable(semgrepReport.counts),
    "",
    "## Trivy",
    "",
    scanStatus(trivyOk),
    "",
    countTable(trivyReport.counts),
    "",
    "## Critical and high findings",
    "",
  ];
  if (shown.length === 0) {
    lines.push("None.");
  } else {
    for (const finding of shown) lines.push(findingLine(finding));
    if (hidden > 0) lines.push("", `${hidden} more critical or high findings were not listed.`);
  }
  lines.push("");
  return {
    markdown: `${lines.join("\n")}\n`,
    findings,
    semgrepSarif: semgrep && semgrepOk !== false ? sanitizeSarif(semgrep, root) : null,
    trivySarif: trivy && trivyOk !== false ? sanitizeSarif(trivy, root) : null,
  };
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const value = argv[index + 1];
    if (value === undefined || value.startsWith("--")) args[key] = true;
    else {
      args[key] = value;
      index += 1;
    }
  }
  return args;
}

async function readSarif(file) {
  if (!file) return null;
  try {
    const text = await readFile(file, "utf8");
    if (!text.trim()) return null;
    const parsed = JSON.parse(text);
    if (!parsed || parsed.version !== "2.1.0" || !Array.isArray(parsed.runs)) {
      throw new Error("SARIF is missing version 2.1.0 runs");
    }
    return parsed;
  } catch (error) {
    if (error && error.code === "ENOENT") return null;
    throw error;
  }
}

function asOk(flag) {
  if (flag === undefined || flag === true) return undefined;
  if (flag === "true" || flag === "success") return true;
  if (flag === "false" || flag === "failure" || flag === "cancelled") return false;
  return undefined;
}

export async function writeSummary(options) {
  const root = options.root || process.cwd();
  let semgrep = null;
  let trivy = null;
  const notes = [];
  try {
    semgrep = await readSarif(options.semgrep);
  } catch (error) {
    notes.push(`Semgrep SARIF could not be read (${error.message}).`);
  }
  try {
    trivy = await readSarif(options.trivy);
  } catch (error) {
    notes.push(`Trivy SARIF could not be read (${error.message}).`);
  }
  const semgrepOk = semgrep ? asOk(options.semgrepOk) ?? true : false;
  const trivyOk = trivy ? asOk(options.trivyOk) ?? true : asOk(options.trivyOk) ?? false;
  const report = summarize({ semgrep, trivy, semgrepOk, trivyOk, root });
  if (notes.length > 0) {
    report.markdown += `${notes.join("\n")}\n`;
  }
  if (options.markdown) await writeFile(options.markdown, report.markdown);
  if (options.summary) await writeFile(options.summary, report.markdown);
  if (report.semgrepSarif && options.semgrepOut) {
    await writeFile(options.semgrepOut, `${JSON.stringify(report.semgrepSarif)}\n`);
  }
  if (report.trivySarif && options.trivyOut) {
    await writeFile(options.trivyOut, `${JSON.stringify(report.trivySarif)}\n`);
  }
  return report;
}

function invokedDirectly() {
  const entry = process.argv[1];
  if (!entry) return false;
  return import.meta.url === pathToFileURL(path.resolve(entry)).href;
}

if (invokedDirectly()) {
  const args = parseArgs(process.argv.slice(2));
  writeSummary({
    semgrep: args.semgrep,
    trivy: args.trivy,
    semgrepOk: args["semgrep-ok"],
    trivyOk: args["trivy-outcome"],
    root: args.root,
    summary: args.summary,
    markdown: args.markdown,
    semgrepOut: args["semgrep-out"],
    trivyOut: args["trivy-out"],
  })
    .then((report) => {
      process.stdout.write(report.markdown);
    })
    .catch((error) => {
      const message = `# Security scan\n\nThe summary could not be written (${error.message}).\n`;
      process.stdout.write(message);
      if (args.summary) writeFile(args.summary, message).catch(() => {});
    });
}
