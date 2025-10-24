"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";
import { getCookie } from "@/lib/cookies";
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
      const token = getCookie("access_token");
      if (!token) {
        setError("Pengguna belum login");
        setProfile(null);
        setStats(null);
        setLoading(false);
        return;
      }

      const response = await fetch(apiUrl("/api/users/me"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError("Data profil pengguna belum tersedia");
          setProfile(null);
          setStats(null);
          setLoading(false);
          return;
        }
        throw new Error("Gagal memuat profil pengguna");
      }

      const json = await response.json();
      const userData: UserProfileResponse = json.data;

      const firstName = userData.first_name || userData.firstName || "";
      const lastName = userData.last_name || userData.lastName || "";
      const displayName = firstName && lastName 
        ? `${firstName} ${lastName}`.trim()
        : firstName || lastName || userData.email?.split('@')[0] || "User";

      setProfile({
        id: userData.id,
        name: displayName,
        email: userData.email,
        avatar: userData.avatar_url || userData.avatar, 
        role: userData.role || "user",
        joinDate: userData.joinDate || userData.created_at || new Date().toISOString(), 
        profileCompletion: userData.profileCompletion || 0,
      });

      setStats({
        tripPlans: userData.stats?.tripPlans || 0,
        visitedDestinations: userData.stats?.visitedDestinations || 0,
        reviewsWritten: userData.stats?.reviewsWritten || 0,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load user profile";
      setError(message);
      console.error("useUserProfile error:", err);
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
