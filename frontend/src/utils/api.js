import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token if available
api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('be_admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Properties ───────────────────────────────────────────────────────────────
export const propertyAPI = {
  getAll: (params) => api.get('/properties', { params }),
  getFeatured: () => api.get('/properties/featured'),
  getLocalities: () => api.get('/properties/localities'),
  getBySlug: (slug) => api.get(`/properties/${slug}`),
  // Admin
  adminGetAll: (params) => api.get('/properties/admin/all', { params }),
  adminCreate: (data) => api.post('/properties/admin/create', data),
  adminUpdate: (id, data) => api.put(`/properties/admin/${id}`, data),
  adminDelete: (id) => api.delete(`/properties/admin/${id}`),
  adminToggle: (id) => api.patch(`/properties/admin/${id}/toggle`)
};

// ─── Leads ────────────────────────────────────────────────────────────────────
export const leadAPI = {
  submitInquiry: (data) => api.post('/leads/inquiry', data),
  bookVisit: (data) => api.post('/leads/visit', data),
  // Admin
  adminGetAll: (params) => api.get('/leads/admin/all', { params }),
  adminUpdate: (id, data) => api.put(`/leads/admin/${id}`, data),
  adminDelete: (id) => api.delete(`/leads/admin/${id}`)
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data)
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats')
};

// ─── Upload ───────────────────────────────────────────────────────────────────
export const uploadAPI = {
  images: (formData) => api.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteImage: (filename) => api.delete(`/upload/image/${filename}`)
};

// ─── Utils ────────────────────────────────────────────────────────────────────
export const formatPrice = (price, unit = 'total') => {
  if (!price) return 'Price on Request';
  if (unit === 'per-month') return `₹${price.toLocaleString('en-IN')}/mo`;

  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
};

export const PROPERTY_TYPES = [
  { value: 'flat', label: 'Flat / Apartment' },
  { value: 'plot', label: 'Plot / Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'rental', label: 'Rental' },
  { value: 'builder-project', label: 'Builder Project' }
];

export const BHK_OPTIONS = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK', 'Studio'];

export const AMENITIES_LIST = [
  'Swimming Pool', 'Gym', 'Club House', 'Security', 'Power Backup',
  'Lift', 'Garden', 'Children Play Area', 'Parking', 'Visitor Parking',
  'CCTV', 'Intercom', 'Rain Water Harvesting', 'Solar Energy',
  'Sewage Treatment', 'Fire Safety', 'Jogging Track', 'Badminton Court',
  'Tennis Court', 'Indoor Games', 'Multipurpose Hall', 'Temple',
  'School', 'Hospital Nearby', 'Market Nearby', 'Railway Station Nearby',
  'Bus Stop Nearby', 'Highway Access', 'Water Supply 24/7'
];

export default api;
