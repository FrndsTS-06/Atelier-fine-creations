import fs from 'node:fs';
import path from 'node:path';

const curatedRings = [
  {
    name: 'Imperial Oval Diamond Ring',
    file: 'oval-diamond-ring.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Halo_Oval_Engagement_Ring.jpg',
  },
  {
    name: 'Royal Emerald-Cut Solitaire',
    file: 'emerald-cut-ring.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Emerald_and_diamond_ring.jpg',
  },
  {
    name: 'Eternal Knot Gold Ring',
    file: 'knot-gold-ring.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Ian_Rosenberg_Jeweller_-_Gold_Celtic_love_knot_ring.JPG',
  },
  {
    name: 'Maharaja Heritage Signet Ring',
    file: 'maharaja-signet-ring.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Gold_Signet_Ring_of_Michael_Zorianos_MET_LC_18_145_42_s9.jpg',
  },
  {
    name: 'Celestial Pavé Diamond Band',
    file: 'pave-diamond-band.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Half_Eternity_ring_in_white_gold.jpg',
  },
  {
    name: 'Sculpted 22K Gold Statement Ring',
    file: 'sculpted-statement-ring.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Diamond_and_gold_ring.JPG',
  },
  {
    name: 'Vintage Filigree Gold Ring',
    file: 'vintage-filigree-ring.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Rose_Gold_Diamond_Engagement_Ring.jpg',
  },
  {
    name: 'Marquise Diamond Halo Ring',
    file: 'marquise-halo-ring.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Diamond_and_gold_rings_%2839538047354%29.jpg',
  },
  {
    name: 'Royal Sapphire Gold Ring',
    file: 'royal-sapphire-ring.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Sapphire_ring_photo_by_Mark_Somma.jpg',
  },
  {
    name: 'Radiant Princess-Cut Ring',
    file: 'princess-cut-ring.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Diamond_princess_cut.jpg',
  },
  {
    name: 'Twin-Twist Gold Band',
    file: 'twin-twist-band.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Three_Stones_Diamond_engagement_ring_yellow_gold_made_by_1791_Diamond.jpg',
  },
  {
    name: 'Imperial Ruby Cocktail Ring',
    file: 'ruby-cocktail-ring.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Gold_ring_with_a_ruby.jpg',
  },
  {
    name: 'Floral Engraved Heritage Ring',
    file: 'floral-heritage-ring.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Engagement_ring_18K_yellow_gold_with_yellow_sapphire_and_diamonds.jpg',
  },
  {
    name: 'Pear-Shaped Diamond Solitaire',
    file: 'pear-solitaire-ring.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Lucia_pear_cut-195_carat-Australian_parti_sapphire-engagement_gold_ring-Lizunova_Fine_Jewels-Sydney-jeweller-Chifley-Square.jpg',
  },
  {
    name: 'Champagne Diamond Eternity Band',
    file: 'champagne-eternity-band.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Bezel_set_Ruby_and_Diamond_Eternity_Band.jpg',
  },
  {
    name: 'Sculptural Wave Gold Ring',
    file: 'sculptural-wave-ring.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Ad_Astra_-_gold_ring_with_diamonds.jpg',
  },
  {
    name: 'Men\'s Onyx Signet Ring',
    file: 'onyx-signet-ring.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Signet_%28260629077%29.jpeg',
  },
  {
    name: 'Interwoven Gold Wedding Band',
    file: 'interwoven-wedding-band.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Two-gold_and_diamond_ring.jpg',
  },
  {
    name: 'Emerald and Diamond Cluster Ring',
    file: 'emerald-cluster-ring.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Emerald_ring_photo_by_Somma.jpg',
  },
  {
    name: 'Aurelia Bespoke Statement Ring',
    file: 'aurelia-statement-ring.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Starlight_-_white_gold_ring_with_diamonds.jpg',
  },
];

async function downloadAll() {
  const targetDir = path.resolve('frontend/public/images/products');
  const distDir = path.resolve('frontend/dist/images/products');
  
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

  for (let i = 0; i < curatedRings.length; i++) {
    const item = curatedRings[i];
    console.log(`[${i + 1}/${curatedRings.length}] Downloading: ${item.name} -> ${item.file}`);
    try {
      const res = await fetch(item.sourceUrl, {
        headers: {
          'User-Agent': 'AtelierFineCreationsCatalog/1.0 (catalog@atelierfinecreations.gold) node-fetch'
        }
      });
      if (!res.ok) {
        console.error(`  FAIL HTTP ${res.status} for ${item.sourceUrl}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 5000) {
        console.error(`  FAIL Too small (${buffer.length} bytes)`);
        continue;
      }
      const outPath = path.join(targetDir, item.file);
      fs.writeFileSync(outPath, buffer);
      fs.writeFileSync(path.join(distDir, item.file), buffer);
      console.log(`  SUCCESS ${item.file} saved (${Math.round(buffer.length / 1024)}KB)`);
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
    }
  }
}

downloadAll();
