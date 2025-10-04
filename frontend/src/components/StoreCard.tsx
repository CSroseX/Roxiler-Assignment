import React, { useState } from 'react';
import { Store } from '../types';
import RatingModal from './RatingModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRatingSubmit = async (rating: number) => {
    await onRatingSubmit(store.id, rating);
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-4">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{store.name}</h3>
          <p className="text-gray-600 mb-4">{store.address}</p>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Store Rating</h4>
              <span>
                {averageRating.toFixed(1)} / 5.0
              </span>
            </div>

            <div className="mb-4">
              {userRating ? (
                <p className="text-sm text-gray-600">
                  Your rating: {userRating} stars
                </p>
              ) : (
                <p className="text-sm text-gray-600">Not rated yet</p>
              )}
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {userRating ? 'Edit Rating' : 'Rate Store'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <RatingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRatingSubmit}
        initialRating={userRating || 0}
        storeName={store.name}
      />
    </>
  );
};

export default StoreCard;