import { Router } from 'express';
import { login, getMe } from './auth.controller.js';
import { validate } from '../../middleware/validate.js';
import { loginSchema } from './auth.schema.js';
import { authenticate } from '../../middleware/authenticate.js';
import { rateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

// Rate limited login endpoint (5 attempts per 15 minutes to protect against brute force)
router.post(
  '/login',
  rateLimiter({ maxRequests: 5, windowMs: 15 * 60 * 1000 }),
  validate(loginSchema),
  login
);
router.get('/me', authenticate, getMe);

export default router;
