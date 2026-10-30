async function getExactUrl(title) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|size&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Atelier/1.0' } });
  const data = await res.json();
  const page = Object.values(data.query?.pages || {})[0];
  return page?.imageinfo?.[0]?.url;
}

async function run() {
  const titles = [
    'File:Halo Oval Engagement Ring.jpg',
    'File:Ian Rosenberg Jeweller - Gold Celtic love knot ring.JPG',
    'File:Diamond princess cut.jpg'
  ];
  for (const t of titles) {
    const canonical = await getExactUrl(t);
    console.log(t, '->', canonical);
  }
}

run();
