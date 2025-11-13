import express from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
} from '../controllers/order.controller.js';
import {
  getOrdersValidator,
  createOrderValidator,
  updateOrderValidator,
  orderIdValidator,
} from '../validators/order.validator.js';
import { validate } from '../middleware/validator.js';
import { verifyJWT, authorize } from '../middleware/auth.js';
import { auditLog } from '../middleware/audit.js';

const router = express.Router();

// All order routes require authentication
router.use(verifyJWT);

router.get('/', getOrdersValidator, validate, getOrders);
router.get('/:id', orderIdValidator, validate, getOrder);

router.post('/',authorize('admin', 'manager', 'staff'),createOrderValidator,validate, auditLog('create', 'order'),createOrder);

router.put('/:id', authorize('admin', 'manager', 'staff'), updateOrderValidator, validate,auditLog('update', 'order'),updateOrder);

export default router;

