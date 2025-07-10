"use client";

import { useState, useMemo } from "react";
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
  Search,
  ChevronRight,
  Clock,
  Calendar,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/_components/Header";
import { useArticles } from "@/hooks/use-articles";

// Map category IDs to readable names
const categoryMap: Record<string, string> = {
  "1": "Panduan Wisata",
  "2": "Budaya Lokal",
  "3": "Kuliner",
  "4": "Tips Perjalanan",
  "5": "Pantai & Alam",
  "6": "Umum",
  // Add more mappings as needed
};

const categoryColors: Record<string, string> = {
  "Panduan Wisata": "bg-sky-500",
  "Budaya Lokal": "bg-emerald-500",
  "Kuliner": "bg-orange-500",
  "Tips Perjalanan": "bg-purple-500",
  "Pantai & Alam": "bg-blue-500",
  "Umum": "bg-slate-500",
};

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const { featured, articles, loading, error } = useArticles();

  // Get unique categories from articles
  const availableCategories = useMemo(() => {
    const categories = ["Semua"];
    if (articles.length > 0) {
      const uniqueCategories = Array.from(
        new Set(articles.map((article) => categoryMap[article.category] || "Umum"))
      );
      categories.push(...uniqueCategories);
    }
    return categories;
  }, [articles]);

  // Filter articles based on search and category
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
      const articleCategory = categoryMap[article.category] || "Umum";
      const matchesCategory =
        selectedCategory === "Semua" || articleCategory === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Memuat artikel...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <p className="text-red-600 mb-4">Gagal memuat artikel</p>
              <Button onClick={() => window.location.reload()}>
                Coba Lagi
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
        {featured && (
          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8">
            <Image
              src={featured.image || "/placeholder.svg"}
              alt={featured.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <Badge
                className={`${
                  categoryColors[categoryMap[featured.category] || "Umum"]
                } mb-4`}
              >
                {categoryMap[featured.category] || "Umum"}
              </Badge>

              <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
                {featured.title}
              </h1>

              {featured.excerpt && (
                <p className="text-lg text-gray-200 mb-6 line-clamp-3 max-w-3xl">
                  {featured.excerpt}
                </p>
              )}

              <div className="flex items-center gap-6 mb-6">
                {featured.author.name && (
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={featured.author.avatar} />
                      <AvatarFallback>
                        {featured.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{featured.author.name}</span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-gray-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{featured.publishDate}</span>
                  </div>
                  {featured.readingTime && featured.readingTime !== "null menit" && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{featured.readingTime}</span>
                    </div>
                  )}
                </div>
              </div>

              <Link href={`/artikel/${featured.slug}`}>
                <Button size="lg" className="bg-sky-500 hover:bg-sky-600">
                  Baca Selengkapnya
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3 mb-6">
            {availableCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
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
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
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
                        categoryColors[categoryMap[article.category] || "Umum"]
                      }`}
                    >
                      {categoryMap[article.category] || "Umum"}
                    </Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {article.excerpt && (
                      <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                        {article.excerpt}
                      </p>
                    )}

                    {article.author.name && (
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={article.author.avatar} />
                          <AvatarFallback className="text-xs">
                            {article.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-slate-600">
                          {article.author.name}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{article.publishDate}</span>
                      </div>
                      {article.readingTime && article.readingTime !== "null menit" && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.readingTime}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Link href={`/artikel/${article.slug}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        Baca Selengkapnya
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">
                {searchQuery || selectedCategory !== "Semua"
                  ? "Tidak ada artikel yang ditemukan dengan kriteria tersebut."
                  : "Belum ada artikel yang tersedia."}
              </p>
              {(searchQuery || selectedCategory !== "Semua") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Semua");
                  }}
                >
                  Reset Filter
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
