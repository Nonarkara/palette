// Mechanical export from the canonical skill; no book text or upstream code.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const source = process.argv[2];
if (!source) throw new Error('Usage: node scripts/sync-design-guide.mjs /path/to/bauhaus-human-design');
const files = ['SKILL.md', 'references/field-guide.md', 'references/reading-ledger.md'];
const parts = [];
for (const file of files) {
  const text = await readFile(path.join(source, file), 'utf8');
  const target = path.join('skills/bauhaus-human-design', file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, text);
  parts.push(text);
}
const guide = parts.join('\n\n---\n\n')
  .replaceAll('(references/field-guide.md)', '(#field-guide--authored-functional-design)')
  .replaceAll('(reading-ledger.md)', '(#reading-ledger--2026-10-02)');
await writeFile('DESIGN-FIELD-GUIDE.md', guide);
console.log('Exported skill, references and self-contained design field guide.');
