"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/lib/cookies";
import { decodeJwt } from "@/lib/jwt";
import { logout } from "@/lib/auth";

/**
 * useAuthStatus – mengembalikan boolean apakah pengguna telah terautentikasi
 * dengan memeriksa keberadaan cookie "access_token".
 */
export function useAuthStatus(): boolean {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie("access_token");

      if (token) {
        try {
          const payload = decodeJwt<{ exp?: number }>(token);
          const exp = payload?.exp;
          if (typeof exp === "number" && exp * 1000 < Date.now()) {
            logout("/masuk");
            setIsAuthenticated(false);
            return;
          }
        } catch {
        }
      }

      const newAuthState = Boolean(token);
      setIsAuthenticated((prev) => (prev !== newAuthState ? newAuthState : prev));
    };

    checkAuth();

    const interval = setInterval(checkAuth, 30000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuth();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleAuthChange = () => checkAuth();
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  return isAuthenticated;
}