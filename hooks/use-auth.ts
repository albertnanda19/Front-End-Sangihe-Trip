"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie, deleteCookie } from "@/lib/cookies";
import { decodeJwt } from "@/lib/jwt";
import { apiUrl } from "@/lib/api";

interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface UseAuthReturn {
  login: (payload: LoginPayload) => Promise<void>;
  isLoading: boolean;
  error: string;
}

/**
 * useAuth – encapsulates authentication related logic (login for now)
 * and provides a clean API for UI components.
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async ({ email, password, rememberMe = false }: LoginPayload) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: "Gagal login" }));
        throw new Error(message || "Gagal login");
      }

      const json = await res.json();
      const {
        data: { access_token, refresh_token },
      } = json;

      const accessTokenExpiry = rememberMe ? 7 : 1;
      setCookie("access_token", access_token, { days: accessTokenExpiry });

      if (rememberMe) {
        setCookie("refresh_token", refresh_token, { days: 7 });
      } else {
        deleteCookie("refresh_token");
      }

      window.dispatchEvent(new Event("auth-change"));

      // Decode token to determine role-based destination
      type Payload = { 
        id: string;
        email: string;
        name: string;
        role?: string;
      };
      const payload = decodeJwt<Payload>(access_token);
      const role = payload?.role ?? "user";

      const destination = role === "admin" ? "/admin/beranda" : "/beranda";
      router.push(destination);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Terjadi kesalahan saat login";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
