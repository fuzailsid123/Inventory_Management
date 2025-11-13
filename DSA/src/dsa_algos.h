#pragma once
#include <vector>
#include <string>
#include <cstdint>
#include <map>

struct StockLocation {
  std::string warehouseId;
  double quantity;
  double reserved;
};

struct Batch {
  std::string batchNumber;
  double quantity;
  std::int64_t expiryDateMs; // epoch ms, 0 if not set
  std::int64_t manufacturingDateMs; // epoch ms, 0 if not set
};

struct Product {
  std::string id;
  std::string name;
  std::string sku;
  std::string barcode;
  std::string categoryId;
  std::string supplierId;
  double quantity; // Total quantity across all warehouses
  std::vector<StockLocation> stockLocations; // Per-warehouse stock
  std::vector<Batch> batches; // Batch tracking
  double costPrice;
  double sellingPrice;
  double reorderLevel;
  double reorderQuantity;
  double maxStock;
  double turnoverRate;
  std::int64_t lastSoldMs; // epoch ms
  bool isActive;
  bool lowStockAlert;
};

struct ReorderSuggestion {
  size_t productIndex;
  double priorityScore;
  double suggestedQuantity;
  std::string reason;
};

struct InventoryValue {
  double totalValue;
  double lowStockValue;
  size_t totalProducts;
  size_t lowStockCount;
  size_t outOfStockCount;
};

struct ABCCategory {
  char category; // 'A', 'B', or 'C'
  double percentage; // Percentage of total value
  size_t productCount;
};

// Computes top K products to reorder, using an advanced scoring heuristic.
// Returns indices of the products vector in priority order.
std::vector<size_t> topKToReorderIndices(const std::vector<Product>& products, size_t top);

// Computes top K products to reorder with detailed suggestions
std::vector<ReorderSuggestion> topKToReorderWithDetails(
  const std::vector<Product>& products, 
  size_t top,
  const std::string& warehouseId = "" // Empty string for all warehouses
);

// Calculate inventory value and statistics
InventoryValue calculateInventoryValue(const std::vector<Product>& products);

// ABC Analysis: Categorize products by value (A: top 80%, B: next 15%, C: remaining 5%)
std::map<char, std::vector<size_t>> abcAnalysis(const std::vector<Product>& products);

// Get products with expiring batches (within specified days)
std::vector<size_t> getExpiringBatches(
  const std::vector<Product>& products,
  int daysAhead = 30
);

// Get warehouse-specific reorder suggestions
std::vector<ReorderSuggestion> getWarehouseReorderSuggestions(
  const std::vector<Product>& products,
  const std::string& warehouseId,
  size_t top
);

