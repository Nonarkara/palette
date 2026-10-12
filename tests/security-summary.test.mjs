import test from "node:test";
import assert from "node:assert/strict";

import { isSecretResult, severityOf, summarize } from "../.github/scripts/security-summary.mjs";

const SECRET = "EXAMPLESECRETVALUE" + "1234567890";
const BANNER = "-----BEGIN " + "RSA PRIVATE KEY-----";

function sarif() {
  return {
    version: "2.1.0",
    runs: [
      {
        tool: {
          driver: {
            name: "Trivy",
            rules: [
              {
                id: "private-key",
                name: "Secret",
                shortDescription: { text: "Asymmetric Private Key" },
                fullDescription: { text: `${BANNER}\n${SECRET}` },
                help: { text: `Match: ${SECRET}` },
                properties: {
                  tags: ["secret", "security", "CRITICAL"],
                  "security-severity": "9.5",
                },
              },
              {
                id: "CVE-2024-0001",
                name: "vulnerability",
                shortDescription: { text: "Example vulnerability" },
                properties: {
                  tags: ["vulnerability", "security", "HIGH"],
                  "security-severity": "8.0",
                },
              },
            ],
          },
        },
        results: [
          {
            ruleId: "private-key",
            ruleIndex: 0,
            level: "error",
            message: { text: `Artifact: app.js\nSecret Asymmetric Private Key\nMatch: ${SECRET}` },
            locations: [
              {
                physicalLocation: {
                  artifactLocation: { uri: "/src/app.js", uriBaseId: "%SRCROOT%" },
                  region: { startLine: 4, snippet: { text: `const key = "${SECRET}"` } },
                },
              },
            ],
          },
          {
            ruleId: "CVE-2024-0001",
            ruleIndex: 1,
            level: "error",
            message: { text: "Package: playwright\nInstalled Version: 1.63.0\nSeverity: HIGH" },
            locations: [
              {
                physicalLocation: {
                  artifactLocation: { uri: "package-lock.json" },
                  region: { startLine: 18 },
                },
              },
            ],
          },
        ],
      },
    ],
  };
}

test("summary omits secret values and keeps file, line, and rule", () => {
  const report = summarize({
    semgrep: null,
    trivy: sarif(),
    semgrepOk: false,
    trivyOk: true,
    root: "/workspace",
  });
  const serialized = `${report.markdown}\n${JSON.stringify(report.trivySarif)}`;
  assert.equal(serialized.includes(SECRET), false);
  assert.equal(serialized.includes(BANNER), false);
  assert.match(report.markdown, /app\.js:4/);
  assert.match(report.markdown, /private-key/);
  assert.match(report.markdown, /package-lock\.json:18/);
  assert.match(report.markdown, /CVE-2024-0001/);
  assert.match(report.markdown, /\| Critical \| 1 \|/);
  assert.match(report.markdown, /\| High \| 1 \|/);
  const secretResult = report.trivySarif.runs[0].results[0];
  assert.equal(secretResult.locations[0].physicalLocation.region.snippet, undefined);
  assert.equal(secretResult.locations[0].physicalLocation.artifactLocation.uri, "app.js");
  assert.equal(report.trivySarif.runs[0].tool.driver.rules[0].fullDescription.text.includes(SECRET), false);
});

test("warning findings stay medium when a tag only says high confidence", () => {
  const rule = {
    id: "yaml.github-actions.security.github-actions-mutable-action-tag.github-actions-mutable-action-tag",
    defaultConfiguration: { level: "warning" },
    properties: { tags: ["HIGH CONFIDENCE", "security"] },
  };
  const result = { ruleId: rule.id, properties: {} };
  assert.equal(severityOf(result, rule), "medium");
  assert.equal(isSecretResult(result, rule), false);
});
