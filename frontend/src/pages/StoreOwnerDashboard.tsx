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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Store Owner Dashboard</h1>
        <button
          onClick={() => {
            setEditingStore(null);
            setShowForm(!showForm);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Add New Store'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {(showForm || editingStore) && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingStore ? 'Edit Store' : 'Create New Store'}
          </h2>
          <StoreForm
            initialValues={editingStore || undefined}
            onSubmit={editingStore ? handleUpdateStore : handleCreateStore}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading stores...</div>
      ) : stores.length > 0 ? (
        <StoreList
          stores={stores}
          onEdit={(store) => {
            setEditingStore(store);
            setShowForm(true);
          }}
          onDelete={handleDeleteStore}
        />
      ) : (
        <div className="text-center py-4 text-gray-500">
          No stores found. Click "Add New Store" to create one.
        </div>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;