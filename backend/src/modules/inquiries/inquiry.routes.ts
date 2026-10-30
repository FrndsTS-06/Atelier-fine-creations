import { Router } from 'express';
import { submitInquiry, listInquiries, updateInquiry } from './inquiry.controller.js';
import { validate } from '../../middleware/validate.js';
import { createInquirySchema, updateInquiryStatusSchema } from './inquiry.schema.js';
import { rateLimiter } from '../../middleware/rateLimiter.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

// Public submission with rate limiting protection
router.post(
  '/',
  rateLimiter({ maxRequests: 5, windowMs: 15 * 60 * 1000 }), // 5 per 15 min
  validate(createInquirySchema),
  submitInquiry
);

// Protected staff access
router.get('/', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), listInquiries);
router.patch(
  '/:id/status',
  authenticate,
  authorize(['ADMIN', 'SUPER_ADMIN']),
  validate(updateInquiryStatusSchema),
  updateInquiry
);

export default router;
