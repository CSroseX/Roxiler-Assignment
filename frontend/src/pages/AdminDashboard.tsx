import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UserList from '../components/admin/UserList';
import StoreList from '../components/stores/StoreList';
import { userService } from '../services/user.service';
import { storeService } from '../services/store.service';
import { User, Store } from '../types';
import PageLayout from '../components/layout/PageLayout';
import { LoadingSpinner, Alert } from '../components/common/UIComponents';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'stores'>('users');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [usersData, storesData] = await Promise.all([
        userService.getUsers(),
        storeService.getStores(),
      ]);
      setUsers(usersData);
      setStores(storesData);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async (user: User) => {
    // Implement user edit functionality
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await userService.deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
      setError(null);
    } catch (err) {
      setError('Failed to delete user');
    }
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
            {isLoading ? (
              <LoadingSpinner />
            ) : activeTab === 'users' ? (
              <UserList
                users={users}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
              />
            ) : (
              <StoreList
                stores={stores}
                onEdit={() => {}}
                onDelete={handleDeleteStore}
              />
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;