"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  MapPin,
  Star,
  Plus,
  Edit,
  Calendar,
  Compass,
  BookOpen,  
  Globe,
  Lock,
  Heart,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Target,
  Map,
} from "lucide-react";
import Image from "next/image";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useUserDashboard } from "@/hooks/use-user-dashboard";
import { DashboardSkeleton, SidebarSkeleton } from "@/components/shared/dashboard-skeleton";
import { EmptyTrips, EmptyReviews, EmptyDestinations, EmptyArticles } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";



export default function DashboardPage() {
  const [sidebarOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());

  const { profile, stats, loading: profileLoading, error: profileError, refetch: refetchProfile } = useUserProfile();
  const {
    recentTrips,
    recentReviews,
    recommendedDestinations,
    recommendedArticles,
    upcomingTrips,
    loading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useUserDashboard();

  const loading = profileLoading || dashboardLoading;
  const error = profileError || dashboardError;

  const userName = profile?.name || "User";
  

  const toggleLike = (reviewId: string) => {
    setLikedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

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
      <div>
        {/* Error Alert */}
        {error && (
          <ErrorState
            message={error}
            onRetry={() => {
              refetchProfile();
              refetchDashboard();
            }}
            variant="alert"
          />
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <DashboardSkeleton />
            ) : (
              <>
                {/* Welcome Section */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                      Selamat datang, {userName}! 👋
                    </h1>
                    <p className="text-slate-600">
                      Siap untuk petualangan baru di Kepulauan Sangihe?
                    </p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Map className="w-6 h-6 text-sky-600" />
                        </div>
                        <p className="text-2xl font-bold text-slate-800">
                          {stats?.tripPlans || 0}
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
                          {stats?.visitedDestinations || 0}
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
                          {stats?.reviewsWritten || 0}
                        </p>
                        <p className="text-sm text-slate-600">Review Ditulis</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-800">
                      Aksi Cepat
                    </h2>
                    <span className="text-xs text-slate-500">
                      Aktivitas Anda
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Buat Trip Baru */}
                    <Link href="/create-trip">
                      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-sky-300 relative">
                        <CardContent className="p-6 text-center">
                          {/* Stats Badge */}
                          {stats && stats.tripPlans > 0 && (
                            <Badge className="absolute top-3 right-3 bg-sky-100 text-sky-700 text-[10px] px-2 py-0.5">
                              {stats.tripPlans} trips
                            </Badge>
                          )}
                          <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                            <Plus className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                            Buat Rencana Baru
                          </h3>
                          <p className="text-sm text-slate-600">
                            {stats && stats.tripPlans > 0 
                              ? `${stats.tripPlans} trip aktif`
                              : "Mulai merencanakan perjalanan"}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>

                    {/* Jelajahi Destinasi */}
                    <Link href="/destinasi">
                      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-emerald-300 relative">
                        <CardContent className="p-6 text-center">
                          {/* Stats Badge */}
                          {stats && stats.visitedDestinations > 0 && (
                            <Badge className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5">
                              {stats.visitedDestinations} visited
                            </Badge>
                          )}
                          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                            <Compass className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                            Jelajahi Destinasi
                          </h3>
                          <p className="text-sm text-slate-600">
                            {stats && stats.visitedDestinations > 0
                              ? `${stats.visitedDestinations} destinasi dikunjungi`
                              : "Temukan tempat menakjubkan"}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>

                    {/* Tulis Review */}
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-orange-300 relative">
                      <CardContent className="p-6 text-center">
                        {/* Stats Badge with Contextual Suggestion */}
                        {stats && stats.reviewsWritten > 0 ? (
                          <Badge className="absolute top-3 right-3 bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5">
                            {stats.reviewsWritten} reviews
                          </Badge>
                        ) : stats && stats.visitedDestinations > 0 && (
                          <Badge className="absolute top-3 right-3 bg-red-100 text-red-700 text-[10px] px-2 py-0.5 animate-pulse">
                            New!
                          </Badge>
                        )}
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                          <Edit className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                          Tulis Review
                        </h3>
                        <p className="text-sm text-slate-600">
                          {stats && stats.reviewsWritten > 0 
                            ? `${stats.reviewsWritten} review ditulis`
                            : stats && stats.visitedDestinations > 0
                            ? "Bagikan pengalaman Anda!"
                            : "Bagikan pengalaman perjalanan"}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Lihat Artikel */}
                    <Link href="/artikel">
                      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-purple-300 relative">
                        <CardContent className="p-6 text-center">
                          {/* Suggestion Badge */}
                          {stats && stats.tripPlans === 0 && (
                            <Badge className="absolute top-3 right-3 bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5">
                              Rekomendasi
                            </Badge>
                          )}
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                            Lihat Artikel
                          </h3>
                          <p className="text-sm text-slate-600">
                            {stats && stats.tripPlans === 0
                              ? "Mulai dengan tips wisata"
                              : "Baca tips dan panduan wisata"}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
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
                  <Link href="/my-trips">
                    <Button variant="ghost" size="sm">
                      Lihat Semua
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentTrips.length === 0 ? (
                    <EmptyTrips variant="minimal" />
                  ) : (
                    recentTrips.map((trip) => (
                    <Card
                      key={trip.id}
                      className="hover:shadow-md transition-all hover:border-sky-300 cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* Enhanced Image with overlay badges */}
                          <div className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                            <Image
                              src={trip.image || "/placeholder.svg"}
                              alt={trip.name}
                              fill
                              className="object-cover"
                            />
                            {/* Trip Type Badge Overlay */}
                            <div className="absolute bottom-1 left-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-700 border border-slate-200">
                              {trip.tripType === "family" && "👨‍👩‍👧 Keluarga"}
                              {trip.tripType === "solo" && "🎒 Solo"}
                              {trip.tripType === "couple" && "💑 Couple"}
                              {trip.tripType === "group" && "👥 Group"}
                              {!trip.tripType && "🗺️ Trip"}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Title and Status Row */}
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 truncate text-[15px]">
                                  {trip.name}
                                </h3>
                                {/* Privacy Indicator */}
                                {trip.isPublic ? (
                                  <div className="flex-shrink-0 text-sky-600" title="Trip Publik">
                                    <Globe className="w-3.5 h-3.5" />
                                  </div>
                                ) : (
                                  <div className="flex-shrink-0 text-slate-400" title="Trip Pribadi">
                                    <Lock className="w-3.5 h-3.5" />
                                  </div>
                                )}
                              </div>
                              <Badge
                                className={`${getStatusColor(
                                  trip.status
                                )} text-white text-[11px] px-2 py-0.5 font-medium flex-shrink-0`}
                              >
                                {getStatusText(trip.status)}
                              </Badge>
                            </div>

                            {/* Date */}
                            <p className="text-xs text-slate-600 mb-2.5">
                              📅 {trip.dates}
                            </p>

                            {/* Info and Actions Row */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5 text-xs text-slate-500 flex-1">
                                <div className="flex items-center gap-1">
                                  <User className="w-3.5 h-3.5" />
                                  <span>{trip.peopleCount}</span>
                                </div>
                                <span className="text-slate-300">•</span>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>{trip.destinations}</span>
                                </div>
                                {trip.budget > 0 && (
                                  <>
                                    <span className="text-slate-300">•</span>
                                    <span className="font-semibold text-emerald-600">
                                      Rp {(trip.budget / 1000000).toFixed(1)}jt
                                    </span>
                                  </>
                                )}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-sky-50 hover:text-sky-600"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="space-y-4" id="reviews">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Review Terbaru
                  </h2>
                  <Link href="/reviews">
                    <Button variant="ghost" size="sm">
                      Lihat Semua
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentReviews.length === 0 ? (
                    <EmptyReviews variant="minimal" />
                  ) : (
                    recentReviews.map((review) => {
                      const isLiked = likedReviews.has(review.id);
                      const displayLikes = review.likes + (isLiked ? 1 : 0);
                      
                      return (
                    <Card
                      key={review.id}
                      className="hover:shadow-lg transition-all hover:border-sky-200 group"
                    >
                      <CardContent className="p-4">
                        {/* Destination Name - Clickable */}
                        <div className="flex items-start justify-between mb-3">
                          <Link 
                            href={`/destinasi/${review.destinationId}`}
                            className="flex-1 group/link"
                          >
                            <h3 className="font-semibold text-slate-900 group-hover/link:text-sky-600 transition-colors flex items-center gap-2">
                              {review.destination}
                              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </h3>
                          </Link>
                          
                          {/* Enhanced Rating Display */}
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 transition-all ${
                                  i < review.rating
                                    ? "text-amber-400 fill-amber-400 scale-110"
                                    : "text-slate-300"
                                }`}
                              />
                            ))}
                            <span className="ml-1.5 text-sm font-semibold text-slate-700">
                              {review.rating}.0
                            </span>
                          </div>
                        </div>

                        {/* Review Excerpt */}
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                          &ldquo;{review.excerpt}&rdquo;
                        </p>

                        {/* Actions Row */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {review.date}
                          </span>
                          
                          <div className="flex items-center gap-3">
                            {/* Like Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-7 px-2 gap-1.5 transition-all ${
                                isLiked 
                                  ? "text-rose-600 hover:text-rose-700 bg-rose-50" 
                                  : "text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                              }`}
                              onClick={() => toggleLike(review.id)}
                            >
                              <Heart 
                                className={`w-3.5 h-3.5 transition-all ${
                                  isLiked ? "fill-rose-600" : ""
                                }`} 
                              />
                              <span className="font-medium">{displayLikes}</span>
                            </Button>

                            {/* View Full Review */}
                            <Link href={`/destinasi/${review.destinationId}#review-${review.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 gap-1 text-slate-600 hover:text-sky-600 hover:bg-sky-50"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span className="text-xs">Lihat</span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                      );
                    })
                  )}
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
                {recommendedDestinations.length === 0 ? (
                  <EmptyDestinations />
                ) : (
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
                )}
              </div>

              {/* Recommended Articles */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-800">
                  Artikel Menarik
                </h2>
                {recommendedArticles.length === 0 ? (
                  <EmptyArticles />
                ) : (
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
                )}
              </div>
            </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div
            className={`lg:col-span-1 space-y-6 ${
              sidebarOpen ? "block" : "hidden lg:block"
            }`}
          >
            {loading ? (
              <SidebarSkeleton />
            ) : (
              <>
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
                        {profile?.profileCompletion || 0}%
                      </div>
                      <Progress
                        value={profile?.profileCompletion || 0}
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
                {upcomingTrips.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-2">Belum ada perjalanan mendatang.</p>
                ) : (
                  upcomingTrips.map((trip, index) => (
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
                  ))
                )}
              </CardContent>
            </Card>
            {/* Removed Weather and Tips sections (mock data) */}
              </>
            )}
          </div>
        </div>
      </div>
  );
}
