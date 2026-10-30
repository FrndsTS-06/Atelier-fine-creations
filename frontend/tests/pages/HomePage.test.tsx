import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_CATEGORIES } from '../../src/data/demoProducts';

test('Frontend HomePage Categories count verification', () => {
  assert.equal(DEMO_CATEGORIES.length >= 4, true);
  const slugs = DEMO_CATEGORIES.map((c) => c.slug);
  assert.equal(slugs.includes('bridal-sets'), true);
  assert.equal(slugs.includes('necklaces'), true);
  assert.equal(slugs.includes('rings'), true);
  assert.equal(slugs.includes('bangles'), true);
});
