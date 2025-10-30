"use client";

import { useAdminList } from "@/hooks/admin/use-admin-list";
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
import {
  RefreshCw,
  Eye
} from "lucide-react";
import Link from "next/link";

interface ActivityItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName: string;
  adminId: string;
  userName: string;
  userType: string;
  details: string;
  timestamp: string;
}

const getActionDisplayName = (action: string): string => {
  const baseAction = action.split('_')[0];

  switch (baseAction) {
    case "create": return "Create";
    case "update": return "Update";
    case "delete": return "Delete";
    case "approve": return "Approve";
    case "reject": return "Reject";
    case "login": return "Login";
    case "logout": return "Logout";
    default: return baseAction;
  }
};

const getUserTypeDisplayName = (userType: string): string => {
  switch (userType) {
    case "admin": return "Admin";
    case "user": return "User";
    default: return userType;
  }
};

const getTypeDisplayName = (entityType: string): string => {
  switch (entityType) {
    case "destination": return "Destinasi";
    case "article": return "Artikel";
    case "review": return "Review";
    case "user": return "Pengguna";
    case "trip": return "Trip";
    case "admin": return "Admin";
    default: return entityType;
  }
};

export default function AdminActivitiesPage() {
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
  } = useAdminList<ActivityItem>({
    endpoint: "/api/admin/activities",
    searchFields: ["action", "entityName", "details"],
    pageSize: 10,
  });

  return (
    <div className="min-h-screen bg-gray-50 px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Aktivitas Admin</h1>
          <p className="text-sm text-gray-600">Log aktivitas dan perubahan yang dilakukan admin dan user.</p>
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
          <CardDescription>Filter aktivitas berdasarkan aksi, tipe entitas, dan role pengguna.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-3 items-end">
            <div className="w-full flex-1 min-w-0">
              <Input
                placeholder="Cari aksi, nama entitas atau detail..."
                value={search}
                onChange={(e) => setSearchAndFetch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchAndFetch(search);
                  }
                }}
              />
            </div>
            <Select onValueChange={(v) => setFilter("action", v === "all" ? undefined : v)}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Aksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Aksi</SelectItem>
                <SelectItem value="create">Buat</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Hapus</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => setFilter("entityType", v === "all" ? undefined : v)}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Tipe Entitas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="destination">Destinasi</SelectItem>
                <SelectItem value="article">Artikel</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="user">Pengguna</SelectItem>
                <SelectItem value="trip">Trip</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => setFilter("userType", v === "all" ? undefined : v)}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Role</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <div className="md:col-span-2 lg:col-span-4 flex justify-end">
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Log Aktivitas</CardTitle>
          <CardDescription>
            {loading ? "Memuat..." : `${meta ? meta.total : items.length} aktivitas`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Aktivitas</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="hidden md:table-cell">Detail</TableHead>
                  <TableHead className="text-center hidden md:table-cell">User/Admin</TableHead>
                  <TableHead className="text-center hidden lg:table-cell">Role</TableHead>
                  <TableHead className="text-center hidden xl:table-cell">Waktu</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="justify-center">
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">
                          {getActionDisplayName(activity.action)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getTypeDisplayName(activity.entityType)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {activity.entityName}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm truncate">
                        {activity.details}
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      <div className="text-sm">
                        {activity.userName || "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden lg:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {getUserTypeDisplayName(activity.userType)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center hidden xl:table-cell text-sm text-gray-600">
                      {new Date(activity.timestamp).toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/${activity.entityType}s/${activity.entityId}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
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