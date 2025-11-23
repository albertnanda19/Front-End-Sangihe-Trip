"use client";

import { useEffect, useState } from "react";
import { get } from "@/lib/api";
import type {
  TripResponse,
  ReviewResponse,
  DestinationResponse,
  ArticleResponse,
} from "@/lib/api-response";

// Frontend Display Interfaces
export interface RecentTrip {
  id: string;
  name: string;
  dates: string;
  status: "Upcoming" | "Planning" | "Draft" | "Completed";
  image: string;
  destinations: number;
  peopleCount: number;
  budget: number;
  startDate: string;
  endDate: string;
  tripType?: string;
  isPublic: boolean;
}

export interface RecentReview {
  id: string;
  destination: string;
  destinationId: string;
  rating: number;
  date: string;
  excerpt: string;
  likes: number;
}

export interface RecommendedDestination {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: string;
  category: string;
}

export interface RecommendedArticle {
  id: string;
  title: string;
  image: string;
  readTime: string;
  category: string;
  slug: string;
}

export interface UpcomingTrip {
  name: string;
  date: string;
  daysLeft: number;
  id: string;
}

interface UseUserDashboardReturn {
  recentTrips: RecentTrip[];
  recentReviews: RecentReview[];
  recommendedDestinations: RecommendedDestination[];
  recommendedArticles: RecommendedArticle[];
  upcomingTrips: UpcomingTrip[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserDashboard(): UseUserDashboardReturn {
  const [recentTrips, setRecentTrips] = useState<RecentTrip[]>([]);
  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);
  const [recommendedDestinations, setRecommendedDestinations] = useState<RecommendedDestination[]>([]);
  const [recommendedArticles, setRecommendedArticles] = useState<RecommendedArticle[]>([]);
  const [upcomingTrips, setUpcomingTrips] = useState<UpcomingTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [tripsRes, reviewsRes, destRes, articlesRes] = await Promise.allSettled([
        get<{ data: TripResponse[] }>("/api/users/me/trips?per_page=3&page=1", { auth: "required" }),
        get<{ data: ReviewResponse[] }>("/api/users/me/reviews?limit=3", { auth: "required" }),
        get<{ data: DestinationResponse[] }>("/api/destination?sortBy=popular&pageSize=3", { auth: false }),
        get<{ articles: ArticleResponse[] }>("/api/article?per_page=3&page=1", { auth: false }),
      ]);

      if (tripsRes.status === "fulfilled") {
        const tripsData = tripsRes.value.data?.data || [];

        const trips = tripsData.map((trip: TripResponse) => {
          const now = new Date();
          const start = new Date(trip.startDate);
          const end = new Date(trip.endDate);
          
          let status: RecentTrip["status"] = "Draft";
          
          if (now > end) {
            status = "Completed";
          } else if (now >= start && now <= end) {
            status = "Upcoming";
          } else if (now < start) {
            const daysUntilStart = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysUntilStart <= 7) {
              status = "Upcoming";
            } else if (trip.destinationCount > 0) {
              status = "Planning";
            }
          }

          return {
            id: trip.id,
            name: trip.name,
            dates: `${new Date(trip.startDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })} - ${new Date(trip.endDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}`,
            status,
            image: trip.coverImage || "/placeholder.svg",
            destinations: trip.destinationCount || 0,
            peopleCount: trip.peopleCount || 1,
            budget: trip.totalBudget || 0,
            startDate: trip.startDate,
            endDate: trip.endDate,
            tripType: trip.tripType,
            isPublic: trip.isPublic ?? false,
          };
        });
        setRecentTrips(trips);

        const upcoming = trips
          .filter((t: RecentTrip) => {
            const start = new Date(t.startDate);
            const now = new Date();
            return start > now;
          })
          .map((t: RecentTrip) => {
            const start = new Date(t.startDate);
            const now = new Date();
            const daysLeft = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return {
              name: t.name,
              date: new Date(t.startDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
              daysLeft: Math.max(0, daysLeft),
              id: t.id,
            };
          });
        setUpcomingTrips(upcoming);
      }

      if (reviewsRes.status === "fulfilled") {
        const reviewsData = reviewsRes.value.data?.data || [];

        const reviews = reviewsData.map((review: ReviewResponse) => {
          const reviewDate = new Date(review.createdAt || review.date || new Date());
          const now = new Date();
          const diffDays = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
          
          let dateStr = "";
          if (diffDays === 0) dateStr = "Hari ini";
          else if (diffDays === 1) dateStr = "Kemarin";
          else if (diffDays < 7) dateStr = `${diffDays} hari lalu`;
          else if (diffDays < 30) dateStr = `${Math.floor(diffDays / 7)} minggu lalu`;
          else dateStr = `${Math.floor(diffDays / 30)} bulan lalu`;

          return {
            id: review.id,
            destination: review.destinationName || review.destination?.name || "Destination",
            destinationId: review.destinationId || review.destination?.id || "",
            rating: review.rating || 5,
            date: dateStr,
            excerpt: review.comment || review.content || "", 
            likes: review.helpful || review.helpfulCount || review.likes || 0, 
          };
        });
        setRecentReviews(reviews);
      }

      if (destRes.status === "fulfilled") {
        const destinationsData = destRes.value.data?.data || [];

        const destinations = destinationsData.map((dest: DestinationResponse) => ({
          id: dest.id,
          name: dest.name,
          image: dest.image || dest.images?.[0] || "/placeholder.svg", 
          rating: dest.rating || 0, 
          price: dest.price ? `Rp ${dest.price.toLocaleString("id-ID")}` : "Gratis",
          category: dest.category || "Wisata", 
        }));
        setRecommendedDestinations(destinations);
      }

      if (articlesRes.status === "fulfilled") {
        const articlesData = articlesRes.value.data?.articles || [];

        const articles = articlesData.map((article: ArticleResponse) => ({
          id: article.id,
          title: article.title,
          image: article.image || "/placeholder.svg", 
          readTime: article.readingTime || "5 menit", 
          category: article.category || "Travel",
          slug: article.slug,
        }));
        setRecommendedArticles(articles);
      }
    } catch (err) {
      console.error("useUserDashboard error:", err);

      if (err instanceof Error && !err.message.includes("404")) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    recentTrips,
    recentReviews,
    recommendedDestinations,
    recommendedArticles,
    upcomingTrips,
    loading,
    error,
    refetch: fetchDashboardData,
  };
}
