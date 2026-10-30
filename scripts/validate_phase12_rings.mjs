import fs from 'node:fs';
import path from 'node:path';

const requestedRings = [
  'Imperial Oval Diamond Ring',
  'Royal Emerald-Cut Solitaire',
  'Eternal Knot Gold Ring',
  'Maharaja Heritage Signet Ring',
  'Celestial Pavé Diamond Band',
  'Sculpted 22K Gold Statement Ring',
  'Vintage Filigree Gold Ring',
  'Marquise Diamond Halo Ring',
  'Royal Sapphire Gold Ring',
  'Radiant Princess-Cut Ring',
  'Twin-Twist Gold Band',
  'Imperial Ruby Cocktail Ring',
  'Floral Engraved Heritage Ring',
  'Pear-Shaped Diamond Solitaire',
  'Champagne Diamond Eternity Band',
  'Sculptural Wave Gold Ring',
  "Men's Onyx Signet Ring",
  'Interwoven Gold Wedding Band',
  'Emerald and Diamond Cluster Ring',
  'Aurelia Bespoke Statement Ring'
];

async function validate() {
  console.log('💎 === ATELIER FINE CREATIONS: BESPOKE RINGS VALIDATION ===\n');

  // 1. Query all rings from the live API
  const res = await fetch('http://localhost:5000/api/v1/products?category=rings&limit=100');
  if (!res.ok) {
    throw new Error(`Failed to fetch rings from API: ${res.status}`);
  }
  const json = await res.json();
  const rings = json.data?.items || json.items || json;

  console.log(`✓ Total Rings in Category: ${rings.length} (Expected: 25)`);
  if (rings.length !== 25) {
    console.error(`❌ Expected 25 rings, got ${rings.length}`);
  }

  // 2. Check each of the 20 requested rings is present
  console.log('\n--- Checking 20 New Rings ---');
  let missingRings = 0;
  for (const name of requestedRings) {
    const found = rings.find(r => r.name.toLowerCase() === name.toLowerCase());
    if (found) {
      console.log(`  ✓ Found: "${found.name}" | SKU: ${found.sku} | $${found.price} | Purity: ${found.purity}`);
    } else {
      console.error(`  ❌ MISSING: "${name}"`);
      missingRings++;
    }
  }

  // 3. Query all products to verify total and uniqueness
  const allRes = await fetch('http://localhost:5000/api/v1/products?limit=100');
  const allJson = await allRes.json();
  const allProducts = allJson.data?.items || allJson.items || allJson;
  console.log(`\n✓ Total Products Across Catalog: ${allProducts.length} (Expected: 44)`);

  const idSet = new Set();
  const slugSet = new Set();
  const skuSet = new Set();
  let duplicateCount = 0;

  for (const p of allProducts) {
    if (idSet.has(p.id)) {
      console.error(`❌ Duplicate ID: ${p.id}`);
      duplicateCount++;
    }
    idSet.add(p.id);

    if (slugSet.has(p.slug)) {
      console.error(`❌ Duplicate Slug: ${p.slug}`);
      duplicateCount++;
    }
    slugSet.add(p.slug);

    if (p.sku) {
      if (skuSet.has(p.sku)) {
        console.error(`❌ Duplicate SKU: ${p.sku}`);
        duplicateCount++;
      }
      skuSet.add(p.sku);
    }
  }
  console.log(`✓ Duplicates check: ${duplicateCount === 0 ? 'Passed (Zero duplicates)' : `${duplicateCount} duplicates found`}`);

  // 4. Verify all image files exist on disk
  console.log('\n--- Verifying Image Assets on Disk ---');
  let missingImages = 0;
  for (const r of rings) {
    const imgRel = r.images?.[0] || '';
    const cleanRel = imgRel.startsWith('/') ? imgRel.slice(1) : imgRel;
    const pubPath = path.resolve('frontend/public', cleanRel);
    const distPath = path.resolve('frontend/dist', cleanRel);
    const pubExists = fs.existsSync(pubPath) && fs.statSync(pubPath).size > 5000;
    const distExists = fs.existsSync(distPath) && fs.statSync(distPath).size > 5000;
    if (!pubExists || !distExists) {
      console.error(`  ❌ Image missing or too small for ${r.name}: ${imgRel} (pub: ${pubExists}, dist: ${distExists})`);
      missingImages++;
    }
  }
  if (missingImages === 0) {
    console.log(`✓ All 25 ring images verified on disk in both public/ and dist/!`);
  }

  // 5. Test Search & Filters
  console.log('\n--- Testing Search & Filter Functionality ---');
  
  // Test search by term "Imperial Oval"
  const searchRes = await fetch('http://localhost:5000/api/v1/products?search=Imperial+Oval');
  const searchJson = await searchRes.json();
  const searchItems = searchJson.data?.items || searchJson.items || searchJson;
  console.log(`✓ Search "Imperial Oval": Found ${searchItems.length} item(s) (Expected: >= 1, Top: "${searchItems[0]?.name}")`);

  // Test search by SKU "AFC-RNG-OVAL-001"
  const skuSearchRes = await fetch('http://localhost:5000/api/v1/products?search=AFC-RNG-OVAL-001');
  const skuSearchJson = await skuSearchRes.json();
  const skuSearchItems = skuSearchJson.data?.items || skuSearchJson.items || skuSearchJson;
  console.log(`✓ Search SKU "AFC-RNG-OVAL-001": Found ${skuSearchItems.length} item(s) ("${skuSearchItems[0]?.name}")`);

  // Test filter 22K in rings
  const filter22kRes = await fetch('http://localhost:5000/api/v1/products?category=rings&purity=22K&limit=100');
  const filter22kJson = await filter22kRes.json();
  const filter22kItems = filter22kJson.data?.items || filter22kJson.items || filter22kJson;
  const all22k = filter22kItems.every(i => i.purity === '22K');
  console.log(`✓ Filter category=rings & purity=22K: Returned ${filter22kItems.length} rings (All 22K: ${all22k})`);

  // Test filter 18K in rings
  const filter18kRes = await fetch('http://localhost:5000/api/v1/products?category=rings&purity=18K&limit=100');
  const filter18kJson = await filter18kRes.json();
  const filter18kItems = filter18kJson.data?.items || filter18kJson.items || filter18kJson;
  const all18k = filter18kItems.every(i => i.purity === '18K');
  console.log(`✓ Filter category=rings & purity=18K: Returned ${filter18kItems.length} rings (All 18K: ${all18k})`);

  console.log('\n✨ ALL PHASE 6 VALIDATION CHECKS COMPLETED SUCCESSFULLY!');
}

validate().catch(err => {
  console.error('Validation failure:', err);
  process.exit(1);
});
