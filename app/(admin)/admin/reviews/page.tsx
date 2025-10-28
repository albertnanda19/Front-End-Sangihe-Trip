"use client";

import { useAdminList } from "@/hooks/admin/use-admin-list";
import { put } from "@/lib/api";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Eye, RefreshCw } from "lucide-react";

interface ReviewItem {
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

export default function AdminReviewsModeration() {
  const {
    items,
    meta,
    loading,
    error,
    search,
    page,
    setSearchAndFetch,
    setFilter,
    setPage,
    resetFilters,
    refresh,
  } = useAdminList<ReviewItem>({
    endpoint: "/api/admin/reviews",
    searchFields: ["title", "content"],
    pageSize: 10,
  });

  const handleApprove = async (reviewId: string) => {
    if (!confirm("Apakah Anda yakin ingin menyetujui review ini?")) return;

    try {
      await put(`/api/admin/reviews/${reviewId}/approve`, {}, { auth: "required" });
      alert("Review berhasil disetujui!");
      refresh();
    } catch (error) {
      console.error("Error approving review:", error);
      alert("Terjadi kesalahan saat menyetujui review");
    }
  };

  const handleReject = async (reviewId: string) => {
    const reason = prompt("Masukkan alasan penolakan:");
    if (!reason) return;

    try {
      await put(`/api/admin/reviews/${reviewId}/reject`, { reason }, { auth: "required" });
      alert("Review berhasil ditolak!");
      refresh();
    } catch (error) {
      console.error("Error rejecting review:", error);
      alert("Terjadi kesalahan saat menolak review");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Moderasi Review</h1>
          <p className="text-sm text-gray-600">Kelola dan moderasi review pengguna.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Pencarian & Filter</CardTitle>
          <CardDescription>Filter review berdasarkan status, destinasi atau konten.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-3 items-end">
            <div className="w-full lg:w-80">
              <Input
                placeholder="Cari judul atau konten review..."
                value={search}
                onChange={(e) => setSearchAndFetch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchAndFetch(search);
                  }
                }}
              />
            </div>
            <Select onValueChange={(v) => setFilter("status", v === "all" ? undefined : v)}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="hidden">Tersembunyi</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
            <div className="lg:w-auto">
              <Button variant="outline" onClick={resetFilters} className="w-full lg:w-auto">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review untuk Moderasi</CardTitle>
          <CardDescription>
            {loading ? "Memuat..." : `${meta ? meta.total : items.length} review`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Judul</TableHead>
                  <TableHead className="text-center">Pengguna</TableHead>
                  <TableHead className="text-center">Destinasi</TableHead>
                  <TableHead className="text-center">Rating</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Tanggal</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="max-w-xs">
                      <div className="font-medium text-sm truncate" title={review.title}>
                        {review.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate" title={review.content}>
                        {review.content}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-sm font-medium">{review.user.name}</div>
                      <div className="text-xs text-gray-500">{review.user.email}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-sm">{review.destination.name}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-medium">{review.rating}</span>
                        <span className="text-yellow-500">⭐</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusColor(review.status)}>
                        {getStatusDisplayName(review.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell text-sm text-gray-600">
                      {new Date(review.created_at).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/admin/reviews/${review.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {review.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                              onClick={() => handleApprove(review.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              onClick={() => handleReject(review.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination controls */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              {meta ? `Menampilkan halaman ${meta.page} dari ${meta.totalPages}` : ""}
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={loading || (meta ? meta.page <= 1 : page <= 1)}
              >
                Sebelumnya
              </Button>

              {/* Page numbers - responsive */}
              {meta && meta.totalPages > 1 && (
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                    let pnum;
                    if (meta.totalPages <= 5) {
                      pnum = i + 1;
                    } else {
                      const half = Math.floor(5 / 2);
                      const start = Math.max(1, meta.page - half);
                      const end = Math.min(meta.totalPages, start + 4);
                      pnum = start + i;
                      if (pnum > end) return null;
                    }
                    return (
                      <Button
                        key={i}
                        size="sm"
                        variant={pnum === meta.page ? "default" : "ghost"}
                        onClick={() => setPage(pnum)}
                      >
                        {pnum}
                      </Button>
                    );
                  }).filter(Boolean)}
                </div>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={loading || (meta ? meta.page >= meta.totalPages : false)}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}