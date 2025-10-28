"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, XCircle, User, MapPin, Calendar, Star } from "lucide-react";
import Link from "next/link";
import { get, put } from "@/lib/api";

interface ReviewDetail {
  id: string;
  title: string;
  content: string;
  rating: number;
  status: "pending" | "active" | "hidden" | "rejected";
  created_at: string;
  updated_at: string;
  moderator_notes?: string;
  rejection_reason?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  destination: {
    id: string;
    name: string;
    category?: string;
  };
}

const getStatusDisplayName = (status: string): string => {
  switch (status) {
    case "pending": return "Menunggu";
    case "active": return "Aktif";
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

const getCategoryDisplayName = (category?: string): string => {
  switch (category) {
    case "beach": return "Pantai";
    case "culinary": return "Kuliner";
    case "nature": return "Alam";
    case "cultural": return "Budaya";
    default: return category ?? "-";
  }
};

export default function AdminReviewDetail() {
  const params = useParams();
  const reviewId = params.id as string;

  const [review, setReview] = useState<ReviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReview = useCallback(async () => {
    try {
      setLoading(true);
      const result = await get<ReviewDetail>(`/api/admin/reviews/${reviewId}`, { auth: "required" });
      setReview(result.data);
    } catch (error) {
      console.error("Error fetching review:", error);
      setError("Terjadi kesalahan saat memuat review");
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
      await put(`/api/admin/reviews/${reviewId}/approve`, undefined, { auth: "required" });
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Memuat detail review...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error || "Review tidak ditemukan"}</p>
          <Link href="/admin/reviews">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Moderasi Review
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/reviews">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Detail Review</h1>
            <p className="text-sm text-gray-600">Moderasi review pengguna</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Review Content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    {review.title}
                  </CardTitle>
                  <Badge variant={getStatusColor(review.status)}>
                    {getStatusDisplayName(review.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
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

                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{review.content}</p>
                </div>

                <Separator />

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Dibuat pada {new Date(review.created_at).toLocaleString('id-ID')}
                </div>

                {review.updated_at !== review.created_at && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    Diupdate pada {new Date(review.updated_at).toLocaleString('id-ID')}
                  </div>
                )}

                {review.moderator_notes && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">Catatan Moderator</h4>
                    <p className="text-sm text-blue-800">{review.moderator_notes}</p>
                  </div>
                )}

                {review.rejection_reason && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-1">Alasan Penolakan</h4>
                    <p className="text-sm text-red-800">{review.rejection_reason}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* User & Destination Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informasi Pengguna
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{review.user.name}</p>
                  <p className="text-sm text-gray-600">{review.user.email}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Informasi Destinasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{review.destination.name}</p>
                  <p className="text-sm text-gray-600">
                    Kategori: {getCategoryDisplayName(review.destination.category)}
                  </p>
                </div>
                <Link href={`/admin/destinations/${review.destination.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Lihat Destinasi
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Moderation Actions */}
            {review.status === "pending" && (
              <Card>
                <CardHeader>
                  <CardTitle>Aksi Moderasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="w-full"
                    variant="default"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Setujui Review
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="w-full"
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Tolak Review
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}