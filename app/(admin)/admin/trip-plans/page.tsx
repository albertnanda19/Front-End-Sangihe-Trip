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
import { Eye, Trash2, RefreshCw, Search, Users } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface TripPlanItem {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  total_people: number;
  trip_type: string;
  status: string;
  privacy_level: string;
  estimated_budget: number;
  actual_budget: number;
  view_count: number;
  clone_count: number;
  total_days: number;
  total_items: number;
  total_collaborators: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

const getTripTypeDisplayName = (tripType?: string): string => {
  switch (tripType) {
    case "solo": return "Solo";
    case "couple": return "Pasangan";
    case "family": return "Keluarga";
    case "group": return "Grup";
    case "business": return "Bisnis";
    default: return tripType ?? "-";
  }
};

const getTripTypeBadgeVariant = (tripType?: string): "default" | "secondary" | "outline" => {
  switch (tripType) {
    case "solo": return "secondary";
    case "couple": return "outline";
    case "family": return "default";
    default: return "secondary";
  }
};

const getStatusDisplayName = (status?: string): string => {
  switch (status) {
    case "planning": return "Perencanaan";
    case "confirmed": return "Dikonfirmasi";
    case "ongoing": return "Berlangsung";
    case "completed": return "Selesai";
    case "cancelled": return "Dibatalkan";
    default: return status ?? "-";
  }
};

const getStatusBadgeVariant = (status?: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case "planning": return "secondary";
    case "confirmed": return "default";
    case "ongoing": return "default";
    case "completed": return "outline";
    case "cancelled": return "destructive";
    default: return "secondary";
  }
};

export default function AdminTripPlansList() {
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
  } = useAdminList<TripPlanItem>({
    endpoint: "/api/admin/trips",
    searchFields: ["title"],
    pageSize: 20,
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus trip plan ini?")) return;
    await deleteItem(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kelola Trip Plans</h1>
          <p className="text-sm text-gray-600">Daftar, cari dan kelola rencana perjalanan pengguna.</p>
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
          <CardDescription>
            Cari berdasarkan nama trip, email, atau nama pengguna
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari nama trip, email, atau nama pengguna..."
                  value={search}
                  onChange={(e) => setSearchAndFetch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select onValueChange={(value) => setFilter("status", value === "all" ? undefined : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="planning">Perencanaan</SelectItem>
                <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                <SelectItem value="ongoing">Berlangsung</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
                <SelectItem value="cancelled">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setFilter("tripType", value === "all" ? undefined : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="solo">Solo</SelectItem>
                <SelectItem value="couple">Pasangan</SelectItem>
                <SelectItem value="family">Keluarga</SelectItem>
                <SelectItem value="group">Grup</SelectItem>
                <SelectItem value="business">Bisnis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Nama Trip</TableHead>
                  <TableHead>Status & Tipe</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Statistik</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead>Diupdate</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      Tidak ada data trip plan
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {item.user.firstName} {item.user.lastName}
                          </span>
                          <span className="text-sm text-gray-500">{item.user.email}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="font-medium max-w-xs truncate">{item.title}</div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Badge variant={getStatusBadgeVariant(item.status)}>
                            {getStatusDisplayName(item.status)}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-gray-500" />
                            <span className="text-sm font-medium">{item.total_people}</span>
                            <Badge variant={getTripTypeBadgeVariant(item.trip_type)} className="text-xs">
                              {getTripTypeDisplayName(item.trip_type)}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span className="font-medium">
                            {format(new Date(item.start_date), "dd MMM yyyy", { locale: localeId })}
                          </span>
                          <span className="text-gray-500">s/d</span>
                          <span className="font-medium">
                            {format(new Date(item.end_date), "dd MMM yyyy", { locale: localeId })}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            ({item.duration_days} hari)
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span className="font-medium">
                            Rp {item.estimated_budget.toLocaleString("id-ID")}
                          </span>
                          {item.actual_budget > 0 && (
                            <span className="text-gray-500 text-xs">
                              Aktual: Rp {item.actual_budget.toLocaleString("id-ID")}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col text-xs text-gray-600 gap-1">
                          <span>📊 {item.total_days} hari, {item.total_items} item</span>
                          <span>👁️ {item.view_count} views</span>
                          <span>📋 {item.clone_count} clone</span>
                          {item.total_collaborators > 0 && (
                            <span>👥 {item.total_collaborators} kolaborator</span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-sm text-gray-600">
                        {format(new Date(item.created_at), "dd MMM yyyy HH:mm", { locale: localeId })}
                      </TableCell>

                      <TableCell className="text-sm text-gray-600">
                        {format(new Date(item.updated_at), "dd MMM yyyy HH:mm", { locale: localeId })}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/trip-plans/${item.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {meta && meta.total > meta.limit && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-gray-600">
                Halaman {meta.page} dari {Math.ceil(meta.total / meta.limit)} ({meta.total} total)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= Math.ceil(meta.total / meta.limit)}
                  onClick={() => setPage(page + 1)}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
