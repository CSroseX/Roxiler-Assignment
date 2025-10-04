import React, { useState, useEffect, useMemo } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating'>('name');

  const loadStores = async () => {
    try {
      setIsLoading(true);
      const storesData = await storeService.getStores();
      let userRatings = [];
      try {
        userRatings = await storeService.getMyRatings();
      } catch (err) {
        console.warn('Failed to load user ratings, proceeding without them.', err);
      }

      const userRatingsMap = new Map(userRatings.map((r: { storeId: string; rating: number }) => [r.storeId, r.rating]));

      const storesWithRatings = storesData.map((store: Store) => ({
        ...store,
        userRating: userRatingsMap.get(store.id) || null,
        averageRating: store.avgRating || 0,
      }));

      setStores(storesWithRatings);
      setError(null);
    } catch (err) {
      console.error('Error loading stores:', err);
      setError('Failed to load stores');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  const filteredAndSortedStores = useMemo(() => {
    let filtered = stores.filter(store =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return (b.averageRating || 0) - (a.averageRating || 0);
      }
    });

    return filtered;
  }, [stores, searchTerm, sortBy]);

  const handleRatingSubmit = async (storeId: string, rating: number) => {
    try {
      await storeService.rateStore(storeId, rating);
      // Update userRating and refetch averageRating for the store
      const updatedStores = await storeService.getStores();
      let userRatings = [];
      try {
        userRatings = await storeService.getMyRatings();
      } catch (err) {
        console.warn('Failed to load user ratings, proceeding without them.', err);
      }
      const userRatingsMap = new Map(userRatings.map((r: { storeId: string; rating: number }) => [r.storeId, r.rating]));
      const storesWithRatings = updatedStores.map((store: Store) => ({
        ...store,
        userRating: userRatingsMap.get(store.id) || null,
        averageRating: store.avgRating || 0,
      }));
      setStores(storesWithRatings);
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

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'rating')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="name">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading stores...</div>
      ) : filteredAndSortedStores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedStores.map((store) => (
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