"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { get, put } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle, User, MapPin, Star, ThumbsUp, Flag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewDetail {
  id: string;
  rating: number;
  content: string;
  visit_date: string | null;
  status: string;
  helpful_count: number;
  report_count: number;
  moderation_notes: string | null;
  moderated_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  users: {
    email: string;
    last_name: string;
    first_name: string;
    avatar_url: string | null;
  };
  destinations: {
    id: string;
    name: string;
  };
  review_images: {
    url: string;
  }[];
}

const getStatusDisplayName = (status: string): string => {
  switch (status) {
    case "active": return "Aktif";
    case "pending": return "Menunggu";
    case "hidden": return "Tersembunyi";
    case "rejected": return "Ditolak";
    default: return status;
  }
};

const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "active": return "default";
    case "pending": return "outline";
    case "hidden": return "secondary";
    case "rejected": return "destructive";
    default: return "secondary";
  }
};

export default function ReviewViewPage() {
  const params = useParams();
  const reviewId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState<ReviewDetail | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReview = useCallback(async () => {
    try {
      const response = await get<ReviewDetail>(`/api/admin/reviews/${reviewId}`, { auth: "required" });
      setReview(response.data);
    } catch (error) {
      console.error("Error fetching review:", error);
      alert("Terjadi kesalahan saat memuat review");
    } finally {
      setLoading(false);
    }
  }, [reviewId]);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  const handleApprove = async () => {
    if (!confirm("Apakah Anda yakin ingin menyetujui review ini?")) return;

    try {
      setActionLoading(true);
      await put(`/api/admin/reviews/${reviewId}/approve`, {}, { auth: "required" });
      alert("Review berhasil disetujui!");
      fetchReview();
    } catch (error) {
      console.error("Error approving review:", error);
      alert("Terjadi kesalahan saat menyetujui review");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt("Masukkan alasan penolakan:");
    if (!reason) return;

    try {
      setActionLoading(true);
      await put(`/api/admin/reviews/${reviewId}/reject`, { reason }, { auth: "required" });
      alert("Review berhasil ditolak!");
      fetchReview();
    } catch (error) {
      console.error("Error rejecting review:", error);
      alert("Terjadi kesalahan saat menolak review");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat review...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center">
          <p className="text-gray-600">Review tidak ditemukan.</p>
          <Link href="/admin/reviews">
            <Button className="mt-4">Kembali ke Moderasi Review</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/reviews">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Detail Review</h1>
            <p className="text-sm text-gray-600">Lihat detail review pengguna.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusColor(review.status)}>
            {getStatusDisplayName(review.status)}
          </Badge>
          {review.status === "pending" && (
            <>
              <Button onClick={handleApprove} disabled={actionLoading}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {actionLoading ? "Memproses..." : "Setujui"}
              </Button>
              <Button onClick={handleReject} disabled={actionLoading} variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Tolak
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Rating</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({review.rating}/5)</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Statistik</Label>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-green-600">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm">{review.helpful_count}</span>
                  </div>
                  <div className="flex items-center gap-1 text-red-600">
                    <Flag className="h-4 w-4" />
                    <span className="text-sm">{review.report_count}</span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Dibuat</Label>
                <p className="text-sm text-gray-600">
                  {new Date(review.created_at).toLocaleString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
              {review.visit_date && (
                <div>
                  <Label className="text-sm font-medium">Tanggal Kunjungan</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(review.visit_date).toLocaleDateString("id-ID")}
                  </p>
                </div>
              )}
              {review.moderated_at && (
                <div>
                  <Label className="text-sm font-medium">Dimoderasi Pada</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(review.moderated_at).toLocaleString("id-ID")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informasi Pengguna
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={review.users.avatar_url || undefined} />
                    <AvatarFallback>
                      {review.users.first_name[0]}{review.users.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {review.users.first_name} {review.users.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{review.users.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Destinasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{review.destinations.name}</p>
                </div>
                <Link href={`/admin/destinations/${review.destinations.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Lihat Destinasi
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {review.moderation_notes ? (
              <Card>
                <CardHeader>
                  <CardTitle>Catatan Moderasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{review.moderation_notes}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="md:col-span-1"></div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Konten Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Isi Review</Label>
                <div className="mt-3 p-6 bg-white rounded-lg border border-gray-200">
                  <div className="prose prose-sm md:prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {review.content}
                    </div>
                  </div>
                </div>
              </div>

              {/* {review.pros_cons && Object.keys(review.pros_cons).length > 0 && (
                <div className="pt-4 border-t">
                  <Label className="text-sm font-medium text-gray-500">Kelebihan & Kekurangan</Label>
                  <div className="mt-3 space-y-3">
                    {Object.entries(review.pros_cons).map(([key, values]) => (
                      <div key={key} className="flex gap-3">
                        <span className="text-sm font-medium min-w-[100px] capitalize">
                          {key}:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {values.map((value, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}

              {review.review_images && review.review_images.length > 0 && (
                <div className="pt-4 border-t">
                  <Label className="text-sm font-medium text-gray-500">Gambar Review</Label>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {review.review_images.map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={image.url}
                          alt={`Review image ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}