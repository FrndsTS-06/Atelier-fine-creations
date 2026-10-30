import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';

import { MainLayout } from '../../src/components/layout/MainLayout';
import { HeroSection } from '../../src/components/home/HeroSection';
import { CollectionHighlights } from '../../src/components/home/CollectionHighlights';
import { ProductCard } from '../../src/components/products/ProductCard';
import { Product } from '../../src/types/product';
import { MemoryRouter } from 'react-router-dom';

test('Production Quality Phase 10 - SEO Metadata & Open Graph Definitions', () => {
  // Read index.html to verify static fallback tags
  const indexPath = path.resolve('frontend/index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf-8');

  // Verify Title and Meta
  assert.ok(indexHtml.includes('<title>ATELIER FINE CREATIONS'), 'Must have branded title');
  assert.ok(indexHtml.includes('name="description"'), 'Must have meta description');
  assert.ok(indexHtml.includes('rel="canonical"'), 'Must define canonical link');

  // Verify Open Graph tags
  assert.ok(indexHtml.includes('property="og:type"'), 'Must have og:type');
  assert.ok(indexHtml.includes('property="og:title"'), 'Must have og:title');
  assert.ok(indexHtml.includes('property="og:description"'), 'Must have og:description');
  assert.ok(indexHtml.includes('property="og:image"'), 'Must have og:image');
  assert.ok(indexHtml.includes('property="og:url"'), 'Must have og:url');

  // Verify Twitter Card tags
  assert.ok(indexHtml.includes('name="twitter:card"'), 'Must have twitter:card');
  assert.ok(indexHtml.includes('name="twitter:title"'), 'Must have twitter:title');
  assert.ok(indexHtml.includes('name="twitter:description"'), 'Must have twitter:description');
  assert.ok(indexHtml.includes('name="twitter:image"'), 'Must have twitter:image');

  // Verify Structured Data JSON-LD
  assert.ok(indexHtml.includes('type="application/ld+json"'), 'Must have JSON-LD structured data');
  assert.ok(indexHtml.includes('"@type": "JewelryStore"'), 'Must declare JewelryStore schema');
  assert.ok(indexHtml.includes('"priceRange": "$$$$"'), 'Must specify price range');
});

test('Production Quality Phase 10 - Robots.txt and Sitemap.xml Compliance', () => {
  // 1. Robots.txt
  const robotsPath = path.resolve('frontend/public/robots.txt');
  assert.ok(fs.existsSync(robotsPath), 'robots.txt must exist in public folder');
  const robotsTxt = fs.readFileSync(robotsPath, 'utf-8');
  assert.ok(robotsTxt.includes('User-agent: *'), 'robots.txt must declare User-agent');
  assert.ok(robotsTxt.includes('Disallow: /admin'), 'robots.txt must protect /admin routes');
  assert.ok(robotsTxt.includes('Sitemap: https://www.aurelien.gold/sitemap.xml'), 'robots.txt must point to sitemap.xml');

  // 2. Sitemap.xml
  const sitemapPath = path.resolve('frontend/public/sitemap.xml');
  assert.ok(fs.existsSync(sitemapPath), 'sitemap.xml must exist in public folder');
  const sitemapXml = fs.readFileSync(sitemapPath, 'utf-8');
  assert.ok(sitemapXml.includes('<loc>https://www.aurelien.gold/</loc>'), 'Sitemap must contain home URL');
  assert.ok(sitemapXml.includes('<loc>https://www.aurelien.gold/gallery</loc>'), 'Sitemap must contain gallery URL');
  assert.ok(sitemapXml.includes('<loc>https://www.aurelien.gold/about</loc>'), 'Sitemap must contain about URL');
  assert.ok(sitemapXml.includes('<loc>https://www.aurelien.gold/contact</loc>'), 'Sitemap must contain contact URL');
  assert.ok(!sitemapXml.includes('/admin'), 'Sitemap must never expose private admin routes');
});

test('Production Quality Phase 10 - Semantic Landmarks and Keyboard Skip Link', () => {
  const html = renderToString(
    <MemoryRouter>
      <MainLayout />
    </MemoryRouter>
  );

  // Semantic landmarks
  assert.ok(html.includes('<header'), 'Must render semantic <header> landmark');
  assert.ok(html.includes('<nav'), 'Must render semantic <nav> landmark');
  assert.ok(html.includes('<main id="main-content"'), 'Must render semantic <main> landmark with id');
  assert.ok(html.includes('<footer'), 'Must render semantic <footer> landmark');

  // Skip to main content link for keyboard navigation
  assert.ok(html.includes('href="#main-content"'), 'Must render skip link pointing to main content');
  assert.ok(html.includes('Skip to main content'), 'Skip link text must be descriptive');
});

test('Production Quality Phase 10 - Focus Visible & Reduced Motion Tokens in CSS', () => {
  // Focus ring in variables.css
  const varPath = path.resolve('frontend/src/styles/variables.css');
  const varCss = fs.readFileSync(varPath, 'utf-8');
  assert.ok(varCss.includes('--focus-ring:'), 'variables.css must define --focus-ring token');

  // Focus visible in globals.css
  const globalPath = path.resolve('frontend/src/styles/globals.css');
  const globalCss = fs.readFileSync(globalPath, 'utf-8');
  assert.ok(globalCss.includes(':focus-visible'), 'globals.css must apply :focus-visible rules');

  // Reduced motion support in animations.css
  const animPath = path.resolve('frontend/src/styles/animations.css');
  const animCss = fs.readFileSync(animPath, 'utf-8');
  assert.ok(animCss.includes('@media (prefers-reduced-motion: reduce)'), 'animations.css must support reduced motion');
  assert.ok(animCss.includes('animation-duration: 0.01ms !important'), 'Animations must be neutralized when reduced motion preferred');
});

test('Production Quality Phase 10 - Performance & Image Optimizations', () => {
  // 1. HeroSection prioritized hero image
  const heroHtml = renderToString(
    <MemoryRouter>
      <HeroSection />
    </MemoryRouter>
  );
  assert.ok(heroHtml.includes('loading="eager"'), 'Hero image must have eager loading');
  assert.ok(heroHtml.includes('decoding="async"'), 'Hero image must have async decoding');
  assert.ok(heroHtml.includes('width="800"'), 'Hero image must have reserved width to prevent CLS');
  assert.ok(heroHtml.includes('height="500"'), 'Hero image must have reserved height to prevent CLS');

  // 2. CollectionHighlights below-the-fold image lazy loading
  const highlightsHtml = renderToString(
    <MemoryRouter>
      <CollectionHighlights />
    </MemoryRouter>
  );
  assert.ok(highlightsHtml.includes('loading="lazy"'), 'Collection images must be lazy-loaded');
  assert.ok(highlightsHtml.includes('decoding="async"'), 'Collection images must have async decoding');
  assert.ok(highlightsHtml.includes('width="480"'), 'Collection images must have reserved width');
  assert.ok(highlightsHtml.includes('height="360"'), 'Collection images must have reserved height');

  // 3. ProductCard lazy loading and dimensions
  const testProduct: Product = {
    id: 'prod_test',
    name: 'Aura Imperial 22K Gold Choker',
    slug: 'aura-imperial-22k-gold-choker',
    description: 'Exquisite 22K gold necklace with certified gemstones.',
    purity: '22K',
    grossWeight: 45.0,
    netWeight: 42.0,
    makingCharges: 450,
    estimatedPrice: 18500,
    hallmarkCertified: true,
    inStock: true,
    isFeatured: true,
    images: ['/images/products/royal-choker.svg'],
    categoryId: 'cat_01',
  };

  const cardHtml = renderToString(
    <MemoryRouter>
      <ProductCard product={testProduct} />
    </MemoryRouter>
  );
  assert.ok(cardHtml.includes('loading="lazy"'), 'ProductCard image must be lazy loaded');
  assert.ok(cardHtml.includes('decoding="async"'), 'ProductCard image must be asynchronously decoded');
  assert.ok(cardHtml.includes('width="400"'), 'ProductCard image must have reserved width');
  assert.ok(cardHtml.includes('height="400"'), 'ProductCard image must have reserved height');
  assert.ok(cardHtml.includes('alt="Aura Imperial 22K Gold Choker'), 'ProductCard image must have descriptive alt text');
});
