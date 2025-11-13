import Product from '../models/product.model.js';
import StockMovement from '../models/stockMovement.model.js';
import {
  getTopKToReorder,
  calculateInventoryValue,
  ABCAnalysis,
  ExpiringBatches,
} from '../services/reOrder.service.js';
import logger from '../utils/logger.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { optimizePlacement } from '../services/dsa.service';

const getReorderSuggestions = async (req, res) => {
  try {
    const top = Math.max(1, parseInt(req.query.top || '5', 10));
    const warehouse = req.query.warehouse;

    let products = await Product.find({ isActive: true })
      .populate('category', 'name')
      .populate('supplier', 'name code')
      .lean();

    if (warehouse) {
      products = products.filter((p) =>
        p.stockLocations?.some((sl) => sl.warehouse?.toString() === warehouse)
      );
    }

    const suggestions = await getTopKToReorder(products, top, warehouse || null);
    return res
    .status(200)
    .json(new ApiResponse(200, suggestions, 'Reorder suggestions retrieved successfully'))

  } catch (error) {
    logger.error('Get reorder suggestions error', error);
    throw new ApiError(500, 'Failed to compute reorder suggestions');
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const warehouse = req.query.warehouse;

    const query = {
      isActive: true,
      $expr: {
        $lt: ['$quantity', '$reorderLevel'],
      },
    };

    if (warehouse) {
      query['stockLocations.warehouse'] = warehouse;
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('supplier', 'name')
      .sort({ quantity: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Product.countDocuments(query);

    return res
    .status(200)
    .json(new ApiResponse(200,
      {
        products,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      },'Low stock products retrieved successfully'))

  } catch (error) {
    logger.error('Get low stock products error', error);
    throw new ApiError(500, 'Failed to fetch low stock products');
  }
};

const getStockMovements = async (req, res) => {
  try {
    const { page = 1, limit = 50, product, warehouse, type, startDate, endDate } = req.query;

    const query = {};
    if (product) query.product = product;
    if (warehouse) query.warehouse = warehouse;
    if (type) query.type = type;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const movements = await StockMovement.find(query)
      .populate('product', 'name sku')
      .populate('warehouse', 'name code')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await StockMovement.countDocuments(query);

    return res
    .status(200)
    .json( new ApiResponse(200,
      {
        movements,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      }, 'Stock movements retrieved successfully'));

  } catch (error) {
    logger.error('Get stock movements error', error);
    throw new ApiError(500, 'Failed to fetch stock movements');
  }
};

const getInventoryStats = async (req, res) => {
  try {
    const warehouse = req.query.warehouse;

    const query = { isActive: true };
    if (warehouse) {
      query['stockLocations.warehouse'] = warehouse;
    }

    const products = await Product.find(query).lean();
    const stats = await calculateInventoryValue(products);

    return res
    .status(200)
    .json(new ApiResponse(200, stats, 'Inventory stats retrieved successfully'));

  } catch (error) {
    logger.error('Get inventory stats error', error);
    throw new ApiError(500, 'Failed to fetch inventory stats');
  }
};

const getABCAnalysis = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('category', 'name')
      .populate('supplier', 'name')
      .lean();

    const abc = await ABCAnalysis(products);

    return res
    .status(200)
    .json(new ApiResponse(200, abc, 'ABC analysis retrieved successfully'));
  } catch (error) {
    logger.error('Get ABC analysis error', error);
    throw new ApiError(500, 'Failed to compute ABC analysis');
  }
};

const optimizePlacementController = asyncHandler(async (req, res) => {
  const { items, warehouses } = req.body;

  if (!items || !warehouses) {
    throw new ApiError(400, 'Items and warehouses are required');
  }

  const result = optimizePlacement(items, warehouses); // UPDATED: Call the new JS function

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Placement optimization complete'));
});

const getExpiringBatches = async (req, res) => {
  try {
    const daysAhead = parseInt(req.query.daysAhead || '30', 10);
    const products = await Product.find({ isActive: true, batches: { $exists: true, $ne: [] } })
      .populate('category', 'name')
      .lean();

    const expiring = await ExpiringBatches(products, daysAhead);

    return res
    .status(200)
    .json(new ApiResponse(200,{ products: expiring, daysAhead },'Expiring batches retrieved successfully'));

  } catch (error) {
    logger.error('Get expiring batches error', error);
    throw new ApiError(500, 'Failed to fetch expiring batches');
  }
};


export {
  getReorderSuggestions,
  getLowStockProducts,
  getStockMovements,
  getInventoryStats,
  getABCAnalysis,
  getExpiringBatches,
  optimizePlacementController
}