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
    <PageLayout title="Admin Dashboard">
      <div className="container mx-auto px-4 py-6">
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">U</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">S</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Stores</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalStores}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">R</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Ratings</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalRatings}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('users')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('stores')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'stores'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Stores
              </button>
            </nav>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {activeTab === 'users' ? 'Manage Users' : 'Manage Stores'}
              </h3>
              <button
                onClick={() => activeTab === 'users' ? setShowCreateUserForm(true) : setShowCreateStoreForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Create {activeTab === 'users' ? 'User' : 'Store'}
              </button>
            </div>

            {isLoading ? (
              <LoadingSpinner />
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
    </PageLayout>
  );
};

export default AdminDashboard;
