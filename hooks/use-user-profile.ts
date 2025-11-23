"use client";

import { useEffect, useState } from "react";
import { get, ApiError } from "@/lib/api";
import type { UserProfileResponse } from "@/lib/api-response";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  joinDate: string;
  profileCompletion: number;
}

export interface UserStats {
  tripPlans: number;
  visitedDestinations: number;
  reviewsWritten: number;
}

interface UseUserProfileReturn {
  profile: UserProfile | null;
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserProfile(): UseUserProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await get<UserProfileResponse>("/api/users/me", { auth: "required" });
      const userData = result.data;

      const firstName = userData.firstName || "";
      const lastName = userData.lastName || "";
      const displayName = firstName && lastName 
        ? `${firstName} ${lastName}`.trim()
        : firstName || lastName || userData.email?.split('@')[0] || "User";

      setProfile({
        id: userData.id,
        name: displayName,
        email: userData.email,
        avatar: userData.avatarUrl, 
        role: userData.role || "user",
        joinDate: userData.joinDate || userData.createdAt || new Date().toISOString(), 
        profileCompletion: userData.profileCompletion || 0,
      });

      setStats({
        tripPlans: userData.stats?.tripPlans || 0,
        visitedDestinations: userData.stats?.visitedDestinations || 0,
        reviewsWritten: userData.stats?.reviewsWritten || 0,
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError("Data profil pengguna belum tersedia");
        setProfile(null);
        setStats(null);
      } else {
        const message = err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Failed to load user profile";
        setError(message);
        console.error("useUserProfile error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return {
    profile,
    stats,
    loading,
    error,
    refetch: fetchUserProfile,
  };
}
