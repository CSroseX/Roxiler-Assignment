import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storeService } from '../services/store.service';
import StoreCard from '../components/StoreCard';
import { Store } from '../types';

interface StoreWithRatings extends Store {
  userRating?: number;
  averageRating?: number;
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState<StoreWithRatings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStores = async () => {
    try {
      setIsLoading(true);
      const data = await storeService.getStores();
      // Here we would also fetch ratings for each store
      // For now, we'll just set dummy ratings
      const storesWithRatings = data.map((store: Store) => ({
        ...store,
        userRating: 0,
        averageRating: 0,
      }));
      setStores(storesWithRatings);
      setError(null);
    } catch (err) {
      setError('Failed to load stores');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  const handleRatingSubmit = async (storeId: string, rating: number) => {
    try {
      await storeService.rateStore(storeId, rating);
      setStores(
        stores.map((store) =>
          store.id === storeId
            ? { ...store, userRating: rating }
            : store
        )
      );
      setError(null);
    } catch (err) {
      setError('Failed to submit rating');
      throw err; // Re-throw to handle in the StoreCard component
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
      <div className="mb-8">
        <p className="text-lg">Welcome, {user?.name}</p>
        <p className="text-gray-600">Rate your favorite stores below</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading stores...</div>
      ) : stores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              userRating={store.userRating ?? null}
              averageRating={store.averageRating ?? 0}
              onRatingSubmit={handleRatingSubmit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          No stores available for rating.
        </div>
      )}
    </div>
  );
};

export default UserDashboard;