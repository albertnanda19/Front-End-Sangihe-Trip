"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { get, ApiError } from "@/lib/api";
import type { ReviewResponse } from "@/lib/api-response";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { EmptyReviews } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Calendar, ChevronRight, Heart, Star } from "lucide-react";

type Order = "asc" | "desc";

interface ReviewsMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface ReviewsResult {
  items: ReviewResponse[];
  meta?: ReviewsMeta;
}

export default function UserReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [rating, setRating] = useState<string>("all");
  const [order, setOrder] = useState<Order>("desc");

  const [data, setData] = useState<ReviewsResult>({ items: [] });

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("per_page", String(perPage));
      params.set("sortBy", "date");
      params.set("order", order);
      if (rating !== "all") params.set("rating", rating);

      const urlPath = `/api/users/me/reviews?${params.toString()}`;
      const { data: items, meta } = await get<ReviewResponse[], ReviewsMeta>(urlPath, {
        auth: "required",
        cache: "no-store",
      });
      setData({ items: items ?? [], meta });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, rating, order]);

  const totalPages = useMemo(() => {
    if (data.meta?.total_pages) return data.meta.total_pages;
    return data.items.length < perPage && page === 1 ? 1 : page + (data.items.length === perPage ? 1 : 0);
  }, [data.meta, data.items.length, perPage, page]);

  const goTo = (p: number) => {
    if (p < 1) return;
    if (data.meta?.total_pages && p > data.meta.total_pages) return;
    setPage(p);
  };

  const renderStars = (r: number) => (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < r ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
      ))}
      <span className="ml-1.5 text-sm font-medium text-slate-700">{r}.0</span>
    </div>
  );

  return (
      <div>
        {/* Title & Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Review Saya</h1>
            <p className="text-sm text-slate-600">Semua ulasan yang Anda tulis untuk destinasi.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-40">
              <Select value={rating} onValueChange={(val) => { setPage(1); setRating(val); }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Rating</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Select value={order} onValueChange={(val: Order) => { setPage(1); setOrder(val); }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Terbaru</SelectItem>
                  <SelectItem value="asc">Terlama</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-28 hidden sm:block">
              <Select value={String(perPage)} onValueChange={(val) => { setPage(1); setPerPage(Number(val)); }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="10/hal." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 / hal.</SelectItem>
                  <SelectItem value="10">10 / hal.</SelectItem>
                  <SelectItem value="20">20 / hal.</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4">
            <ErrorState message={error} onRetry={fetchReviews} variant="alert" />
          </div>
        )}

        {/* List */}
        {loading ? (
          <p className="text-center text-slate-600 py-10">Memuat ulasan...</p>
        ) : data.items.length === 0 ? (
          <EmptyReviews />
        ) : (
          <div className="space-y-4">
            {data.items.map((review) => {
              const ratingVal = review.rating || 0;
              const destinationId = review.destinationId || review.destination?.id || "";
              const destinationName = review.destinationName || review.destination?.name || "Destinasi";
              const dateStr = review.createdAt || review.date || "";
              const excerpt = review.comment || review.content || "";
              const likes = review.helpful ?? review.helpfulCount ?? review.likes ?? 0;

              return (
                <Card key={review.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link href={`/destinasi/${destinationId}#review-${review.id}`} className="group">
                          <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                            {destinationName}
                          </h3>
                        </Link>
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{dateStr ? new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : ""}</span>
                        </div>
                      </div>
                      {renderStars(ratingVal)}
                    </div>
                    {excerpt && (
                      <p className="mt-3 text-sm text-slate-700 line-clamp-3">{excerpt}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <Link href={`/destinasi/${destinationId}#review-${review.id}`} className="text-sky-600 text-sm inline-flex items-center gap-1">
                        Lihat Ulasan
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                      <div className="text-xs text-slate-500 inline-flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" /> {likes}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {data.items.length > 0 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (page > 1) goTo(page - 1); }} />
                </PaginationItem>
                {/* Show simple pages if meta present */}
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const p = data.meta?.total_pages ? i + Math.max(1, Math.min(page - 2, data.meta.total_pages - 4)) : i + 1;
                  return (
                    <PaginationItem key={p}>
                      <PaginationLink href="#" isActive={p === page} onClick={(e) => { e.preventDefault(); goTo(p); }}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (!data.meta || page < totalPages) goTo(page + 1); }} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
  );
}
