// Mechanical export of original skill writing, never book scans or extracts.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const source = process.argv[2];
if (!source) throw new Error('Usage: node scripts/sync-typography-guide.mjs /path/to/bringhurst-contextual-type');
const files = ['SKILL.md', 'references/source-and-proof.md'];
const parts = [];
for (const file of files) {
  const text = await readFile(path.join(source, file), 'utf8');
  const target = path.join('skills/bringhurst-contextual-type', file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, text);
  parts.push(text);
}
const guide = parts.join('\n\n---\n\n').replaceAll(
  '(references/source-and-proof.md)', '(#source-and-proof--2026-10-02)'
);
await writeFile('TYPOGRAPHY-FIELD-GUIDE.md', guide);
console.log('Exported contextual typography skill, ledger and standalone guide.');
