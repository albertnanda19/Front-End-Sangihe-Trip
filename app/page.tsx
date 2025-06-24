import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Search, Star, MapPin, Calendar, Phone, Mail, Facebook, Instagram, Twitter, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "./_components/Header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden z-0">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/70 to-emerald-900/50">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Pantai Sangihe"
            fill
            className="object-cover -z-10"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Rencanakan Perjalananmu ke{" "}
            <span className="bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent">
              Surga Tropis Sangihe
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-sky-100 max-w-2xl mx-auto">
            Temukan destinasi tersembunyi, budaya lokal, dan kuliner khas di kepulauan yang memukau
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
              Mulai Rencana
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white  hover:text-slate-500 text-slate-900 px-8 py-3 text-lg"
            >
              Lihat Destinasi
            </Button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Cari destinasi wisata..."
                className="pl-12 py-4 text-lg border-2 border-sky-200 focus:border-sky-500 rounded-xl"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-3 justify-center">
              {["Semua", "Pantai", "Budaya", "Kuliner", "Alam"].map((filter) => (
                <Button
                  key={filter}
                  variant={filter === "Semua" ? "default" : "outline"}
                  className={
                    filter === "Semua" ? "bg-sky-500 hover:bg-sky-600" : "border-sky-200 text-slate-600 hover:bg-sky-50"
                  }
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Destinasi Unggulan */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Destinasi Unggulan</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Jelajahi keindahan alam dan budaya Kepulauan Sangihe yang menawan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Pantai Mahoro",
                location: "Pulau Sangihe",
                rating: 4.8,
                price: "Rp 150.000",
                image: "/placeholder.svg?height=300&width=400",
              },
              {
                name: "Pulau Siau",
                location: "Kepulauan Sangihe",
                rating: 4.9,
                price: "Rp 200.000",
                image: "/placeholder.svg?height=300&width=400",
              },
              {
                name: "Gunung Api Karangetang",
                location: "Pulau Siau",
                rating: 4.7,
                price: "Rp 300.000",
                image: "/placeholder.svg?height=300&width=400",
              },
              {
                name: "Pantai Petta",
                location: "Pulau Sangihe",
                rating: 4.6,
                price: "Rp 120.000",
                image: "/placeholder.svg?height=300&width=400",
              },
              {
                name: "Desa Adat Bowongkali",
                location: "Pulau Sangihe",
                rating: 4.8,
                price: "Rp 100.000",
                image: "/placeholder.svg?height=300&width=400",
              },
              {
                name: "Pulau Tagulandang",
                location: "Kepulauan Sangihe",
                rating: 4.7,
                price: "Rp 180.000",
                image: "/placeholder.svg?height=300&width=400",
              },
            ].map((destination, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg"
              >
                <CardHeader className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {destination.rating}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{destination.name}</h3>
                  <div className="flex items-center text-slate-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{destination.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-600">{destination.price}</span>
                    <span className="text-sm text-slate-500">per orang</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full bg-sky-500 hover:bg-sky-600">Lihat Detail</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Artikel Terbaru */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Artikel Terbaru</h2>
            <p className="text-xl text-slate-600">Tips dan panduan perjalanan untuk pengalaman terbaik di Sangihe</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "10 Pantai Tersembunyi di Kepulauan Sangihe",
                excerpt: "Jelajahi pantai-pantai eksotis yang belum banyak dikunjungi wisatawan...",
                date: "15 Desember 2024",
                image: "/placeholder.svg?height=200&width=350",
              },
              {
                title: "Kuliner Khas Sangihe yang Wajib Dicoba",
                excerpt: "Dari ikan bakar hingga kelapa muda, nikmati cita rasa autentik Sangihe...",
                date: "12 Desember 2024",
                image: "/placeholder.svg?height=200&width=350",
              },
              {
                title: "Panduan Lengkap Mendaki Gunung Karangetang",
                excerpt: "Tips aman dan persiapan untuk mendaki gunung api aktif yang menawan...",
                date: "10 Desember 2024",
                image: "/placeholder.svg?height=200&width=350",
              },
            ].map((article, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-slate-800 mb-3 line-clamp-2">{article.title}</h3>
                  <p className="text-slate-600 mb-4 line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center text-slate-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {article.date}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="py-16 bg-gradient-to-r from-sky-500 to-emerald-500">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Promo Spesial Akhir Tahun!</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Dapatkan diskon hingga 30% untuk paket wisata ke Sangihe. Buruan, promo terbatas!
            </p>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
              Klaim Promo Sekarang
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold">SANGIHETRIP</span>
              </div>
              <p className="text-slate-300 mb-4">
                Platform terpercaya untuk merencanakan perjalanan wisata ke Kepulauan Sangihe.
              </p>
              <div className="flex space-x-4">
                <Facebook className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
                <Instagram className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
                <Twitter className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Destinasi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Paket Wisata
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Bantuan
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Syarat & Ketentuan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4">Kontak</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="text-slate-300">+62 812-3456-7890</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="text-slate-300">info@sangihetrip.com</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-3 text-slate-400 mt-1" />
                  <span className="text-slate-300">Tahuna, Kepulauan Sangihe, Sulawesi Utara</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400">© 2024 SANGIHETRIP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
