"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Star,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  Heart,
  Calendar,
  Navigation,
  Facebook,
  Instagram,
  MessageCircle,
  MessageSquarePlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDestinationDetail } from "@/hooks/use-destination-detail";
import { useReviews } from "@/hooks/use-reviews";
import { useAuthStatus } from "@/hooks/use-auth-status";
import { ReviewForm } from "@/components/review-form";
import { ReviewList } from "@/components/review-list";

const MapView = dynamic(() => import("@/components/map-view").then(mod => ({ default: mod.MapView })), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-200 rounded-lg flex items-center justify-center">
      <MapPin className="w-8 h-8 text-slate-400" />
    </div>
  ),
});

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

const DestinationDetailContent = ({ id }: { id: string }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("reviews");
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewSortBy, setReviewSortBy] = useState("newest");

  const { destination, loading, error } = useDestinationDetail(id);
  const isAuthenticated = useAuthStatus();
  
  const destinationId = destination?.id || "";
  
  const {
    reviews,
    total,
    stats,
    loading: reviewsLoading,
    error: reviewsError,
    submitReview,
    toggleLike,
    isReviewLiked,
  } = useReviews(destinationId, {
    page: reviewPage,
    limit: 10,
    sortBy: reviewSortBy as "newest" | "oldest" | "highest" | "lowest" | "helpful",
    autoFetch: !!destinationId
  });
  
  const relatedDestinations: { id: string; name: string; image: string; rating: number; price: number }[] = [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Gagal memuat destinasi
      </div>
    );
  }

  const nextImage = () => {
    if (!destination) return;
    setCurrentImageIndex((prev) => (prev + 1) % destination.images.length);
  };

  const prevImage = () => {
    if (!destination) return;
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + destination.images.length) % destination.images.length
    );
  };

  const shareDestination = (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${destination.name} di SANGIHETRIP!`;

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
        break;
      case "instagram":
        navigator.clipboard.writeText(`${text} ${url}`);
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
        );
        break;
    }
  };
  const hasFacilities = Boolean(destination?.facilities?.length);
  // Hide related destinations since backend doesn't provide this data
  const hasRelated = false;

  const handleSubmitReview = async (data: {
    rating: number;
    comment: string;
    images: string[];
  }) => {
    await submitReview(data);
    setActiveTab("reviews");
  };

  const handleLikeReview = async (reviewId: string) => {
    await toggleLike(reviewId);
  };
  return (
    <>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
          <Link href="/" className="hover:text-sky-600">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/destinations" className="hover:text-sky-600">
            Destinasi
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">{destination.name}</span>
        </div>

        {/* Hero Section - Image Gallery */}
        <div className="mb-8">
          <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden mb-4">
            <Image
              src={
                (Array.isArray(destination.images) && destination.images.length > 0
                  ? destination.images[currentImageIndex].image_url
                  : "/placeholder.svg")
              }
              alt={destination.images[currentImageIndex]?.alt_text || destination.name}
              fill
              className="object-cover"
            />

            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={prevImage}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={nextImage}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Share Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70 text-white"
                onClick={() => shareDestination("facebook")}
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70 text-white"
                onClick={() => shareDestination("instagram")}
              >
                <Instagram className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70 text-white"
                onClick={() => shareDestination("whatsapp")}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {destination.images.map((image, index: number) => (
              <button
                key={image.id || index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                  index === currentImageIndex
                    ? "border-sky-500"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={image.image_url || "/placeholder.svg"}
                  alt={image.alt_text || `${destination.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                  {destination.name}
                </h1>
                <Badge className="bg-sky-500">
                  {categoryTranslations[destination.category] || destination.category}
                </Badge>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold ml-1">
                    {destination.avgRating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-slate-600 ml-1">
                    ({destination.totalReviews} review)
                  </span>
                </div>
                <div className="flex items-center text-slate-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{destination.address}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {destination.description}
                </p>
              </div>
            </div>

            {/* Operating Hours & Price */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Jam Operasional
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-emerald-600">
                    {destination.openHours}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Harga Tiket</h3>
                </CardHeader>
                <CardContent>
                  <p>
                    <span className="text-2xl font-bold text-emerald-600">
                    {destination.entryFee === 0
                      ? "Gratis"
                      : `Rp ${destination.entryFee.toLocaleString('id-ID')}`}
                    </span>
                    <span className="text-slate-600"> per orang</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Facilities & Activities */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Facilities */}
              {hasFacilities && (
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Fasilitas Tersedia</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {destination.facilities.map((facility, index) => (
                        <div
                          key={index}
                          className="flex items-center pl-4 py-2 rounded-lg bg-emerald-50 text-emerald-700"
                        >
                          <span className="font-medium">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Activities */}
              {destination.activities && destination.activities.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Aktivitas Tersedia</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {destination.activities.map((activity, index) => (
                        <div key={index} className="flex items-center px-4 py-2 bg-sky-50 rounded-lg">
                          <span className="font-medium text-slate-800 text-sm">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column - Sticky Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent>
                {/* OpenStreetMap View */}
                <div className="relative h-48 rounded-lg mb-4 overflow-hidden">
                  <MapView
                    latitude={destination.latitude}
                    longitude={destination.longitude}
                    name={destination.name}
                  />
                  {/* Floating Google Maps Button */}
                  <Button
                    size="sm"
                    className="absolute top-3 left-3 bg-white hover:bg-slate-50 text-slate-900 shadow-lg z-[1000] border border-slate-200"
                    onClick={() => window.open(`https://www.google.com/maps?q=${destination.latitude},${destination.longitude}`, '_blank')}
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    <span className="text-xs">Google Maps</span>
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    {/* Lokasi */}
                    <div className="flex items-start gap-3">
                      <span className="text-slate-800 font-semibold text-sm min-w-[80px]">Lokasi:</span>
                      <span className="text-slate-600 text-sm flex-1">
                        {destination.address}
                      </span>
                    </div>

                    {/* Telepon */}
                    {destination.phone && (
                      <div className="flex items-center gap-3">
                        <span className="text-slate-800 font-semibold text-sm min-w-[80px]">Telepon:</span>
                        <a
                          href={`tel:${destination.phone}`}
                          className="text-sky-600 hover:underline text-sm"
                        >
                          {destination.phone}
                        </a>
                      </div>
                    )}

                    {/* Email */}
                    {destination.email && (
                      <div className="flex items-center gap-3">
                        <span className="text-slate-800 font-semibold text-sm min-w-[80px]">Email:</span>
                        <a
                          href={`mailto:${destination.email}`}
                          className="text-sky-600 hover:underline text-sm break-all"
                        >
                          {destination.email}
                        </a>
                      </div>
                    )}

                    {/* Website */}
                    {destination.website && (
                      <div className="flex items-center gap-3">
                        <span className="text-slate-800 font-semibold text-sm min-w-[80px]">Website:</span>
                        <a
                          href={destination.website.startsWith("http") ? destination.website : `https://${destination.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:underline text-sm break-all"
                        >
                          {destination.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Tambah ke Rencana Perjalanan
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Heart className="w-4 h-4 mr-2" />
                      Simpan ke Wishlist
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Review Pengunjung</h3>
                {isAuthenticated && (
                  <Button
                    onClick={() => setActiveTab(activeTab === "write" ? "reviews" : "write")}
                    variant="outline"
                  >
                    <MessageSquarePlus className="w-4 h-4 mr-2" />
                    {activeTab === "write" ? "Lihat Reviews" : "Tulis Review"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="hidden">
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="write">Tulis</TabsTrigger>
                </TabsList>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="mt-0">
                  <ReviewList
                    reviews={reviews}
                    total={total}
                    stats={stats}
                    loading={reviewsLoading}
                    currentPage={reviewPage}
                    limit={10}
                    sortBy={reviewSortBy}
                    onPageChange={setReviewPage}
                    onSortChange={setReviewSortBy}
                    onLikeReview={handleLikeReview}
                    isReviewLiked={isReviewLiked}
                  />

                  {/* Login Prompt for Non-authenticated Users */}
                  {!isAuthenticated && (
                    <Card className="mt-6">
                      <CardContent className="p-8 text-center">
                        <p className="text-slate-600 mb-4">
                          Login untuk menulis review dan memberikan like
                        </p>
                        <Button asChild>
                          <Link href="/masuk">Login</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Write Review Tab */}
                <TabsContent value="write" className="mt-0">
                  {isAuthenticated ? (
                    <ReviewForm
                      onSubmit={handleSubmitReview}
                      loading={reviewsLoading}
                    />
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-slate-600 mb-4">
                          Login untuk menulis review
                        </p>
                        <Button asChild>
                          <Link href="/masuk">Login</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

              {/* Error Display */}
              {reviewsError && (
                <Card className="mt-4 border-red-200">
                  <CardContent className="p-4 bg-red-50">
                    <p className="text-red-800">{reviewsError}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        {hasRelated && (
        <>
        {/* Related Destinations */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-6">Destinasi Terkait</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedDestinations.map((dest) => (
              <Card
                key={dest.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={dest.image || "/placeholder.svg"}
                    alt={dest.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{dest.name}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm">{dest.rating}</span>
                    </div>
                    <span className="font-semibold text-emerald-600">
                      Rp {dest.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        </>
        )}
      </div>

      {/* Mobile Sticky Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:hidden z-30">
        <Button className="w-full bg-sky-500 hover:bg-sky-600">
          <Calendar className="w-4 h-4 mr-2" />
          Tambah ke Rencana Perjalanan
        </Button>
      </div>
    </>
  );
};

export default DestinationDetailContent;
