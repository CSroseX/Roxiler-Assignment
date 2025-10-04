import api from './api';
import { Store } from '../types';

export const storeService = {
  getStores: async () => {
    const response = await api.get('/stores');
    return response.data.data;
  },

  getStoreById: async (id: string) => {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },

  createStore: async (storeData: Omit<Store, 'id' | 'ownerId'>) => {
    const response = await api.post('/stores', storeData);
    return response.data;
  },

  updateStore: async (id: string, storeData: Omit<Store, 'id' | 'ownerId'>) => {
    const response = await api.put(`/stores/${id}`, storeData);
    return response.data;
  },

  deleteStore: async (id: string) => {
    await api.delete(`/stores/${id}`);
  },

  getStoreRatings: async (storeId: string) => {
    const response = await api.get(`/stores/${storeId}/ratings`);
    return response.data;
  },

  rateStore: async (storeId: string, rating: number) => {
    const response = await api.post(`/stores/${storeId}/rate`, { rating });
    return response.data;
  },

  getMyRatings: async () => {
    const response = await api.get('/stores/ratings/my');
    return response.data;
  },

  // Admin methods
  getAdminStores: async () => {
    const response = await api.get('/admin/stores');
    return response.data;
  },

  createAdminStore: async (storeData: Omit<Store, 'id' | 'ownerId'>) => {
    const response = await api.post('/admin/stores', storeData);
    return response.data;
  },
};
