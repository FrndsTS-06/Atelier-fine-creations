async function testApi() {
  try {
    const res = await fetch('http://localhost:5000/api/v1/products?category=rings&limit=50');
    if (!res.ok) {
      console.error('API response not OK:', res.status, await res.text());
      return;
    }
    const json = await res.json();
    const data = json.data || json;
    const items = data.items || data;
    console.log('--- API RINGS RESPONSE ---');
    console.log('Total reported:', data.total);
    console.log('Items returned count:', items.length);
    console.log('\nRings List:');
    items.forEach((item, idx) => {
      console.log(`[${idx + 1}] ${item.name} | SKU: ${item.sku} | Price: $${item.price} | Purity: ${item.purity} | Image: ${item.images?.[0]}`);
    });
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

testApi();
