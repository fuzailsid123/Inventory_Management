import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Layout from '../components/Layout';
import ProductForm from '../components/ProductForm';
import { FaTrash, FaPen } from "react-icons/fa";

const Products = ({ onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // SORT CONFIGURATION
  const [sortConfig, setSortConfig] = useState({
    by: "price",
    order: "asc",
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (product) => {
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, product);
      } else {
        await api.post('/products', product);
      }
      setShowModal(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Failed to save product', err);
      setError('Failed to save product. Check console for details.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error('Failed to delete product', err);
        setError('Failed to delete product.');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  // SORTING LOGIC
  const sortedProducts = [...products].sort((a, b) => {
    let valA = a[sortConfig.by];
    let valB = b[sortConfig.by];

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortConfig.order === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.order === "asc" ? 1 : -1;
    return 0;
  });

  const handleSortChange = (e) => {
    const { name, value } = e.target;
    setSortConfig((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Layout onNavigate={onNavigate} title="Products">

      {/* ADD PRODUCT BUTTON */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddNew}
          className="px-6 py-3 font-semibold text-white rounded-xl shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 transform transition-all duration-300 hover:scale-110 hover:shadow-2xl"
        >
          + Add Product
        </button>
      </div>

      {/* SORTING BAR */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Sort Products</h3>

          <div className="flex space-x-3">
            <select
              name="by"
              value={sortConfig.by}
              onChange={handleSortChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="price">Price</option>
              <option value="name">Name</option>
              <option value="quantity">Quantity</option>
              <option value="id">Recently Added</option>
            </select>

            <select
              name="order"
              value={sortConfig.order}
              onChange={handleSortChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">

              {sortedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>

                  {/* ACTION BUTTONS */}
                  <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-4">

                    {/* EDIT ICON BUTTON */}
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-gray-500 hover:text-blue-600 transition transform hover:scale-125"
                    >
                      <FaPen size={18} />
                    </button>

                    {/* DELETE ICON BUTTON */}
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-gray-500 hover:text-red-600 transition transform hover:scale-125"
                    >
                      <FaTrash size={18} />
                    </button>

                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      )}

      {/* PRODUCT FORM MODAL */}
      {showModal && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          saveButtonClass="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-xl"
        />
      )}

    </Layout>
  );
};

export default Products;
