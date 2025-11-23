"use client";

import React from "react";

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
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Star,
  MapPin,
  Filter,
  Grid3X3,
  List,
  X,
  ChevronRight,
  Heart,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categories = ["Semua", "Pantai", "Kuliner", "Alam", "Budaya", "Sejarah", "Petualangan", "Religi", "Gunung"] as const;

const categoryMap: Record<(typeof categories)[number], string | undefined> = {
  "Semua": undefined,
  "Pantai": "beach",
  "Kuliner": "culinary",
  "Alam": "nature",
  "Budaya": "cultural",
  "Sejarah": "historical",
  "Petualangan": "adventure",
  "Religi": "religious",
  "Gunung": "mountain",
};

const categoryTranslations: Record<string, string> = {
  beach: "Pantai",
  culinary: "Kuliner",
  nature: "Alam",
  cultural: "Budaya",
  historical: "Sejarah",
  adventure: "Petualangan",
  religious: "Religi",
  mountain: "Gunung",
};

import { useDestinations } from "@/hooks/use-destinations";

const DestinationContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [locationQuery, setLocationQuery] = useState("");
  const [minRating, setMinRating] = useState([0]);
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "price-low" | "newest">("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { destinations, meta, loading } = useDestinations({
    search: searchQuery || undefined,
    category:
      selectedCategory !== "Semua"
        ? categoryMap[selectedCategory as keyof typeof categoryMap]
        : undefined,
    location: locationQuery || undefined,
    minRating: minRating[0] > 0 ? minRating[0] : undefined,
    priceMin: priceMin ? parseInt(priceMin) : undefined,
    priceMax: priceMax ? parseInt(priceMax) : undefined,
    sortBy,
    page: currentPage,
    pageSize: 12,
  });
  const sortedDestinations = destinations;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
    if (filter.includes("Kategori")) setSelectedCategory("Semua");
    if (filter.includes("Lokasi")) setLocationQuery("");
  };
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
        <Link href="/" className="hover:text-sky-600">
          Beranda
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 font-medium">Destinasi</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
          <Card className="sticky top-24">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Filter Pencarian</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Cari Destinasi
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Nama destinasi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Cari Lokasi
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Cari berdasarkan lokasi..."
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-3 block">
                  Kategori
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "outline"
                      }
                      size="sm"
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
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-3 block">
                  Rating Minimum: {minRating[0].toFixed(1)}
                </label>
                <Slider
                  value={minRating}
                  onValueChange={setMinRating}
                  max={5}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>0</span>
                  <span>5</span>
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Harga (Rp)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">Minimum</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      min="0"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">Maksimum</label>
                    <Input
                      type="number"
                      placeholder="Tanpa batas"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      min="0"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar & Controls */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(true)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Urutkan:</span>
                  <Select
                    value={sortBy}
                    onValueChange={(v) =>
                      setSortBy(v as "popular" | "rating" | "price-low" | "newest")
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Populer</SelectItem>
                      <SelectItem value="rating">Rating Tertinggi</SelectItem>
                      <SelectItem value="price-low">Harga Terendah</SelectItem>
                      <SelectItem value="newest">Terbaru</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">
                  {loading ? "Memuat..." : `${sortedDestinations.length} destinasi ditemukan`}
                </span>

                <div className="flex items-center border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={
                      viewMode === "grid" ? "bg-sky-500 hover:bg-sky-600" : ""
                    }
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={
                      viewMode === "list" ? "bg-sky-500 hover:bg-sky-600" : ""
                    }
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {activeFilters.map((filter) => (
                  <Badge
                    key={filter}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {filter}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeFilter(filter)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Results Grid/List */}
          <div
            className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {loading && <p>Memuat...</p>}
            {!loading && sortedDestinations.map((destination) => (
              <Card
                key={destination.id}
                className={`group overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
                  viewMode === "list" ? "flex flex-row" : ""
                }`}
              >
                <div
                  className={viewMode === "list" ? "w-64 flex-shrink-0" : ""}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={
                        (Array.isArray(destination.images) && destination.images.length > 0
                          ? destination.images[0].image_url
                          : "/placeholder.svg")
                      }
                      alt={destination.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-sky-500">
                      {categoryTranslations[destination.category] || destination.category}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-slate-800 mb-1">
                          {destination.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium ml-1">
                              {destination.avg_rating?.toFixed(1) || "0.0"}
                            </span>
                          </div>
                          <span className="text-sm text-slate-500">
                            ({destination.total_reviews || 0} review)
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 w-24">
                        <div className="text-lg font-bold text-emerald-600 whitespace-nowrap">
                          {(destination.entry_fee ?? 0) === 0
                            ? "Gratis"
                            : `Rp ${(destination.entry_fee ?? 0).toLocaleString('id-ID')}`}
                        </div>
                        <div className="text-xs text-slate-500 whitespace-nowrap">per orang</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 flex-1">
                    <div className="relative group/address">
                      <div className="flex items-start text-slate-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                        <span className="text-sm line-clamp-2 cursor-pointer">
                          {destination.address || "Lokasi tidak tersedia"}
                        </span>
                      </div>
                      {/* Floating tooltip for full address */}
                      <div className="absolute left-0 top-full mt-1 z-50 invisible group-hover/address:visible opacity-0 group-hover/address:opacity-100 transition-all duration-200 pointer-events-none">
                        <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg max-w-xs">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{destination.address || "Lokasi tidak tersedia"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative group/desc">
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2 cursor-pointer">
                        {destination.description}
                      </p>
                      {/* Floating tooltip for full description */}
                      <div className="absolute left-0 top-full mt-1 z-50 invisible group-hover/desc:visible opacity-0 group-hover/desc:opacity-100 transition-all duration-200 pointer-events-none">
                        <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg max-w-sm">
                          <p className="leading-relaxed">{destination.description}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 gap-2 flex-wrap">
                    <Button
                      className="flex-1 bg-sky-500 hover:bg-sky-600"
                      onClick={() => router.push(`/destinasi/${destination.slug}`)}
                    >
                      Lihat Detail
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Tambah ke Rencana
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                Sebelumnya
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                  let pageNum;
                  if (meta.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= meta.totalPages - 2) {
                    pageNum = meta.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={loading}
                      className={currentPage === pageNum ? "bg-sky-500 hover:bg-sky-600" : ""}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === meta.totalPages || loading}
              >
                Selanjutnya
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationContent;
