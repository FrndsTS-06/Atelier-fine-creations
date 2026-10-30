import test from 'node:test';
import assert from 'node:assert/strict';
import { createInquirySchema } from '../src/modules/inquiries/inquiry.schema.js';

test('Inquiry Schema Validation - Valid VIP Client Inquiry', () => {
  const validInquiry = {
    fullName: 'Duchess of Cambridge',
    email: 'client@royalty.co.uk',
    subject: 'Bespoke 22K Bridal Necklace Suite',
    phone: '+44 20 7946 0991',
    preferredKarat: '22K',
    message: 'Requesting private consultation for bespoke bridal necklace suite.',
    productId: 'prod_99182',
  };

  const result = createInquirySchema.safeParse(validInquiry);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.subject, 'Bespoke 22K Bridal Necklace Suite');
  }
});

test('Inquiry Schema Validation - Invalid Email fails', () => {
  const invalidInquiry = {
    fullName: 'Anonymous',
    email: 'not-an-email',
    phone: '123456',
    message: 'Hello jewelry store',
  };

  const result = createInquirySchema.safeParse(invalidInquiry);
  assert.equal(result.success, false);
});
