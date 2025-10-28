import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 p-6">
              <ShieldAlert className="w-12 h-12 text-red-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Akses Ditolak
          </h1>
          
          <p className="text-gray-600 mb-8">
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. 
            Halaman ini hanya dapat diakses oleh administrator.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default">
              <Link href="/beranda">
                Kembali ke Beranda
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">
                Ke Halaman Utama
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
