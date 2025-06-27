"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ChevronRight,
  Clock,
  Calendar,
  TrendingUp,
  Mail,
  Menu,
  Tag,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/_components/Header";

// Sample articles data
const featuredArticle = {
  id: 1,
  title:
    "Panduan Lengkap Wisata Kepulauan Sangihe: Surga Tersembunyi di Ujung Utara Indonesia",
  excerpt:
    "Jelajahi keindahan alam, budaya unik, dan kuliner khas Kepulauan Sangihe yang masih jarang dikunjungi wisatawan. Dari pantai vulkanik hingga gunung berapi aktif, temukan pengalaman tak terlupakan di destinasi eksotis ini.",
  category: "Panduan Wisata",
  author: {
    name: "Maria Sondakh",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  publishDate: "15 Desember 2024",
  readingTime: "12 menit",
  image: "/placeholder.svg?height=400&width=800",
  slug: "panduan-lengkap-wisata-sangihe",
};

const articles = [
  {
    id: 2,
    title: "10 Kuliner Khas Sangihe yang Wajib Dicoba",
    excerpt:
      "Dari ikan bakar rica-rica hingga kelapa muda segar, nikmati cita rasa autentik kuliner Sangihe yang menggugah selera.",
    category: "Kuliner",
    author: {
      name: "Chef Ronny Tahuna",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    publishDate: "12 Desember 2024",
    readingTime: "8 menit",
    image: "/placeholder.svg?height=200&width=300",
    slug: "kuliner-khas-sangihe",
  },
  {
    id: 3,
    title: "Budaya Unik Suku Sangihe: Tradisi yang Masih Lestari",
    excerpt:
      "Mengenal lebih dekat tradisi dan budaya masyarakat Sangihe yang masih dijaga hingga kini, dari tarian tradisional hingga upacara adat.",
    category: "Budaya Lokal",
    author: {
      name: "Dr. Samuel Runtu",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    publishDate: "10 Desember 2024",
    readingTime: "10 menit",
    image: "/placeholder.svg?height=200&width=300",
    slug: "budaya-suku-sangihe",
  },
  {
    id: 4,
    title: "Tips Mendaki Gunung Karangetang dengan Aman",
    excerpt:
      "Panduan lengkap untuk mendaki gunung berapi aktif di Pulau Siau, termasuk persiapan, rute terbaik, dan tips keselamatan.",
    category: "Tips Perjalanan",
    author: {
      name: "Andi Climbing Guide",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    publishDate: "8 Desember 2024",
    readingTime: "15 menit",
    image: "/placeholder.svg?height=200&width=300",
    slug: "tips-mendaki-karangetang",
  },
  {
    id: 5,
    title: "Pantai Tersembunyi di Sangihe yang Belum Banyak Diketahui",
    excerpt:
      "Temukan pantai-pantai eksotis dengan pasir vulkanik dan air jernih yang masih sepi pengunjung di berbagai pulau di Sangihe.",
    category: "Panduan Wisata",
    author: {
      name: "Traveler Nusantara",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    publishDate: "5 Desember 2024",
    readingTime: "7 menit",
    image: "/placeholder.svg?height=200&width=300",
    slug: "pantai-tersembunyi-sangihe",
  },
  {
    id: 6,
    title: "Festival Tulude: Perayaan Tahun Baru Tradisional Sangihe",
    excerpt:
      "Saksikan kemeriahan Festival Tulude, perayaan tahun baru tradisional masyarakat Sangihe yang penuh dengan tarian dan musik tradisional.",
    category: "Budaya Lokal",
    author: {
      name: "Cultural Explorer",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    publishDate: "3 Desember 2024",
    readingTime: "6 menit",
    image: "/placeholder.svg?height=200&width=300",
    slug: "festival-tulude-sangihe",
  },
  {
    id: 7,
    title: "Transportasi ke Sangihe: Panduan Lengkap Akses dan Rute",
    excerpt:
      "Informasi lengkap tentang cara mencapai Kepulauan Sangihe, mulai dari penerbangan, kapal laut, hingga transportasi lokal.",
    category: "Tips Perjalanan",
    author: {
      name: "Travel Guide Indonesia",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    publishDate: "1 Desember 2024",
    readingTime: "9 menit",
    image: "/placeholder.svg?height=200&width=300",
    slug: "transportasi-ke-sangihe",
  },
  {
    id: 8,
    title: "Diving di Sangihe: Surga Bawah Laut yang Menakjubkan",
    excerpt:
      "Jelajahi keindahan bawah laut Sangihe dengan terumbu karang yang masih pristine dan keanekaragaman hayati yang luar biasa.",
    category: "Panduan Wisata",
    author: {
      name: "Dive Master Sangihe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    publishDate: "28 November 2024",
    readingTime: "11 menit",
    image: "/placeholder.svg?height=200&width=300",
    slug: "diving-di-sangihe",
  },
  {
    id: 9,
    title: "Oleh-oleh Khas Sangihe yang Wajib Dibawa Pulang",
    excerpt:
      "Daftar souvenir dan oleh-oleh khas Sangihe yang bisa menjadi kenang-kenangan indah dari perjalanan Anda.",
    category: "Tips Perjalanan",
    author: {
      name: "Shopping Guide",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    publishDate: "25 November 2024",
    readingTime: "5 menit",
    image: "/placeholder.svg?height=200&width=300",
    slug: "oleh-oleh-khas-sangihe",
  },
];

const categories = [
  "Semua",
  "Panduan Wisata",
  "Budaya Lokal",
  "Kuliner",
  "Tips Perjalanan",
];

const categoryColors = {
  "Panduan Wisata": "bg-sky-500",
  "Budaya Lokal": "bg-emerald-500",
  Kuliner: "bg-orange-500",
  "Tips Perjalanan": "bg-purple-500",
};

const recentArticles = articles.slice(0, 5);
const popularArticles = [
  { title: "Panduan Lengkap Wisata Sangihe", views: "2.1k" },
  { title: "10 Kuliner Khas yang Wajib Dicoba", views: "1.8k" },
  { title: "Tips Mendaki Gunung Karangetang", views: "1.5k" },
  { title: "Budaya Unik Suku Sangihe", views: "1.2k" },
  { title: "Pantai Tersembunyi di Sangihe", views: "1.1k" },
];

const tags = [
  "Wisata Alam",
  "Pantai",
  "Gunung",
  "Budaya",
  "Kuliner",
  "Diving",
  "Snorkeling",
  "Festival",
  "Tradisi",
  "Tips Travel",
  "Transportasi",
  "Akomodasi",
  "Fotografi",
];

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("Semua");

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "Semua" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearchCategory =
      searchCategory === "Semua" || article.category === searchCategory;

    return matchesCategory && matchesSearch && matchesSearchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same as other pages */}
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
          <Link href="/" className="hover:text-sky-600">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">Artikel</span>
        </div>

        {/* Featured Article Hero */}
        <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8">
          <Image
            src={featuredArticle.image || "/placeholder.svg"}
            alt={featuredArticle.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
            <Badge
              className={`${
                categoryColors[
                  featuredArticle.category as keyof typeof categoryColors
                ]
              } mb-4`}
            >
              {featuredArticle.category}
            </Badge>

            <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
              {featuredArticle.title}
            </h1>

            <p className="text-lg text-gray-200 mb-6 line-clamp-3 max-w-3xl">
              {featuredArticle.excerpt}
            </p>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={featuredArticle.author.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {featuredArticle.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">
                  {featuredArticle.author.name}
                </span>
              </div>

              <div className="flex items-center gap-4 text-gray-300">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{featuredArticle.publishDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{featuredArticle.readingTime}</span>
                </div>
              </div>
            </div>

            <Button size="lg" className="bg-sky-500 hover:bg-sky-600">
              Baca Selengkapnya
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-3 mb-6">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-sky-500 hover:bg-sky-600"
                      : ""
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Cari artikel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={searchCategory} onValueChange={setSearchCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Articles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <Badge
                      className={`absolute top-3 left-3 ${
                        categoryColors[
                          article.category as keyof typeof categoryColors
                        ]
                      }`}
                    >
                      {article.category}
                    </Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-6 h-6">
                        <AvatarImage
                          src={article.author.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="text-xs">
                          {article.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-slate-600">
                        {article.author.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{article.publishDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readingTime}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full">
                      Baca Selengkapnya
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline" size="lg">
                Muat Lebih Banyak Artikel
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Articles */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-sky-500" />
                  Artikel Terbaru
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentArticles.map((article) => (
                  <div key={article.id} className="flex gap-3">
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 text-slate-800 mb-1">
                        {article.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {article.publishDate}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Popular Articles */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" />
                  Artikel Populer
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {popularArticles.map((article, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 text-slate-800">
                        {article.title}
                      </h4>
                    </div>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {article.views}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tags Cloud */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-orange-500" />
                  Tags Populer
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-sky-50 hover:border-sky-300 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="bg-gradient-to-br from-sky-500 to-emerald-500 text-white">
              <CardHeader>
                <h3 className="font-semibold text-lg flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Newsletter
                </h3>
                <p className="text-sky-100 text-sm">
                  Dapatkan artikel terbaru tentang wisata Sangihe langsung di
                  email Anda
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Email Anda"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />
                <Button className="w-full bg-white text-sky-600 hover:bg-white/90">
                  Berlangganan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
