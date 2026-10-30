import fs from 'node:fs';
import path from 'node:path';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  const targetDir = path.resolve('frontend/public/images/products');
  const distDir = path.resolve('frontend/dist/images/products');
  const url = 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Diamond_princess_cut.jpg';

  console.log('Waiting 2s...');
  await sleep(2000);
  console.log('Downloading princess-cut-ring.jpg...');
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'AtelierFineCreationsCatalog/1.0 (https://atelierfinecreations.gold; contact@atelierfinecreations.gold)'
    }
  });
  if (!res.ok) {
    console.error(`FAIL: ${res.status}`);
    return;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(targetDir, 'princess-cut-ring.jpg'), buf);
  fs.writeFileSync(path.join(distDir, 'princess-cut-ring.jpg'), buf);
  console.log(`Saved princess-cut-ring.jpg (${Math.round(buf.length/1024)}KB)`);
}

run();
