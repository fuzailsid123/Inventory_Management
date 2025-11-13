import { body, param, query } from 'express-validator';

export const createOrderValidator = [
  body('type').isIn(['sale', 'purchase', 'transfer', 'return']).withMessage('Invalid order type'),
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isFloat({ min: 0.01 }).withMessage('Quantity must be greater than 0'),
  body('items.*.unitPrice').optional().isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
  body('warehouse').optional().isMongoId().withMessage('Invalid warehouse ID'),
  body('supplier').optional().isMongoId().withMessage('Invalid supplier ID'),
];

export const updateOrderValidator = [
  param('id').isMongoId().withMessage('Invalid order ID'),
  body('status').optional().isIn(['pending', 'processing', 'completed', 'cancelled', 'refunded']).withMessage('Invalid status'),
];

export const orderIdValidator = [
  param('id').isMongoId().withMessage('Invalid order ID'),
];

export const getOrdersValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'processing', 'completed', 'cancelled', 'refunded']).withMessage('Invalid status'),
  query('type').optional().isIn(['sale', 'purchase', 'transfer', 'return']).withMessage('Invalid order type'),
];



