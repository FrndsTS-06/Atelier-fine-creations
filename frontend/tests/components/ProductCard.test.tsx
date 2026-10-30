import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_PRODUCTS } from '../../src/data/demoProducts';

test('Frontend Demo Catalog Integrity - ProductCard Data', () => {
  const sample = DEMO_PRODUCTS[0];
  assert.equal(sample.purity, '22K');
  assert.equal(sample.hallmarkCertified, true);
  assert.equal(sample.grossWeight > 0, true);
  assert.equal(sample.netWeight > 0, true);
  assert.equal(sample.estimatedPrice > 0, true);
});
