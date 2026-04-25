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

  useEffect(() => {
    let cancelled = false;
    const loadStats = async () => {
      try {
        const data = await fetchProductReviews(product.id, 'most_recent');
        if (!cancelled && data.stats.total_reviews > 0) {
          setLiveRating(data.stats.average_rating);
          setLiveReviewCount(data.stats.total_reviews);
        }
      } catch { /* fallback silently */ }
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
      className="group relative overflow-hidden bg-[#0a0a0a] border border-white/5 hover:border-yellow-500/20 cursor-pointer transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onViewProduct(product)}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] bg-gradient-to-r from-yellow-600 to-yellow-400 text-black">
            {product.badge}
          </span>
        </div>
      )}

      {/* Discount */}
      {discount > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-1 text-[9px] font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20">
            -{discount}%
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#111]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-black/30 flex items-end justify-center pb-4 gap-2 transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={(e) => { e.stopPropagation(); onViewProduct(product); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold border border-white/20 hover:bg-white/20 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-all duration-300 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-400'
            }`}
          >
            {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 border-t border-white/5">
        <p className="text-[9px] font-bold text-yellow-500/70 uppercase tracking-[0.25em] mb-1.5">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-yellow-400 transition-colors leading-snug">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-600 mb-3 line-clamp-1">{product.shortDesc}</p>

        <div className="flex items-center gap-1.5 mb-3">
          <StarRating rating={liveRating} size="sm" />
          <span className="text-[10px] text-gray-600">({liveReviewCount})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-600 line-through">${product.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-yellow-500/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <circle cx="12" cy="20" r="1" fill="currentColor" />
            </svg>
            <span className="text-[9px] text-yellow-500/60 font-medium">NFC</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
