import React, { useState } from 'react';
import { Store } from '../types';
import { StarRating } from './StarRating';
import { storeService } from '../services/store.service';

interface StoreCardProps {
  store: Store;
  userRating: number | null;
  averageRating: number;
  onRatingSubmit: (storeId: string, rating: number) => Promise<void>;
}

const StoreCard: React.FC<StoreCardProps> = ({
  store,
  userRating,
  averageRating,
  onRatingSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRatingSubmit = async (rating: number) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onRatingSubmit(store.id, rating);
    } catch (err) {
      setError('Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-4">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{store.name}</h3>
        <p className="text-gray-600 mb-2">{store.email}</p>
        <p className="text-gray-600 mb-4">{store.address}</p>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Store Rating</h4>
            <span>
              {averageRating.toFixed(1)} / 5.0
            </span>
          </div>

          {error && (
            <div className="text-red-600 mb-4">{error}</div>
          )}

          <div className="mb-4">
            <StarRating
              value={userRating || 0}
              onChange={handleRatingSubmit}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;