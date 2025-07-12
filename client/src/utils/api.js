import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  register: (userData) => api.post('/auth/register', userData),
  
  getProfile: () => api.get('/auth/profile'),
  
  updateProfile: (profileData) => 
    api.patch('/auth/profile', profileData),
  
  changePassword: (passwordData) => 
    api.patch('/auth/change-password', passwordData),
};

// Energy API
export const energyAPI = {
  createEnergyUsage: (energyData) =>
    api.post('/energy', energyData),
  
  getEnergyUsage: (params) =>
    api.get('/energy', { params }),
  
  getEnergyUsageById: (id) =>
    api.get(`/energy/${id}`),
  
  updateEnergyUsage: (id, energyData) =>
    api.patch(`/energy/${id}`, energyData),
  
  deleteEnergyUsage: (id) =>
    api.delete(`/energy/${id}`),
  
  getEnergyStats: (params) =>
    api.get('/energy/stats', { params }),
  
  exportEnergyData: (params) =>
    api.get('/energy/export', { 
      params,
      responseType: 'blob'
    }),
  
  bulkImportEnergyUsage: (fileData) =>
    api.post('/energy/bulk-import', fileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

// Recommendations API
export const recommendationAPI = {
  generateRecommendations: () =>
    api.post('/recommendations/generate'),
  
  getRecommendations: (params) =>
    api.get('/recommendations', { params }),
  
  getRecommendationById: (id) =>
    api.get(`/recommendations/${id}`),
  
  updateRecommendationStatus: (id, status) =>
    api.patch(`/recommendations/${id}/status`, { status }),
  
  deleteRecommendation: (id) =>
    api.delete(`/recommendations/${id}`),
  
  getRecommendationStats: (params) =>
    api.get('/recommendations/stats', { params }),
};

// Users API (Admin only)
export const usersAPI = {
  getAllUsers: (params) =>
    api.get('/users', { params }),
  
  getUserById: (id) =>
    api.get(`/users/${id}`),
  
  toggleUserStatus: (id) =>
    api.patch(`/users/${id}/toggle-status`),
  
  updateUserRole: (id, role) =>
    api.patch(`/users/${id}/role`, { role }),
  
  getDashboardStats: () =>
    api.get('/users/dashboard-stats'),
};

export default api;
