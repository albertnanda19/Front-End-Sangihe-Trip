import Image from "next/image";
import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/placeholder.svg?height=800&width=600"
          alt="Pantai Sangihe"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600/80 to-emerald-600/80" />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold mb-4">Selamat Datang Kembali!</h1>
            <p className="text-xl text-sky-100 mb-8">
              Lanjutkan perjalanan Anda menjelajahi keindahan Kepulauan Sangihe
            </p>
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Rencanakan perjalanan impian Anda</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Temukan destinasi tersembunyi</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Simpan tempat favorit Anda</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <LoginForm />
    </div>
  );
}
