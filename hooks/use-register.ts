"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { post, ApiError } from "@/lib/api";
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

      const result = await post("/api/auth/register", requestBody, { auth: false });

      toast.success(result.message || "Berhasil mendaftar. Silakan login");

      router.push("/masuk");
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Terjadi kesalahan saat mendaftar";
      setError(msg);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}
