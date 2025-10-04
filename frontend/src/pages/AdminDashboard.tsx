import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UserList from '../components/admin/UserList';
import AdminStoreList from '../components/admin/AdminStoreList';
import CreateUserForm from '../components/admin/CreateUserForm';
import CreateStoreForm from '../components/admin/CreateStoreForm';
import { userService } from '../services/user.service';
import { storeService } from '../services/store.service';
import { adminService } from '../services/admin.service';
import { User, Store } from '../types';
import PageLayout from '../components/layout/PageLayout';
import { LoadingSpinner, Alert } from '../components/common/UIComponents';

interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'stores'>('users');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [showCreateStoreForm, setShowCreateStoreForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [usersData, storesData, statsData] = await Promise.all([
        userService.getAdminUsers(),
        storeService.getAdminStores(),
        adminService.getDashboardStats(),
      ]);
      setUsers(usersData);
      setStores(storesData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async (user: User) => {
    // Implement user edit functionality
    alert('Edit user functionality not implemented yet');
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await userService.deleteAdminUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
      setError(null);
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleCreateUser = async (userData: Omit<User, 'id'>) => {
    try {
      await userService.createUser(userData);
      setShowCreateUserForm(false);
      loadData(); // Reload data
      setError(null);
    } catch (err) {
      setError('Failed to create user');
    }
  };

  const handleEditStore = async (store: Store) => {
    // Implement store edit functionality
    alert('Edit store functionality not implemented yet');
  };

  const handleDeleteStore = async (storeId: string) => {
    if (!window.confirm('Are you sure you want to delete this store?')) return;

    try {
      await storeService.deleteStore(storeId);
      setStores(stores.filter((store) => store.id !== storeId));
      setError(null);
    } catch (err) {
      setError('Failed to delete store');
    }
  };

  const handleCreateStore = async (storeData: Omit<Store, 'id' | 'ownerId'>) => {
    try {
      await storeService.createAdminStore(storeData);
      setShowCreateStoreForm(false);
      loadData(); // Reload data
      setError(null);
    } catch (err) {
      setError('Failed to create store');
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-300 text-base">
            Manage users, stores, and system analytics
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="glass-effect bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start animate-shake">
            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-effect p-6 rounded-2xl shadow-2xl card-hover animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.totalUsers}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="glass-effect p-6 rounded-2xl shadow-2xl card-hover animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Stores</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.totalStores}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="glass-effect p-6 rounded-2xl shadow-2xl card-hover animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Ratings</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.totalRatings}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="glass-effect rounded-2xl shadow-2xl overflow-hidden">
          <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('users')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'users'
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Users
                </div>
              </button>
              <button
                onClick={() => setActiveTab('stores')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'stores'
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Stores
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {activeTab === 'users' ? 'Manage Users' : 'Manage Stores'}
              </h3>
              <button
                onClick={() => activeTab === 'users' ? setShowCreateUserForm(true) : setShowCreateStoreForm(true)}
                className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-xl font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create {activeTab === 'users' ? 'User' : 'Store'}
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <svg className="spinner w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full mb-4" viewBox="0 0 24 24"></svg>
                <p className="text-sm text-gray-500">Loading data...</p>
              </div>
            ) : activeTab === 'users' ? (
              <UserList
                users={users}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
              />
            ) : (
              <AdminStoreList
                stores={stores}
                onEdit={handleEditStore}
                onDelete={handleDeleteStore}
              />
            )}
          </div>
        </div>

        {/* Create User Form Modal */}
        {showCreateUserForm && (
          <CreateUserForm
            onCreate={handleCreateUser}
            onCancel={() => setShowCreateUserForm(false)}
          />
        )}

        {/* Create Store Form Modal */}
        {showCreateStoreForm && (
          <CreateStoreForm
            onCreate={handleCreateStore}
            onCancel={() => setShowCreateStoreForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
