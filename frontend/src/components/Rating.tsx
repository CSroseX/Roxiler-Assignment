import React from 'react';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

const RatingInput: React.FC<RatingInputProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          disabled={disabled}
          onClick={() => onChange(rating)}
          className={`${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          } p-1 focus:outline-none`}
        >
          {rating <= value ? (
            <StarSolidIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <StarOutlineIcon className="h-6 w-6 text-gray-400" />
          )}
        </button>
      ))}
    </div>
  );
};

interface RatingDisplayProps {
  value: number;
  className?: string;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ value, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarSolidIcon
          key={star}
          className={`h-5 w-5 ${
            star <= value ? 'text-yellow-400' : 'text-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

export { RatingInput, RatingDisplay };