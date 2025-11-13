import Product from '../models/product.model.js';
import StockMovement from '../models/stockMovement.model.js';
import { paginate, paginationResponse } from '../utils/pagination.js';
import logger from '../utils/logger.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const getProducts = async (req, res) => {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);
    const { search, category, warehouse, lowStock, isActive } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { sku: new RegExp(search, 'i') },
        { barcode: new RegExp(search, 'i') },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (warehouse) {
      query['stockLocations.warehouse'] = warehouse;
    }

    if (lowStock === 'true') {
      query.$expr = {
        $lt: ['$quantity', '$reorderLevel'],
      };
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .populate('supplier', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return res
    .status(200)
    .json(paginationResponse(products, total, page, limit));
  } catch (error) {
    logger.error('Get products error', error);
    throw new ApiError(500, 'Failed to fetch products');
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('supplier', 'name code contact')
      .populate('stockLocations.warehouse', 'name code');

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    return res
    .status
    .json(new ApiResponse(200, product, 'Product retrieved successfully'));
  } catch (error) {
    logger.error('Get product error', error);
    throw new ApiError(500, 'Failed to fetch product');
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    
    // Log stock movement if quantity > 0
    if (product.quantity > 0 && req.user) {
      await StockMovement.create({
        product: product._id,
        warehouse: product.stockLocations[0]?.warehouse,
        type: 'in',
        quantity: product.quantity,
        reason: 'Initial stock',
        performedBy: req.user._id,
      });
    }

    logger.info('Product created', { productId: product._id, sku: product.sku });

    return res
    .status(201)
    .json(new ApiResponse(201, product, 'Product created successfully'));
  } catch (error) {
    logger.error('Create product error', error);
    throw new ApiError(400, 'Failed to create product');
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('category supplier');

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    logger.info('Product updated', { productId: product._id });

    return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product updated successfully'));
  } catch (error) {
    logger.error('Update product error', error);
    throw new ApiError(400, 'Failed to update product');
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    logger.info('Product deleted', { productId: product._id });

    return res
    .status(200)
    .json(new ApiResponse(200, null, 'Product deleted successfully'));
  } catch (error) {
    logger.error('Delete product error', error);
    throw new ApiError(500, 'Failed to delete product');
  }
};

const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, warehouse, type, reason, batchNumber } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Update stock
    if (warehouse) {
      // Update warehouse-specific stock
      const stockLocation = product.stockLocations.find(
        (sl) => sl.warehouse.toString() === warehouse
      );

      if (stockLocation) {
        if (type === 'in') {
          stockLocation.quantity += quantity;
        } else {
          stockLocation.quantity = Math.max(0, stockLocation.quantity - quantity);
        }
      } else if (type === 'in') {
        product.stockLocations.push({
          warehouse,
          quantity,
        });
      } else{
        throw new ApiError(404, `Cannot remove stock: Product ${product.name} has no stock recorded in warehouse ${warehouse}.`);
      }
    }

    if (type === 'in') {
      product.quantity += quantity;
    } else {
      product.quantity = Math.max(0, product.quantity - quantity);
    }

    product.lowStockAlert = product.quantity < product.reorderLevel;

    await product.save();

    if (req.user) {
      await StockMovement.create({
        product: product._id,
        warehouse,
        type: type || 'adjustment',
        quantity,
        batchNumber,
        reason: reason || 'Manual adjustment',
        performedBy: req.user._id,
      });
    }

    logger.info('Stock updated', { productId: product._id, type, quantity });

    return res
    .status(200)
    .json(new ApiResponse(200, product, 'Stock updated successfully'));

  } catch (error) {
    logger.error('Update stock error', error);
    throw new ApiError(500, 'Failed to update stock');
  }
};


export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
}
