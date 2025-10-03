import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StoreList from '../components/stores/StoreList';
import StoreForm from '../components/stores/StoreForm';
import { storeService } from '../services/store.service';
import { Store } from '../types';

const StoreOwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setIsLoading(true);
      const data = await storeService.getStores();
      setStores(data);
      setError(null);
    } catch (err) {
      setError('Failed to load stores');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStore = async (values: Pick<Store, 'name' | 'email' | 'address'>) => {
    try {
      setIsSubmitting(true);
      const storeData: Omit<Store, 'id' | 'ownerId'> = {
        ...values,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await storeService.createStore(storeData);
      await loadStores();
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create store');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStore = async (values: Pick<Store, 'name' | 'email' | 'address'>) => {
    if (!editingStore) return;

    try {
      setIsSubmitting(true);
      const storeData: Omit<Store, 'id' | 'ownerId'> = {
        ...values,
        createdAt: editingStore.createdAt,
        updatedAt: new Date()
      };
      await storeService.updateStore(editingStore.id, storeData);
      await loadStores();
      setEditingStore(null);
      setError(null);
    } catch (err) {
      setError('Failed to update store');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    if (!window.confirm('Are you sure you want to delete this store?')) return;

    try {
      await storeService.deleteStore(storeId);
      await loadStores();
      setError(null);
    } catch (err) {
      setError('Failed to delete store');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Store Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your stores and track customer ratings
              </p>
            </div>
            <button
              onClick={() => {
                setEditingStore(null);
                setShowForm(!showForm);
              }}
              className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-sm font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showForm ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                )}
              </svg>
              {showForm ? 'Cancel' : 'Add Store'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Form Section */}
        {(showForm || editingStore) && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingStore ? 'Edit Store Details' : 'Create New Store'}
              </h2>
            </div>
            <div className="p-6">
              <StoreForm
                initialValues={editingStore || undefined}
                onSubmit={editingStore ? handleUpdateStore : handleCreateStore}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
              <p className="text-sm text-gray-500">Loading your stores...</p>
            </div>
          ) : stores.length > 0 ? (
            <div className="overflow-hidden">
              <StoreList
                stores={stores}
                onEdit={(store) => {
                  setEditingStore(store);
                  setShowForm(true);
                }}
                onDelete={handleDeleteStore}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No stores yet</h3>
              <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
                Get started by adding your first store to begin collecting customer ratings and feedback.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Your First Store
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;