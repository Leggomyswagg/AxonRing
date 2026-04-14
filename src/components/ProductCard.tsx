import React, { useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import StarRating from './StarRating';
import { fetchProductReviews } from '@/lib/reviewsService';

interface ProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewProduct }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [liveRating, setLiveRating] = useState<number>(product.rating);
  const [liveReviewCount, setLiveReviewCount] = useState<number>(product.reviews);

  // Fetch live review stats
  useEffect(() => {
    let cancelled = false;
    const loadStats = async () => {
      try {
        const data = await fetchProductReviews(product.id, 'most_recent');
        if (!cancelled && data.stats.total_reviews > 0) {
          setLiveRating(data.stats.average_rating);
          setLiveReviewCount(data.stats.total_reviews);
        }
      } catch {
        // Fallback to product data silently
      }
    };
    loadStats();
    return () => { cancelled = true; };
  }, [product.id, product.rating, product.reviews]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.sizes[2] || product.sizes[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div
      className="product-card group relative rounded-xl overflow-hidden bg-[hsl(220,25%,9%)] border border-white/5 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onViewProduct(product)}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
            product.badge === 'Luxury' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black' :
            product.badge === 'Premium' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
            product.badge === 'New' ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white' :
            product.badge === 'Exclusive' ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white' :
            product.badge === 'Popular' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white' :
            product.badge === 'Value Pick' ? 'bg-gradient-to-r from-teal-500 to-green-400 text-white' :
            'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
          }`}>
            {product.badge}
          </span>
        </div>
      )}

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-1 text-[10px] font-bold text-cyan-400 bg-cyan-400/10 rounded-full border border-cyan-400/20">
            -{discount}%
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[hsl(220,25%,12%)] to-[hsl(220,25%,7%)]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,25%,9%)] via-transparent to-transparent opacity-60" />

        {/* Hover Actions */}
        <div className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-300 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewProduct(product);
            }}
            className="p-3 rounded-full glass hover:bg-white/20 transition-colors"
            aria-label="Quick view"
          >
            <Eye className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={handleAddToCart}
            className={`p-3 rounded-full transition-all duration-300 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-cyan-500 hover:bg-cyan-400 text-white'
            }`}
            aria-label="Add to cart"
          >
            {added ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-1">{product.shortDesc}</p>

        {/* Rating - now using live data */}
        <div className="flex items-center gap-1.5 mb-3">
          <StarRating rating={liveRating} size="sm" />
          <span className="text-[10px] text-gray-500 ml-0.5">({liveReviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">${product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-500 line-through">${product.originalPrice}</span>
          )}
        </div>

        {/* NFC Tag */}
        <div className="mt-3 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <circle cx="12" cy="20" r="1" fill="currentColor" />
          </svg>
          <span className="text-[10px] text-cyan-400/70 font-medium">NFC Enabled</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
