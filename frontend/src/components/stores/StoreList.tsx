import React from 'react';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Store } from '../../types';

interface StoreListProps {
  stores: Store[];
  onEdit: (store: Store) => void;
  onDelete: (storeId: string) => void;
}

const StoreList: React.FC<StoreListProps> = ({ stores, onEdit, onDelete }) => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stores.map((store) => (
        <div key={store.id} className="bg-white shadow-sm rounded-lg border border-gray-100 p-4 flex flex-col justify-between transform transition hover:-translate-y-1 hover:shadow-lg">
          <div>
            <div className="flex items-start justify-between">
              <div className="pr-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{store.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{store.email}</p>
                <p className="text-sm text-gray-600 mt-3 line-clamp-3">{store.address}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-yellow-400">
                  <StarSolid className="h-5 w-5" />
                  <span className="ml-1 text-sm text-gray-700 font-medium">{(((store as any).avgRating) || 0).toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
            <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(store)}
                className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => onDelete(store.id)}
                className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded-md border border-red-100 hover:bg-red-100 transition"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
            <div className="text-sm text-gray-500">Created {new Date(store.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreList;