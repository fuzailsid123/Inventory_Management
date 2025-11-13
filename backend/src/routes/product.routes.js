import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} from '../controllers/product.controller.js';
import {
  getProductsValidator,
  createProductValidator,
  updateProductValidator,
  productIdValidator,
} from '../validators/product.validator.js';
import { validate } from '../middleware/validator.js';
import { verifyJWT, authorize } from '../middleware/auth.js';
import { auditLog } from '../middleware/audit.js';
// import { verify } from 'jsonwebtoken';

const router = express.Router();

// Public routes
router.get('/', getProductsValidator, validate, getProducts);
router.get('/:id', productIdValidator, validate, getProduct);

// Protected routes
router.post(
  '/',
  verifyJWT,
  authorize('admin', 'manager', 'staff'),
  createProductValidator,
  validate,
  auditLog('create', 'product'),
  createProduct
);

router.put(
  '/:id',
  verifyJWT,
  authorize('admin', 'manager', 'staff'),
  updateProductValidator,
  validate,
  auditLog('update', 'product'),
  updateProduct
);

router.delete(
  '/:id',
  verifyJWT,
  authorize('admin', 'manager'),
  productIdValidator,
  validate,
  auditLog('delete', 'product'),
  deleteProduct
);

// Stock management
router.patch(
  '/:id/stock',
  verifyJWT,
  authorize('admin', 'manager', 'staff'),
  productIdValidator,
  validate,
  updateStock
);

export default router;

