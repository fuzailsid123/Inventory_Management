let addon;
try {
  addon = await import('dsa');
  addon = addon?.default || addon;
} catch (_e) {
  try {
    addon = await import('../../../DSA/build/Release/dsa.node');
    addon = addon?.default || addon;
  } catch (_e2) {
    addon = null;
  }
}

function jsTopKToReorder(products, top) {
  const now = Date.now();
  const scored = (products || []).map((p) => {
    const quantity = Number(p.quantity || 0);
    const reorderLevel = Number(p.reorderLevel || 0);
    const deficit = Math.max(0, reorderLevel - quantity); // higher deficit => higher priority
    const turnover = Math.max(0, Number(p.turnoverRate || 0)); // higher turnover => higher priority
    const lastSold = p.lastSoldDate ? new Date(p.lastSoldDate).getTime() : 0;
    const daysSinceSold = lastSold ? Math.max(1, (now - lastSold) / (1000 * 60 * 60 * 24)) : 365;
    const recencyFactor = 1 / Math.sqrt(daysSinceSold); // more recent => higher
    const score = deficit * 2 + turnover * 1.5 + recencyFactor;
    return { ...p, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, top).map(({ score, ...rest }) => rest);
}

export async function getTopKToReorder(products, top, warehouseId = null) {
  const mode = (process.env.DSA_MODE || 'addon').toLowerCase();
  
  if (mode === 'addon' && addon) {
    // Try new detailed function first, fallback to original
    if (typeof addon.topKToReorderWithDetails === 'function') {
      const suggestions = addon.topKToReorderWithDetails(products, top, warehouseId || '');
      // Return products with additional suggestion metadata
      return suggestions.map(s => ({
        ...s.product,
        _suggestion: {
          priorityScore: s.priorityScore,
          suggestedQuantity: s.suggestedQuantity,
          reason: s.reason,
        },
      }));
    } else if (typeof addon.topKToReorder === 'function') {
      return addon.topKToReorder(products, top);
    }
  }
  
  if (mode === 'wasm') {
    // Placeholder for WASM integration
    return jsTopKToReorder(products, top);
  }
  
  if (mode === 'child') {
    // Placeholder for child-process invocation
    return jsTopKToReorder(products, top);
  }
  
  // Default JS fallback
  return jsTopKToReorder(products, top);
}

export async function calculateInventoryValue(products) {
  const mode = (process.env.DSA_MODE || 'addon').toLowerCase();
  
  if (mode === 'addon' && addon && typeof addon.calculateInventoryValue === 'function') {
    return addon.calculateInventoryValue(products);
  }
  
  // JS fallback
  let totalValue = 0;
  let lowStockValue = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  
  for (const p of products || []) {
    if (!p.isActive) continue;
    const value = (p.quantity || 0) * (p.costPrice || 0);
    totalValue += value;
    
    if ((p.quantity || 0) < (p.reorderLevel || 0)) {
      lowStockValue += value;
      lowStockCount++;
    }
    
    if ((p.quantity || 0) <= 0) {
      outOfStockCount++;
    }
  }
  
  return {
    totalValue,
    lowStockValue,
    totalProducts: products.length,
    lowStockCount,
    outOfStockCount,
  };
}

export async function ABCAnalysis(products) {
  const mode = (process.env.DSA_MODE || 'addon').toLowerCase();
  
  if (mode === 'addon' && addon && typeof addon.abcAnalysis === 'function') {
    return addon.abcAnalysis(products);
  }
  
  // JS fallback - simple implementation
  const productValues = products
    .filter(p => p.isActive)
    .map((p, idx) => ({
      index: idx,
      value: (p.quantity || 0) * (p.costPrice || 0),
    }))
    .sort((a, b) => b.value - a.value);
  
  const totalValue = productValues.reduce((sum, p) => sum + p.value, 0);
  let cumulativeValue = 0;
  
  const result = { A: [], B: [], C: [] };
  
  for (const pv of productValues) {
    cumulativeValue += pv.value;
    const percentage = (cumulativeValue / totalValue) * 100;
    
    if (percentage <= 80) {
      result.A.push(products[pv.index]);
    } else if (percentage <= 95) {
      result.B.push(products[pv.index]);
    } else {
      result.C.push(products[pv.index]);
    }
  }
  
  return result;
}

export async function ExpiringBatches(products, daysAhead = 30) {
  const mode = (process.env.DSA_MODE || 'addon').toLowerCase();
  
  if (mode === 'addon' && addon && typeof addon.ExpiringBatches === 'function') {
    return addon.ExpiringBatches(products, daysAhead);
  }
  
  // JS fallback
  const now = Date.now();
  const thresholdMs = daysAhead * 24 * 60 * 60 * 1000;
  const result = [];
  const added = new Set();
  
  for (const p of products || []) {
    if (!p.isActive || !p.batches) continue;
    
    for (const batch of p.batches) {
      if (batch.expiryDate && batch.quantity > 0) {
        const expiryMs = typeof batch.expiryDate === 'string' 
          ? new Date(batch.expiryDate).getTime()
          : batch.expiryDate;
        
        if (expiryMs > now && expiryMs <= now + thresholdMs) {
          if (!added.has(p._id || p.id)) {
            result.push(p);
            added.add(p._id || p.id);
          }
          break;
        }
      }
    }
  }
  
  return result;
}

export default { getTopKToReorder };

