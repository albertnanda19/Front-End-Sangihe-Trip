"use client";

import { getCookie, deleteCookie } from "@/lib/cookies";
import { decodeJwt, DecodedToken } from "@/lib/jwt";
import { toast } from "sonner";

/**
 * Get the current user's role from JWT token
 * @returns 'user' | 'admin' | null
 */
export function getRole(): 'user' | 'admin' | null {
  if (typeof window === "undefined") return null;
  
  const token = getCookie("access_token");
  if (!token) return null;

  const decoded = decodeJwt<DecodedToken>(token);
  return decoded?.role ?? null;
}

/**
 * Check if the current user is an admin
 * @returns boolean
 */
export function isAdmin(): boolean {
  return getRole() === "admin";
}

/**
 * Check if the current user is logged in (has a valid token)
 * @returns boolean
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const token = getCookie("access_token");
  return !!token;
}

/**
 * Get the current user information from JWT token
 * @returns DecodedToken | null
 */
export function getCurrentUser(): DecodedToken | null {
  if (typeof window === "undefined") return null;
  
  const token = getCookie("access_token");
  if (!token) return null;

  return decodeJwt<DecodedToken>(token);
}

/**
 * Logout the current user by clearing all auth cookies
 */
export function logout(redirectTo = "/beranda") {
  try {
    deleteCookie("access_token");
    deleteCookie("refresh_token");
  } catch {
  }

  try {
    window.dispatchEvent(new Event("auth-change"));
  } catch {}

  try {
    toast("Sesi Anda berakhir, silakan login kembali.");
  } catch {}

  setTimeout(() => {
    try {
      window.location.href = redirectTo;
    } catch {
    }
  }, 700);
}

export default logout;
