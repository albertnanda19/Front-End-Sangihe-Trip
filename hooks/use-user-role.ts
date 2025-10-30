"use client";

import { useEffect, useState } from "react";
import { getRole } from "@/lib/auth";

/**
 * useUserRole – mengembalikan role pengguna saat ini ('user' | 'admin' | null)
 */
export function useUserRole(): 'user' | 'admin' | null {
  const [role, setRole] = useState<'user' | 'admin' | null>(null);

  useEffect(() => {
    const checkRole = () => {
      const currentRole = getRole();
      setRole(currentRole);
    };

    checkRole();

    const handleAuthChange = () => checkRole();
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  return role;
}