import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

process.env.NODE_ENV = 'test';

import { createApp } from '../src/app.js';
import { prisma } from '../src/config/database.js';

let server: http.Server;
let baseUrl: string;

test.before(async () => {
  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const addr = server.address();
      if (typeof addr === 'object' && addr !== null) {
        baseUrl = `http://127.0.0.1:${addr.port}`;
      }
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
  await prisma.$disconnect();
});

test('API Phase 7 - GET /api/health returns database status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.status, 'healthy');
  assert.equal(json.data.database, 'connected');
});

test('API Phase 7 - GET /api/categories lists all active collections', async () => {
  const res = await fetch(`${baseUrl}/api/categories`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(Array.isArray(json.data), true);
  assert.equal(json.data.length >= 4, true);

  const firstCat = json.data[0];
  assert.equal(typeof firstCat.id, 'string');
  assert.equal(typeof firstCat.name, 'string');
  assert.equal(typeof firstCat.slug, 'string');
});

test('API Phase 7 - GET /api/products supports pagination, filters, and search', async () => {
  // Base list
  const res = await fetch(`${baseUrl}/api/products?page=1&limit=2`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(Array.isArray(json.data.items), true);
  assert.equal(json.data.items.length <= 2, true);
  assert.equal(json.data.pagination.page, 1);
  assert.equal(json.data.pagination.limit, 2);
  assert.equal(typeof json.data.pagination.total, 'number');

  // Search filter
  const searchRes = await fetch(`${baseUrl}/api/products?search=imperial`);
  const searchJson = await searchRes.json();
  assert.equal(searchRes.status, 200);
  assert.equal(searchJson.success, true);
  for (const item of searchJson.data.items) {
    const text = `${item.name} ${item.description}`.toLowerCase();
    assert.match(text, /imperial/i);
  }

  // Category filter
  const catRes = await fetch(`${baseUrl}/api/products?category=rings`);
  const catJson = await catRes.json();
  assert.equal(catRes.status, 200);
  assert.equal(catJson.success, true);
  for (const item of catJson.data.items) {
    assert.equal(item.category.slug, 'rings');
  }

  // Sorting: price_asc
  const sortRes = await fetch(`${baseUrl}/api/products?sortBy=price_asc`);
  const sortJson = await sortRes.json();
  assert.equal(sortRes.status, 200);
  assert.equal(sortJson.success, true);
  const items = sortJson.data.items;
  if (items.length > 1) {
    for (let i = 0; i < items.length - 1; i++) {
      assert.equal(items[i].price <= items[i + 1].price, true);
    }
  }

  // Validated query params: invalid sortBy rejected with 400
  const invalidSortRes = await fetch(`${baseUrl}/api/products?sortBy=invalid_sort`);
  assert.equal(invalidSortRes.status, 400);
  const invalidSortJson = await invalidSortRes.json();
  assert.equal(invalidSortJson.success, false);
  assert.equal(invalidSortJson.error.code, 'QUERY_VALIDATION_ERROR');
});

test('API Phase 7 - GET /api/products/:slug returns product and handles 404', async () => {
  // Existing product
  const res = await fetch(`${baseUrl}/api/products/aura-imperial-22k-gold-choker`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.slug, 'aura-imperial-22k-gold-choker');
  assert.equal(typeof json.data.price, 'number');
  assert.equal(Array.isArray(json.data.images), true);

  // Non-existent product
  const notFoundRes = await fetch(`${baseUrl}/api/products/non-existent-masterpiece-12345`);
  assert.equal(notFoundRes.status, 404);
  const notFoundJson = await notFoundRes.json();
  assert.equal(notFoundJson.success, false);
  assert.equal(notFoundJson.error.code, 'PRODUCT_NOT_FOUND');
});

test('API Phase 7 - POST /api/inquiries validates, normalizes, and stores submissions', async () => {
  // Valid inquiry
  const payload = {
    fullName: '  Baroness Beatrice von Rothschild  ',
    email: '  BEATRICE@ROTHSCHILD-ESTATE.CH  ',
    subject: '  Custom 22K Tiara Consultation  ',
    phone: '  +41 22 731 00 00  ',
    preferredKarat: '22K',
    message: 'Requesting a private consultation at Place Vendôme regarding a bespoke emerald and 22K tiara.',
  };

  const res = await fetch(`${baseUrl}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  assert.equal(res.status, 201);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.name, 'Baroness Beatrice von Rothschild');
  assert.equal(json.data.email, 'beatrice@rothschild-estate.ch'); // Normalized lowercase
  assert.equal(json.data.status, 'PENDING');

  // Verify in PostgreSQL / SQLite database via Prisma
  const savedInquiry = await prisma.inquiry.findUnique({
    where: { id: json.data.id },
  });
  assert.notEqual(savedInquiry, null);
  assert.equal(savedInquiry?.email, 'beatrice@rothschild-estate.ch');
  assert.equal(savedInquiry?.name, 'Baroness Beatrice von Rothschild');

  // Invalid payload: message too short (< 10 chars)
  const invalidPayload = {
    fullName: 'Lady Test',
    email: 'test@domain.com',
    message: 'Short',
  };

  const badRes = await fetch(`${baseUrl}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invalidPayload),
  });

  assert.equal(badRes.status, 400);
  const badJson = await badRes.json();
  assert.equal(badJson.success, false);
  assert.equal(badJson.error.code, 'VALIDATION_ERROR');
});

test('API Phase 7 - Database Models and Relations Compliance', async () => {
  // 1. Category
  const cat = await prisma.category.findUnique({ where: { slug: 'rings' } });
  assert.notEqual(cat, null);

  // 2. Product with Decimal price & ProductImage relation
  const prod = await prisma.product.findFirst({
    include: { images: true, category: true },
  });
  assert.notEqual(prod, null);
  assert.notEqual(prod?.images, null);
  assert.equal(Array.isArray(prod?.images), true);

  // 3. ProductImage
  const img = await prisma.productImage.findFirst();
  assert.notEqual(img, null);
  assert.equal(typeof img?.imageUrl, 'string');
  assert.equal(typeof img?.sortOrder, 'number');

  // 4. Inquiry
  const inq = await prisma.inquiry.findFirst({
    where: { email: 'beatrice@rothschild-estate.ch' },
  });
  assert.notEqual(inq, null);
  assert.equal(inq?.status, 'PENDING');

  // 5. AdminUser
  const admin = await prisma.adminUser.findFirst();
  assert.notEqual(admin, null);
  assert.equal(typeof admin?.email, 'string');
  assert.equal(typeof admin?.passwordHash, 'string');
});
