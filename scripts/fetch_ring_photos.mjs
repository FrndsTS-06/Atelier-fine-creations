async function searchCategory(term) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(term)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size|mime&format=json`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'AtelierFineCreationsCatalog/1.0 (info@atelierfinecreations.gold) node-fetch'
      }
    });
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    console.log(`\n=== Term: "${term}" (${pages.length} results) ===`);
    pages.slice(0, 5).forEach((p, i) => {
      const info = p.imageinfo?.[0];
      if (info && (info.mime === 'image/jpeg' || info.mime === 'image/png')) {
        console.log(`  [${i}] ${p.title} (${info.width}x${info.height}) -> ${info.url}`);
      }
    });
  } catch (err) {
    console.error(`Error for "${term}":`, err.message);
  }
}

async function run() {
  await searchCategory('emerald gold ring');
  await searchCategory('ruby gold ring');
  await searchCategory('sapphire gold ring');
  await searchCategory('onyx gold ring signet');
  await searchCategory('signet gold ring');
  await searchCategory('filigree gold ring');
  await searchCategory('diamond eternity ring gold');
  await searchCategory('solitaire diamond ring gold');
}

run();
