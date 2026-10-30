import test from 'node:test';
import assert from 'node:assert/strict';
import { createProductSchema } from '../src/modules/products/product.schema.js';

test('Product Schema Validation - Valid Jewelry Piece', () => {
  const sampleJewel = {
    name: 'Aura Imperial 22K Gold Choker',
    description: 'Bespoke antique necklace hand-forged in 916 pure yellow gold.',
    purity: '22K',
    grossWeight: 48.65,
    netWeight: 48.0,
    stoneWeight: 0.65,
    makingCharges: 450,
    estimatedPrice: 24500,
    hallmarkCertified: true,
    inStock: true,
    isFeatured: true,
    images: ['https://aurelien.gold/images/products/royal-choker.svg'],
    categoryId: 'cat_bridal_01',
  };

  const parsed = createProductSchema.safeParse(sampleJewel);
  assert.equal(parsed.success, true);
});

test('Product Schema Validation - Invalid negative weight fails', () => {
  const invalidJewel = {
    name: 'Faulty Ring',
    description: 'Invalid weight test payload',
    purity: '18K',
    grossWeight: -5.0,
    netWeight: 4.0,
    makingCharges: 100,
    estimatedPrice: 1000,
    images: ['https://aurelien.gold/image.png'],
    categoryId: 'cat_rings',
  };

  const parsed = createProductSchema.safeParse(invalidJewel);
  assert.equal(parsed.success, false);
});
