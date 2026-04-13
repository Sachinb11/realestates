import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('be_admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Properties ─────────────────────────────────────────────────────────────
export const propertyAPI = {
  getAll:       (params) => api.get('/properties', { params }),
  getFeatured:  ()       => api.get('/properties/featured'),
  getLocalities:()       => api.get('/properties/localities'),
  getBySlug:    (slug)   => api.get(`/properties/${slug}`),
  getSimilar:   (slug)   => api.get(`/properties/${slug}/similar`),
  adminGetAll:  (params) => api.get('/properties/admin/all', { params }),
  adminCreate:  (data)   => api.post('/properties/admin/create', data),
  adminUpdate:  (id, data) => api.put(`/properties/admin/${id}`, data),
  adminDelete:  (id)     => api.delete(`/properties/admin/${id}`),
  adminToggle:  (id)     => api.patch(`/properties/admin/${id}/toggle`),
};

// ─── Leads ───────────────────────────────────────────────────────────────────
export const leadAPI = {
  submitInquiry: (data) => api.post('/leads/inquiry', data),
  bookVisit:     (data) => api.post('/leads/visit',   data),
  adminGetAll:   (params) => api.get('/leads/admin/all', { params }),
  adminUpdate:   (id, data) => api.put(`/leads/admin/${id}`, data),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
export const formatPrice = (price, unit = 'total') => {
  if (!price && price !== 0) return '₹ On Request';
  if (unit === 'per-month') return `₹${price.toLocaleString('en-IN')}/mo`;
  if (unit === 'per-sqft')  return `₹${price.toLocaleString('en-IN')}/sqft`;
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000)   return `₹${(price / 100000).toFixed(2)} L`;
  if (price >= 1000)     return `₹${(price / 1000).toFixed(1)}K`;
  return `₹${price.toLocaleString('en-IN')}`;
};

export default api;
