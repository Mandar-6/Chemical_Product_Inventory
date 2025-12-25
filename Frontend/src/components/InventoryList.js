import React, { useState, useEffect } from 'react';
import { inventoryAPI } from '../services/api';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingStock, setUpdatingStock] = useState(null);
  const [stockForm, setStockForm] = useState({
    type: 'IN',
    quantity: '',
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getAll();
      setInventory(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleStockInputChange = (e) => {
    const { name, value } = e.target;
    setStockForm((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };

  const handleStockUpdate = async (inventoryId, e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { type, quantity } = stockForm;

    // Ensure quantity is a valid number
    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError('Quantity must be a positive number');
      return;
    }

    try {
      await inventoryAPI.updateStock(inventoryId, type, quantityNum);
      setSuccess(`Stock ${type === 'IN' ? 'increased' : 'decreased'} successfully`);
      setStockForm({ type: 'IN', quantity: '' });
      setUpdatingStock(null);
      fetchInventory();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update stock');
    }
  };

  const getStockBadgeClass = (stock) => {
    if (stock === 0) return 'low';
    if (stock < 50) return 'low';
    if (stock < 100) return 'medium';
    return 'high';
  };

  return (
    <div>
      <div className="card">
        <h2>Inventory List</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {loading ? (
          <div className="empty-state">
            <p>Loading inventory...</p>
          </div>
        ) : inventory.length === 0 ? (
          <div className="empty-state">
            <p>No inventory items found. Add products first.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>CAS Number</th>
                  <th>Current Stock</th>
                  <th>Unit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product_name}</td>
                    <td>{item.cas_number}</td>
                    <td>
                      <span className={`stock-badge ${getStockBadgeClass(item.current_stock)}`}>
                        {item.current_stock} {item.unit_of_measurement}
                      </span>
                    </td>
                    <td>{item.unit_of_measurement}</td>
                    <td>
                      {updatingStock === item.id ? (
                        <form
                          className="stock-form"
                          onSubmit={(e) => handleStockUpdate(item.id, e)}
                        >
                          <div className="form-group">
                            <select
                              name="type"
                              value={stockForm.type}
                              onChange={handleStockInputChange}
                              style={{ marginBottom: '8px' }}
                            >
                              <option value="IN">IN</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <input
                              type="number"
                              name="quantity"
                              value={stockForm.quantity}
                              onChange={handleStockInputChange}
                              placeholder="Qty"
                              min="0.01"
                              step="0.01"
                              required
                              style={{ marginBottom: '8px' }}
                            />
                          </div>
                          <button type="submit" className="btn btn-success btn-small">
                            Update
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-small"
                            onClick={() => {
                              setUpdatingStock(null);
                              setStockForm({ type: 'IN', quantity: '' });
                            }}
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <button
                          className="btn btn-primary btn-small"
                          onClick={() => {
                            setUpdatingStock(item.id);
                            setStockForm({ type: 'IN', quantity: '' });
                            setError('');
                            setSuccess('');
                          }}
                        >
                          Update Stock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryList;


