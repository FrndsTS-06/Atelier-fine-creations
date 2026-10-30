import test from 'node:test';
import assert from 'node:assert/strict';
import { loginSchema } from '../src/modules/auth/auth.schema.js';

test('Auth Schema Validation - Valid Login Attempt', () => {
  const payload = {
    email: 'admin@aurelien.gold',
    password: 'AdminPassword123!',
  };

  const parsed = loginSchema.safeParse(payload);
  assert.equal(parsed.success, true);
});

test('Auth Schema Validation - Missing password fails', () => {
  const payload = {
    email: 'admin@aurelien.gold',
    password: '123',
  };

  const parsed = loginSchema.safeParse(payload);
  assert.equal(parsed.success, false);
});
