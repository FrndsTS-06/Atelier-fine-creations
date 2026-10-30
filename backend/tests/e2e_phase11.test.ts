import test from 'node:test';
import assert from 'node:assert/strict';

const API_BASE = 'http://localhost:5000/api/v1';
const FRONTEND_BASE = 'http://localhost:5173';

test('E2E Phase 11 - Live Servers Connectivity & Health', async () => {
  // Check backend server
  const healthRes = await fetch(`${API_BASE}/health`);
  assert.equal(healthRes.status, 200);
  const healthJson = await healthRes.json();
  assert.equal(healthJson.success, true);
  assert.equal(healthJson.data.database, 'connected');

  // Check frontend dev server
  const frontendRes = await fetch(`${FRONTEND_BASE}/`);
  assert.equal(frontendRes.status, 200);
  const frontendHtml = await frontendRes.text();
  assert.ok(frontendHtml.includes('<!DOCTYPE html>'), 'Frontend HTML must be returned');
  assert.ok(frontendHtml.includes('ATELIER FINE CREATIONS'), 'Page title should be configured');
});

test('E2E Phase 11 - Public Showcase: Products, Search, Filters, and Sorting', async () => {
  // 1. Fetch categories
  const catRes = await fetch(`${API_BASE}/categories`);
  assert.equal(catRes.status, 200);
  const categories = (await catRes.json()).data;
  assert.ok(categories.length >= 3, 'Must have active categories');

  // 2. Fetch all products
  const prodRes = await fetch(`${API_BASE}/products?limit=10`);
  assert.equal(prodRes.status, 200);
  const prodData = (await prodRes.json()).data;
  assert.ok(prodData.items.length > 0, 'Products list should contain items');

  // 3. Search filter
  const searchRes = await fetch(`${API_BASE}/products?search=Choker`);
  assert.equal(searchRes.status, 200);
  const searchData = (await searchRes.json()).data;
  assert.ok(searchData.items.every((p: any) => p.name.includes('Choker') || p.description.includes('Choker')));

  // 4. Sorting by price asc
  const sortRes = await fetch(`${API_BASE}/products?sortBy=price_asc`);
  assert.equal(sortRes.status, 200);
  const sortedItems = (await sortRes.json()).data.items;
  for (let i = 0; i < sortedItems.length - 1; i++) {
    assert.ok(sortedItems[i].price <= sortedItems[i + 1].price, 'Items should be sorted ascending by price');
  }

  // 5. Individual product detail retrieval by slug
  const firstItem = prodData.items[0];
  const detailRes = await fetch(`${API_BASE}/products/${firstItem.slug}`);
  assert.equal(detailRes.status, 200);
  const detailItem = (await detailRes.json()).data;
  assert.equal(detailItem.id, firstItem.id);
});

test('E2E Phase 11 - Public Showcase: Client Inquiry Validation and Submission', async () => {
  // 1. Invalid inquiry submission (missing required fields) fails validation
  const badInquiryRes = await fetch(`${API_BASE}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-test-bypass': 'true' },
    body: JSON.stringify({
      email: 'invalid-email',
      message: 'short',
    }),
  });
  assert.equal(badInquiryRes.status, 400);

  // 2. Valid inquiry submission succeeds
  const goodInquiryRes = await fetch(`${API_BASE}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-test-bypass': 'true' },
    body: JSON.stringify({
      fullName: 'Baroness Vivienne de Montmirail',
      email: 'vivienne@montmirail.fr',
      subject: 'Private Viewing for Heritage Bridal Suite',
      message: 'Requesting an exclusive salon consultation for bespoke high jewelry fitting.',
      phone: '+33 1 42 68 00 22',
      preferredKarat: '22K',
    }),
  });
  assert.equal(goodInquiryRes.status, 201);
  const inqJson = await goodInquiryRes.json();
  assert.equal(inqJson.success, true);
  assert.equal(inqJson.data.status, 'PENDING');
});

test('E2E Phase 11 - Admin Suite: Authentication, Inventory CRUD, Category CRUD, Inquiries', async () => {
  // 1. Admin login with credentials
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-test-bypass': 'true' },
    body: JSON.stringify({
      email: 'admin@aurelien.gold',
      password: 'AdminPassword123!',
    }),
  });
  assert.equal(loginRes.status, 200);
  const loginJson = await loginRes.json();
  const token = loginJson.data.token;
  assert.ok(token, 'Must return JWT authorization token');

  // 2. Verified profile access
  const meRes = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(meRes.status, 200);
  const meJson = await meRes.json();
  assert.equal(meJson.data.email, 'admin@aurelien.gold');

  // 3. Category Creation
  const createCatRes = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Haute Horlogerie Complications',
      description: 'Hand-assembled mechanical tourbillon watches with pure gold casing.',
      bannerUrl: 'https://cdn.aurelien.gold/banners/watches.webp',
      displayOrder: 10,
    }),
  });
  assert.equal(createCatRes.status, 201);
  const createdCat = (await createCatRes.json()).data;

  // 4. Product Creation
  const createProdRes = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Sovereign 24K Gold Astronomical Tourbillon',
      description: 'Astronomical celestial complications hand-finished in pure 24K solid yellow gold.',
      categoryId: createdCat.id,
      price: 125000,
      currency: 'USD',
      purchaseUrl: 'https://checkout.aurelien.gold/piece/astronomical-tourbillon',
      status: 'draft',
      purity: '24K',
      grossWeight: 145.0,
      netWeight: 138.0,
      hallmarkCertified: true,
      inStock: true,
      images: ['/images/products/chronometer.svg'],
    }),
  });
  assert.equal(createProdRes.status, 201);
  const createdProd = (await createProdRes.json()).data;
  assert.equal(createdProd.status, 'draft');

  // 5. Product Update (Publish piece)
  const updateProdRes = await fetch(`${API_BASE}/products/${createdProd.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status: 'published',
      price: 130000,
    }),
  });
  assert.equal(updateProdRes.status, 200);
  const updatedProd = (await updateProdRes.json()).data;
  assert.equal(updatedProd.status, 'published');
  assert.equal(updatedProd.price, 130000);

  // 6. Inquiries List & Status Transition
  const inqListRes = await fetch(`${API_BASE}/inquiries`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(inqListRes.status, 200);
  const inqList = (await inqListRes.json()).data;
  assert.ok(inqList.length > 0, 'Inquiry list should have records');

  const pendingInq = inqList.find((i: any) => i.status === 'PENDING') || inqList[0];
  const patchInqRes = await fetch(`${API_BASE}/inquiries/${pendingInq.id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status: 'CONTACTED',
      internalNotes: 'VIP concierge telephone call completed. Scheduled salon appointment.',
    }),
  });
  assert.equal(patchInqRes.status, 200);
  const patchedInq = (await patchInqRes.json()).data;
  assert.equal(patchedInq.status, 'CONTACTED');

  // 7. Cleanup created test piece and category
  const delProdRes = await fetch(`${API_BASE}/products/${createdProd.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(delProdRes.status, 200);

  const delCatRes = await fetch(`${API_BASE}/categories/${createdCat.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(delCatRes.status, 200);
});
