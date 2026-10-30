import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import jwt from 'jsonwebtoken';

process.env.NODE_ENV = 'test';

import { createApp } from '../src/app.js';
import { prisma } from '../src/config/database.js';
import { ENV } from '../src/config/env.js';

let server: http.Server;
let baseUrl: string;
let adminToken: string;

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

  // Authenticate as Admin
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@aurelien.gold',
      password: 'AdminPassword123!',
    }),
  });

  if (loginRes.ok) {
    const loginData = await loginRes.json();
    adminToken = loginData.data.token;
  }
});

test.after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
  await prisma.$disconnect();
});

test('Admin Phase 9 - Unauthorized access is rejected with 401', async () => {
  // Test product creation without auth
  const res1 = await fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Unauthorized Gold Ring' }),
  });
  assert.equal(res1.status, 401);

  // Test inquiries retrieval without auth
  const res2 = await fetch(`${baseUrl}/api/inquiries`);
  assert.equal(res2.status, 401);

  // Test category update without auth
  const res3 = await fetch(`${baseUrl}/api/categories/fake-id`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Unauthorized Category' }),
  });
  assert.equal(res3.status, 401);

  // Test category delete without auth
  const res4 = await fetch(`${baseUrl}/api/categories/fake-id`, {
    method: 'DELETE',
  });
  assert.equal(res4.status, 401);
});

test('Admin Phase 9 - Login and Authentication', async () => {
  // Invalid password fails
  const badLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@aurelien.gold',
      password: 'WrongPassword123!',
    }),
  });
  assert.equal(badLogin.status, 401);

  // Valid credentials return valid JWT and user session
  assert.ok(adminToken, 'Admin token should be generated');
  const meRes = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.equal(meRes.status, 200);
  const meJson = await meRes.json();
  assert.equal(meJson.success, true);
  assert.equal(meJson.data.email, 'admin@aurelien.gold');
  assert.ok(['ADMIN', 'SUPER_ADMIN'].includes(meJson.data.role));
});

test('Admin Phase 9 - Role Permissions Authorization (Forbidden for non-admin)', async () => {
  // Create a viewer token that lacks ADMIN or SUPER_ADMIN role
  const viewerToken = jwt.sign(
    { id: 'viewer-user-id', email: 'viewer@aurelien.gold', role: 'VIEWER' },
    ENV.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const res = await fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${viewerToken}`,
    },
    body: JSON.stringify({ name: 'Forbidden Creation' }),
  });

  assert.equal(res.status, 403);
  const json = await res.json();
  assert.equal(json.error.code, 'FORBIDDEN');
});

test('Admin Phase 9 - Product Catalog CRUD and External Purchase URL', async () => {
  // Find a category to associate with
  const catRes = await fetch(`${baseUrl}/api/categories`);
  const catJson = await catRes.json();
  const categoryId = catJson.data[0].id;

  // 1. CREATE product (draft with external purchase URL and images)
  const createRes = await fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      name: 'Bespoke Aurelien Emerald Tiara',
      description: 'Hand-forged 22K pure yellow gold tiara set with Colombian emeralds.',
      categoryId,
      price: 45000,
      currency: 'USD',
      purchaseUrl: 'https://boutique.aurelien.gold/checkout/tiara',
      status: 'draft',
      purity: '22K',
      grossWeight: 88.5,
      netWeight: 82.0,
      hallmarkCertified: true,
      inStock: true,
      images: ['/images/products/royal-choker.svg'],
    }),
  });

  assert.equal(createRes.status, 201);
  const createdJson = await createRes.json();
  assert.equal(createdJson.success, true);
  const createdProduct = createdJson.data;
  assert.equal(createdProduct.name, 'Bespoke Aurelien Emerald Tiara');
  assert.equal(createdProduct.status, 'draft');
  assert.equal(createdProduct.purchaseUrl, 'https://boutique.aurelien.gold/checkout/tiara');
  assert.equal(createdProduct.price, 45000);

  // 2. READ product
  const getRes = await fetch(`${baseUrl}/api/products/${createdProduct.id}`);
  assert.equal(getRes.status, 200);
  const getJson = await getRes.json();
  assert.equal(getJson.data.id, createdProduct.id);

  // 3. UPDATE product: publish piece and change price
  const updateRes = await fetch(`${baseUrl}/api/products/${createdProduct.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      status: 'published',
      price: 48500,
      purchaseUrl: 'https://boutique.aurelien.gold/checkout/tiara-updated',
    }),
  });

  assert.equal(updateRes.status, 200);
  const updateJson = await updateRes.json();
  assert.equal(updateJson.data.status, 'published');
  assert.equal(updateJson.data.price, 48500);
  assert.equal(updateJson.data.purchaseUrl, 'https://boutique.aurelien.gold/checkout/tiara-updated');

  // 4. ARCHIVE product
  const archiveRes = await fetch(`${baseUrl}/api/products/${createdProduct.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      status: 'archived',
    }),
  });
  assert.equal(archiveRes.status, 200);
  const archiveJson = await archiveRes.json();
  assert.equal(archiveJson.data.status, 'archived');

  // 5. DELETE product
  const deleteRes = await fetch(`${baseUrl}/api/products/${createdProduct.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
  assert.equal(deleteRes.status, 200);

  // Verify deletion
  const verifyRes = await fetch(`${baseUrl}/api/products/${createdProduct.id}`);
  assert.equal(verifyRes.status, 404);
});

test('Admin Phase 9 - Category CRUD', async () => {
  // 1. CREATE category
  const createCatRes = await fetch(`${baseUrl}/api/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      name: 'High Jewelry Brooches',
      description: 'Artisanal lapel masterpieces with hand-engraved motifs.',
      bannerUrl: 'https://images.atelier.gold/banners/brooches.webp',
      displayOrder: 99,
    }),
  });

  assert.equal(createCatRes.status, 201);
  const createdCat = (await createCatRes.json()).data;
  assert.equal(createdCat.name, 'High Jewelry Brooches');
  assert.equal(createdCat.slug, 'high-jewelry-brooches');

  // 2. UPDATE category
  const updateCatRes = await fetch(`${baseUrl}/api/categories/${createdCat.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      name: 'Imperial Brooches & Pins',
      description: 'Updated curatorial narrative.',
    }),
  });

  assert.equal(updateCatRes.status, 200);
  const updatedCat = (await updateCatRes.json()).data;
  assert.equal(updatedCat.name, 'Imperial Brooches & Pins');
  assert.equal(updatedCat.slug, 'imperial-brooches-pins');

  // 3. DELETE category
  const deleteCatRes = await fetch(`${baseUrl}/api/categories/${createdCat.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
  assert.equal(deleteCatRes.status, 200);
});

test('Admin Phase 9 - Inquiries Management (Search, Filter, and Status Updates)', async () => {
  // 1. Submit a client inquiry
  const submitRes = await fetch(`${baseUrl}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Duchess Eleanor of Valois',
      email: 'eleanor.valois@chateau.fr',
      subject: 'Private Viewing for Heritage Bridal Suite',
      message: 'Requesting an appointment for bespoke fitting with master gemologist.',
      phone: '+33 1 42 68 55 00',
      preferredKarat: '22K',
    }),
  });
  assert.equal(submitRes.status, 201);
  const inq = (await submitRes.json()).data;
  assert.equal(inq.status, 'PENDING');

  // 2. Admin retrieves inquiries filtered by status
  const listRes = await fetch(`${baseUrl}/api/inquiries?status=PENDING`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.equal(listRes.status, 200);
  const listJson = await listRes.json();
  assert.equal(Array.isArray(listJson.data), true);
  const found = listJson.data.find((item: any) => item.id === inq.id);
  assert.ok(found, 'Created inquiry should be in pending list');

  // 3. Admin updates status to CONTACTED with concierge internal notes
  const patchRes1 = await fetch(`${baseUrl}/api/inquiries/${inq.id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      status: 'CONTACTED',
      internalNotes: 'Reached out via encrypted concierge telephone. Salon date offered for Friday.',
    }),
  });
  assert.equal(patchRes1.status, 200);
  const updatedInq1 = (await patchRes1.json()).data;
  assert.equal(updatedInq1.status, 'CONTACTED');
  assert.equal(updatedInq1.internalNotes, 'Reached out via encrypted concierge telephone. Salon date offered for Friday.');

  // 4. Admin updates status to CLOSED
  const patchRes2 = await fetch(`${baseUrl}/api/inquiries/${inq.id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      status: 'CLOSED',
    }),
  });
  assert.equal(patchRes2.status, 200);
  const updatedInq2 = (await patchRes2.json()).data;
  assert.equal(updatedInq2.status, 'CLOSED');
});
