import React, { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquarePlus, ChevronDown, Filter, TrendingUp, Clock, ArrowUpDown, Loader2, Send, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import StarRating from './StarRating';
import ReviewCard from './ReviewCard';
import { Review, ReviewStats, SortOption, fetchProductReviews, submitReview } from '@/lib/reviewsService';

interface ReviewSectionProps {
  productId: string;
  productName: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId, productName }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    total_reviews: 0,
    average_rating: 0,
    rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [sortBy, setSortBy] = useState<SortOption>('most_recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRating, setFormRating] = useState(0);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchProductReviews(productId, sortBy);
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setIsLoading(false);
    }
  }, [productId, sortBy]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!formRating) {
      setSubmitError('Please select a star rating');
      return;
    }
    if (!formName.trim() || !formEmail.trim() || !formTitle.trim() || !formBody.trim()) {
      setSubmitError('Please fill in all fields');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail)) {
      setSubmitError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview({
        product_id: productId,
        reviewer_name: formName.trim(),
        reviewer_email: formEmail.trim(),
        rating: formRating,
        title: formTitle.trim(),
        body: formBody.trim(),
      });

      setSubmitSuccess(true);
      setFormName('');
      setFormEmail('');
      setFormRating(0);
      setFormTitle('');
      setFormBody('');

      // Reload reviews
      setTimeout(() => {
        loadReviews();
        setSubmitSuccess(false);
        setShowForm(false);
      }, 2500);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews = filterRating
    ? reviews.filter(r => r.rating === filterRating)
    : reviews;

  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 5);

  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'most_recent', label: 'Most Recent', icon: <Clock className="w-4 h-4" /> },
    { value: 'highest_rated', label: 'Highest Rated', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'lowest_rated', label: 'Lowest Rated', icon: <ArrowUpDown className="w-4 h-4" /> },
    { value: 'most_helpful', label: 'Most Helpful', icon: <Star className="w-4 h-4" /> },
  ];

  const maxDistribution = Math.max(...Object.values(stats.rating_distribution), 1);

  return (
    <div className="mt-16 border-t border-white/5 pt-12">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-8 mb-10">
        {/* Left: Rating Summary */}
        <div className="lg:w-80 flex-shrink-0">
          <h3 className="text-2xl font-bold text-white mb-6">Customer Reviews</h3>
          
          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/5">
            {/* Big Rating */}
            <div className="flex items-center gap-4 mb-5">
              <div className="text-5xl font-black text-white">
                {stats.average_rating > 0 ? stats.average_rating.toFixed(1) : '—'}
              </div>
              <div>
                <StarRating rating={stats.average_rating} size="md" />
                <p className="text-sm text-gray-400 mt-1">
                  Based on {stats.total_reviews} review{stats.total_reviews !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Rating Distribution Bars */}
            <div className="space-y-2.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.rating_distribution[star] || 0;
                const percentage = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0;
                const barWidth = (count / maxDistribution) * 100;
                const isActive = filterRating === star;

                return (
                  <button
                    key={star}
                    onClick={() => setFilterRating(isActive ? null : star)}
                    className={`w-full flex items-center gap-3 group transition-all duration-200 p-1 -m-1 rounded-lg ${
                      isActive ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <span className={`text-xs font-semibold w-4 text-right ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                      {star}
                    </span>
                    <Star className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-amber-400 fill-amber-400' : 'text-amber-400/50 fill-amber-400/50'}`} />
                    <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                            : 'bg-gradient-to-r from-amber-500/70 to-amber-400/70'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className={`text-xs w-10 text-right ${isActive ? 'text-cyan-400 font-semibold' : 'text-gray-500'}`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </button>
                );
              })}
            </div>

            {filterRating && (
              <button
                onClick={() => setFilterRating(null)}
                className="mt-4 flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear filter
              </button>
            )}
          </div>

          {/* Write Review Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Write a Review
          </button>
        </div>

        {/* Right: Reviews List */}
        <div className="flex-1 min-w-0">
          {/* Sort & Filter Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {filterRating
                  ? `${filteredReviews.length} review${filteredReviews.length !== 1 ? 's' : ''} with ${filterRating} star${filterRating !== 1 ? 's' : ''}`
                  : `${stats.total_reviews} review${stats.total_reviews !== 1 ? 's' : ''}`
                }
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-sm text-gray-400 hover:text-white hover:border-white/10 transition-all"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{sortOptions.find(s => s.value === sortBy)?.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {sortDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSortDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 py-1 rounded-xl bg-[hsl(220,25%,12%)] border border-white/10 shadow-2xl z-20">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setSortDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                          sortBy === option.value
                            ? 'text-cyan-400 bg-cyan-500/5'
                            : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                        }`}
                      >
                        {option.icon}
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredReviews.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto mb-4">
                <MessageSquarePlus className="w-7 h-7 text-gray-600" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                {filterRating ? 'No reviews with this rating' : 'No reviews yet'}
              </h4>
              <p className="text-sm text-gray-500 mb-6">
                {filterRating
                  ? 'Try a different filter or clear the current one.'
                  : `Be the first to review the ${productName}.`
                }
              </p>
              {!filterRating && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-sm font-semibold hover:bg-cyan-500/20 transition-colors"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  Write the first review
                </button>
              )}
            </div>
          )}

          {/* Reviews List */}
          {!isLoading && filteredReviews.length > 0 && (
            <div className="space-y-4">
              {displayedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}

          {/* Show More */}
          {!isLoading && filteredReviews.length > 5 && !showAllReviews && (
            <button
              onClick={() => setShowAllReviews(true)}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm font-semibold text-gray-400 hover:text-white hover:border-white/10 transition-all"
            >
              <ChevronDown className="w-4 h-4" />
              Show All {filteredReviews.length} Reviews
            </button>
          )}

          {showAllReviews && filteredReviews.length > 5 && (
            <button
              onClick={() => setShowAllReviews(false)}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm font-semibold text-gray-400 hover:text-white hover:border-white/10 transition-all"
            >
              Show Less
            </button>
          )}
        </div>
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !isSubmitting && setShowForm(false)} />
          
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[hsl(220,25%,10%)] border border-white/10 shadow-2xl">
            {/* Form Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 pb-4 bg-[hsl(220,25%,10%)] border-b border-white/5">
              <div>
                <h3 className="text-xl font-bold text-white">Write a Review</h3>
                <p className="text-sm text-gray-400 mt-1">{productName}</p>
              </div>
              <button
                onClick={() => !isSubmitting && setShowForm(false)}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Review Submitted!</h4>
                <p className="text-sm text-gray-400">Thank you for your feedback. Your review is now live.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="p-6 space-y-5">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">Your Rating</label>
                  <StarRating
                    rating={formRating}
                    size="lg"
                    interactive
                    onRatingChange={setFormRating}
                  />
                  {formRating > 0 && (
                    <p className="text-xs text-gray-400 mt-2">
                      {formRating === 1 && 'Poor'}
                      {formRating === 2 && 'Fair'}
                      {formRating === 3 && 'Good'}
                      {formRating === 4 && 'Very Good'}
                      {formRating === 5 && 'Excellent'}
                    </p>
                  )}
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Your Name</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Email</label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="john@email.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                      required
                    />
                    <p className="text-[10px] text-gray-600 mt-1">Used to verify purchase. Never displayed publicly.</p>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Review Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    maxLength={100}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                    required
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Your Review</label>
                  <textarea
                    value={formBody}
                    onChange={(e) => setFormBody(e.target.value)}
                    placeholder="Share your experience with this product. What did you like? What could be improved?"
                    rows={5}
                    maxLength={2000}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none"
                    required
                  />
                  <p className="text-[10px] text-gray-600 mt-1 text-right">{formBody.length}/2000</p>
                </div>

                {/* Error */}
                {submitError && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-sm text-red-400">{submitError}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Review
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
