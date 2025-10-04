import api from './api';
import { User } from '../types';

export const userService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    await api.delete(`/users/${id}`);
  },

  // Admin methods
  getAdminUsers: async (filters?: { name?: string; email?: string; address?: string; role?: string }) => {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.email) params.append('email', filters.email);
    if (filters?.address) params.append('address', filters.address);
    if (filters?.role) params.append('role', filters.role);
    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  createUser: async (userData: Omit<User, 'id'>) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  getAdminUserById: async (id: string) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  deleteAdminUser: async (id: string) => {
    await api.delete(`/admin/users/${id}`);
  },
};
