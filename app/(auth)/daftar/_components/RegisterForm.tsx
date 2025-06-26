"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
}

const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("Minimal 8 karakter");
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Gunakan huruf kecil");
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Gunakan huruf besar");
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push("Gunakan angka");
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Gunakan karakter khusus");
    }

    let color = "bg-red-500";
    if (score >= 4) color = "bg-green-500";
    else if (score >= 3) color = "bg-yellow-500";
    else if (score >= 2) color = "bg-orange-500";

    return { score, feedback, color };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Nama lengkap harus diisi";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Nama minimal 2 karakter";
    }

    if (!formData.email) {
      newErrors.email = "Email harus diisi";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password harus diisi";
    } else if (passwordStrength.score < 3) {
      newErrors.password = "Password terlalu lemah";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password harus diisi";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Anda harus menyetujui syarat dan ketentuan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
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
          // Simulate registration logic
          if (formData.email === "existing@sangihetrip.com") {
            reject(new Error("Email sudah terdaftar"));
          } else {
            resolve("success");
          }
        }, 2000);
      });

      // Success - show email verification message
      setIsSuccess(true);
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mendaftar"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = async (provider: string) => {
    setIsLoading(true);
    try {
      // Simulate social registration
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log(`Register with ${provider}`);
      router.push("/dashboard");
    } catch (error) {
      setGeneralError(`Gagal mendaftar dengan ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Show success message or update UI
    } catch (error) {
      setGeneralError("Gagal mengirim ulang email verifikasi");
    } finally {
      setIsResending(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                SANGIHETRIP
              </span>
            </div>

            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Periksa Email Anda
            </h2>
            <p className="text-slate-600">
              Kami telah mengirim link verifikasi ke{" "}
              <strong>{formData.email}</strong>
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert className="bg-sky-50 border-sky-200">
              <AlertCircle className="h-4 w-4 text-sky-600" />
              <AlertDescription className="text-sky-800">
                Klik link di email untuk mengaktifkan akun Anda. Periksa folder
                spam jika tidak ditemukan.
              </AlertDescription>
            </Alert>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendVerification}
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengirim ulang...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Kirim Ulang Email
                </>
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sky-600 hover:text-sky-700 font-medium"
              >
                Kembali ke Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
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

          <h2 className="text-2xl font-bold text-slate-800">Buat Akun Baru</h2>
          <p className="text-slate-600">
            Bergabunglah dan mulai petualangan Anda di Sangihe!
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className={`pl-10 ${
                    errors.fullName ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

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
                  placeholder="Buat password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`pl-10 pr-10 ${
                    errors.password ? "border-red-500 focus:border-red-500" : ""
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Progress
                      value={(passwordStrength.score / 5) * 100}
                      className="flex-1 h-2"
                    />
                    <span className="text-xs text-slate-500">
                      {passwordStrength.score < 2
                        ? "Lemah"
                        : passwordStrength.score < 4
                        ? "Sedang"
                        : "Kuat"}
                    </span>
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <div className="text-xs text-slate-500">
                      <p>Saran: {passwordStrength.feedback.join(", ")}</p>
                    </div>
                  )}
                </div>
              )}

              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={`pl-10 pr-10 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            {/* <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) =>
                    handleInputChange("acceptTerms", checked as boolean)
                  }
                  disabled={isLoading}
                />
                <Label htmlFor="terms" className="text-sm text-slate-600">
                  Saya menyetujui{" "}
                  <Link
                    href="/terms"
                    className="underline text-sky-600 hover:text-sky-700"
                  >
                    Syarat & Ketentuan
                  </Link>
                  <span className="whitespace-nowrap">
                    {" "}dan{" "}
                    <Link
                      href="/privacy"
                      className="underline text-sky-600 hover:text-sky-700"
                    >
                      Kebijakan Privasi
                    </Link>
                  </span>
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-500">{errors.acceptTerms}</p>
              )}
            </div> */}

            {/* Register Button */}
            <Button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sedang mendaftar...
                </>
              ) : (
                "Daftar"
              )}
            </Button>
          </form>

          {/* Divider */}
          {/* <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex justify-center">
              <span className="bg-white px-4 text-sm text-slate-500">
                atau daftar dengan
              </span>
            </div>
          </div> */}

          {/* Social Register */}
          {/* <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full py-3"
              onClick={() => handleSocialRegister("Google")}
              disabled={isLoading}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Daftar dengan Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full py-3"
              onClick={() => handleSocialRegister("Facebook")}
              disabled={isLoading}
            >
              <Facebook className="w-4 h-4 mr-2" />
              Daftar dengan Facebook
            </Button>
          </div> */}

          {/* Login Link */}
          <div className="text-center">
            <p className="text-slate-600">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-sky-600 hover:text-sky-700 font-medium"
              >
                Masuk
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="mt-8 text-center text-sm text-slate-500">
        <p>
          Dengan mendaftar, Anda menyetujuis{" "}
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
  );
};

export default RegisterForm;
