import { useState, useEffect } from "react";
import { get, post, ApiError } from "@/lib/api";

interface ReviewData {
  rating: number;
  comment: string;
  images?: string[];
}

interface User {
  id: string;
  name: string;
  avatar: string | null;
}

interface Review {
  id: string;
  userId: string;
  destinationId: string;
  rating: number;
  comment: string;
  images: string[];
  helpful: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  isHelpful: boolean;
}

interface RatingDistribution {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

interface ReviewStats {
  averageRating: number;
  ratingDistribution: RatingDistribution;
}

interface ReviewsApiResponse {
  reviews: Review[];
  total: number;
  stats: ReviewStats;
}

interface UseReviewsOptions {
  page?: number;
  limit?: number;
  sortBy?: "newest" | "oldest" | "highest" | "lowest" | "helpful";
  autoFetch?: boolean;
}

export const useReviews = (
  destinationId: string,
  options: UseReviewsOptions = {}
) => {
  const { page = 1, limit = 10, sortBy = "newest", autoFetch = true } = options;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Track liked reviews locally (workaround for isHelpful bug)
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());

  const fetchReviews = async () => {
    if (!destinationId) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
      });

      const result = await get<ReviewsApiResponse>(
        `/api/reviews/destination/${destinationId}?${params}`,
        { auth: "optional" }
      );

      setReviews(result.data.reviews);
      setTotal(result.data.total);
      setStats(result.data.stats);
    } catch (err: unknown) {
      const message = err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (data: ReviewData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await post<{ review: Review }>(
        "/api/reviews",
        {
          destinationId,
          rating: data.rating,
          comment: data.comment,
          images: data.images || [],
        },
        { auth: "required" }
      );

      await fetchReviews();

      return result.data.review;
    } catch (err: unknown) {
      const message = err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : "An error occurred";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (reviewId: string) => {
    try {
      const result = await post<{ isLiked: boolean; helpful: number }>(
        `/api/reviews/${reviewId}/like`,
        {},
        { auth: "required" }
      );

      if (result.data.isLiked) {
        setLikedReviews((prev) => new Set([...prev, reviewId]));
      } else {
        setLikedReviews((prev) => {
          const next = new Set(prev);
          next.delete(reviewId);
          return next;
        });
      }

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, helpful: result.data.helpful }
            : review
        )
      );

      return result.data;
    } catch (err: unknown) {
      const message = err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : "An error occurred";
      setError(message);
      throw err;
    }
  };

  const isReviewLiked = (reviewId: string): boolean => {
    return likedReviews.has(reviewId);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationId, page, limit, sortBy, autoFetch]);

  return {
    reviews,
    total,
    stats,
    loading,
    error,
    fetchReviews,
    submitReview,
    toggleLike,
    isReviewLiked,
    likedReviews,
  };
};
