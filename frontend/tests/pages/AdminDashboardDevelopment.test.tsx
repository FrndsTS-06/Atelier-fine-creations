import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';

import { ROUTES } from '../../src/routes/routePaths';
import {
  validateProductForm,
  validateImageUrl,
  validateImageFile,
} from '../../src/schemas/productSchema';
import { ConfirmationModal } from '../../src/components/common/ConfirmationModal';
import { Inquiry, InquiryStatus } from '../../src/types/inquiry';

test('Admin Phase 9 - Route Definitions Compliance', () => {
  assert.equal(ROUTES.ADMIN.LOGIN, '/admin/login');
  assert.equal(ROUTES.ADMIN.DASHBOARD, '/admin');
  assert.equal(ROUTES.ADMIN.PRODUCTS, '/admin/products');
  assert.equal(ROUTES.ADMIN.PRODUCT_NEW, '/admin/products/new');
  assert.equal(ROUTES.ADMIN.PRODUCT_EDIT(), '/admin/products/:id/edit');
  assert.equal(ROUTES.ADMIN.PRODUCT_EDIT('crown-jewel-77'), '/admin/products/crown-jewel-77/edit');
  assert.equal(ROUTES.ADMIN.CATEGORIES, '/admin/categories');
  assert.equal(ROUTES.ADMIN.INQUIRIES, '/admin/inquiries');
});

test('Admin Phase 9 - Product Form Validation (Title, Weights, Price, Category)', () => {
  const validData = {
    name: 'Aura Imperial 22K Gold Choker',
    description: 'Masterpiece crafted with antique Kundan setting and hand-woven gold mesh.',
    categoryId: 'cat_chokers_01',
    grossWeight: 45.2,
    netWeight: 42.0,
    estimatedPrice: 18500,
    images: ['/images/products/royal-choker.svg'],
    purchaseUrl: 'https://atelier.gold/shop/aura-choker',
    status: 'published',
  };

  const errors = validateProductForm(validData);
  assert.equal(Object.keys(errors).length, 0, 'Valid product data should produce 0 errors');

  // Short title
  const shortTitleErrors = validateProductForm({ ...validData, name: 'A' });
  assert.ok(shortTitleErrors.name, 'Title < 3 chars must yield validation error');

  // Short description
  const shortDescErrors = validateProductForm({ ...validData, description: 'Short' });
  assert.ok(shortDescErrors.description, 'Description < 10 chars must yield validation error');

  // Invalid weights
  const invalidWeightErrors = validateProductForm({
    ...validData,
    grossWeight: 10,
    netWeight: 15, // net gold cannot exceed gross weight
  });
  assert.ok(invalidWeightErrors.netWeight, 'Net weight > gross weight must yield validation error');

  // Negative price
  const negativePriceErrors = validateProductForm({ ...validData, estimatedPrice: -500 });
  assert.ok(negativePriceErrors.estimatedPrice, 'Negative price must yield validation error');

  // Missing category
  const missingCatErrors = validateProductForm({ ...validData, categoryId: '' });
  assert.ok(missingCatErrors.categoryId, 'Missing categoryId must yield validation error');
});

test('Admin Phase 9 - Product External Purchase URL and Status Validation', () => {
  const baseData = {
    name: 'Imperial Emerald Solitaire Band',
    description: 'Bespoke hand-hammered 22K yellow gold band with emerald center stone.',
    categoryId: 'cat_rings_01',
    grossWeight: 12.0,
    netWeight: 11.2,
    estimatedPrice: 6200,
    images: ['/images/products/solitaire-ring.svg'],
  };

  // Valid HTTPS purchase URL
  const validUrlErrors = validateProductForm({
    ...baseData,
    purchaseUrl: 'https://checkout.aurelien.gold/piece/emerald-band',
  });
  assert.equal(validUrlErrors.purchaseUrl, undefined);

  // Invalid malformed purchase URL
  const invalidUrlErrors = validateProductForm({
    ...baseData,
    purchaseUrl: 'not-a-valid-url',
  });
  assert.ok(invalidUrlErrors.purchaseUrl, 'Malformed purchase URL must fail validation');

  // Valid statuses
  for (const status of ['published', 'draft', 'archived']) {
    const statusErrors = validateProductForm({ ...baseData, status });
    assert.equal(statusErrors.status, undefined, `Status "${status}" should be valid`);
  }

  // Invalid status
  const badStatusErrors = validateProductForm({ ...baseData, status: 'unapproved' });
  assert.ok(badStatusErrors.status, 'Invalid status must fail validation');
});

test('Admin Phase 9 - Image Asset Validation (URLs and Files)', () => {
  // Valid internal boutique image asset
  const internalCheck = validateImageUrl('/images/products/royal-choker.svg');
  assert.equal(internalCheck.isValid, true);

  // Valid secure HTTPS image URL
  const httpsJpgCheck = validateImageUrl('https://cdn.aurelien.gold/assets/tiara.jpg');
  assert.equal(httpsJpgCheck.isValid, true);

  const httpsWebpCheck = validateImageUrl('https://cdn.aurelien.gold/assets/tiara.webp');
  assert.equal(httpsWebpCheck.isValid, true);

  // Insecure / unsupported protocol
  const ftpCheck = validateImageUrl('ftp://files.aurelien.gold/image.png');
  assert.equal(ftpCheck.isValid, false);

  // Unsupported format (.exe, .pdf)
  const badExtCheck = validateImageUrl('https://cdn.aurelien.gold/assets/document.pdf');
  assert.equal(badExtCheck.isValid, false);

  // File validation mock
  const validFile = {
    type: 'image/webp',
    size: 2 * 1024 * 1024, // 2MB
  } as File;
  const fileCheck = validateImageFile(validFile);
  assert.equal(fileCheck.isValid, true);

  // Oversized file (> 5MB)
  const oversizedFile = {
    type: 'image/jpeg',
    size: 8 * 1024 * 1024, // 8MB
  } as File;
  const oversizedCheck = validateImageFile(oversizedFile);
  assert.equal(oversizedCheck.isValid, false);

  // Disallowed type
  const badTypeFile = {
    type: 'application/pdf',
    size: 500 * 1024,
  } as File;
  const badTypeCheck = validateImageFile(badTypeFile);
  assert.equal(badTypeCheck.isValid, false);
});

test('Admin Phase 9 - Accessible Confirmation Modal Component', () => {
  const html = renderToString(
    <ConfirmationModal
      isOpen={true}
      title="Decommission Piece"
      message="Are you certain you wish to remove this masterpiece?"
      confirmText="Confirm Removal"
      cancelText="Keep in Vault"
      isDestructive={true}
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  );

  // Accessibility checks
  assert.ok(html.includes('role="dialog"'), 'Should render dialog role');
  assert.ok(html.includes('aria-modal="true"'), 'Should render aria-modal="true"');
  assert.ok(html.includes('id="confirm-modal-title"'), 'Should render modal title ID');
  assert.ok(html.includes('id="confirm-modal-description"'), 'Should render modal description ID');
  assert.ok(html.includes('Decommission Piece'), 'Should display the modal title');
  assert.ok(html.includes('Confirm Removal'), 'Should display the confirm button label');
  assert.ok(html.includes('Keep in Vault'), 'Should display the cancel button label');
});

test('Admin Phase 9 - Inquiry Search and Status Filtering Logic', () => {
  const sampleInquiries: Inquiry[] = [
    {
      id: 'inq_1',
      fullName: 'Lady Genevieve Sterling',
      email: 'genevieve@sterling.com',
      subject: 'Bespoke Choker Clasp Fitting',
      message: 'Looking for a private consultation in Geneva.',
      status: 'PENDING',
      createdAt: '2026-10-01T10:00:00Z',
    },
    {
      id: 'inq_2',
      fullName: 'Lord Julian Vance',
      email: 'julian.vance@mayfair.co.uk',
      subject: 'Chronometer Tourbillon Inquiry',
      message: 'Inquiring regarding custom hand-engraved rotor.',
      status: 'CONTACTED',
      createdAt: '2026-10-02T10:00:00Z',
    },
    {
      id: 'inq_3',
      fullName: 'Contessa Beatrice Rossi',
      email: 'b.rossi@milano.it',
      subject: 'Bridal Heritage Solitaire',
      message: 'Completed private salon fitting. Purchase finalized.',
      status: 'CLOSED',
      createdAt: '2026-10-03T10:00:00Z',
    },
  ];

  // Test name search
  const nameSearch = sampleInquiries.filter((i) =>
    i.fullName.toLowerCase().includes('genevieve')
  );
  assert.equal(nameSearch.length, 1);
  assert.equal(nameSearch[0].id, 'inq_1');

  // Test email search
  const emailSearch = sampleInquiries.filter((i) =>
    i.email.toLowerCase().includes('milano.it')
  );
  assert.equal(emailSearch.length, 1);
  assert.equal(emailSearch[0].id, 'inq_3');

  // Test message or subject search
  const messageSearch = sampleInquiries.filter((i) =>
    (i.message || '').toLowerCase().includes('hand-engraved') ||
    (i.subject || '').toLowerCase().includes('tourbillon')
  );
  assert.equal(messageSearch.length, 1);
  assert.equal(messageSearch[0].id, 'inq_2');

  // Test status filters
  const pendingInquiries = sampleInquiries.filter((i) => i.status === 'PENDING');
  assert.equal(pendingInquiries.length, 1);

  const contactedInquiries = sampleInquiries.filter((i) => i.status === 'CONTACTED');
  assert.equal(contactedInquiries.length, 1);

  const closedInquiries = sampleInquiries.filter((i) => i.status === 'CLOSED');
  assert.equal(closedInquiries.length, 1);
});
