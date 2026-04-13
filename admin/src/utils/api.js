import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE, timeout: 20000 });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('be_admin_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('be_admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const propertyAPI = {
  getAll: (params) => api.get('/properties/admin/all', { params }),
  create: (data) => api.post('/properties/admin/create', data),
  update: (id, data) => api.put(`/properties/admin/${id}`, data),
  delete: (id) => api.delete(`/properties/admin/${id}`),
  toggle: (id) => api.patch(`/properties/admin/${id}/toggle`),
};

export const leadAPI = {
  getAll: (params) => api.get('/leads/admin/all', { params }),
  update: (id, data) => api.put(`/leads/admin/${id}`, data),
  delete: (id) => api.delete(`/leads/admin/${id}`),
};

export const visitAPI = {
  getAll: () => api.get('/visits/admin/all'),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export const uploadAPI = {
  images: (formData) => api.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteImage: (filename) => api.delete(`/upload/image/${filename}`),
};

export const formatPrice = (price, unit = 'total') => {
  if (!price) return '₹ On Request';
  if (unit === 'per-month') return `₹${price.toLocaleString('en-IN')}/mo`;
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
};

export default api;
