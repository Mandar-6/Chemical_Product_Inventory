import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_name: '',
    cas_number: '',
    unit_of_measurement: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingProduct) {
        await productAPI.update(editingProduct.id, formData);
        setSuccess('Product updated successfully');
      } else {
        await productAPI.create(formData);
        setSuccess('Product created successfully');
      }
      
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      product_name: product.product_name,
      cas_number: product.cas_number,
      unit_of_measurement: product.unit_of_measurement,
    });
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productAPI.delete(id);
      setSuccess('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      product_name: '',
      cas_number: '',
      unit_of_measurement: '',
    });
    setEditingProduct(null);
    setError('');
    setSuccess('');
  };

  return (
    <div>
      <div className="card">
        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="product_name">Product Name *</label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              value={formData.product_name}
              onChange={handleInputChange}
              required
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cas_number">CAS Number *</label>
            <input
              type="text"
              id="cas_number"
              name="cas_number"
              value={formData.cas_number}
              onChange={handleInputChange}
              required
              placeholder="Enter CAS number (e.g., 7647-14-5)"
              disabled={!!editingProduct}
            />
            {editingProduct && (
              <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                CAS number cannot be changed
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="unit_of_measurement">Unit of Measurement *</label>
            <select
              id="unit_of_measurement"
              name="unit_of_measurement"
              value={formData.unit_of_measurement}
              onChange={handleInputChange}
              required
            >
              <option value="">Select unit</option>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="L">L</option>
              <option value="mL">mL</option>
              <option value="mg">mg</option>
              <option value="pieces">pieces</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            {editingProduct && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Products List</h2>
        
        {loading ? (
          <div className="empty-state">
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products found. Add a new product to get started.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>CAS Number</th>
                  <th>Unit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.product_name}</td>
                    <td>{product.cas_number}</td>
                    <td>{product.unit_of_measurement}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn btn-warning btn-small"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-small"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </button>
                      </div>
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

export default ProductManagement;


