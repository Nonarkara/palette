import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Client} from '../mcp/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import {StdioClientTransport} from '../mcp/node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js';

const server = new URL('../mcp/index.mjs', import.meta.url).pathname;
const colors = JSON.parse(await readFile(new URL('../data/colors.json', import.meta.url), 'utf8'));
const plates = new Set(colors.flatMap(c => c.combinations));

test('humanized-design MCP answers a brief over stdio with real, era-matched sources', async () => {
  const client = new Client({name: 'test', version: '0'});
  await client.connect(new StdioClientTransport({command: process.execPath, args: [server]}));
  try {
    const {tools} = await client.listTools();
    assert.deepEqual(tools.map(t => t.name).sort(), ['design_brief', 'humanize_rules', 'search_references']);
    const res = await client.callTool({name: 'design_brief', arguments: {intent: 'poster', era: '1960s', mood: 'calm'}});
    const brief = JSON.parse(res.content[0].text);
    assert.ok(brief.aesthetics.length && brief.aesthetics.every(a => a.source === 'cari' && a.url.startsWith('https://cari.institute/aesthetics/')));
    assert.ok(brief.aesthetics.some(a => a.name === 'Supergraphic Ultramodern'), '1960s brief must include a 1960s aesthetic');
    assert.equal(brief.design_reviewed.decade[0]?.name, '1960s');
    assert.ok(brief.design_reviewed.movements.length);
    assert.equal(brief.wada_plates.length, 3);
    assert.ok(brief.wada_plates.every(p => plates.has(p.plate)), 'plates must exist in the Wada data');
    assert.ok(brief.public_domain_links.every(l => l.source === 'artvee' && !('fetched' in l)), 'Artvee is link-only');
    assert.match(brief.overrides, /zero border-radius/);
  } finally {
    await client.close();
  }
});
