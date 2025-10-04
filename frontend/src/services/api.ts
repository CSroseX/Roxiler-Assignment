import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:4000';

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
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Login error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  },
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    address: string;
    role: string;
  }) => {
    try {
      console.log('Making registration request to:', `${API_URL}/auth/register`);
      console.log('With data:', {
        ...userData,
        password: '********',
        headers: api.defaults.headers
      });

      const response = await api.post('/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Registration response status:', response.status);
      console.log('Registration response data:', response.data);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      return response.data;
    } catch (error) {
      console.error('Registration request failed:', error);
      if (error instanceof AxiosError) {
        console.error('Full error response:', error.response);
        const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.message;
        console.error('Server error:', errorMessage);
        throw new Error(errorMessage || 'Registration failed. Please try again.');
      } else {
        console.error('Unexpected error:', error);
        throw new Error('An unexpected error occurred during registration.');
      }
    }
  },
  changePassword: async (changePasswordData: { oldPassword: string; newPassword: string }) => {
    try {
      const response = await api.post('/auth/change-password', changePasswordData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Change password error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
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