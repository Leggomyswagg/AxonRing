import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import {
  Minus, Plus, ShoppingBag, Truck, Shield, RotateCcw,
  Wifi, Activity, Home, ChevronRight, Star, Check,
  ThumbsUp, BadgeCheck, MessageSquarePlus, X,
} from 'lucide-react';
import { getProduct, PRODUCTS } from '@/data/catalog';
import { analytics } from '@/hooks/useAnalytics';

const BASE44_API = 'https://tek-agent-65076290.base44.app/functions';

// ── Types ──────────────────────────────────────────────────────
interface Review {
  id: string;
  product_id: string;
  reviewer_name: string;
  rating: number;
  title: string;
  body: string | null;
  verified_purchase: boolean;
  helpful_count: number;
  created_date: string;
}

// ── Star Input ─────────────────────────────────────────────────
function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star} type="button"
          onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star className={`w-7 h-7 transition-colors ${star <= (hover || value) ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-zinc-600'}`} />
        </button>
      ))}
    </div>
  );
}

// ── Star Display ───────────────────────────────────────────────
function StarDisplay({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star} className={`${sz} ${star <= rating ? 'fill-amber-400 text-amber-400' : star - 0.5 <= rating ? 'fill-amber-400/50 text-amber-400' : 'fill-transparent text-zinc-700'}`} />
      ))}
    </div>
  );
}

// ── Rating Bar ─────────────────────────────────────────────────
function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-zinc-400 w-8 text-right">{stars}</span>
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
      <div className="flex-1 h-2.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm text-zinc-500 w-8">{count}</span>
    </div>
  );
}

// ── Review Form ────────────────────────────────────────────────
function ReviewForm({ productId, onSubmitted, onClose }: { productId: string; onSubmitted: () => void; onClose: () => void }) {
  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [rating,     setRating]     = useState(0);
  const [title,      setTitle]      = useState('');
  const [body,       setBody]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim() || rating === 0) {
      setError('Please fill in your name, title, and select a rating.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${BASE44_API}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id:       productId,
          reviewer_name:    name.trim(),
          reviewer_email:   email.trim() || null,
          rating,
          title:            title.trim(),
          body:             body.trim() || null,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      onSubmitted();
    } catch {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const ic = "w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors";

  return (
    <div className="bg-zinc-900/70 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Write a Review</h3>
        <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
          <X className="w-5 h-5 text-zinc-400" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-semibold text-zinc-300 mb-2 block">Your Rating *</label>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-zinc-300 mb-2 block">Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className={ic} required />
          </div>
          <div>
            <label className="text-sm font-semibold text-zinc-300 mb-2 block">Email <span className="text-zinc-600 font-normal">(for verification)</span></label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" className={ic} />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-zinc-300 mb-2 block">Review Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Summarize your experience" className={ic} required />
        </div>
        <div>
          <label className="text-sm font-semibold text-zinc-300 mb-2 block">Your Review</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Tell others about your experience..." rows={4} className={`${ic} resize-none`} />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={submitting}
          className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

// ── Review Card ────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  const [helpfulCount,   setHelpfulCount]   = useState(review.helpful_count || 0);
  const [helpfulClicked, setHelpfulClicked] = useState(false);

  const handleHelpful = async () => {
    if (helpfulClicked) return;
    setHelpfulClicked(true);
    setHelpfulCount(c => c + 1);
    // Fire-and-forget — no Supabase needed
    fetch(`${BASE44_API}/reviews`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review_id: review.id }),
    }).catch(() => {});
  };

  const timeAgo = (d: string) => {
    const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
    if (days < 1) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}yr ago`;
  };

  return (
    <div className="p-6 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <StarDisplay rating={review.rating} />
            {review.verified_purchase && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <BadgeCheck className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Verified</span>
              </span>
            )}
          </div>
          <h4 className="font-semibold text-white text-base">{review.title}</h4>
        </div>
      </div>
      {review.body && <p className="text-zinc-400 leading-relaxed mb-4 text-sm">{review.body}</p>}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
            <span className="text-xs font-bold text-rose-400">{review.reviewer_name[0]?.toUpperCase()}</span>
          </div>
          <span className="text-sm font-medium text-zinc-300">{review.reviewer_name}</span>
          <span className="text-xs text-zinc-600">· {timeAgo(review.created_date)}</span>
        </div>
        <button onClick={handleHelpful} disabled={helpfulClicked}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${helpfulClicked ? 'bg-zinc-800 text-zinc-300 cursor-default' : 'hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          Helpful {helpfulCount > 0 && `(${helpfulCount})`}
        </button>
      </div>
    </div>
  );
}

// ── Reviews Section ────────────────────────────────────────────
function ReviewsSection({ productId, seedRating, seedCount }: { productId: string; seedRating: number; seedCount: number }) {
  const [reviews,     setReviews]     = useState<Review[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [submitted,   setSubmitted]   = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE44_API}/reviews?product_id=${encodeURIComponent(productId)}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : (data.reviews || []));
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  // Blend live reviews with seed stats for display
  const liveCount = reviews.length;
  const liveAvg   = liveCount > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / liveCount : 0;

  // Weighted blend: seed data + live reviews
  const totalCount = seedCount + liveCount;
  const blendedAvg = totalCount > 0
    ? (seedRating * seedCount + liveAvg * liveCount) / totalCount
    : seedRating;

  const dist = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
  }));

  return (
    <div id="reviews-section" className="mt-20 pt-20 border-t border-zinc-800">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl lg:text-3xl font-bold text-white">Customer Reviews</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 border border-zinc-700 hover:border-rose-500/50 text-zinc-300 hover:text-white rounded-xl text-sm font-medium transition-all"
          >
            <MessageSquarePlus className="w-4 h-4" /> Write a Review
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="grid lg:grid-cols-3 gap-8 mb-10">
        <div className="flex flex-col items-center justify-center p-8 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 text-center">
          <p className="text-7xl font-bold text-white mb-2">{blendedAvg.toFixed(1)}</p>
          <StarDisplay rating={Math.round(blendedAvg)} size="lg" />
          <p className="text-zinc-500 text-sm mt-2">{totalCount} reviews</p>
        </div>
        <div className="lg:col-span-2 p-8 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 space-y-3 justify-center flex flex-col">
          {dist.map(({ stars, count }) => (
            <RatingBar key={stars} stars={stars} count={count} total={liveCount} />
          ))}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8">
          {submitted ? (
            <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
              <Check className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-semibold text-lg">Thank you for your review!</p>
              <p className="text-zinc-400 text-sm mt-1">It will appear after moderation.</p>
            </div>
          ) : (
            <ReviewForm
              productId={productId}
              onSubmitted={() => { setSubmitted(true); setShowForm(false); fetchReviews(); }}
              onClose={() => setShowForm(false)}
            />
          )}
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-36 bg-zinc-900/50 rounded-2xl animate-pulse" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16">
          <Star className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-400 text-lg font-medium">No written reviews yet</p>
          <p className="text-zinc-600 text-sm mt-1">Be the first to share your experience</p>
          <button onClick={() => setShowForm(true)} className="mt-5 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-colors text-sm">
            Write First Review
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
        </div>
      )}
    </div>
  );
}

// ── Main Product Page ──────────────────────────────────────────
export default function ProductPage() {
  const { handle }       = useParams<{ handle: string }>();
  const product          = handle ? getProduct(handle) : undefined;
  const [selectedSize,   setSelectedSize]   = useState('');
  const [quantity,       setQuantity]       = useState(1);
  const [activeImage,    setActiveImage]    = useState(0);
  const { addToCart }    = useCart();

  // Fire view_item analytics on load
  useEffect(() => {
    if (product) {
      analytics.viewItem({ id: product.id, name: product.name, price: product.price, category: product.tags[0] || '' });
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <CartDrawer />
        <div className="pt-40 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
          <Link to="/collections/all-rings" className="text-rose-400 hover:text-rose-300">Browse all rings →</Link>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants.find(v => v.option1 === selectedSize) || product.variants[0];
  const currentPrice    = selectedVariant?.price ?? product.price;
  const inStock         = selectedVariant ? selectedVariant.inventory_qty > 0 : true;
  const isElite         = product.tags.includes('elite');

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      product_id:    product.id,
      variant_id:    selectedVariant?.id,
      name:          product.name,
      variant_title: selectedSize,
      sku:           selectedVariant?.sku,
      price:         currentPrice,
      image:         product.images[0],
    }, quantity);
  };

  // Related products — same collection, excluding current
  const related = PRODUCTS
    .filter(p => p.id !== product.id && p.tags.some(t => product.tags.includes(t)))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <CartDrawer />

      <div className="pt-28 lg:pt-36 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <nav className="flex items-center gap-2 text-sm text-zinc-500">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/collections/all-rings" className="hover:text-white transition-colors">All Rings</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-300">{product.name}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

            {/* ── Images ── */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-900">
                <img src={product.images[activeImage] || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                {isElite && (
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold uppercase tracking-wider rounded-full">Elite</div>
                )}
                <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-medium text-white uppercase tracking-wider">NFC</span>
                </div>
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-rose-500' : 'border-zinc-800 hover:border-zinc-600'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Info ── */}
            <div>
              {/* Rating anchor */}
              <button onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity"
              >
                <StarDisplay rating={Math.round(product.rating)} />
                <span className="text-sm text-zinc-500">{product.rating} ({product.review_count} reviews)</span>
              </button>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">{product.name}</h1>
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">{product.metadata.finish} · {product.metadata.material}</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent mb-6">
                ${currentPrice}
              </p>

              <p className="text-zinc-400 leading-relaxed mb-8">{product.description}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-8">
                {product.features.map(f => (
                  <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-300">
                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" /> {f}
                  </span>
                ))}
              </div>

              {/* Size selector */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-white">Ring Size</label>
                  <button className="text-xs text-rose-400 hover:text-rose-300 transition-colors">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(v => (
                    <button key={v.option1} onClick={() => setSelectedSize(v.option1)}
                      disabled={v.inventory_qty === 0}
                      className={`w-12 h-12 rounded-xl font-medium text-sm transition-all duration-200 ${
                        selectedSize === v.option1
                          ? 'bg-rose-500 text-white border-2 border-rose-500 shadow-lg shadow-rose-500/25'
                          : v.inventory_qty > 0
                          ? 'bg-zinc-900 text-zinc-300 border border-zinc-700 hover:border-zinc-500'
                          : 'bg-zinc-900/50 text-zinc-700 border border-zinc-800 cursor-not-allowed line-through'
                      }`}
                    >
                      {v.option1}
                    </button>
                  ))}
                </div>
                {!selectedSize && <p className="text-xs text-zinc-500 mt-2">Select a size to continue</p>}
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <label className="text-sm font-semibold text-white mb-3 block">Quantity</label>
                <div className="inline-flex items-center border border-zinc-700 rounded-xl">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-zinc-800 rounded-l-xl transition-colors">
                    <Minus className="w-4 h-4 text-zinc-400" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-zinc-800 rounded-r-xl transition-colors">
                    <Plus className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
              </div>

              {/* Discount code hint */}
              <div className="mb-5 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-medium">🎁 Use code <span className="font-mono font-bold">WELCOME10</span> at checkout for 10% off</span>
              </div>

              {/* Add to cart */}
              <button onClick={handleAddToCart} disabled={!selectedSize || !inStock}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                {!inStock ? 'Out of Stock' : !selectedSize ? 'Select a Size' : `Add to Cart — $${currentPrice * quantity}`}
              </button>

              {/* Trust */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-zinc-800 text-center">
                {[
                  { icon: Truck,     label: 'Free Shipping'   },
                  { icon: Shield,    label: '2-Yr Warranty'   },
                  { icon: RotateCcw, label: '30-Day Returns'  },
                ].map(({ icon: Icon, label }) => (
                  <div key={label}>
                    <Icon className="w-5 h-5 text-zinc-500 mx-auto mb-1.5" />
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>

              {/* NFC features */}
              <div className="flex flex-wrap gap-3 mt-8">
                {[
                  { icon: Wifi,     label: 'NFC Payments',     color: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/20'    },
                  { icon: Activity, label: 'Health Tracking',  color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                  { icon: Home,     label: 'Smart Home',       color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20'  },
                ].map(({ icon: Icon, label, color, bg }) => (
                  <div key={label} className={`flex items-center gap-2 px-3 py-2 ${bg} border rounded-full`}>
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    <span className="text-xs text-zinc-300 font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Reviews ── */}
          <ReviewsSection productId={product.id} seedRating={product.rating} seedCount={product.review_count} />

          {/* ── Related products ── */}
          {related.length > 0 && (
            <div className="mt-20 pt-20 border-t border-zinc-800">
              <h2 className="text-2xl font-bold text-white mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map(p => (
                  <Link key={p.id} to={`/product/${p.handle}`}
                    className="group bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-rose-500/30 transition-all duration-300"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-white text-sm group-hover:text-rose-300 transition-colors">{p.name}</p>
                      <p className="text-rose-400 font-bold mt-1">${p.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
