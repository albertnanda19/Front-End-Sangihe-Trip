"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  CheckCircle,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Copy,
  Calendar,
  MapPin,
  Users,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import type { TripData } from "@/app/(user)/create-trip/page"

interface SuccessPageProps {
  tripData: TripData
}

export function SuccessPage({ tripData }: SuccessPageProps) {
  const totalBudget = Object.values(tripData.budget).reduce((sum, value) => sum + value, 0)
  const tripDuration =
    tripData.startDate && tripData.endDate
      ? Math.ceil((tripData.endDate.getTime() - tripData.startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0

  const shareTrip = (platform: string) => {
    const url = window.location.origin + "/trip/" + Date.now()
    const text = `Lihat rencana perjalanan saya ke Sangihe: ${tripData.tripName}`

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`)
        break
      case "instagram":
        navigator.clipboard.writeText(`${text} ${url}`)
        break
      case "copy":
        navigator.clipboard.writeText(url)
        break
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-6">
        {/* Success Header */}
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-800 mb-4">Rencana Perjalanan Berhasil Dibuat! 🎉</h1>

            <p className="text-lg text-slate-600 mb-6">
              Selamat! Rencana perjalanan &quot;{tripData.tripName}&quot; telah tersimpan dan siap untuk petualangan Anda.
            </p>

            <div className="bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-200 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Calendar className="w-6 h-6 text-sky-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Durasi</p>
                  <p className="font-semibold">{tripDuration} hari</p>
                </div>
                <div className="text-center">
                  <MapPin className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Destinasi</p>
                  <p className="font-semibold">{tripData.selectedDestinations.length} tempat</p>
                </div>
                <div className="text-center">
                  <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Peserta</p>
                  <p className="font-semibold">{tripData.peopleCount} orang</p>
                </div>
                <div className="text-center">
                  <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Budget</p>
                  <p className="font-semibold">Rp {totalBudget.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/beranda">
                <Button className="bg-sky-500 hover:bg-sky-600">Kembali ke Dashboard</Button>
              </Link>
              <Link href="/my-trips">
                <Button variant="outline">Lihat Semua Perjalanan</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Share Options */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-800">Bagikan Rencana Perjalanan</h3>
            </div>
            <p className="text-slate-600">Ajak teman dan keluarga untuk melihat rencana perjalanan Anda</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto p-4"
                onClick={() => shareTrip("facebook")}
              >
                <Facebook className="w-6 h-6 text-blue-600" />
                <span className="text-sm">Facebook</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto p-4"
                onClick={() => shareTrip("twitter")}
              >
                <Twitter className="w-6 h-6 text-sky-500" />
                <span className="text-sm">Twitter</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto p-4"
                onClick={() => shareTrip("instagram")}
              >
                <Instagram className="w-6 h-6 text-pink-600" />
                <span className="text-sm">Instagram</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto p-4"
                onClick={() => shareTrip("copy")}
              >
                <Copy className="w-6 h-6 text-slate-600" />
                <span className="text-sm">Salin Link</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-800">Langkah Selanjutnya</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Periksa Cuaca & Kondisi</h4>
                  <p className="text-sm text-slate-600">Pantau prakiraan cuaca menjelang keberangkatan</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Booking Akomodasi</h4>
                  <p className="text-sm text-slate-600">Reservasi hotel atau penginapan sesuai jadwal</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Siapkan Perlengkapan</h4>
                  <p className="text-sm text-slate-600">Gunakan checklist packing yang sudah dibuat</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Nikmati Perjalanan!</h4>
                  <p className="text-sm text-slate-600">Jangan lupa dokumentasikan momen berharga Anda</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
