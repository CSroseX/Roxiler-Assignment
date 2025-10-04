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
      // Filter stores: show all for admin, only owned for store_owner
      const filteredStores = data.filter((store: Store) =>
        user?.role === 'admin' || store.ownerId === user?.id
      );
      setStores(filteredStores);
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.2);
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <div className="max-w-7xl w-full space-y-8 relative z-10 animate-slide-up">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
            Store Management
          </h1>
          <p className="text-gray-300 text-base">
            Manage your stores and track customer ratings
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="glass-effect bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start animate-shake">
            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Analytics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Your Ratings */}
          <div className="glass-effect p-6 rounded-2xl shadow-2xl card-hover animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-sm font-medium text-gray-500">Your Ratings</h3>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {stores.length > 0 ? (stores.reduce((acc, s) => acc + (s.avgRating || 0), 0) / stores.length).toFixed(1) : 'N/A'}
                  <span className="text-gray-400 text-base ml-1">/5</span>
                </p>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="glass-effect p-6 rounded-2xl shadow-2xl card-hover animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-sm font-medium text-gray-500">Performance</h3>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {stores.length} {stores.length === 1 ? 'Store' : 'Stores'}
                </p>
                <p className="text-sm text-gray-400 mt-1">Managing efficiently</p>
              </div>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="glass-effect p-6 rounded-2xl shadow-2xl card-hover animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-sm font-medium text-gray-500">Total Reviews</h3>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {stores.reduce((acc, s) => acc + (s.ratingsCount || 0), 0)}
                </p>
                <p className="text-sm text-gray-400 mt-1">Customer feedback</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        {(showForm || editingStore) && (
          <div className="glass-effect rounded-2xl shadow-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
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

        {/* Main Content */}
        <div className="glass-effect rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Your Stores</h3>
              <button
                onClick={() => {
                  setEditingStore(null);
                  setShowForm(!showForm);
                }}
                className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-xl font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showForm ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  )}
                </svg>
                {showForm ? 'Cancel' : 'Add Store'}
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <svg className="spinner w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full mb-4" viewBox="0 0 24 24"></svg>
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
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
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
                  className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-xl font-medium text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Your First Store
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;