const { runCpp } = require('../utils/runCpp');

function parseCppJson(jsonString, errorMessage = 'Failed to parse C++ output') {
  try {
    return JSON.parse(jsonString);
  } catch (parseError) {
    console.error('Failed to parse C++ JSON:', jsonString);
    throw new Error(errorMessage);
  }
}

const getAllOrders = async (req, res, next) => {
  try {
    const output = await runCpp('get_all_orders');
    if (!output) {
      return res.status(200).send([]);
    }
    const orders = parseCppJson(output, 'Failed to get orders');
    res.status(200).send(orders);
  } catch (error) {
    next(error);
  }
};

const addOrder = async (req, res, next) => {
  try {
    const { customerName, items } = req.body; // items is [{productId: "123", quantity: 2}, ...]
    if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).send({ error: 'Invalid order data' });
    }

    // We must pass the items array as a single JSON string
    // This is a complex argument, so we serialize it
    const itemsJson = JSON.stringify(items);

    // Args: customerName, itemsJson
    const output = await runCpp('add_order', [customerName, itemsJson]);

    const newOrder = parseCppJson(output, 'Failed to create order');
    res.status(201).send(newOrder);
  } catch (error) {
    // Error from C++ might be "Insufficient stock for product..."
    next(error);
  }
};

module.exports = { getAllOrders, addOrder };