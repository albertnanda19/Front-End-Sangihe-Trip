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
    const checkAuth = () => {
      const token = getCookie("access_token");
      const newAuthState = Boolean(token);
      
      setIsAuthenticated((prev) => {
        if (prev !== newAuthState) {
          return newAuthState;
        }
        return prev;
      });
    };

    checkAuth();

    const interval = setInterval(checkAuth, 500);

    const handleAuthChange = () => checkAuth();
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  return isAuthenticated;
} 