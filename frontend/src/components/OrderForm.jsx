import React, { useState } from 'react';

const OrderForm = ({ products, onSave, onClose }) => {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    if(field === 'productId' && value !== '') {
       newItems[index]['quantity'] = 1;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };
  
  const getProductStock = (productId) => {
    if (!productId) return 0;
    const product = products.find(p => p.id === parseInt(productId));
    return product?.quantity || 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedItems = items
      .filter(item => item.productId && item.quantity > 0)
      .map(item => ({
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
      }));
    
    if(formattedItems.length === 0) {
      alert("Please add at least one valid item.");
      return;
    }
      
    onSave({ customerName, items: formattedItems });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <h3 className="mb-4 text-xl font-semibold">Create Order</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
          <h4 className="text-lg font-medium">Items</h4>
          {items.map((item, index) => (
            <div key={index} className="flex items-end space-x-2">
              <div className="flex-1">
                <label className="block text-sm font-medium">Product</label>
                <select
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                >
                  <option value="">Select a product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} disabled={p.quantity === 0}>
                      {p.name} (Stock: {p.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={getProductStock(item.productId)}
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  required
                  disabled={!item.productId}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="px-3 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
          >
            Add Another Item
          </button>
          
          <div className="flex justify-end pt-4 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;