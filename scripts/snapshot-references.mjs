#!/usr/bin/env node
// Writes mcp/data/references.json from the public, robots-allowed endpoints only.
// Stores metadata and links, never images or prose. Artvee (robots blocks AI crawlers)
// and the eMuseum demo (Cloudflare challenge) are link lists written by hand, never fetched.
import {writeFile, mkdir} from 'node:fs/promises';

const UA = 'palette-reference-snapshot/1.0 (+https://colors.nonarkara.org; one-shot, metadata only)';
const now = new Date().toISOString();
const sleep = ms => new Promise(r => setTimeout(r, ms));
const get = async (url, accept = 'application/json') => {
  const res = await fetch(url, {headers: {'User-Agent': UA, Accept: accept}});
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return accept.includes('json') ? res.json() : res.text();
};

async function cari() {
  const out = [];
  for (let page = 0; ; page++) {
    const data = await get(`https://cari.institute/api/aesthetics?page=${page}`);
    for (const group of data.content) for (const items of Object.values(group)) for (const a of items) {
      out.push({source: 'cari', name: a.name, start: a.startYear, end: a.endYear, decade: a.decadeYear,
        url: `https://cari.institute/aesthetics/${a.urlSlug}`});
    }
    if (page + 1 >= data.page.totalPages) break;
    await sleep(1000);
  }
  return out;
}

async function designReviewed() {
  const out = [];
  for (const taxonomy of ['design-movement', 'decade', 'country', 'format', 'designer']) {
    for (let page = 1; ; page++) {
      const res = await fetch(`https://designreviewed.com/wp-json/wp/v2/${taxonomy}?per_page=100&page=${page}&_fields=name,count,link`,
        {headers: {'User-Agent': UA, Accept: 'application/json'}});
      if (res.status === 400) break; // past the last page
      if (!res.ok) throw new Error(`${res.status} ${taxonomy} p${page}`);
      const rows = await res.json();
      for (const t of rows) if (t.count) out.push({source: 'designreviewed', kind: taxonomy,
        name: t.name.replace(/&amp;/g, '&'), count: t.count, url: t.link});
      await sleep(2000); // their robots asks crawlers for 10s; we make ~12 calls once
      if (rows.length < 100) break;
    }
  }
  return out;
}

async function gurafiku() {
  const xml = await get('https://gurafiku.tumblr.com/rss', 'application/rss+xml');
  const unescape = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
    const caption = unescape(item.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? '')
      .match(/<p>([\s\S]*?)<br\/?>/)?.[1]?.trim() ?? '';
    const tags = [...item.matchAll(/<category>(.*?)<\/category>/g)].map(m => m[1]);
    const [kindWork, ...rest] = caption.split('. ');
    const year = caption.match(/(\d{4})\s*$/)?.[1] ?? null;
    return {source: 'gurafiku', name: kindWork, designer: rest.slice(0, -1).join('. ') || 'Not listed',
      year, tags, url: item.match(/<link>(.*?)<\/link>/)[1]};
  });
}

// Hand-curated, never fetched. Verified paths from a human-browser read on 2026-10-12.
const artvee = [
  ['Posters', '/c/posters/'], ['Illustration', '/c/illustration/'], ['Abstract', '/c/abstract/'], ['Drawings', '/c/drawings/'],
  ['Books & Wall Charts', '/books-wall-charts/'],
  ['Art Nouveau', '/movement/art-nouveau/'], ['Art Deco', '/movement/art-deco/'], ['Symbolism', '/movement/symbolism/'],
  ['Expressionism', '/movement/expressionism/'], ['Cubism', '/movement/cubism/'], ['Post-Impressionism', '/movement/post-impressionism/'],
  ['Japanese', '/culture/japanese/'], ['Czech', '/culture/czech/'], ['Polish', '/culture/polish/'], ['Swiss', '/culture/swiss/'],
  ['Advertising', '/topics/advertising/'], ['Propaganda', '/topics/propaganda/'], ['Geometric', '/topics/geometric/'], ['Asian Art', '/topics/asian-art/'],
  ['Travel Posters', '/collection/travel-posters/'], ['Beverage Posters', '/collection/beverage-posters/'],
  ['Theatrical Posters', '/collection/theatrical-posters/'], ['WPA Posters', '/collection/wpa-posters/'],
  ['Wiener Werkstätte Illustrations', '/collection/wiener-werkstatte-illustrations/'],
  ['Scandinavian Postcards', '/collection/scandinavian-postcards/'], ['Polish Postcards', '/collection/polish-postcards/'],
  ['Circus Lithographs', '/collection/circus-lithographs/'], ['Ex Libris', '/collection/ex-libris/'],
  ['Pictorial Cartography', '/collection/pictorial-cartography/'],
].map(([name, path]) => ({source: 'artvee', name, url: `https://artvee.com${path}`}));

const emuseum = [
  {source: 'emuseum', name: 'eMuseum demo collections', url: 'https://demo.emuseum.com/collections'},
  {source: 'emuseum', name: 'eMuseum API (documented shape: /search/<q>/objects/json, /collections/<id>/objects/json)',
    url: 'https://help.gallerysystems.com/emuseum/emuseum-api'},
];

const rights = {
  cari: 'Research and reference only; metadata stored, images not. Credit cari.institute.',
  designreviewed: 'Taxonomy names, counts and links only. Artefact images are rights-reserved; reproduction by request.',
  gurafiku: 'Captions and tags from the public RSS (20 posts, 2018-19). Works are the designers\' copyright.',
  artvee: 'Link only. robots.txt disallows AI crawlers; never fetch. Public-domain claims are per image.',
  emuseum: 'Link only. Demo sits behind a Cloudflare challenge; each institution sets its own rights.',
};

const [c, d, g] = [await cari(), await designReviewed(), await gurafiku()];
await mkdir(new URL('../mcp/data/', import.meta.url), {recursive: true});
await writeFile(new URL('../mcp/data/references.json', import.meta.url),
  JSON.stringify({fetched_at: now, rights, entries: [...c, ...d, ...g, ...artvee, ...emuseum]}, null, 1) + '\n');
console.log(`cari ${c.length} · designreviewed ${d.length} · gurafiku ${g.length} · artvee ${artvee.length} links · emuseum ${emuseum.length} links`);
