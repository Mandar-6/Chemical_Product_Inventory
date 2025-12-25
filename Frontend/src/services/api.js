import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product API
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Inventory API
export const inventoryAPI = {
  getAll: () => api.get('/inventory'),
  getById: (id) => api.get(`/inventory/${id}`),
  updateStock: (id, type, quantity) => 
    api.post(`/inventory/${id}/stock`, { type, quantity }),
};

export default api;


