"use client";

import { useAdminList } from "@/hooks/admin/use-admin-list";
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
import { Eye, Trash2, RefreshCw } from "lucide-react";

interface DestinationItem {
  id: string;
  name: string;
  status: string;
  category: string;
  is_featured: boolean;
  avg_rating: number;
  total_reviews: number;
  view_count: number;
  created_by?: {
    firstName: string;
    lastName: string;
  };
  created_at: string;
  updated_at: string;
}

const getCategoryDisplayName = (category?: string): string => {
  switch (category) {
    case "nature": return "Alam";
    case "cultural": return "Budaya";
    case "adventure": return "Petualangan";
    case "religious": return "Religi";
    case "historical": return "Sejarah";
    case "culinary": return "Kuliner";
    case "beach": return "Pantai";
    case "mountain": return "Gunung";
    default: return category ?? "-";
  }
};

const getStatusDisplayName = (status?: string): string => {
  switch (status) {
    case "active": return "Aktif";
    case "inactive": return "Tidak Aktif";
    default: return status ?? "unknown";
  }
};

export default function AdminDestinationsList() {
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
    deleteItem,
  } = useAdminList<DestinationItem>({
    endpoint: "/api/admin/destinations",
    searchFields: ["name"],
    pageSize: 10,
  });

  return (
    <div className="min-h-screen bg-gray-50 px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kelola Destinasi</h1>
          <p className="text-sm text-gray-600">Daftar, cari dan kelola destinasi.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Link href="/admin/destinations/new">
            <Button>Tambah Destinasi</Button>
          </Link>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Pencarian & Filter</CardTitle>
          <CardDescription>Filter berdasarkan nama, status atau kategori.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-3 items-end">
            <div className="w-full flex-1 min-w-0">
              <Input
                placeholder="Cari nama destinasi..."
                value={search}
                onChange={(e) => setSearchAndFetch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchAndFetch(search);
                  }
                }}
              />
            </div>
            <Select onValueChange={(v) => setFilter("category", v === "all" ? undefined : v)}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="nature">Alam</SelectItem>
                <SelectItem value="cultural">Budaya</SelectItem>
                <SelectItem value="adventure">Petualangan</SelectItem>
                <SelectItem value="religious">Religi</SelectItem>
                <SelectItem value="historical">Sejarah</SelectItem>
                <SelectItem value="culinary">Kuliner</SelectItem>
                <SelectItem value="beach">Pantai</SelectItem>
                <SelectItem value="mountain">Gunung</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => setFilter("status", v === "all" ? undefined : v)}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => setFilter("sort", v === "default" ? undefined : v)}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="createdAt:desc">Terbaru</SelectItem>
                <SelectItem value="createdAt:asc">Terlama</SelectItem>
                <SelectItem value="rating:desc">Rating Tertinggi</SelectItem>
                <SelectItem value="viewCount:desc">Paling Banyak Dilihat</SelectItem>
                <SelectItem value="name:asc">Nama A-Z</SelectItem>
                <SelectItem value="name:desc">Nama Z-A</SelectItem>
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
          <CardTitle>Destinasi</CardTitle>
          <CardDescription>
            {loading ? "Memuat..." : `${meta ? meta.total : items.length} item`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Nama</TableHead>
                  <TableHead className="text-center">Kategori</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center hidden lg:table-cell">Rating Rata-Rata</TableHead>
                  <TableHead className="text-center hidden xl:table-cell">Total Reviews</TableHead>
                  <TableHead className="text-center hidden lg:table-cell">Views</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Pembuat</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Dibuat</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Diupdate</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="font-medium text-sm">{d.name}</div>
                    </TableCell>
                    <TableCell className="text-center">{getCategoryDisplayName(d.category)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={d.status === "active" ? "default" : "secondary"}>
                        {getStatusDisplayName(d.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center hidden lg:table-cell">
                      <div className="text-sm">
                        {d.avg_rating ? `${d.avg_rating.toFixed(1)} ⭐` : "-"}
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden xl:table-cell">
                      <div className="text-sm font-medium">
                        {d.total_reviews.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden lg:table-cell">
                      <div className="text-sm font-medium">
                        {d.view_count.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      <div className="text-sm">
                        {d.created_by ? `${d.created_by.firstName} ${d.created_by.lastName}`.trim() : 'Unknown'}
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell text-sm text-gray-600">
                      {d.created_at ? new Date(d.created_at).toLocaleString('id-ID') : "-"}
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell text-sm text-gray-600">
                      {d.updated_at ? new Date(d.updated_at).toLocaleString('id-ID') : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/admin/destinations/${d.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          onClick={() => deleteItem(d.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

              {/* Page numbers */}
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
