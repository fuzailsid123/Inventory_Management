const { runCpp } = require('../utils/runCpp');

function parseCppJson(jsonString, errorMessage = 'Failed to parse C++ output') {
  try {
    return JSON.parse(jsonString);
  } catch (parseError) {
    console.error('Failed to parse C++ JSON:', jsonString);
    throw new Error(errorMessage);
  }
}

const getLowStockReport = async (req, res, next) => {
  try {
    // C++ script uses a Min-Heap to find and return low stock items
    const output = await runCpp('get_low_stock_report');
    if (!output) {
      return res.status(200).send([]);
    }
    const report = parseCppJson(output, 'Failed to generate low stock report');
    res.status(200).send(report);
  } catch (error) {
    next(error);
  }
};

const getSortedProducts = async (req, res, next) => {
  try {
    const { by = 'name', order = 'asc' } = req.query; // e.g., ?by=price&order=desc

    // C++ script uses std::sort (Merge/Quick Sort)
    // Args: sortBy, sortOrder
    const output = await runCpp('get_products_sorted', [by, order]);
    
    if (!output) {
      return res.status(200).send([]);
    }
    const sortedProducts = parseCppJson(output, 'Failed to get sorted products');
    res.status(200).send(sortedProducts);
  } catch (error) {
    next(error);
  }
};

module.exports = { getLowStockReport, getSortedProducts };