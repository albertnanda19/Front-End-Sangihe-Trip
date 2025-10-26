import type React from "react";

import Image from "next/image";
import RegisterForm from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/images/pantai-sangihe.jpg"
          alt="Pantai Sangihe"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/80 to-sky-600/80" />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold mb-4">
              Bergabunglah dengan Kami!
            </h1>
            <p className="text-xl text-emerald-100 mb-8">
              Mulai petualangan Anda menjelajahi keindahan Kepulauan Sangihe
              yang menakjubkan
            </p>
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Akses ke semua destinasi eksklusif</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Buat rencana perjalanan personal</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Dapatkan rekomendasi khusus</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Bergabung dengan komunitas traveler</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <RegisterForm />
      </div>
    </div>
  );
}
