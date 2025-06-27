"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api";
import { toast } from "sonner";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface UseRegisterReturn {
  register: (payload: RegisterPayload) => Promise<void>;
  isLoading: boolean;
  error: string;
}

/**
 * useRegister – handles the user registration flow.
 * Encapsulates API interaction and redirection logic so UI components stay clean.
 */
export function useRegister(): UseRegisterReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const register = async ({ name, email, password }: RegisterPayload) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        // Attempt to extract message from API, fallback to generic error
        const { message } = await res.json().catch(() => ({ message: "Gagal mendaftar" }));
        throw new Error(message || "Gagal mendaftar");
      }

      const { message } = await res.json();

      // Show success toast
      toast.success(message || "Berhasil mendaftar. Silakan login");

      // Redirect to login page
      router.push("/masuk");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Terjadi kesalahan saat mendaftar";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}
