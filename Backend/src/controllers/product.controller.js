const { runCpp } = require('../utils/runCpp');

function parseCppJson(jsonString, errorMessage = 'Failed to parse C++ output') {
  try {
    return JSON.parse(jsonString);
  } catch (parseError) {
    console.error('Failed to parse C++ JSON:', jsonString);
    throw new Error(errorMessage);
  }
}

const getAllProducts = async (req, res, next) => {
  try {
    const output = await runCpp('get_all_products');
    if (!output) {
      return res.status(200).send([]);
    }
    const products = parseCppJson(output, 'Failed to get products');
    res.status(200).send(products);
  } catch (error) {
    next(error);
  }
};

const addProduct = async (req, res, next) => {
  try {
    const { name, sku, price, quantity, category } = req.body;
    if (!name || !sku || price == null || quantity == null) {
      return res.status(400).send({ error: 'Missing required fields' });
    }

    const output = await runCpp('add_product', [
      sku,
      name,
      String(price),
      String(quantity),
      category || 'Uncategorized',
    ]);
    
    const newProduct = parseCppJson(output, 'Failed to add product');
    res.status(201).send(newProduct);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, sku, price, quantity, category } = req.body;

    const output = await runCpp('update_product', [
      id,
      sku || '',
      name || '',
      price != null ? String(price) : '-1',
      quantity != null ? String(quantity) : '-1',
      category || '',
    ]);

    const updatedProduct = parseCppJson(output, 'Failed to update product');
    res.status(200).send(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const output = await runCpp('delete_product', [id]);

    if (output.startsWith('Success')) {
      res.status(200).send({ message: 'Product deleted successfully' });
    } else {
      throw new Error(output || 'Failed to delete product');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};