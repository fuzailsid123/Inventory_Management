import mongoose from 'mongoose';

const StockMovementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
    },
    type: {
      type: String,
      enum: ['in', 'out', 'transfer', 'adjustment', 'return', 'damage', 'expired'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    batchNumber: String,
    reference: {
      type: String,
      enum: ['order', 'purchase', 'transfer', 'adjustment', 'return', 'other'],
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    reason: String,
    notes: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
StockMovementSchema.index({ product: 1, createdAt: -1 });
StockMovementSchema.index({ warehouse: 1, createdAt: -1 });
StockMovementSchema.index({ type: 1, createdAt: -1 });

export default mongoose.model('StockMovement', StockMovementSchema);



