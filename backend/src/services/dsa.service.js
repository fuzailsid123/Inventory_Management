/**
 * Calculates the reorder point for a product.
 * This logic was ported from the C++ dsa_algos.cpp file.
 *
 * @param {number} avgDailySales - Average daily sales of the product.
 * @param {number} leadTime - Lead time from the supplier in days.
 * @param {number} safetyStock - Desired safety stock level.
 * @returns {number} The calculated reorder point.
 */
function calculateReorderPoint(avgDailySales, leadTime, safetyStock) {
  // Original C++ logic: (avgDailySales * leadTime) + safetyStock
  return (avgDailySales * leadTime) + safetyStock;
}

/**
 * Optimizes warehouse placement using a First Fit Decreasing (FFD) bin packing algorithm.
 * This logic was ported from the C++ dsa_algos.cpp file.
 *
 * @param {Array<Object>} items - Array of items to be placed.
 * e.g., [{ id: "item1", dimensions: { length: 10, width: 10, height: 10 } }]
 * @param {Array<Object>} warehouses - Array of available warehouses (bins).
 * e.g., [{ id: "wh1", availableVolume: 5000 }]
 * @returns {Object} An object containing placements and unplaced items.
 * e.g., { placements: { wh1: ["item1"] }, unplacedItems: ["item2"] }
 */
function optimizePlacement(items, warehouses) {
  // 1. Calculate volume for each item and store as a new object
  const itemsWithVolume = items.map(item => ({
    id: item.id,
    volume: item.dimensions.length * item.dimensions.width * item.dimensions.height,
  }));

  itemsWithVolume.sort((a, b) => b.volume - a.volume);

  // 3. Prepare warehouse bins and tracking objects
  const warehouseBins = [...warehouses.map(wh => ({ ...wh }))]; 
  const placements = {};
  warehouses.forEach(wh => {
    placements[wh.id] = [];
  });
  const unplacedItems = [];

  for (const item of itemsWithVolume) {
    let placed = false;
    
    for (const bin of warehouseBins) {
      if (bin.availableVolume >= item.volume) {
        // Place the item
        placements[bin.id].push(item.id);
        bin.availableVolume -= item.volume;
        placed = true;
        break;
      }
    }

    if (!placed) {
      unplacedItems.push(item.id);
    }
  }

  return { placements, unplacedItems };
}

export {
  calculateReorderPoint,
  optimizePlacement,
};