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
import { Edit, Trash2, RefreshCw } from "lucide-react";

interface DestinationItem {
  id: string;
  name: string;
  category?: string;
  status?: string;
  avg_rating?: number;
  updated_at?: string;
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
    case "pending": return "Menunggu";
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
    <div className="min-h-screen bg-gray-50 p-6">
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
                <SelectItem value="pending">Menunggu</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => setFilter("avg_rating", v === "all" ? undefined : parseInt(v))}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="5">5 Bintang</SelectItem>
                <SelectItem value="4">4 Bintang</SelectItem>
                <SelectItem value="3">3 Bintang</SelectItem>
                <SelectItem value="2">2 Bintang</SelectItem>
                <SelectItem value="1">1 Bintang</SelectItem>
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
                  <TableHead className="text-center hidden lg:table-cell">Rating Rata-rata</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Terakhir Diupdate</TableHead>
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
                      {d.avg_rating ? `${d.avg_rating} bintang` : "-"}
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell text-sm text-gray-600">
                      {d.updated_at ? new Date(d.updated_at).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/admin/destinations/${d.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
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
