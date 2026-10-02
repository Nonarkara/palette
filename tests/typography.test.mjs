import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('typography reading chapter has navigation, three scripts and source boundaries', () => {
  const html = readFileSync('reading.html', 'utf8');
  const section = html.match(/<section id="typography"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  assert.ok(html.includes('href="#typography"'));
  for (const text of ['lang="th"', 'lang="zh-Hans"', 'Robert Bringhurst',
    'Selected close reading', 'TYPOGRAPHY-FIELD-GUIDE.md']) assert.ok(section.includes(text), text);
  for (const id of ['method', 'standards', 'language', 'sources', 'take']) {
    assert.ok(html.includes(`id="${id}"`), `preserved ${id}`);
  }
});

test('download embeds its reference and portable skill matches the mechanical export', () => {
  const skill = readFileSync('skills/bringhurst-contextual-type/SKILL.md', 'utf8');
  const reference = readFileSync('skills/bringhurst-contextual-type/references/source-and-proof.md', 'utf8');
  const expected = [skill, reference].join('\n\n---\n\n').replaceAll(
    '(references/source-and-proof.md)', '(#source-and-proof--2026-10-02)');
  assert.equal(readFileSync('TYPOGRAPHY-FIELD-GUIDE.md', 'utf8'), expected);
  assert.ok(expected.includes('# Source and proof / 2026-10-02'));
  assert.ok(!expected.includes('(references/source-and-proof.md)'));
});
