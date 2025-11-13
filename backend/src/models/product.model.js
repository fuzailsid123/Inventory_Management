import mongoose from 'mongoose';

const StockLocationSchema = new mongoose.Schema(
  {
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    reserved: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const BatchSchema = new mongoose.Schema(
  {
    batchNumber: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    expiryDate: Date,
    manufacturingDate: Date,
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
    },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    barcode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    description: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    // Total quantity across all warehouses
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    // Per-warehouse stock tracking
    stockLocations: [StockLocationSchema],
    // Batch tracking
    batches: [BatchSchema],
    // Pricing
    costPrice: {
      type: Number,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      min: 0,
    },
    // Inventory management
    reorderLevel: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    reorderQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxStock: {
      type: Number,
      min: 0,
    },
    turnoverRate: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastSoldDate: Date,
    // Product attributes
    unit: {
      type: String,
      default: 'piece',
      enum: ['piece', 'kg', 'liter', 'box', 'pack'],
    },
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    lowStockAlert: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
ProductSchema.index({ name: 'text', sku: 'text', barcode: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ supplier: 1 });
ProductSchema.index({ isActive: 1 });

// Virtual for available quantity (total - reserved)
ProductSchema.virtual('availableQuantity').get(function () {
  return this.quantity;
});

export default mongoose.model('Product', ProductSchema);

