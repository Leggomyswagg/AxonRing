import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showValue = false,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const gapMap = {
    sm: 'gap-0.5',
    md: 'gap-1',
    lg: 'gap-1.5',
  };

  const textSizeMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`flex items-center ${gapMap[size]} ${className}`}>
      <div className={`flex items-center ${gapMap[size]}`}>
        {[...Array(maxStars)].map((_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= Math.floor(displayRating);
          const isPartial = !isFilled && starValue <= displayRating + 0.5 && starValue > Math.floor(displayRating);

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`relative ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
              aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
            >
              {/* Background star (empty) */}
              <Star className={`${sizeMap[size]} text-gray-600/40`} />
              
              {/* Filled star overlay */}
              {(isFilled || isPartial) && (
                <Star
                  className={`${sizeMap[size]} absolute inset-0 text-amber-400 fill-amber-400 ${
                    interactive && hoverRating >= starValue ? 'drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]' : ''
                  }`}
                  style={isPartial ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
                />
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className={`${textSizeMap[size]} font-semibold text-white ml-1`}>
          {rating > 0 ? rating.toFixed(1) : ''}
        </span>
      )}
    </div>
  );
};

export default StarRating;
