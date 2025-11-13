import { body, param, query } from 'express-validator';

export const createProductValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required').toUpperCase(),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('reorderLevel').isFloat({ min: 0 }).withMessage('Reorder level must be a positive number'),
  body('costPrice').optional().isFloat({ min: 0 }).withMessage('Cost price must be a positive number'),
  body('sellingPrice').optional().isFloat({ min: 0 }).withMessage('Selling price must be a positive number'),
  body('category').optional().isMongoId().withMessage('Invalid category ID'),
  body('supplier').optional().isMongoId().withMessage('Invalid supplier ID'),
];

export const updateProductValidator = [
  param('id').isMongoId().withMessage('Invalid product ID'),
  body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('quantity').optional().isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('reorderLevel').optional().isFloat({ min: 0 }).withMessage('Reorder level must be a positive number'),
];

export const getProductsValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('category').optional().isMongoId().withMessage('Invalid category ID'),
  query('warehouse').optional().isMongoId().withMessage('Invalid warehouse ID'),
  query('lowStock').optional().isBoolean().withMessage('lowStock must be a boolean'),
];

export const productIdValidator = [
  param('id').isMongoId().withMessage('Invalid product ID'),
];



