import { Router } from 'express';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from './product.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate, validateQuery } from '../../middleware/validate.js';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from './product.schema.js';

const router = Router();

// Public showcase endpoints
router.get('/', validateQuery(productQuerySchema), listProducts);
router.get('/:id', getProduct);

// Protected admin endpoints
router.post(
  '/',
  authenticate,
  authorize(['ADMIN', 'SUPER_ADMIN']),
  validate(createProductSchema),
  createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize(['ADMIN', 'SUPER_ADMIN']),
  validate(updateProductSchema),
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize(['ADMIN', 'SUPER_ADMIN']),
  deleteProduct
);

export default router;
