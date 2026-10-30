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

test('Production Quality Phase 10 - Helmet Security Headers Defense', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);

  // 1. Strict-Transport-Security (HSTS)
  const hsts = res.headers.get('strict-transport-security');
  assert.ok(hsts, 'HSTS header must be present');
  assert.ok(hsts.includes('max-age='), 'HSTS must specify max-age');

  // 2. Content-Security-Policy (CSP)
  const csp = res.headers.get('content-security-policy');
  assert.ok(csp, 'CSP header must be present');
  assert.ok(csp.includes("default-src 'self'"), 'CSP must restrict default sources');

  // 3. X-Content-Type-Options: nosniff
  const nosniff = res.headers.get('x-content-type-options');
  assert.equal(nosniff, 'nosniff', 'Must prevent MIME-type sniffing');

  // 4. X-Frame-Options: SAMEORIGIN
  const frameOptions = res.headers.get('x-frame-options');
  assert.equal(frameOptions, 'SAMEORIGIN', 'Must protect against clickjacking');

  // 5. No X-Powered-By leakage
  const poweredBy = res.headers.get('x-powered-by');
  assert.equal(poweredBy, null, 'Must suppress X-Powered-By header');
});

test('Production Quality Phase 10 - Public Read Caching Headers', async () => {
  // Test products list caching header
  const prodRes = await fetch(`${baseUrl}/api/products`);
  assert.equal(prodRes.status, 200);
  const prodCache = prodRes.headers.get('cache-control');
  assert.ok(prodCache, 'Products endpoint must return Cache-Control');
  assert.ok(prodCache.includes('public'), 'Cache-Control must be public');

  // Test categories list caching header
  const catRes = await fetch(`${baseUrl}/api/categories`);
  assert.equal(catRes.status, 200);
  const catCache = catRes.headers.get('cache-control');
  assert.ok(catCache, 'Categories endpoint must return Cache-Control');
  assert.ok(catCache.includes('public'), 'Cache-Control must be public');
});

test('Production Quality Phase 10 - Restrictive CORS Enforcement', async () => {
  // Origin from authorized local client
  const allowedRes = await fetch(`${baseUrl}/api/health`, {
    headers: { Origin: 'http://localhost:5173' },
  });
  assert.equal(allowedRes.headers.get('access-control-allow-origin'), 'http://localhost:5173');

  // Origin from unauthorized malicious domain in non-dev environment
  const originalEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = 'production';
    const unauthorizedRes = await fetch(`${baseUrl}/api/health`, {
      headers: { Origin: 'https://malicious-counterfeit-gold.com' },
    });
    // In production, unauthorized origin will not receive access-control-allow-origin
    const acao = unauthorizedRes.headers.get('access-control-allow-origin');
    assert.notEqual(acao, 'https://malicious-counterfeit-gold.com');
  } finally {
    process.env.NODE_ENV = originalEnv;
  }
});

test('Production Quality Phase 10 - Production Error Sanitization (No Secret Leakage)', async () => {
  const originalEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = 'production';
    // Requesting a non-existent route returns sanitized 404
    const res = await fetch(`${baseUrl}/api/non-existent-chamber`);
    assert.equal(res.status, 404);
    const json = await res.json();
    assert.equal(json.success, false);
    assert.equal(typeof json.error.message, 'string');
    // Ensure no stack trace leakage
    assert.equal(json.stack, undefined);
    assert.equal(json.error.stack, undefined);
  } finally {
    process.env.NODE_ENV = originalEnv;
  }
});
