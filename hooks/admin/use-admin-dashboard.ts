import { useState, useEffect } from "react";
import { get, ApiResult } from "@/lib/api";

export interface RegistrationData {
  month: string;
  users: number;
}

export interface DestinationData {
  name: string;
  visits: number;
}

export interface TripPlanData {
  month: string;
  plans: number;
}

export interface ReviewRatingData {
  rating: number;
  count: number;
  color: string;
}

export interface SummaryResponse {
  totalUsers: number;
  userGrowth: string;
  totalDestinations: number;
  destinationGrowth: string;
  totalTripPlans: number;
  tripGrowth: string;
  totalReviews: number;
  reviewGrowth: string;
}

export interface KPIData {
  title: string;
  value: string | number;
  growth: string;
  trend: "up" | "down";
  icon: React.FC<{ className?: string }>;
  color: string;
}

export function useAdminDashboard() {
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [userRegistrationData, setUserRegistrationData] = useState<RegistrationData[]>([]);
  const [popularDestinationsData, setPopularDestinationsData] = useState<DestinationData[]>([]);
  const [tripPlansData, setTripPlansData] = useState<TripPlanData[]>([]);
  const [reviewRatingsData, setReviewRatingsData] = useState<ReviewRatingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatMonthLabel = (monthStr: unknown) => {
    if (!monthStr) return "";
    const s = String(monthStr);
    const tryDate = new Date(s.length === 7 ? `${s}-01` : s);
    if (isNaN(tryDate.getTime())) return s;
    return tryDate.toLocaleString("id-ID", { month: "short", year: "numeric" });
  };

  const formatNumber = (v: number | string | undefined) => {
    if (v === undefined || v === null) return "0";
    const n = Number(v) || 0;
    return n.toLocaleString("id-ID");
  };

  const hasData = (arr: unknown[] | undefined) => Array.isArray(arr) && arr.length > 0;

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const [
          summaryRes,
          registrationsRes,
          popularDestinationsRes,
          tripPlansRes,
          reviewDistributionRes,
        ] = await Promise.all([
          get<SummaryResponse>("/api/admin/metrics/summary", { auth: "required" }),
          get<RegistrationData[]>("/api/admin/metrics/registrations?range=6mo", { auth: "required" }),
          get<DestinationData[]>("/api/admin/metrics/popular-destinations?limit=10&period=30d", { auth: "required" }),
          get<TripPlanData[]>("/api/admin/metrics/trip-plans?range=6mo", { auth: "required" }),
          get<ReviewRatingData[]>("/api/admin/metrics/review-distribution?period=30d", { auth: "required" }),
        ]);

        const summary = (summaryRes as ApiResult<SummaryResponse>)?.data as SummaryResponse | undefined;
        const registrationsRaw = (registrationsRes as ApiResult<unknown>)?.data as unknown[] | undefined;
        const popularDestinationsRaw = (popularDestinationsRes as ApiResult<unknown>)?.data as unknown[] | undefined;
        const tripPlansRaw = (tripPlansRes as ApiResult<unknown>)?.data as unknown[] | undefined;
        const reviewDistributionRaw = (reviewDistributionRes as ApiResult<unknown>)?.data as unknown[] | undefined;

        const registrations = (registrationsRaw ?? []).map((r: unknown) => {
          const obj = r as Record<string, unknown>;
          return {
            month: (obj["month"] as string) ?? (obj["period"] as string) ?? (obj["label"] as string) ?? "",
            users: Number((obj["users"] as number) ?? (obj["count"] as number) ?? 0),
          } as RegistrationData;
        });

        registrations.sort((a, b) => a.month.localeCompare(b.month));

        const popularDestinations = (popularDestinationsRaw ?? []).map((d: unknown) => {
          const obj = d as Record<string, unknown>;
          return {
            name: (obj["name"] as string) ?? (obj["destination"] as string) ?? (obj["title"] as string) ?? "",
            visits: Number((obj["visits"] as number) ?? (obj["views"] as number) ?? (obj["count"] as number) ?? 0),
          } as DestinationData;
        });

        const tripPlans = (tripPlansRaw ?? []).map((t: unknown) => {
          const obj = t as Record<string, unknown>;
          return {
            month: (obj["month"] as string) ?? (obj["period"] as string) ?? (obj["label"] as string) ?? "",
            plans: Number((obj["plans"] as number) ?? (obj["count"] as number) ?? 0),
          } as TripPlanData;
        });

        const palette = ["#4f46e5", "#10b981", "#ef4444", "#f59e0b", "#06b6d4"];
        const reviewDistribution = (reviewDistributionRaw ?? []).map((rd: unknown, idx: number) => {
          const obj = rd as Record<string, unknown>;
          return {
            rating: Number(obj["rating"] ?? obj["stars"] ?? (idx + 1)),
            count: Number(obj["count"] ?? obj["value"] ?? 0),
            color: (obj["color"] as string) ?? palette[idx % palette.length],
          } as ReviewRatingData;
        });

        const { Users, MapPin, Calendar, Star } = await import("lucide-react");

        setKpiData([
          {
            title: "Total Users",
            value: summary?.totalUsers ?? 0,
            growth: summary?.userGrowth ?? "0%",
            trend: "up",
            icon: Users as unknown as React.FC<{ className?: string }>,
            color: "text-blue-600",
          },
          {
            title: "Total Destinations",
            value: summary?.totalDestinations ?? 0,
            growth: summary?.destinationGrowth ?? "0%",
            trend: "up",
            icon: MapPin,
            color: "text-green-600",
          },
          {
            title: "Total Trip Plans",
            value: summary?.totalTripPlans ?? 0,
            growth: summary?.tripGrowth ?? "0%",
            trend: "up",
            icon: Calendar,
            color: "text-purple-600",
          },
          {
            title: "Total Reviews",
            value: summary?.totalReviews ?? 0,
            growth: summary?.reviewGrowth ?? "0%",
            trend: "up",
            icon: Star,
            color: "text-yellow-600",
          },
        ]);

        setUserRegistrationData(registrations ?? []);
        setPopularDestinationsData(popularDestinations ?? []);
        setTripPlansData(tripPlans ?? []);
        setReviewRatingsData(reviewDistribution ?? []);
      } catch (err) {
        setError((err as Error).message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return {
    kpiData,
    userRegistrationData,
    popularDestinationsData,
    tripPlansData,
    reviewRatingsData,
    loading,
    error,
    formatMonthLabel,
    formatNumber,
    hasData,
  };
}