"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/lib/cookies";

/**
 * useAuthStatus – mengembalikan boolean apakah pengguna telah terautentikasi
 * dengan memeriksa keberadaan cookie "access_token".
 */
export function useAuthStatus(): boolean {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Periksa cookie saat mount
    const token = getCookie("access_token");
    setIsAuthenticated(Boolean(token));
  }, []);

  return isAuthenticated;
} 