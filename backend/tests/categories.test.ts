import test from 'node:test';
import assert from 'node:assert/strict';

test('Category Slug Generation Logic', () => {
  function slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  assert.equal(slugify('Bridal & Royal Sets'), 'bridal-royal-sets');
  assert.equal(slugify('22K Solitaire Rings!'), '22k-solitaire-rings');
});
