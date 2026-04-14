// ── Reviews Service — powered by Base44 backend ──
const REVIEWS_URL = 'https://tek-agent-65076290.base44.app/functions/reviews';

export interface Review {
  id: string;
  product_id: string;
  reviewer_name: string;
  reviewer_email?: string;
  rating: number;
  title: string;
  body: string;
  verified_purchase: boolean;
  helpful_count: number;
  created_date: string;
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: Record<number, number>;
}

export interface ReviewSubmission {
  productId: string;
  reviewerName: string;
  reviewerEmail?: string;
  rating: number;
  title: string;
  body: string;
}

export type SortOption = 'most_recent' | 'highest_rated' | 'lowest_rated' | 'most_helpful';

export async function fetchProductReviews(
  productId: string,
  sortBy: SortOption = 'most_recent'
): Promise<{ reviews: Review[]; stats: ReviewStats }> {
  const res = await fetch(`${REVIEWS_URL}?productId=${encodeURIComponent(productId)}`);
  if (!res.ok) throw new Error('Failed to load reviews');

  const data = await res.json();
  let reviews: Review[] = data.reviews || [];

  // Client-side sort
  if (sortBy === 'highest_rated') {
    reviews = reviews.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'lowest_rated') {
    reviews = reviews.sort((a, b) => a.rating - b.rating);
  } else if (sortBy === 'most_helpful') {
    reviews = reviews.sort((a, b) => b.helpful_count - a.helpful_count);
  }
  // most_recent is default from API

  return { reviews, stats: data.stats };
}

export async function submitReview(submission: ReviewSubmission): Promise<{ success: boolean; verifiedPurchase: boolean }> {
  const res = await fetch(REVIEWS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit review');
  return { success: true, verifiedPurchase: data.verifiedPurchase || false };
}
