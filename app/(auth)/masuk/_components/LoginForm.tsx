"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Chrome,
  Facebook,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState("");
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email harus diisi";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password harus diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (generalError) {
      setGeneralError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setGeneralError("");

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate login logic
          if (
            formData.email === "demo@sangihetrip.com" &&
            formData.password === "password"
          ) {
            resolve("success");
          } else {
            reject(new Error("Email atau password salah"));
          }
        }, 2000);
      });

      // Success - redirect to dashboard or previous page
      router.push("/dashboard");
    } catch (error) {
      setGeneralError(
        error instanceof Error ? error.message : "Terjadi kesalahan saat login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      // Simulate social login
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log(`Login with ${provider}`);
      router.push("/dashboard");
    } catch (error) {
      setGeneralError(`Gagal login dengan ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link
          href="/"
          className="inline-flex items-center text-slate-600 hover:text-sky-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                SANGIHETRIP
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-800">
              Masuk ke Akun Anda
            </h2>
            <p className="text-slate-600">
              Selamat datang kembali! Silakan masuk ke akun Anda.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* General Error */}
            {generalError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}

            {/* Demo Credentials Info */}
            <Alert className="bg-sky-50 border-sky-200">
              <AlertCircle className="h-4 w-4 text-sky-600" />
              <AlertDescription className="text-sky-800">
                <strong>Demo:</strong> Email: demo@sangihetrip.com, Password:
                password
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 ${
                      errors.email ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`pl-10 pr-10 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      handleInputChange("rememberMe", checked as boolean)
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm text-slate-600">
                    Ingat saya
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-sky-600 hover:text-sky-700"
                >
                  Lupa password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sedang masuk...
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>

            {/* Divider */}
            {/* <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex justify-center">
                <span className="bg-white px-4 text-sm text-slate-500">
                  atau masuk dengan
                </span>
              </div>
            </div> */}

            {/* Social Login */}
            {/* <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full py-3"
                onClick={() => handleSocialLogin("Google")}
                disabled={isLoading}
              >
                <Chrome className="w-4 h-4 mr-2" />
                Masuk dengan Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full py-3"
                onClick={() => handleSocialLogin("Facebook")}
                disabled={isLoading}
              >
                <Facebook className="w-4 h-4 mr-2" />
                Masuk dengan Facebook
              </Button>
            </div> */}

            {/* Register Link */}
            <div className="text-center">
              <p className="text-slate-600">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="text-sky-600 hover:text-sky-700 font-medium"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            Dengan masuk, Anda menyetujui{" "}
            <Link href="/terms" className="text-sky-600 hover:text-sky-700">
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link href="/privacy" className="text-sky-600 hover:text-sky-700">
              Kebijakan Privasi
            </Link>{" "}
            kami.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
