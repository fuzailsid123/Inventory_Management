# DSA Module - Advanced Inventory Algorithms

## Overview
This C++ native addon provides high-performance algorithms for inventory management calculations, including reorder suggestions, ABC analysis, batch tracking, and multi-warehouse support.

## Features

### 1. Advanced Reorder Suggestions
- **Multi-factor scoring**: Considers stock deficit, turnover rate, sales recency, product value, and batch expiry
- **Warehouse-aware**: Calculate reorder suggestions for specific warehouses
- **Detailed suggestions**: Returns priority scores, suggested quantities, and reasons

### 2. ABC Analysis
- Categorizes products by inventory value:
  - **Category A**: Top 80% of inventory value
  - **Category B**: Next 15% of inventory value
  - **Category C**: Remaining 5% of inventory value

### 3. Batch Tracking
- Expiry date tracking
- Manufacturing date tracking
- Expiring batch detection

### 4. Inventory Valuation
- Total inventory value calculation
- Low stock value calculation
- Product count statistics

### 5. Multi-Warehouse Support
- Per-warehouse stock tracking
- Reserved quantity handling
- Warehouse-specific reorder calculations

## API Functions

### `topKToReorder(products, top)`
Original function for backward compatibility. Returns array of products needing reorder.

**Parameters:**
- `products` (Array): Array of product objects
- `top` (Number): Number of top products to return

**Returns:** Array of product objects

### `topKToReorderWithDetails(products, top, [warehouseId])`
Advanced reorder suggestions with detailed information.

**Parameters:**
- `products` (Array): Array of product objects
- `top` (Number): Number of top products to return
- `warehouseId` (String, optional): Filter by specific warehouse

**Returns:** Array of suggestion objects with:
- `productIndex`: Index in original array
- `priorityScore`: Calculated priority score
- `suggestedQuantity`: Recommended reorder quantity
- `reason`: Reason for reorder (e.g., "Out of stock", "Critical stock level")
- `product`: Original product object

### `calculateInventoryValue(products)`
Calculate total inventory value and statistics.

**Parameters:**
- `products` (Array): Array of product objects

**Returns:** Object with:
- `totalValue`: Total inventory value
- `lowStockValue`: Value of low stock items
- `totalProducts`: Total number of products
- `lowStockCount`: Number of low stock products
- `outOfStockCount`: Number of out of stock products

### `abcAnalysis(products)`
Perform ABC analysis on products.

**Parameters:**
- `products` (Array): Array of product objects

**Returns:** Object with keys 'A', 'B', 'C', each containing arrays of products in that category

### `getExpiringBatches(products, [daysAhead])`
Get products with batches expiring within specified days.

**Parameters:**
- `products` (Array): Array of product objects
- `daysAhead` (Number, optional): Days to look ahead (default: 30)

**Returns:** Array of products with expiring batches

## Product Object Structure

The module expects product objects with the following structure:

```javascript
{
  _id: String,
  name: String,
  sku: String,
  barcode: String (optional),
  category: String | Object (with _id),
  supplier: String | Object (with _id),
  quantity: Number,
  stockLocations: [{
    warehouse: String | Object (with _id),
    quantity: Number,
    reserved: Number
  }],
  batches: [{
    batchNumber: String,
    quantity: Number,
    expiryDate: Number (epoch ms) | String,
    manufacturingDate: Number (epoch ms)
  }],
  costPrice: Number,
  sellingPrice: Number,
  reorderLevel: Number,
  reorderQuantity: Number (optional),
  maxStock: Number (optional),
  turnoverRate: Number,
  lastSoldDate: Number (epoch ms) | String | null,
  isActive: Boolean,
  lowStockAlert: Boolean
}
```

## Scoring Algorithm

The reorder scoring algorithm uses multiple weighted factors:

1. **Stock Deficit** (weight: 3.0) - Most important factor
2. **Criticality Factor** (weight: 2.0) - How critical the shortage is
3. **Turnover Factor** (weight: 1.5) - Sales velocity
4. **Recency Factor** (weight: 1.5) - Days since last sale
5. **Value Factor** (weight: 1.0) - Product cost value
6. **Expiry Urgency** (weight: 0.5) - Batch expiry warnings

## Building

```bash
npm install
npm run build
```

## Usage Example

```javascript
const dsa = require('./build/Release/dsa.node');

// Get reorder suggestions
const products = [/* product array */];
const suggestions = dsa.topKToReorderWithDetails(products, 10);

// ABC Analysis
const abc = dsa.abcAnalysis(products);
console.log('Category A products:', abc.A);
console.log('Category B products:', abc.B);
console.log('Category C products:', abc.C);

// Inventory value
const stats = dsa.calculateInventoryValue(products);
console.log('Total value:', stats.totalValue);

// Expiring batches
const expiring = dsa.getExpiringBatches(products, 30);
console.log('Products with expiring batches:', expiring);
```

## Performance

- Optimized C++ implementation for high performance
- Uses partial sorting for efficient top-K selection
- Handles large product catalogs efficiently
- Multi-threaded operations where applicable

## Requirements

- Node.js 18+
- node-gyp
- C++ build tools (Visual Studio on Windows, Xcode on macOS, build-essential on Linux)
- Python 3.x



