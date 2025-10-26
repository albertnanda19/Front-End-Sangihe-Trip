"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import Header from "@/components/layout/header";
import { ArticleCard } from "@/components/article-card";
import { useArticles } from "@/hooks/use-articles";

const categoryMap: Record<string, string> = {
  "1": "Panduan Wisata",
  "2": "Budaya Lokal",
  "3": "Kuliner",
  "4": "Tips Perjalanan",
  "5": "Pantai & Alam",
  "6": "Umum",
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
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  slug={article.slug}
                  title={article.title}
                  excerpt={article.excerpt}
                  image={article.image}
                  category={categoryMap[article.category] || "Umum"}
                  readingTime={article.readingTime && article.readingTime !== "null menit" ? article.readingTime : undefined}
                  date={article.publishDate}
                  author={article.author}
                />
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
