import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

export const storeService = {
  getStores: async () => {
    const response = await api.get('/stores');
    return response.data;
  },
  getStoreById: async (id: string) => {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },
  rateStore: async (storeId: string, rating: number) => {
    const response = await api.post(`/stores/${storeId}/rate`, { rating });
    return response.data;
  },
};

export default api;