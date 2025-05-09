import { Star, StarHalf } from "lucide-react";

interface RatingProps {
  value: number;
  reviews?: number;
  size?: number;
  showCount?: boolean;
}

const Rating = ({ value, reviews, size = 16, showCount = true }: RatingProps) => {
  // Ensure the value is between 0 and 5
  const safeValue = Math.min(Math.max(0, value), 5);
  
  // Calculate the full stars, half stars, and empty stars
  const fullStars = Math.floor(safeValue);
  const hasHalfStar = safeValue % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex items-center">
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} fill="currentColor" size={size} className="text-yellow-400" />
        ))}
        
        {hasHalfStar && (
          <StarHalf key="half" fill="currentColor" size={size} className="text-yellow-400" />
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-gray-300" />
        ))}
      </div>
      
      {showCount && reviews !== undefined && (
        <span className="text-gray-600 text-sm ml-1">
          {value.toFixed(1)} ({reviews})
        </span>
      )}
    </div>
  );
};

export default Rating;
