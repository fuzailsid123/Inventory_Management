import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import StockMovement from '../models/stockMovement.model.js';
import { paginate, paginationResponse } from '../utils/pagination.js';
import logger from '../utils/logger.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';


const getOrders = async (req, res) => {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);
    const { status, type, warehouse } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (warehouse) query.warehouse = warehouse;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('items.product', 'name sku')
        .populate('warehouse', 'name code')
        .populate('supplier', 'name code')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    return res
    .status(200)
    .json(paginationResponse(orders, total, page, limit));
  } catch (error) {
    logger.error('Get orders error', error);
    throw new ApiError(500, 'Failed to fetch orders');
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('warehouse')
      .populate('supplier')
      .populate('createdBy');

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, order, 'Order retrieved successfully'));
  } catch (error) {
    logger.error('Get order error', error);
    throw new ApiError(500, 'Failed to fetch order');
  }
};

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { items, type, warehouse, supplier, customer, notes, paymentMethod } = req.body;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new ApiError(404, `Product ${item.product} not found`);
      }

      // Check stock availability for sales
      if (type === 'sale' && product.quantity < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`);
      }

      const unitPrice = item.unitPrice || product.sellingPrice || 0;
      const total = unitPrice * item.quantity;
      subtotal += total;

      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        unitPrice,
        total,
        batchNumber: item.batchNumber,
      });
    }

    const tax = subtotal * 0.1; // 10% tax (configurable)
    const discount = 0; // Can be added from req.body
    const total = subtotal + tax - discount;

    // Create order
    const order = await Order.create([{
      type: type || 'sale',
      items: orderItems,
      warehouse,
      supplier,
      customer,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      notes,
      createdBy: req.user._id,
    }], {session});

    if (order.status === 'completed') {
      await updateStockFromOrder(order, type, session);
    }

    await session.commitTransaction();

    logger.info('Order created', { orderId: order._id, orderNumber: order.orderNumber });

    return res
    .status(201)
    .json(new ApiResponse(201, order, 'Order created successfully'));

  } catch (error) {
    await session.abortTransaction();
    logger.error('Create order error', error);
    throw new ApiError(400, 'Failed to create order');
  } finally{
    session.endSession();
  }
};

const updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // If status changed to completed, update stock
    if (status === 'completed' && order.status !== 'completed') {
      await updateStockFromOrder(order, order.type);
    }

    // If status changed from completed, reverse stock
    if (order.status === 'completed' && status !== 'completed') {
      await reverseStockFromOrder(order, order.type);
    }

    order.status = status || order.status;
    Object.assign(order, req.body);
    await order.save();

    logger.info('Order updated', { orderId: order._id, status: order.status });

    return res
    .status(200)
    .json(new ApiResponse(200, order, 'Order updated successfully'));

  } catch (error) {
    logger.error('Update order error', error);
    throw new ApiError(400, 'Failed to update order');
  }
};

const updateStockFromOrder = async (order, type, session = null) => {
  for (const item of order.items) {
    const product = await Product.findById(item.product).session(session);
    if (!product) continue;

    if (type === 'sale' || type === 'out') {
      product.quantity = Math.max(0, product.quantity - item.quantity);
      product.lastSoldDate = new Date();
    } else if (type === 'purchase' || type === 'in') {
      product.quantity += item.quantity;
    }

    // Update warehouse stock if specified
    if (order.warehouse) {
      const stockLocation = product.stockLocations.find(
        (sl) => sl.warehouse.toString() === order.warehouse.toString()
      );

      if (stockLocation) {
        if (type === 'sale' || type === 'out') {
          stockLocation.quantity = Math.max(0, stockLocation.quantity - item.quantity);
        } else {
          stockLocation.quantity += item.quantity;
        }
      } else if (type === 'purchase' || type === 'in') {
        product.stockLocations.push({
          warehouse: order.warehouse,
          quantity: item.quantity,
        });
      } else {
        throw new ApiError(404, `Cannot remove stock: Product ${product.name} has no stock recorded in warehouse ${order.warehouse.toString()}.`);
      }
    }

    product.lowStockAlert = product.quantity < product.reorderLevel;
    await product.save({ session });

    // Log stock movement
    await StockMovement.create([{
      product: product._id,
      warehouse: order.warehouse,
      type: type === 'sale' ? 'out' : 'in',
      quantity: item.quantity,
      batchNumber: item.batchNumber,
      reference: 'order',
      referenceId: order._id,
      reason: `${order.type} order ${order.orderNumber}`,
      performedBy: order.createdBy,
    }], { session });
  }
};

const reverseStockFromOrder = async (order, type, session) => {
  for (const item of order.items) {
    const product = await Product.findById(item.product).session(session);
    if (!product) continue;

    if (type === 'sale') {
      product.quantity += item.quantity;
    } else if (type === 'purchase') {
      product.quantity = Math.max(0, product.quantity - item.quantity);
    }

    if (order.warehouse) {
      const stockLocation = product.stockLocations.find(
        (sl) => sl.warehouse.toString() === order.warehouse.toString()
      );

      if (stockLocation) {
        if (type === 'sale') {
          stockLocation.quantity += item.quantity;
        } else if (type === 'purchase') {
          stockLocation.quantity = Math.max(0, stockLocation.quantity - item.quantity);
        }
      } else {
        // This case should ideally not happen if data is consistent
        logger.warn(`Could not reverse stock for warehouse ${order.warehouse} on product ${product._id}: stockLocation not found.`);
      }
    }

    await StockMovement.create([{
        product: product._id,
        warehouse: order.warehouse,
        type: type === 'sale' ? 'in' : 'out', // The movement is reversed
        quantity: item.quantity,
        reference: 'order_reversal',
        referenceId: order._id,
        reason: `Reversal of ${order.type} order ${order.orderNumber}`,
        performedBy: order.createdBy, // This should be the user *doing* the update
    }], { session });

    await product.save({session});
  }
};


export {
  getOrder,
  getOrders,
  createOrder,
  updateOrder
}
