import mongoose from 'mongoose';
import Counter from "./counter.model.js"

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    batchNumber: String,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    type: {
      type: String,
      enum: ['sale', 'purchase', 'transfer', 'return'],
      required: true,
      default: 'sale',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Order must have at least one item',
      },
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    customer: {
      name: String,
      email: String,
      phone: String,
    },
    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'bank_transfer', 'credit', 'other'],
    },
    notes: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.pre('save', async function (next) {
  if (this.isNew || !this.orderNumber) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { _id: 'orderNumber' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      const seqNum = String(counter.seq).padStart(6, '0');
      const prefix = this.type === 'purchase' ? 'PO' : this.type === 'transfer' ? 'TR' : 'SO';
      this.orderNumber = `${prefix}-${seqNum}`;
      
      next();
    } catch (error) {
      next(error);
    }
  } else{
  next();
  }
});

// Indexes
// OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ type: 1, createdAt: -1 });
OrderSchema.index({ createdBy: 1, createdAt: -1 });

export default mongoose.model('Order', OrderSchema);

