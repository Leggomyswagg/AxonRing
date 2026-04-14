import React, { useState, useEffect, useRef } from 'react';
import { Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, Star, Shield, Truck, RotateCcw, Minus, Plus, Check, ShoppingBag, Wifi, Heart } from 'lucide-react';
import StarRating from './StarRating';
import ReviewSection from './ReviewSection';
import { fetchProductReviews, ReviewStats } from '@/lib/reviewsService';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onViewProduct: (product: Product) => void;
  relatedProducts: Product[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onViewProduct, relatedProducts }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[2] || product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'features' | 'nfc' | 'specs'>('features');
  const [liveStats, setLiveStats] = useState<ReviewStats | null>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  // Fetch live review stats for this product
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchProductReviews(product.id, 'most_recent');
        setLiveStats(data.stats);
      } catch (err) {
        console.error('Failed to load review stats:', err);
      }
    };
    loadStats();
  }, [product.id]);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  // Use live stats if available, fallback to product data
  const displayRating = liveStats ? liveStats.average_rating : product.rating;
  const displayReviewCount = liveStats ? liveStats.total_reviews : product.reviews;

  return (
    <div className="min-h-screen bg-[hsl(220,25%,6%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(220,25%,12%)] to-[hsl(220,25%,7%)] border border-white/5">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.badge && (
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                  {product.badge}
                </span>
              </div>
            )}
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className="absolute top-4 right-4 p-3 rounded-full glass hover:bg-white/10 transition-colors"
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'text-red-500 fill-red-500' : 'text-white'}`} />
            </button>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">{product.category}</span>
              <span className="text-xs text-gray-600">|</span>
              <div className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-cyan-400" />
                <span className="text-xs text-cyan-400">NFC Enabled</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">{product.name}</h1>

            {/* Rating - now clickable to scroll to reviews */}
            <button
              onClick={scrollToReviews}
              className="flex items-center gap-2 mb-4 group"
            >
              <StarRating rating={displayRating} size="sm" />
              <span className="text-sm text-gray-400 group-hover:text-cyan-400 transition-colors">
                {displayRating > 0 ? displayRating.toFixed(1) : '—'} ({displayReviewCount} review{displayReviewCount !== 1 ? 's' : ''})
              </span>
            </button>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-black text-white">${product.price}</span>
              <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
              <span className="px-3 py-1 text-xs font-bold text-green-400 bg-green-400/10 rounded-full">
                Save {discount}%
              </span>
            </div>

            <p className="text-gray-400 leading-relaxed mb-8">{product.description}</p>

            {/* Size Selector */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-white mb-3 block">Ring Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg text-sm font-bold transition-all duration-200 ${
                      selectedSize === size
                        ? 'bg-cyan-500 text-white border-2 border-cyan-400 shadow-lg shadow-cyan-500/25'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:border-cyan-400/30 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="text-sm font-semibold text-white mb-3 block">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-cyan-400/30 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-bold text-white w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-cyan-400/30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart — ${(product.price * quantity).toFixed(2)}
                  </>
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <Truck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-[11px] text-gray-400">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <RotateCcw className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-[11px] text-gray-400">30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-[11px] text-gray-400">2-Year Warranty</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-white/5 pt-8">
              <div className="flex gap-6 mb-6">
                {(['features', 'nfc', 'specs'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'text-cyan-400 border-cyan-400'
                        : 'text-gray-500 border-transparent hover:text-gray-300'
                    }`}
                  >
                    {tab === 'nfc' ? 'NFC Capabilities' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {activeTab === 'features' && (
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'nfc' && (
                <ul className="space-y-2">
                  {product.nfcCapabilities.map((c, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <Wifi className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-3">
                  {[
                    { label: 'Material', value: product.material },
                    { label: 'Water Resistance', value: product.waterproof },
                    { label: 'Battery Life', value: product.battery },
                    { label: 'NFC Protocol', value: 'ISO 14443A/B, NFC Forum Type 2/4' },
                    { label: 'Compatibility', value: 'iOS 14+ / Android 8+' },
                    { label: 'Available Sizes', value: product.sizes.join(', ') },
                  ].map((spec, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-sm text-gray-500">{spec.label}</span>
                      <span className="text-sm text-white font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div ref={reviewsRef}>
          <ReviewSection productId={product.id} productName={product.name} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-white mb-8">You May Also Like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.slice(0, 4).map(p => (
                <button
                  key={p.id}
                  onClick={() => onViewProduct(p)}
                  className="group text-left rounded-xl overflow-hidden bg-white/[0.02] border border-white/5 hover:border-cyan-400/20 transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-cyan-400 font-semibold mb-1">{p.category}</p>
                    <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{p.name}</p>
                    <p className="text-sm font-bold text-gray-400 mt-1">${p.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
