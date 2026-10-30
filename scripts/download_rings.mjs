import fs from 'node:fs';
import path from 'node:path';

const searchTerms = [
  { file: 'oval-diamond-ring.jpg', query: 'oval diamond ring gold' },
  { file: 'emerald-cut-ring.jpg', query: 'emerald cut diamond ring' },
  { file: 'knot-gold-ring.jpg', query: 'knot ring gold' },
  { file: 'maharaja-signet-ring.jpg', query: 'gold signet ring' },
  { file: 'pave-diamond-band.jpg', query: 'pave diamond band ring' },
  { file: 'sculpted-statement-ring.jpg', query: 'sculpted gold ring statement' },
  { file: 'vintage-filigree-ring.jpg', query: 'filigree gold ring' },
  { file: 'marquise-halo-ring.jpg', query: 'marquise diamond ring' },
  { file: 'royal-sapphire-ring.jpg', query: 'sapphire gold ring diamond' },
  { file: 'princess-cut-ring.jpg', query: 'princess cut diamond ring' },
  { file: 'twin-twist-band.jpg', query: 'twisted gold ring' },
  { file: 'ruby-cocktail-ring.jpg', query: 'ruby cocktail ring gold' },
  { file: 'floral-heritage-ring.jpg', query: 'floral engraved gold ring' },
  { file: 'pear-solitaire-ring.jpg', query: 'pear shaped diamond ring' },
  { file: 'champagne-eternity-band.jpg', query: 'eternity diamond ring band' },
  { file: 'sculptural-wave-ring.jpg', query: 'wave gold ring' },
  { file: 'onyx-signet-ring.jpg', query: 'onyx signet ring gold' },
  { file: 'interwoven-wedding-band.jpg', query: 'interwoven gold band ring' },
  { file: 'emerald-cluster-ring.jpg', query: 'emerald diamond cluster ring' },
  { file: 'aurelia-statement-ring.jpg', query: 'luxury gold diamond statement ring' }
];

async function findImage(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size|mime&format=json`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'AtelierFineCreations/1.0 (info@atelierfinecreations.gold)' }
  });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  for (const page of pages) {
    const info = page.imageinfo?.[0];
    if (info && (info.mime === 'image/jpeg' || info.mime === 'image/png') && info.size > 20000) {
      return { title: page.title, url: info.url, size: info.size, width: info.width, height: info.height };
    }
  }
  return null;
}

async function run() {
  for (const item of searchTerms) {
    const match = await findImage(item.query);
    console.log(`${item.file} ("${item.query}") ->`, match ? `${match.title} (${match.width}x${match.height}, ${Math.round(match.size/1024)}KB)` : 'NO MATCH');
  }
}

run();
