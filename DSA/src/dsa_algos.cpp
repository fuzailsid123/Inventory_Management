#include "dsa_algos.h"
#include <algorithm>
#include <cmath>
#include <chrono>
#include <numeric>
#include <unordered_map>

static double getWarehouseQuantity(const Product& p, const std::string& warehouseId) {
  if (warehouseId.empty()) {
    return p.quantity;
  }
  
  for (const auto& loc : p.stockLocations) {
    if (loc.warehouseId == warehouseId) {
      return loc.quantity - loc.reserved; // Available quantity
    }
  }
  return 0.0;
}

static double computeAdvancedScore(
  const Product& p, 
  std::int64_t nowMs,
  const std::string& warehouseId = ""
) {
  if (!p.isActive) return -1.0; // Skip inactive products
  
  const double quantity = getWarehouseQuantity(p, warehouseId);
  const double reorderLevel = std::max(0.0, p.reorderLevel);
  const double deficit = std::max(0.0, reorderLevel - quantity);
  
  // If already above reorder level, lower priority
  if (deficit <= 0.0) return -1.0;
  
  const double turnover = std::max(0.0, p.turnoverRate);
  const double costPrice = std::max(0.0, p.costPrice);
  
  // Recency factor (days since last sold)
  double daysSinceSold = 365.0;
  if (p.lastSoldMs > 0) {
    const double diffMs = static_cast<double>(nowMs - p.lastSoldMs);
    daysSinceSold = std::max(1.0, diffMs / (1000.0 * 60.0 * 60.0 * 24.0));
  }
  const double recencyFactor = 1.0 / std::sqrt(daysSinceSold + 1.0);
  
  // Criticality factor: how critical is the deficit?
  const double criticalityFactor = deficit / std::max(1.0, reorderLevel);
  
  // Value factor: higher value items get priority
  const double valueFactor = std::log10(costPrice + 1.0) * 0.5;
  
  // Turnover urgency: high turnover = urgent
  const double turnoverFactor = std::log10(turnover + 1.0) * 1.5;
  
  // Batch expiry urgency: check if batches are expiring soon
  double expiryUrgency = 0.0;
  const double daysUntilExpiry = 30.0; // 30 days threshold
  for (const auto& batch : p.batches) {
    if (batch.expiryDateMs > 0) {
      const double diffMs = static_cast<double>(batch.expiryDateMs - nowMs);
      const double daysUntil = diffMs / (1000.0 * 60.0 * 60.0 * 24.0);
      if (daysUntil > 0 && daysUntil < daysUntilExpiry) {
        expiryUrgency += (daysUntilExpiry - daysUntil) / daysUntilExpiry;
      }
    }
  }
  
  // Combined scoring with weighted factors
  const double score = 
    deficit * 3.0 +                    // Stock deficit (most important)
    criticalityFactor * 2.0 +          // How critical the shortage is
    turnoverFactor +                   // Turnover rate
    recencyFactor * 1.5 +               // Sales recency
    valueFactor +                       // Product value
    expiryUrgency * 0.5;                // Batch expiry urgency
  
  return score;
}

static double calculateSuggestedQuantity(const Product& p, const std::string& warehouseId = "") {
  const double quantity = getWarehouseQuantity(p, warehouseId);
  const double reorderLevel = std::max(0.0, p.reorderLevel);
  const double reorderQuantity = std::max(0.0, p.reorderQuantity);
  const double maxStock = std::max(0.0, p.maxStock);
  
  // If reorderQuantity is set, use it
  if (reorderQuantity > 0) {
    return reorderQuantity;
  }
  
  // Otherwise, calculate based on reorder level and max stock
  if (maxStock > 0) {
    return std::max(0.0, maxStock - quantity);
  }
  
  // Default: order enough to reach reorder level + 50% buffer
  return std::max(0.0, (reorderLevel - quantity) * 1.5);
}

static std::string getReorderReason(const Product& p, const std::string& warehouseId = "") {
  const double quantity = getWarehouseQuantity(p, warehouseId);
  const double reorderLevel = std::max(0.0, p.reorderLevel);
  
  if (quantity <= 0) {
    return "Out of stock";
  }
  
  if (quantity < reorderLevel * 0.5) {
    return "Critical stock level";
  }
  
  if (quantity < reorderLevel) {
    return "Below reorder level";
  }
  
  // Check for expiring batches
  const auto nowMs = std::chrono::duration_cast<std::chrono::milliseconds>(
    std::chrono::system_clock::now().time_since_epoch()
  ).count();
  
  for (const auto& batch : p.batches) {
    if (batch.expiryDateMs > 0) {
      const double diffMs = static_cast<double>(batch.expiryDateMs - nowMs);
      const double daysUntil = diffMs / (1000.0 * 60.0 * 60.0 * 24.0);
      if (daysUntil > 0 && daysUntil < 30) {
        return "Batch expiring soon";
      }
    }
  }
  
  return "Low stock";
}

std::vector<size_t> topKToReorderIndices(const std::vector<Product>& products, size_t top) {
  const auto nowMs = std::chrono::duration_cast<std::chrono::milliseconds>(
    std::chrono::system_clock::now().time_since_epoch()
  ).count();

  std::vector<std::pair<double, size_t>> scored;
  scored.reserve(products.size());
  
  for (size_t i = 0; i < products.size(); ++i) {
    const double s = computeAdvancedScore(products[i], nowMs);
    if (s > 0) { // Only include products that need reordering
      scored.emplace_back(s, i);
    }
  }
  
  std::partial_sort(scored.begin(),
                    scored.begin() + std::min(top, scored.size()),
                    scored.end(),
                    [](const auto& a, const auto& b){ return a.first > b.first; });

  std::vector<size_t> result;
  const size_t k = std::min(top, scored.size());
  result.reserve(k);
  for (size_t i = 0; i < k; ++i) {
    result.push_back(scored[i].second);
  }
  return result;
}

std::vector<ReorderSuggestion> topKToReorderWithDetails(
  const std::vector<Product>& products,
  size_t top,
  const std::string& warehouseId
) {
  const auto nowMs = std::chrono::duration_cast<std::chrono::milliseconds>(
    std::chrono::system_clock::now().time_since_epoch()
  ).count();

  std::vector<std::pair<double, size_t>> scored;
  scored.reserve(products.size());
  
  for (size_t i = 0; i < products.size(); ++i) {
    const double s = computeAdvancedScore(products[i], nowMs, warehouseId);
    if (s > 0) {
      scored.emplace_back(s, i);
    }
  }
  
  std::partial_sort(scored.begin(),
                    scored.begin() + std::min(top, scored.size()),
                    scored.end(),
                    [](const auto& a, const auto& b){ return a.first > b.first; });

  std::vector<ReorderSuggestion> result;
  const size_t k = std::min(top, scored.size());
  result.reserve(k);
  
  for (size_t i = 0; i < k; ++i) {
    const size_t idx = scored[i].second;
    ReorderSuggestion suggestion;
    suggestion.productIndex = idx;
    suggestion.priorityScore = scored[i].first;
    suggestion.suggestedQuantity = calculateSuggestedQuantity(products[idx], warehouseId);
    suggestion.reason = getReorderReason(products[idx], warehouseId);
    result.push_back(suggestion);
  }
  
  return result;
}

InventoryValue calculateInventoryValue(const std::vector<Product>& products) {
  InventoryValue value{};
  value.totalProducts = products.size();
  
  double totalValue = 0.0;
  double lowStockValue = 0.0;
  
  for (const auto& p : products) {
    if (!p.isActive) continue;
    
    const double productValue = p.quantity * p.costPrice;
    totalValue += productValue;
    
    if (p.quantity < p.reorderLevel) {
      lowStockValue += productValue;
      value.lowStockCount++;
    }
    
    if (p.quantity <= 0) {
      value.outOfStockCount++;
    }
  }
  
  value.totalValue = totalValue;
  value.lowStockValue = lowStockValue;
  
  return value;
}

std::map<char, std::vector<size_t>> abcAnalysis(const std::vector<Product>& products) {
  // Calculate total value
  double totalValue = 0.0;
  std::vector<std::pair<double, size_t>> productValues;
  
  for (size_t i = 0; i < products.size(); ++i) {
    if (!products[i].isActive) continue;
    const double value = products[i].quantity * products[i].costPrice;
    totalValue += value;
    productValues.emplace_back(value, i);
  }
  
  // Sort by value (descending)
  std::sort(productValues.begin(), productValues.end(),
            [](const auto& a, const auto& b) { return a.first > b.first; });
  
  std::map<char, std::vector<size_t>> result;
  double cumulativeValue = 0.0;
  
  for (const auto& [value, idx] : productValues) {
    cumulativeValue += value;
    const double percentage = (cumulativeValue / totalValue) * 100.0;
    
    char category;
    if (percentage <= 80.0) {
      category = 'A';
    } else if (percentage <= 95.0) {
      category = 'B';
    } else {
      category = 'C';
    }
    
    result[category].push_back(idx);
  }
  
  return result;
}

std::vector<size_t> getExpiringBatches(
  const std::vector<Product>& products,
  int daysAhead
) {
  const auto nowMs = std::chrono::duration_cast<std::chrono::milliseconds>(
    std::chrono::system_clock::now().time_since_epoch()
  ).count();
  
  const double thresholdMs = daysAhead * 24.0 * 60.0 * 60.0 * 1000.0;
  std::vector<size_t> result;
  
  for (size_t i = 0; i < products.size(); ++i) {
    if (!products[i].isActive) continue;
    
    for (const auto& batch : products[i].batches) {
      if (batch.expiryDateMs > 0 && batch.quantity > 0) {
        const double diffMs = static_cast<double>(batch.expiryDateMs - nowMs);
        if (diffMs > 0 && diffMs <= thresholdMs) {
          result.push_back(i);
          break; // Only add product once
        }
      }
    }
  }
  
  return result;
}

std::vector<ReorderSuggestion> getWarehouseReorderSuggestions(
  const std::vector<Product>& products,
  const std::string& warehouseId,
  size_t top
) {
  return topKToReorderWithDetails(products, top, warehouseId);
}

