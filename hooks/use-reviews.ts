import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";
import { getCookie } from "@/lib/cookies";

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

      const token = getCookie("access_token");

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${apiUrl(`/api/reviews/destination/${destinationId}`)}?${params}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const result = await response.json();

      setReviews(result.data.reviews);
      setTotal(result.data.total);
      setStats(result.data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (data: ReviewData) => {
    setLoading(true);
    setError(null);

    try {
      const token = getCookie("access_token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(apiUrl("/api/reviews"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destinationId,
          rating: data.rating,
          comment: data.comment,
          images: data.images || [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      const result = await response.json();

      await fetchReviews();

      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (reviewId: string) => {
    try {
      const token = getCookie("access_token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(apiUrl(`/api/reviews/${reviewId}/like`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle like");
      }

      const result = await response.json();

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
