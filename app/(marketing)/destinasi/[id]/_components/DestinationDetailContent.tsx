"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Star,
  MapPin,
  Clock,
  Wifi,
  Car,
  Utensils,
  ChevronRight,
  ChevronLeft,
  Play,
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

const DestinationDetailContent = ({ id }: { id: string }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("reviews");
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewSortBy, setReviewSortBy] = useState("newest");

  const { destination, loading, error } = useDestinationDetail(id);
  const isAuthenticated = useAuthStatus();
  
  const {
    reviews,
    total,
    stats,
    loading: reviewsLoading,
    error: reviewsError,
    submitReview,
    toggleLike,
    isReviewLiked,
  } = useReviews(id, {
    page: reviewPage,
    limit: 10,
    sortBy: reviewSortBy as "newest" | "oldest" | "highest" | "lowest" | "helpful",
    autoFetch: true,
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
  const hasTips = Boolean(destination?.tips?.length);
  const hasRelated = relatedDestinations.length > 0;

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
              src={destination.images[currentImageIndex] || "/placeholder.svg"}
              alt={destination.name}
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

            {/* Video Play Button */}
            {destination.hasVideo && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-16 h-16 rounded-full"
              >
                <Play className="w-8 h-8 ml-1" />
              </Button>
            )}

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
            {destination.images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                  index === currentImageIndex
                    ? "border-sky-500"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${destination.name} ${index + 1}`}
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
                <Badge className="bg-sky-500">{destination.category}</Badge>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold ml-1">
                    {destination.rating}
                  </span>
                  <span className="text-slate-600 ml-1">
                    ({destination.totalReviews} review)
                  </span>
                </div>
                <div className="flex items-center text-slate-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{destination.location}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {destination.description}
                </p>
              </div>
            </div>

            {/* Facilities */}
            {hasFacilities && (
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Fasilitas Tersedia</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {destination.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        facility.available
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                        {facility.icon === "car" && <Car className="w-4 h-4" />}
                        {facility.icon === "building" && (
                          <div className="w-4 h-4 bg-slate-400 rounded" />
                        )}
                        {facility.icon === "utensils" && (
                          <Utensils className="w-4 h-4" />
                        )}
                        {facility.icon === "wifi" && (
                          <Wifi className="w-4 h-4" />
                        )}
                        {facility.icon === "home" && (
                          <div className="w-4 h-4 bg-slate-400" />
                        )}
                        {facility.icon === "waves" && (
                          <div className="w-4 h-4 bg-blue-400 rounded-full" />
                        )}
                        {facility.icon === "parking" && <Car className="w-4 h-4" />}
                        {facility.icon === "toilet" && (
                          <div className="w-4 h-4 bg-slate-400 rounded" />
                        )}
                      </div>
                      <span className="font-medium">{facility.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            )}

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
                  <p className="text-2xl font-bold text-emerald-600">
                    Rp {(destination.price ?? 0).toLocaleString('id-ID')}
                  </p>
                  <p className="text-slate-600">per orang</p>
                </CardContent>
              </Card>
            </div>

            {/* Tips */}
            {hasTips && (
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Tips Berkunjung</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {destination.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sky-600 text-sm font-medium">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-slate-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            )}
          </div>

          {/* Right Column - Sticky Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {/* Map Placeholder */}
                <div className="h-48 bg-slate-200 rounded-lg mb-4 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-slate-400" />
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">
                      Lokasi
                    </h4>
                    <p className="text-slate-600 text-sm">
                      {destination.location}
                    </p>
                    
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full bg-sky-500 hover:bg-sky-600">
                      <Navigation className="w-4 h-4 mr-2" />
                      Buka di Google Maps
                    </Button>
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
