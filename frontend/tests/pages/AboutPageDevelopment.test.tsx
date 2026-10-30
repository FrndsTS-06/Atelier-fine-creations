import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('AboutPage Phase 5 - Breadcrumbs and Exact Heading', () => {
  const aboutPath = path.resolve(__dirname, '../../src/pages/AboutPage.tsx');
  const aboutContent = fs.readFileSync(aboutPath, 'utf-8');

  // Breadcrumbs
  assert.match(aboutContent, /label:\s*'Home'/);
  assert.match(aboutContent, /label:\s*'About Us'/);

  // Exact Heading: A Passion for Timeless Craftsmanship.
  assert.match(
    aboutContent,
    /A Passion for.*Timeless Craftsmanship\./s,
    'About page must have exact heading: A Passion for Timeless Craftsmanship.'
  );

  // Dual CTAs to Gallery and Contact
  assert.match(aboutContent, /ROUTES\.GALLERY/, 'About page must link to Gallery');
  assert.match(aboutContent, /ROUTES\.CONTACT/, 'About page must link to Contact');
});

test('AboutPage Phase 5 - BrandStory & Workshop Photography', () => {
  const storyPath = path.resolve(__dirname, '../../src/components/about/BrandStory.tsx');
  const storyContent = fs.readFileSync(storyPath, 'utf-8');

  // Workshop visual
  assert.match(storyContent, /workshop\.jpg/, 'Must include workshop photography');

  // Craftsmanship narrative
  assert.match(storyContent, /Fine Jewelry/i);
  assert.match(storyContent, /Horology & Leather|Watches/i);

  // Neutral copy constraints - must NOT contain invented years or fake histories
  assert.equal(storyContent.includes('1928'), false, 'Must not invent company founding year');
  assert.equal(storyContent.includes('four generations'), false, 'Must not invent generations of history');
});

test('AboutPage Phase 5 - CraftsmanshipProcess 4 Stages', () => {
  const processPath = path.resolve(__dirname, '../../src/components/about/CraftsmanshipProcess.tsx');
  const processContent = fs.readFileSync(processPath, 'utf-8');

  // 1. Design and inspiration process
  assert.match(processContent, /Design & Inspiration/i);
  // 2. Material selection
  assert.match(processContent, /Material Selection/i);
  // 3. Precision craftsmanship
  assert.match(processContent, /Precision Craftsmanship/i);
  // 4. Finishing and presentation
  assert.match(processContent, /Finishing & Presentation/i);
});

test('AboutPage Phase 5 - BrandValues Restrained Pillars', () => {
  const valuesPath = path.resolve(__dirname, '../../src/components/about/BrandValues.tsx');
  const valuesContent = fs.readFileSync(valuesPath, 'utf-8');

  // 4 restrained values
  assert.match(valuesContent, /Material Integrity/i);
  assert.match(valuesContent, /Unrushed Discipline/i);
  assert.match(valuesContent, /Enduring Proportion/i);
  assert.match(valuesContent, /Client Dedication/i);
});
