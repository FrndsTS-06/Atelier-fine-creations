import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('HomePage Phase 3 - HeroSection Requirements', () => {
  const heroPath = path.resolve(__dirname, '../../src/components/home/HeroSection.tsx');
  const heroContent = fs.readFileSync(heroPath, 'utf-8');

  // Eyebrow
  assert.match(heroContent, /TIMELESS CRAFTSMANSHIP\./, 'Hero must have exact eyebrow: TIMELESS CRAFTSMANSHIP.');
  // Heading
  assert.match(heroContent, /Jewelry, Watches,.*Leather Straps\./s, 'Hero must have exact heading: Jewelry, Watches, Leather Straps.');
  // Primary CTA
  assert.match(heroContent, /EXPLORE COLLECTION/, 'Hero primary CTA must be EXPLORE COLLECTION');
  assert.match(heroContent, /ROUTES\.GALLERY/, 'Hero CTA must navigate to /gallery');
  // Dark cinematic imagery
  assert.match(heroContent, /hero-cinematic\.jpg/, 'Hero must include dark cinematic luxury imagery');
});

test('HomePage Phase 3 - CollectionHighlights Requirements', () => {
  const collectionsPath = path.resolve(__dirname, '../../src/components/home/CollectionHighlights.tsx');
  const collectionsContent = fs.readFileSync(collectionsPath, 'utf-8');

  // 3 image-led panels
  assert.match(collectionsContent, /Designer Rings/, 'Must have Designer Rings panel');
  assert.match(collectionsContent, /Bespoke Watches/, 'Must have Bespoke Watches panel');
  assert.match(collectionsContent, /Leather Watch Straps/, 'Must have Leather Watch Straps panel');

  // Navigation with category query
  assert.match(collectionsContent, /category=.*panel\.category|ROUTES\.GALLERY\?category=/, 'Must navigate to gallery with category selected');
});

test('HomePage Phase 3 - BrandBenefits Requirements', () => {
  const benefitsPath = path.resolve(__dirname, '../../src/components/home/BrandBenefits.tsx');
  const benefitsContent = fs.readFileSync(benefitsPath, 'utf-8');

  // 4 restrained benefits
  assert.match(benefitsContent, /title:\s*'Craftsmanship'/);
  assert.match(benefitsContent, /title:\s*'Quality'/);
  assert.match(benefitsContent, /title:\s*'Timeless Design'/);
  assert.match(benefitsContent, /title:\s*'Attention to Detail'/);
});

test('HomePage Phase 3 - CraftsmanshipSection Requirements', () => {
  const craftPath = path.resolve(__dirname, '../../src/components/home/CraftsmanshipSection.tsx');
  const craftContent = fs.readFileSync(craftPath, 'utf-8');

  // Split layout and CTA to /about
  assert.match(craftContent, /artisan-workbench\.jpg/, 'Must include artisan workbench visual');
  assert.match(craftContent, /ROUTES\.ABOUT/, 'Craftsmanship CTA must navigate to /about');
});

test('HomePage Phase 3 - FeaturedProducts & Demo Catalog Identification', () => {
  const featuredPath = path.resolve(__dirname, '../../src/components/home/FeaturedProducts.tsx');
  const featuredContent = fs.readFileSync(featuredPath, 'utf-8');

  // Clearly identified demo products
  assert.match(featuredContent, /demo|Demo/i, 'Must clearly identify demo products until API connected');

  const cardPath = path.resolve(__dirname, '../../src/components/products/ProductCard.tsx');
  const cardContent = fs.readFileSync(cardPath, 'utf-8');
  assert.match(cardContent, /isDemo/, 'ProductCard must support demo identifier');
  assert.match(cardContent, /aspectRatio:\s*'1\/1'/, 'ProductCard must use 1:1 aspect ratio');
  assert.match(cardContent, /loading="lazy"/, 'ProductCard must optimize image loading');
});
