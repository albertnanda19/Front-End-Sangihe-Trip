"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api";
import { toast } from "sonner";

interface RegisterPayload {
  firstName: string;
  email: string;
  password: string;
  lastName?: string;
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

  const register = async ({ firstName, email, password, lastName }: RegisterPayload) => {
    setIsLoading(true);
    setError("");
    try {
      const requestBody: {
        firstName: string;
        email: string;
        password: string;
        lastName?: string;
      } = {
        firstName,
        email,
        password,
      };

      if (lastName) {
        requestBody.lastName = lastName;
      }

      const res = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: "Gagal mendaftar" }));
        throw new Error(message || "Gagal mendaftar");
      }

      const { message } = await res.json();

      toast.success(message || "Berhasil mendaftar. Silakan login");

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
