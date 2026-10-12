#!/usr/bin/env node
// Humanized-design MCP. Offline: reads ./data/references.json (refresh with
// scripts/snapshot-references.mjs) and the Wada plates in ../data/colors.json.
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {z} from 'zod';

const root = new URL('../', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');
const refs = JSON.parse(read('mcp/data/references.json'));

// Reuse the site's own Wada search, loaded the same way tests/tools.test.mjs does.
const ctx = {window: {}};
for (const file of ['content.js', 'palette-tools.js', 'app.js']) {
  let src = read(file);
  if (file === 'app.js') src = src.replace('  init();', '  window.buildPalettes = buildPalettes;');
  vm.runInNewContext(src, ctx);
}
const palettes = ctx.window.buildPalettes(JSON.parse(read('data/colors.json')));
const wada = (query, n = 3) => ctx.window.PALETTE_TOOLS.search(palettes, query).results.slice(0, n)
  .map(p => ({plate: p.id, colors: p.colors.map(c => ({name: c.name, hex: c.hex})),
    url: `https://colors.nonarkara.org/#${p.id}`, note: 'Hex is the credited digital conversion, not the printed ink.'}));

export const RULES = [
  'Date things the way people remember them: "Mid 1960s – Early 1970s", "1968". Show an era, not a timestamp. (CARI, Design Reviewed)',
  'Credit the maker on every item. When unknown, print "Designer: Not listed" — never hide the row. (Design Reviewed, Gurafiku)',
  'Give names a story: where the name came from, who coined it, when it was renamed. (CARI namesake lines)',
  'One typeface does all the work; hierarchy by weight, size and case only. Never Inter/Roboto/Poppins/Montserrat/Open Sans/Lato. (Design Reviewed, CARI)',
  'Neutral shell, loud contents: greys, white, hairlines, at most one accent. Let the artefact carry the colour. (CARI, Design Reviewed, Artvee)',
  'Catalogue-card metadata: kicker, literal title ("Forum, Vol 20, No. 02"), a fixed Format / Designer / Year list, plain link text. (Design Reviewed)',
  'Equal-tile contact sheets, cover-cropped, square corners; hover by opacity, never lift or shadow. (CARI gallery, house law)',
  'Facets are navigation: decade, country, format, movement, maker — each with a count. (Design Reviewed, Artvee)',
  'Limited ink, flat colour: 3–5 spot colours, overprint allowed, no gradients or glow. Use a Wada plate as the ink set. (Design Reviewed ephemera, Artvee lithographs, Wada)',
  'Lettering is part of the image — large, cropped, set into the composition — not a caption under a picture. (Artvee posters, Gurafiku)',
  'Negative space is a shape. One focal image; empty field does structural work; no filler. (Gurafiku: Matsunaga, Ishioka, Tanaka)',
  'Show provenance and real wear: the source volume, the scan edge, the fold. Never fake distress. (Design Reviewed, house wabi-sabi rule)',
  'Cross-link lineage: "related to", "influenced", "revived as". A curator\'s voice, not a feed. (CARI related aesthetics)',
  'State reuse plainly: what may be reused, by whom, and the credit line. (CARI, Design Reviewed, Artvee footers)',
];
export const OVERRIDES = 'House law wins: zero border-radius except true circles, no gradients except a dark photo overlay, no drop shadows, max three text sizes, non-looped Thai. Era gloss (Frutiger Aero, Y2K chrome, CARI\'s own rounded tiles) is history to cite, not a style to reproduce. Nostalgia comes from dates, flat ink, type, provenance and Wada colour.';

const tokens = s => (s ?? '').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(t => t.length > 2);
const yearOf = (label, end) => {
  if (/current/i.test(label ?? '')) return new Date().getFullYear();
  const m = (label ?? '').match(/(Early|Mid|Late)?\s*(\d{4})s?/i);
  if (!m) return null;
  return +m[2] + ({early: end ? 2 : 0, mid: end ? 6 : 3, late: end ? 9 : 7}[m[1]?.toLowerCase()] ?? (end ? 9 : 0));
};
const decadeOf = era => { const m = (era ?? '').match(/(\d{3})\d/); return m ? +(m[1] + '0') : null; };
const inEra = (e, d) => {
  if (d == null) return true;
  if (e.source === 'cari') { const s = yearOf(e.start), t = yearOf(e.end, true); return s != null && s <= d + 9 && (t ?? s) >= d; }
  if (e.year) return +e.year >= d && +e.year <= d + 9;
  if (e.tags) return e.tags.includes(`${d}s`);
  return true;
};
const hay = e => [e.name, e.kind, e.designer, ...(e.tags ?? [])].join(' ').toLowerCase();

export function searchReferences({query = '', source, decade, limit = 20}) {
  const terms = tokens(query), d = decadeOf(decade);
  return refs.entries
    .filter(e => (!source || e.source === source) && inEra(e, d))
    .map(e => ({e, score: terms.filter(t => hay(e).includes(t)).length + (e.count ?? 0) / 1e4}))
    .filter(x => !terms.length || x.score >= 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit).map(x => x.e);
}

export function designBrief({intent, era, mood}) {
  const q = [intent, mood].filter(Boolean).join(' ');
  const d = decadeOf(era);
  const pick = (source, extra = {}, n = 6) => {
    const hits = searchReferences({query: q, source, decade: era, limit: n, ...extra});
    if (hits.length) return hits;
    const eraOnly = searchReferences({source, decade: era, limit: n, ...extra});
    return eraOnly.length ? eraOnly : searchReferences({query: q, source, limit: n, ...extra}); // archive has nothing from that era
  };
  const dr = refs.entries.filter(e => e.source === 'designreviewed');
  const top = (kind, n) => dr.filter(e => e.kind === kind).sort((a, b) => b.count - a.count).slice(0, n);
  const plates = wada(mood || intent);
  return {
    intent, era: era ?? null, mood: mood ?? null,
    method: 'Pick ONE era and ONE reference below. Compose from it, then audit the draft against `rules` before shipping.',
    rules: RULES, overrides: OVERRIDES,
    aesthetics: pick('cari', {}, 12),
    design_reviewed: {
      decade: d != null ? dr.filter(e => e.kind === 'decade' && e.name === `${d}s`) : [],
      movements: searchReferences({query: q, source: 'designreviewed', limit: 40}).filter(e => e.kind === 'design-movement').slice(0, 5)
        .concat(top('design-movement', 5)).filter((e, i, a) => a.indexOf(e) === i).slice(0, 6),
      designers_to_study: top('designer', 8),
    },
    japanese_graphics: pick('gurafiku', {}, 5),
    public_domain_links: pick('artvee', {}, 5),
    museum_links: refs.entries.filter(e => e.source === 'emuseum'),
    wada_plates: plates.length ? plates : wada('quiet'),
    rights: refs.rights,
    snapshot: refs.fetched_at,
  };
}

const json = data => ({content: [{type: 'text', text: JSON.stringify(data, null, 1)}]});
const server = new McpServer({name: 'humanized-design', version: '0.1.0'});
server.registerTool('design_brief', {
  description: 'Start any visual design here. Returns humanized-design rules, era-matched human-curated references (CARI aesthetics, Design Reviewed, Gurafiku, Artvee, eMuseum) and three Sanzo Wada colour plates.',
  inputSchema: {intent: z.string().describe('What is being designed, e.g. "festival poster", "dashboard header", "book cover"'),
    era: z.string().optional().describe('Decade for nostalgia, e.g. "1960s"'), mood: z.string().optional().describe('Mood or colour words, e.g. "calm", "red and black", "สงบ"')},
}, async args => json(designBrief(args)));
server.registerTool('search_references', {
  description: 'Search the snapshot of human-curated design references by keyword, source and decade. Returns credited entries with links.',
  inputSchema: {query: z.string().optional(), source: z.enum(['cari', 'designreviewed', 'gurafiku', 'artvee', 'emuseum']).optional(),
    decade: z.string().optional(), limit: z.number().int().min(1).max(100).optional()},
}, async args => json(searchReferences(args)));
server.registerTool('humanize_rules', {
  description: 'The humanized-design checklist and house overrides. Use as an audit pass on a draft before shipping.',
  inputSchema: {},
}, async () => json({rules: RULES, overrides: OVERRIDES}));

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await server.connect(new StdioServerTransport());
