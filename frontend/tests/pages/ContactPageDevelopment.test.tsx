import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { contactFormSchema } from '../../src/schemas/contactSchema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('ContactPage Phase 6 - contactFormSchema Validation Boundaries', () => {
  // Valid complete submission
  const validData = {
    fullName: 'Lady Vivienne Montgomery',
    email: 'vivienne@montgomery-estate.co.uk',
    subject: 'Bespoke 22K Signet Ring Commission',
    message: 'I would like to inquire regarding a bespoke 22K signet ring with family crest engraving.',
    phone: '+44 20 7946 0192',
    preferredKarat: '22K',
  };
  const validResult = contactFormSchema.safeParse(validData);
  assert.equal(validResult.success, true, 'Valid form data must pass schema validation');

  // Valid minimal submission (optional phone omitted)
  const minimalData = {
    fullName: 'Lord Sterling',
    email: 'sterling@luxury.org',
    subject: 'Watch Commission',
    message: 'Inquiring about chronometer timepiece availability.',
  };
  const minimalResult = contactFormSchema.safeParse(minimalData);
  assert.equal(minimalResult.success, true, 'Minimal form data with optional phone omitted must pass');

  // Full name bounds: required, min 2, max 100
  const emptyName = contactFormSchema.safeParse({ ...validData, fullName: '' });
  assert.equal(emptyName.success, false, 'Empty full name must fail');

  const shortName = contactFormSchema.safeParse({ ...validData, fullName: 'A' });
  assert.equal(shortName.success, false, '1-character full name must fail');

  const name100 = contactFormSchema.safeParse({ ...validData, fullName: 'A'.repeat(100) });
  assert.equal(name100.success, true, '100-character full name must pass');

  const longName = contactFormSchema.safeParse({ ...validData, fullName: 'A'.repeat(101) });
  assert.equal(longName.success, false, '101-character full name must fail');

  // Email format validation
  const invalidEmail = contactFormSchema.safeParse({ ...validData, email: 'not-an-email' });
  assert.equal(invalidEmail.success, false, 'Malformed email address must fail');

  const emptyEmail = contactFormSchema.safeParse({ ...validData, email: '' });
  assert.equal(emptyEmail.success, false, 'Empty email must fail');

  // Subject bounds: required, min 3, max 150
  const emptySubject = contactFormSchema.safeParse({ ...validData, subject: '' });
  assert.equal(emptySubject.success, false, 'Empty subject must fail');

  const shortSubject = contactFormSchema.safeParse({ ...validData, subject: 'Hi' });
  assert.equal(shortSubject.success, false, '2-character subject must fail');

  const subject150 = contactFormSchema.safeParse({ ...validData, subject: 'S'.repeat(150) });
  assert.equal(subject150.success, true, '150-character subject must pass');

  const longSubject = contactFormSchema.safeParse({ ...validData, subject: 'S'.repeat(151) });
  assert.equal(longSubject.success, false, '151-character subject must fail');

  // Message length limits: required, min 10, max 2000
  const emptyMessage = contactFormSchema.safeParse({ ...validData, message: '' });
  assert.equal(emptyMessage.success, false, 'Empty message must fail');

  const shortMessage = contactFormSchema.safeParse({ ...validData, message: '123456789' });
  assert.equal(shortMessage.success, false, '9-character message must fail');

  const minMessage = contactFormSchema.safeParse({ ...validData, message: '1234567890' });
  assert.equal(minMessage.success, true, '10-character message must pass');

  const maxMessage = contactFormSchema.safeParse({ ...validData, message: 'M'.repeat(2000) });
  assert.equal(maxMessage.success, true, '2000-character message must pass');

  const overflowMessage = contactFormSchema.safeParse({ ...validData, message: 'M'.repeat(2001) });
  assert.equal(overflowMessage.success, false, '2001-character message must fail');
});

test('ContactPage Phase 6 - ContactForm Accessibility and ARIA Attributes', () => {
  const formPath = path.resolve(__dirname, '../../src/components/contact/ContactForm.tsx');
  const formContent = fs.readFileSync(formPath, 'utf-8');

  // Form label and landmark
  assert.match(formContent, /aria-label="Private Salon Consultation Form"/, 'Form must have descriptive aria-label');

  // Field-level accessibility attributes
  assert.match(formContent, /id="fullName"/, 'Full name input must have explicit id');
  assert.match(formContent, /aria-required="true"/, 'Required fields must declare aria-required');
  assert.match(formContent, /aria-invalid=\{!!errors\.fullName\}/, 'Must bind aria-invalid to fullName error state');
  assert.match(formContent, /aria-describedby=\{errors\.fullName \? 'fullName-error' : undefined\}/, 'Must associate error ID via aria-describedby');

  assert.match(formContent, /id="email"/, 'Email input must have explicit id');
  assert.match(formContent, /aria-invalid=\{!!errors\.email\}/, 'Must bind aria-invalid to email error state');
  assert.match(formContent, /aria-describedby=\{errors\.email \? 'email-error' : undefined\}/, 'Must associate email error ID');

  assert.match(formContent, /id="subject"/, 'Subject input must have explicit id');
  assert.match(formContent, /aria-invalid=\{!!errors\.subject\}/, 'Must bind aria-invalid to subject error state');
  assert.match(formContent, /aria-describedby=\{errors\.subject \? 'subject-error' : undefined\}/, 'Must associate subject error ID');

  assert.match(formContent, /id="message"/, 'Message textarea must have explicit id');
  assert.match(formContent, /aria-invalid=\{!!errors\.message\}/, 'Must bind aria-invalid to message error state');
  assert.match(formContent, /aria-describedby=\{errors\.message \? 'message-error' : undefined\}/, 'Must associate message error ID');

  // Error announcements with role="alert"
  assert.match(formContent, /id="fullName-error"[\s\S]*?role="alert"/, 'Full name error must have role="alert"');
  assert.match(formContent, /id="email-error"[\s\S]*?role="alert"/, 'Email error must have role="alert"');
  assert.match(formContent, /id="subject-error"[\s\S]*?role="alert"/, 'Subject error must have role="alert"');
  assert.match(formContent, /id="message-error"[\s\S]*?role="alert"/, 'Message error must have role="alert"');

  // Live regions for success & failure
  assert.match(formContent, /role="status"[\s\S]*?aria-live="polite"/, 'Success state must announce via polite live region');
  assert.match(formContent, /role="alert"[\s\S]*?aria-live="assertive"/, 'Failure state must announce via assertive live region');
});

test('ContactPage Phase 6 - Loading State & Duplicate Submission Guard', () => {
  const formPath = path.resolve(__dirname, '../../src/components/contact/ContactForm.tsx');
  const formContent = fs.readFileSync(formPath, 'utf-8');

  // Input disabling during submission
  assert.match(formContent, /disabled=\{isSubmitting\}/, 'Form fields must be disabled during submission');

  // Button submission state & double click guard
  assert.match(formContent, /isLoading=\{isSubmitting\}/, 'Button must display loading state');
  assert.match(formContent, /Transmitting to Concierge\.\.\./, 'Button must show clear submitting status message');

  // Character counter for message length limits
  assert.match(formContent, /\{messageValue\.length\} \/ 2000/, 'Form must display live message character counter');
});

test('ContactPage Phase 6 - Inquiry Service Abstraction & No False Successes', () => {
  const servicePath = path.resolve(__dirname, '../../src/services/inquiryService.ts');
  const serviceContent = fs.readFileSync(servicePath, 'utf-8');

  // Must call real endpoint
  assert.match(serviceContent, /request<Inquiry>\('\/inquiries'/, 'Service must invoke POST /inquiries');

  // Must NOT fabricate mock fallback IDs on failure
  assert.equal(
    serviceContent.includes('mock_inq_'),
    false,
    'Service must NOT invent mock IDs or return false successes on network error'
  );

  // Form preserves inputs on recoverable failure
  const formPath = path.resolve(__dirname, '../../src/components/contact/ContactForm.tsx');
  const formContent = fs.readFileSync(formPath, 'utf-8');
  assert.match(
    formContent,
    /setApiError\(failureMessage\)/,
    'Form must catch error, set error alert, and preserve input fields'
  );
  assert.match(
    formContent,
    /Your entered details have been preserved/,
    'Form must notify client that data has been preserved for retry'
  );
});

test('ContactPage Phase 6 - Verified Details & Responsive Layout', () => {
  const pagePath = path.resolve(__dirname, '../../src/pages/ContactPage.tsx');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');

  // Breadcrumbs: Home / Private Concierge
  assert.match(pageContent, /label:\s*'Home'/);
  assert.match(pageContent, /label:\s*'Private Concierge'/);

  // Section heading
  assert.match(pageContent, /title="Private Salon Consultation"/);

  // Verified Salon locations
  assert.match(pageContent, /Place Vendôme/);
  assert.match(pageContent, /Fifth Avenue/);

  // Verified Direct Channels
  assert.match(pageContent, /\+1 \(800\) 555-GOLD/);
  assert.match(pageContent, /concierge@atelierfinecreations\.gold/);

  // Conditional rendering guards for verified details
  assert.match(pageContent, /verifiedContact\.salons && verifiedContact\.salons\.length > 0/);
  assert.match(pageContent, /verifiedContact\.phone &&/);
  assert.match(pageContent, /verifiedContact\.email &&/);
  assert.match(pageContent, /verifiedContact\.hours &&/);

  // Social Links integration
  assert.match(pageContent, /<SocialLinks/);

  // Responsive two-column layout
  assert.match(pageContent, /gridTemplateColumns:\s*'repeat\(auto-fit,\s*minmax\(min\(100%,\s*460px\),\s*1fr\)\)'/);
});
