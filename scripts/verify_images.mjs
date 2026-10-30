import fs from 'node:fs';
import path from 'node:path';

const expectedRings = [
  'oval-diamond-ring.jpg',
  'emerald-cut-ring.jpg',
  'knot-gold-ring.jpg',
  'maharaja-signet-ring.jpg',
  'pave-diamond-band.jpg',
  'sculpted-statement-ring.jpg',
  'vintage-filigree-ring.jpg',
  'marquise-halo-ring.jpg',
  'royal-sapphire-ring.jpg',
  'princess-cut-ring.jpg',
  'twin-twist-band.jpg',
  'ruby-cocktail-ring.jpg',
  'floral-heritage-ring.jpg',
  'pear-solitaire-ring.jpg',
  'champagne-eternity-band.jpg',
  'sculptural-wave-ring.jpg',
  'onyx-signet-ring.jpg',
  'interwoven-wedding-band.jpg',
  'emerald-cluster-ring.jpg',
  'aurelia-statement-ring.jpg'
];

let allOk = true;
for (const file of expectedRings) {
  const pubPath = path.resolve('frontend/public/images/products', file);
  const distPath = path.resolve('frontend/dist/images/products', file);
  const pubOk = fs.existsSync(pubPath) && fs.statSync(pubPath).size > 5000;
  const distOk = fs.existsSync(distPath) && fs.statSync(distPath).size > 5000;
  const size = pubOk ? Math.round(fs.statSync(pubPath).size / 1024) : 0;
  console.log(`${file}: public=${pubOk}, dist=${distOk} (${size}KB)`);
  if (!pubOk || !distOk) allOk = false;
}

console.log(`\nAll 20 ring images valid: ${allOk}`);
