// ── Reviews Service — backed by Supabase ──
// Reads/writes public.reviews directly. Row level security plus column-level
// grants mean the publishable key can read approved reviews (without reviewer
// emails), insert a new review, and bump helpful_count only through the
// increment_review_helpful RPC.

import { supabase } from './supabase';

export interface Review {
  id: string;
  product_id: string;
  reviewer_name: string;
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

// Columns the publishable key is allowed to read — reviewer_email is excluded
// by grant, so requesting it would fail the whole query.
const PUBLIC_COLUMNS =
  'id, product_id, reviewer_name, rating, title, body, verified_purchase, helpful_count, created_at';

const ORDER_BY: Record<SortOption, { column: string; ascending: boolean }> = {
  most_recent: { column: 'created_at', ascending: false },
  highest_rated: { column: 'rating', ascending: false },
  lowest_rated: { column: 'rating', ascending: true },
  most_helpful: { column: 'helpful_count', ascending: false },
};

interface ReviewRow {
  id: string;
  product_id: string;
  reviewer_name: string;
  rating: number;
  title: string | null;
  body: string | null;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
}

function toReview(row: ReviewRow): Review {
  return {
    id: row.id,
    product_id: row.product_id,
    reviewer_name: row.reviewer_name,
    rating: row.rating,
    title: row.title ?? '',
    body: row.body ?? '',
    verified_purchase: row.verified_purchase,
    helpful_count: row.helpful_count,
    created_date: row.created_at,
  };
}

function buildStats(reviews: Review[]): ReviewStats {
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) distribution[r.rating] = (distribution[r.rating] ?? 0) + 1;
  return {
    total_reviews: reviews.length,
    average_rating: reviews.length
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : 0,
    rating_distribution: distribution,
  };
}

export async function fetchProductReviews(
  productId: string,
  sortBy: SortOption = 'most_recent'
): Promise<{ reviews: Review[]; stats: ReviewStats }> {
  if (!supabase) return { reviews: [], stats: buildStats([]) };

  const order = ORDER_BY[sortBy];
  const { data, error } = await supabase
    .from('reviews')
    .select(PUBLIC_COLUMNS)
    .eq('product_id', productId)
    .order(order.column, { ascending: order.ascending });

  if (error) throw new Error(error.message);

  const reviews = ((data ?? []) as ReviewRow[]).map(toReview);
  return { reviews, stats: buildStats(reviews) };
}

export async function submitReview(
  submission: ReviewSubmission
): Promise<{ success: boolean; verifiedPurchase: boolean }> {
  if (!supabase) throw new Error('Reviews are unavailable right now.');

  const { error } = await supabase.from('reviews').insert({
    product_id: submission.productId,
    reviewer_name: submission.reviewerName,
    reviewer_email: submission.reviewerEmail || null,
    rating: submission.rating,
    title: submission.title,
    body: submission.body,
  });

  if (error) throw new Error(error.message);

  // verified_purchase is decided server-side against orders; until checkout
  // moves to Supabase it always defaults to false.
  return { success: true, verifiedPurchase: false };
}

export async function markReviewHelpful(reviewId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.rpc('increment_review_helpful', { review_id: reviewId });
  if (error) throw new Error(error.message);
}
