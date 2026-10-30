import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROUTES } from '../../src/routes/routePaths';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Design System Tokens - Color Palette Compliance', () => {
  const variablesPath = path.resolve(__dirname, '../../src/styles/variables.css');
  const cssContent = fs.readFileSync(variablesPath, 'utf-8');

  // Exact required colors
  assert.match(cssContent, /--color-obsidian:\s*#0C0B09/i, 'Obsidian black must be #0C0B09');
  assert.match(cssContent, /--color-espresso:\s*#352318/i, 'Espresso brown must be #352318');
  assert.match(cssContent, /--color-champagne:\s*#C49A5A/i, 'Champagne gold must be #C49A5A');
  assert.match(cssContent, /--color-ivory:\s*#F5F0E7/i, 'Ivory cream must be #F5F0E7');
  assert.match(cssContent, /--color-warm-beige:\s*#D8C4A8/i, 'Warm beige must be #D8C4A8');
  assert.match(cssContent, /--color-body:\s*#37312B/i, 'Body text must be #37312B');
});

test('Design System Tokens - Typography Rules Compliance', () => {
  const variablesPath = path.resolve(__dirname, '../../src/styles/variables.css');
  const cssContent = fs.readFileSync(variablesPath, 'utf-8');

  assert.match(cssContent, /Cormorant Garamond/, 'Headings must use Cormorant Garamond');
  assert.match(cssContent, /Playfair Display/, 'Display headings must support Playfair Display');
  assert.match(cssContent, /Inter/, 'Body text and interface controls must use Inter');
});

test('Design System Tokens - Accessibility & Reduced Motion Support', () => {
  const animationsPath = path.resolve(__dirname, '../../src/styles/animations.css');
  const animationsContent = fs.readFileSync(animationsPath, 'utf-8');
  assert.match(animationsContent, /@media\s*\(prefers-reduced-motion:\s*reduce\)/, 'Must include reduced-motion support');

  const globalsPath = path.resolve(__dirname, '../../src/styles/globals.css');
  const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
  assert.match(globalsContent, /:focus-visible/, 'Must include accessible focus-visible styles');
});

test('Navigation - Connects the Four Public Routes', () => {
  assert.equal(ROUTES.HOME, '/');
  assert.equal(ROUTES.GALLERY, '/gallery');
  assert.equal(ROUTES.ABOUT, '/about');
  assert.equal(ROUTES.CONTACT, '/contact');

  // Verify DesktopNavigation includes all 4 routes
  const desktopNavPath = path.resolve(__dirname, '../../src/components/layout/DesktopNavigation.tsx');
  const desktopNavContent = fs.readFileSync(desktopNavPath, 'utf-8');
  assert.match(desktopNavContent, /ROUTES\.HOME/);
  assert.match(desktopNavContent, /ROUTES\.GALLERY/);
  assert.match(desktopNavContent, /ROUTES\.ABOUT/);
  assert.match(desktopNavContent, /ROUTES\.CONTACT/);

  // Verify MobileNavigation includes all 4 routes
  const mobileNavPath = path.resolve(__dirname, '../../src/components/layout/MobileNavigation.tsx');
  const mobileNavContent = fs.readFileSync(mobileNavPath, 'utf-8');
  assert.match(mobileNavContent, /ROUTES\.HOME/);
  assert.match(mobileNavContent, /ROUTES\.GALLERY/);
  assert.match(mobileNavContent, /ROUTES\.ABOUT/);
  assert.match(mobileNavContent, /ROUTES\.CONTACT/);
});

test('Design System - Required Components Existence', () => {
  const requiredCommon = [
    'Container.tsx',
    'Button.tsx',
    'SectionHeading.tsx',
    'Breadcrumbs.tsx',
    'LoadingState.tsx',
    'ErrorState.tsx',
    'EmptyState.tsx',
    'SocialLinks.tsx',
  ];

  for (const file of requiredCommon) {
    const fullPath = path.resolve(__dirname, '../../src/components/common', file);
    assert.equal(fs.existsSync(fullPath), true, `Common component ${file} must exist`);
  }

  const requiredLayout = [
    'SiteHeader.tsx',
    'DesktopNavigation.tsx',
    'MobileNavigation.tsx',
    'SiteFooter.tsx',
    'MainLayout.tsx',
  ];

  for (const file of requiredLayout) {
    const fullPath = path.resolve(__dirname, '../../src/components/layout', file);
    assert.equal(fs.existsSync(fullPath), true, `Layout component ${file} must exist`);
  }
});
