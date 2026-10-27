import React, { useState } from 'react';
import { ThumbsUp, ShieldCheck, User, Calendar } from 'lucide-react';
import StarRating from './StarRating';
import { Review, markReviewHelpful } from '@/lib/reviewsService';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const handleHelpful = async () => {
    if (hasVoted || isVoting) return;
    setIsVoting(true);
    try {
      const newCount = await markReviewHelpful(review.id);
      setHelpfulCount(newCount);
      setHasVoted(true);
      // Store in localStorage to persist
      const votedReviews = JSON.parse(localStorage.getItem('voted_reviews') || '[]');
      votedReviews.push(review.id);
      localStorage.setItem('voted_reviews', JSON.stringify(votedReviews));
    } catch (err) {
      console.error('Failed to mark helpful:', err);
    } finally {
      setIsVoting(false);
    }
  };

  // Check if user already voted on this review
  React.useEffect(() => {
    const votedReviews = JSON.parse(localStorage.getItem('voted_reviews') || '[]');
    if (votedReviews.includes(review.id)) {
      setHasVoted(true);
    }
  }, [review.id]);

  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent color from the reviewer name
  const getAvatarColor = (name: string) => {
    const colors = [
      'from-cyan-500 to-blue-600',
      'from-purple-500 to-pink-500',
      'from-emerald-500 to-teal-500',
      'from-amber-500 to-orange-500',
      'from-rose-500 to-red-500',
      'from-indigo-500 to-violet-500',
      'from-lime-500 to-green-500',
      'from-sky-500 to-cyan-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="group relative p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getAvatarColor(review.reviewer_name)} flex items-center justify-center flex-shrink-0`}>
          <span className="text-xs font-bold text-white">{getInitials(review.reviewer_name)}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm">{review.reviewer_name}</span>
            {review.verified_purchase && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Verified Purchase</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <StarRating rating={review.rating} size="sm" />
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              {timeAgo(review.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h4 className="font-bold text-white text-sm mb-2">{review.title}</h4>

      {/* Body */}
      <p className="text-sm text-gray-400 leading-relaxed mb-4">{review.body}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <button
          onClick={handleHelpful}
          disabled={hasVoted || isVoting}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            hasVoted
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'bg-white/[0.03] text-gray-500 border border-white/5 hover:text-white hover:border-white/10 hover:bg-white/[0.05]'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-cyan-400' : ''}`} />
          <span>Helpful ({helpfulCount})</span>
        </button>

        <div className="flex items-center gap-1">
          {[...Array(review.rating)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          ))}
          {[...Array(5 - review.rating)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-700" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
