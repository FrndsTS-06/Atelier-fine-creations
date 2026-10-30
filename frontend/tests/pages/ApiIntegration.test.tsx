import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ApiError } from '../../src/services/apiClient';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('API Integration Phase 8 - ApiClient Architecture & Offline Classification', () => {
  const clientPath = path.resolve(__dirname, '../../src/services/apiClient.ts');
  const clientContent = fs.readFileSync(clientPath, 'utf-8');

  // Must read VITE_API_BASE_URL
  assert.match(clientContent, /VITE_API_BASE_URL/, 'Must read VITE_API_BASE_URL');

  // Must support AbortSignal for stale search cancellation
  assert.match(clientContent, /signal\?: AbortSignal/, 'Must accept AbortSignal');

  // Must have ApiError classification
  const error = new ApiError('Atelier offline', 0, 'OFFLINE', true);
  assert.equal(error.isOffline, true);
  assert.equal(error.code, 'OFFLINE');
  assert.equal(error.message, 'Atelier offline');

  // Must not expose database credentials
  assert.equal(clientContent.includes('passwordHash'), false);
  assert.equal(clientContent.includes('DATABASE_URL'), false);
});

test('API Integration Phase 8 - ProductService Queries Real API Without Silent Mock Substitution', () => {
  const servicePath = path.resolve(__dirname, '../../src/services/productService.ts');
  const serviceContent = fs.readFileSync(servicePath, 'utf-8');

  // Query parameter building
  assert.match(serviceContent, /params\.append\('category',/);
  assert.match(serviceContent, /params\.append\('search',/);
  assert.match(serviceContent, /params\.append\('sortBy',/);
  assert.match(serviceContent, /request<PaginatedResult<Product>>\(`\/products\$\{qs\}`/);

  // Must NOT contain silent fallback to DEMO_PRODUCTS on catch block
  assert.equal(
    serviceContent.includes('catch (err) {\n      // Graceful fallback to demo catalog'),
    false,
    'ProductService must NOT silently mask API failures with demo data'
  );

  // getProduct single item lookup
  assert.match(serviceContent, /request<Product>\(`\/products\/\$\{idOrSlug\}`/);
});

test('API Integration Phase 8 - CategoryService Real Endpoint Integration', () => {
  const servicePath = path.resolve(__dirname, '../../src/services/categoryService.ts');
  const serviceContent = fs.readFileSync(servicePath, 'utf-8');

  // Must directly query /categories
  assert.match(serviceContent, /request<Category\[\]>\('\/categories'/);

  // Must not silently substitute DEMO_CATEGORIES
  assert.equal(
    serviceContent.includes('catch (err) {\n      return DEMO_CATEGORIES;'),
    false,
    'CategoryService must not silently replace failed API responses with mock data'
  );
});

test('API Integration Phase 8 - useProducts Hook AbortController & State Machine', () => {
  const hookPath = path.resolve(__dirname, '../../src/hooks/useProducts.ts');
  const hookContent = fs.readFileSync(hookPath, 'utf-8');

  // AbortController to cancel stale search queries and avoid duplicate requests
  assert.match(hookContent, /abortControllerRef/, 'Must manage AbortController ref');
  assert.match(hookContent, /abortControllerRef\.current\.abort\(\)/, 'Must cancel in-flight requests');
  assert.match(hookContent, /err\.name === 'AbortError'/, 'Must ignore AbortError so state is not polluted');

  // All 5 states supported: loading, empty, error, offline, success
  assert.match(hookContent, /loading,\s*setLoading/);
  assert.match(hookContent, /error,\s*setError/);
  assert.match(hookContent, /isOffline,\s*setIsOffline/);
  assert.match(hookContent, /const isEmpty = !loading && !error && products\.length === 0/);
  assert.match(hookContent, /const isSuccess = !loading && !error/);

  // Pagination support
  assert.match(hookContent, /page,\s*setPage/);
  assert.match(hookContent, /totalPages,\s*setTotalPages/);
});

test('API Integration Phase 8 - useCategories Hook AbortController & Offline Detection', () => {
  const hookPath = path.resolve(__dirname, '../../src/hooks/useCategories.ts');
  const hookContent = fs.readFileSync(hookPath, 'utf-8');

  assert.match(hookContent, /abortControllerRef/);
  assert.match(hookContent, /isOffline/);
  assert.match(hookContent, /refetch:\s*fetchCategories/);
});

test('API Integration Phase 8 - FeaturedProducts Integrates Real States & Lightbox', () => {
  const featuredPath = path.resolve(__dirname, '../../src/components/home/FeaturedProducts.tsx');
  const featuredContent = fs.readFileSync(featuredPath, 'utf-8');

  // Uses useProducts hook with sortBy: featured
  assert.match(featuredContent, /useProducts\(\{\s*sortBy:\s*'featured'/);

  // Renders states: LoadingState, ErrorState, Empty, Active
  assert.match(featuredContent, /<LoadingState/);
  assert.match(featuredContent, /<ErrorState/);
  assert.match(featuredContent, /featured\.length === 0/);
  assert.match(featuredContent, /featured\.map\(/);

  // Lightbox integration
  assert.match(featuredContent, /<ProductLightbox/);
});

test('API Integration Phase 8 - ProductGallery Suite Integration', () => {
  const galleryPath = path.resolve(__dirname, '../../src/components/products/ProductGallery.tsx');
  const galleryContent = fs.readFileSync(galleryPath, 'utf-8');

  // Search, Sort, Filters, Grid, Lightbox integration
  assert.match(galleryContent, /<ProductSearch/);
  assert.match(galleryContent, /<ProductSort/);
  assert.match(galleryContent, /<ProductFilters/);
  assert.match(galleryContent, /<ProductGrid/);
  assert.match(galleryContent, /<ProductLightbox/);

  // Loading and Error state handling
  assert.match(galleryContent, /<LoadingState/);
  assert.match(galleryContent, /<ErrorState/);
});
