"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  MapPin,
  Star,
  Award,
  Plus,
  Edit,
  Calendar,
  TrendingUp,
  Compass,
  BookOpen,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Sun,
  Heart,
  ChevronRight,
  Target,
  Map,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Sample user data
const userData = {
  name: "Sarah Wijaya",
  email: "sarah@email.com",
  avatar: "/placeholder.svg?height=40&width=40",
  joinDate: "Maret 2024",
  profileCompletion: 75,
  stats: {
    tripPlans: 5,
    visitedDestinations: 12,
    reviewsWritten: 8,
    points: 1250,
    badges: 3,
  },
};

const recentTrips = [
  {
    id: 1,
    name: "Eksplorasi Pulau Siau",
    dates: "25-28 Des 2024",
    status: "Upcoming",
    progress: 85,
    image: "/placeholder.svg?height=100&width=150",
    destinations: 4,
  },
  {
    id: 2,
    name: "Weekend di Pantai Mahoro",
    dates: "15-17 Des 2024",
    status: "Planning",
    progress: 45,
    image: "/placeholder.svg?height=100&width=150",
    destinations: 2,
  },
  {
    id: 3,
    name: "Pendakian Karangetang",
    dates: "5-7 Jan 2025",
    status: "Draft",
    progress: 20,
    image: "/placeholder.svg?height=100&width=150",
    destinations: 1,
  },
];

const recentReviews = [
  {
    id: 1,
    destination: "Pantai Mahoro",
    rating: 5,
    date: "2 hari lalu",
    excerpt: "Pantai yang luar biasa indah dengan pasir vulkanik yang unik...",
    likes: 12,
  },
  {
    id: 2,
    destination: "Air Terjun Sahendaruman",
    rating: 4,
    date: "1 minggu lalu",
    excerpt: "Air terjun yang menakjubkan di tengah hutan tropis...",
    likes: 8,
  },
];

const recommendedDestinations = [
  {
    id: 1,
    name: "Pulau Tagulandang",
    image: "/placeholder.svg?height=150&width=200",
    rating: 4.7,
    price: "Rp 180.000",
    category: "Alam",
  },
  {
    id: 2,
    name: "Desa Adat Bowongkali",
    image: "/placeholder.svg?height=150&width=200",
    rating: 4.8,
    price: "Rp 100.000",
    category: "Budaya",
  },
  {
    id: 3,
    name: "Pantai Petta",
    image: "/placeholder.svg?height=150&width=200",
    rating: 4.4,
    price: "Rp 120.000",
    category: "Pantai",
  },
];

const recommendedArticles = [
  {
    id: 1,
    title: "Tips Fotografi di Sangihe",
    image: "/placeholder.svg?height=80&width=120",
    readTime: "5 menit",
    category: "Tips",
  },
  {
    id: 2,
    title: "Kuliner Khas yang Wajib Dicoba",
    image: "/placeholder.svg?height=80&width=120",
    readTime: "8 menit",
    category: "Kuliner",
  },
];

const upcomingTrips = [
  {
    name: "Eksplorasi Pulau Siau",
    date: "25 Des",
    daysLeft: 10,
  },
  {
    name: "Weekend di Pantai Mahoro",
    date: "15 Des",
    daysLeft: 0,
  },
];

const weatherData = {
  location: "Tahuna, Sangihe",
  temperature: 28,
  condition: "Cerah",
  humidity: 75,
  icon: Sun,
};

const quickTips = [
  "Bawa sunscreen saat berkunjung ke pantai",
  "Cek cuaca sebelum mendaki gunung",
  "Coba kuliner lokal di pasar tradisional",
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-green-500";
      case "Planning":
        return "bg-blue-500";
      case "Draft":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "Akan Datang";
      case "Planning":
        return "Perencanaan";
      case "Draft":
        return "Draft";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                SANGIHETRIP
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className="text-sky-600 font-medium">
                Dashboard
              </Link>
              <Link
                href="/destinations"
                className="text-slate-700 hover:text-sky-600 font-medium transition-colors"
              >
                Destinasi
              </Link>
              <Link
                href="/my-trips"
                className="text-slate-700 hover:text-sky-600 font-medium transition-colors"
              >
                Rencana Saya
              </Link>
              <Link
                href="/articles"
                className="text-slate-700 hover:text-sky-600 font-medium transition-colors"
              >
                Artikel
              </Link>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 hover:bg-gray-100"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={userData.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{userData.name}</p>
                      <p className="text-xs text-slate-500">
                        Member sejak {userData.joinDate}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Pengaturan</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  Selamat datang, {userData.name}! 👋
                </h1>
                <p className="text-slate-600">
                  Siap untuk petualangan baru di Kepulauan Sangihe?
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Map className="w-6 h-6 text-sky-600" />
                    </div>
                    <p className="text-2xl font-bold text-slate-800">
                      {userData.stats.tripPlans}
                    </p>
                    <p className="text-sm text-slate-600">Rencana Perjalanan</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-slate-800">
                      {userData.stats.visitedDestinations}
                    </p>
                    <p className="text-sm text-slate-600">
                      Destinasi Dikunjungi
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-slate-800">
                      {userData.stats.reviewsWritten}
                    </p>
                    <p className="text-sm text-slate-600">Review Ditulis</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-slate-800">
                      {userData.stats.points}
                    </p>
                    <p className="text-sm text-slate-600">
                      Poin & {userData.stats.badges} Badge
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800">
                Aksi Cepat
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      Buat Rencana Baru
                    </h3>
                    <p className="text-sm text-slate-600">
                      Mulai merencanakan perjalanan impian Anda
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Compass className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      Jelajahi Destinasi
                    </h3>
                    <p className="text-sm text-slate-600">
                      Temukan tempat-tempat menakjubkan
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Edit className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      Tulis Review
                    </h3>
                    <p className="text-sm text-slate-600">
                      Bagikan pengalaman perjalanan Anda
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      Lihat Artikel
                    </h3>
                    <p className="text-sm text-slate-600">
                      Baca tips dan panduan wisata
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Trip Plans */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Rencana Perjalanan Terbaru
                  </h2>
                  <Button variant="ghost" size="sm">
                    Lihat Semua
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentTrips.map((trip) => (
                    <Card
                      key={trip.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={trip.image || "/placeholder.svg"}
                              alt={trip.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-slate-800 truncate">
                                {trip.name}
                              </h3>
                              <Badge
                                className={`${getStatusColor(
                                  trip.status
                                )} text-white text-xs`}
                              >
                                {getStatusText(trip.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">
                              {trip.dates}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex-1 mr-4">
                                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                  <span>Progress</span>
                                  <span>{trip.progress}%</span>
                                </div>
                                <Progress
                                  value={trip.progress}
                                  className="h-2"
                                />
                              </div>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Review Terbaru
                  </h2>
                  <Button variant="ghost" size="sm">
                    Lihat Semua
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <Card
                      key={review.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-slate-800">
                            {review.destination}
                          </h3>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {review.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{review.date}</span>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            <span>{review.likes}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-6">
              {/* Recommended Destinations */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-800">
                  Destinasi Untukmu
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {recommendedDestinations.map((destination) => (
                    <Card
                      key={destination.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative h-32">
                        <Image
                          src={destination.image || "/placeholder.svg"}
                          alt={destination.name}
                          fill
                          className="object-cover"
                        />
                        <Badge className="absolute top-2 left-2 bg-sky-500">
                          {destination.category}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-800 mb-2">
                          {destination.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm ml-1">
                              {destination.rating}
                            </span>
                          </div>
                          <span className="font-semibold text-emerald-600">
                            {destination.price}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recommended Articles */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-800">
                  Artikel Menarik
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {recommendedArticles.map((article) => (
                    <Card
                      key={article.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={article.image || "/placeholder.svg"}
                              alt={article.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <Badge variant="outline" className="mb-2 text-xs">
                              {article.category}
                            </Badge>
                            <h3 className="font-semibold text-slate-800 mb-1 line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {article.readTime}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div
            className={`lg:col-span-1 space-y-6 ${
              sidebarOpen ? "block" : "hidden lg:block"
            }`}
          >
            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center">
                  <Target className="w-4 h-4 mr-2 text-sky-500" />
                  Kelengkapan Profil
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800 mb-1">
                    {userData.profileCompletion}%
                  </div>
                  <Progress
                    value={userData.profileCompletion}
                    className="mb-3"
                  />
                  <p className="text-sm text-slate-600">
                    Lengkapi profil untuk rekomendasi yang lebih baik
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Lengkapi Profil
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Trips */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-emerald-500" />
                  Perjalanan Mendatang
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingTrips.map((trip, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm text-slate-800">
                        {trip.name}
                      </p>
                      <p className="text-xs text-slate-500">{trip.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-sky-600">
                        {trip.daysLeft === 0
                          ? "Hari ini"
                          : `${trip.daysLeft} hari`}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weather Info */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center">
                  <weatherData.icon className="w-4 h-4 mr-2 text-yellow-500" />
                  Cuaca Sangihe
                </h3>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-800 mb-1">
                    {weatherData.temperature}°C
                  </div>
                  <p className="text-slate-600 mb-3">{weatherData.condition}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Kelembaban</span>
                    <span>{weatherData.humidity}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
                  Tips Hari Ini
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-slate-600">{tip}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
