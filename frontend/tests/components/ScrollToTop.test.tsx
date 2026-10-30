import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('ScrollToTop Component - Implementation and Router Integration', () => {
  // 1. Verify ScrollToTop.tsx file exists
  const scrollToTopPath = path.resolve(__dirname, '../../src/components/common/ScrollToTop.tsx');
  assert.equal(fs.existsSync(scrollToTopPath), true, 'ScrollToTop.tsx must exist');

  const content = fs.readFileSync(scrollToTopPath, 'utf-8');
  assert.match(content, /useLocation/, 'Must use useLocation hook');
  assert.match(content, /window\.scrollTo/, 'Must call window.scrollTo');
  assert.match(content, /pathname/, 'Must listen to pathname changes');
  assert.match(content, /hash/, 'Must support in-page hash links');

  // 2. Verify App.tsx integration
  const appPath = path.resolve(__dirname, '../../src/App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf-8');
  assert.match(appContent, /<ScrollToTop\s*\/>/, 'App.tsx must render ScrollToTop component');
  assert.match(appContent, /<BrowserRouter>[\s\S]*<ScrollToTop\s*\/>[\s\S]*<AppRouter\s*\/>/, 'ScrollToTop must be rendered inside BrowserRouter and above AppRouter');
});
