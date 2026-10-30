import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isValidCheckoutUrl, openExternalCheckout } from '../../src/utils/checkoutUrl';
import { DEMO_PRODUCTS } from '../../src/data/demoProducts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('GalleryPage Phase 4 - Content & Typography', () => {
  const galleryPath = path.resolve(__dirname, '../../src/pages/GalleryPage.tsx');
  const galleryContent = fs.readFileSync(galleryPath, 'utf-8');

  // Breadcrumbs
  assert.match(galleryContent, /label:\s*'Home'/, 'Breadcrumb must include Home');
  assert.match(galleryContent, /label:\s*'Gallery'/, 'Breadcrumb must include Gallery');

  // Heading
  assert.match(
    galleryContent,
    /title="Exquisite Pieces for Every Moment\."/,
    'Gallery must have exact heading: Exquisite Pieces for Every Moment.'
  );

  // Ivory background
  assert.match(galleryContent, /#FAF7F2/, 'Gallery page must feature the ivory background');
});

test('GalleryPage Phase 4 - Category Tabs for Rings, Watches, Straps', () => {
  const filtersPath = path.resolve(__dirname, '../../src/components/products/ProductFilters.tsx');
  const filtersContent = fs.readFileSync(filtersPath, 'utf-8');

  assert.match(filtersContent, /Rings/, 'Must include Rings tab');
  assert.match(filtersContent, /Bespoke Watches/, 'Must include Bespoke Watches tab');
  assert.match(filtersContent, /Leather Straps/, 'Must include Leather Straps tab');
});

test('GalleryPage Phase 4 - Security & External Checkout URL Validation', () => {
  // Approved HTTPS destinations
  assert.equal(
    isValidCheckoutUrl('https://checkout.atelierfinecreations.gold/c/imperial-ring'),
    true,
    'Official checkout subdomain must be valid'
  );
  assert.equal(
    isValidCheckoutUrl('https://boutique.atelierfinecreations.gold/pay'),
    true,
    'Boutique subdomain must be valid'
  );
  assert.equal(
    isValidCheckoutUrl('https://buy.stripe.com/test_12345'),
    true,
    'Stripe checkout must be valid'
  );

  // Rejected non-HTTPS or unapproved destinations
  assert.equal(
    isValidCheckoutUrl('http://checkout.atelierfinecreations.gold/insecure'),
    false,
    'Non-HTTPS must be rejected'
  );
  assert.equal(
    isValidCheckoutUrl('javascript:alert(1)'),
    false,
    'javascript: scheme must be rejected'
  );
  assert.equal(
    isValidCheckoutUrl('https://phishing-scam.com/checkout'),
    false,
    'Unapproved domain must be rejected'
  );
  assert.equal(isValidCheckoutUrl(''), false, 'Empty URL must be rejected');
  assert.equal(isValidCheckoutUrl(undefined), false, 'Undefined URL must be rejected');
});

test('GalleryPage Phase 4 - Product Fields & Demo Catalog Integrity', () => {
  for (const prod of DEMO_PRODUCTS) {
    // Required fields
    assert.equal(typeof prod.id, 'string', 'Product ID must be string');
    assert.equal(typeof prod.name, 'string', 'Product name must be string');
    assert.equal(typeof prod.slug, 'string', 'Product slug must be string');
    assert.equal(typeof prod.description, 'string', 'Product description must be string');
    assert.equal(Boolean(prod.category), true, 'Product category must exist');

    // Optional price and currency
    if (prod.price !== undefined) {
      assert.equal(typeof prod.price, 'number', 'Price must be a number');
      assert.equal(prod.price > 0, true, 'Price must be positive');
      assert.equal(prod.currency, 'USD', 'Currency must be specified');
    }

    // Images and alt text
    assert.equal(Array.isArray(prod.images), true, 'Images must be an array');
    assert.equal(prod.images.length > 0, true, 'Must have at least one image');
    if (prod.imageAlts) {
      assert.equal(Array.isArray(prod.imageAlts), true, 'ImageAlts must be array');
      assert.equal(prod.imageAlts.length > 0, true, 'ImageAlts must contain alt text');
    }

    // Optional attributes
    if (prod.attributes) {
      assert.equal(typeof prod.attributes, 'object', 'Attributes must be an object');
      assert.equal(Object.keys(prod.attributes).length > 0, true, 'Attributes must have entries');
    }

    // External purchase URL
    if (prod.purchaseUrl) {
      assert.equal(isValidCheckoutUrl(prod.purchaseUrl), true, 'Purchase URL must be valid approved HTTPS');
    }

    // Publication status
    if (prod.status) {
      assert.equal(['published', 'draft', 'archived'].includes(prod.status), true);
    }
  }
});

test('GalleryPage Phase 4 - ProductCard and Lightbox Actions', () => {
  const cardPath = path.resolve(__dirname, '../../src/components/products/ProductCard.tsx');
  const cardContent = fs.readFileSync(cardPath, 'utf-8');

  assert.match(cardContent, /onSelect/, 'ProductCard must support onSelect');
  assert.match(cardContent, /handleBuyNow/, 'ProductCard must support Buy Now');
  assert.match(cardContent, /aspectRatio:\s*'1\/1'/, 'ProductCard must use 1:1 aspect ratio');

  const lightboxPath = path.resolve(__dirname, '../../src/components/products/ProductLightbox.tsx');
  const lightboxContent = fs.readFileSync(lightboxPath, 'utf-8');

  assert.match(lightboxContent, /role="dialog"/, 'Lightbox must have dialog role');
  assert.match(lightboxContent, /aria-modal="true"/, 'Lightbox must have aria-modal');
  assert.match(lightboxContent, /handleKeyDown/, 'Lightbox must handle Escape key');
  assert.match(lightboxContent, /openExternalCheckout/, 'Lightbox must support safe checkout');
});
