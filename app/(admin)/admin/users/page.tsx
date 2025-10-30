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
import { Eye, RefreshCw } from "lucide-react";

interface UserItem {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "inactive" | "suspended" | "banned";
  created_at: string;
  last_login_at: string | null;
}

const getRoleDisplayName = (role: string): string => {
  switch (role) {
    case "admin": return "Admin";
    case "moderator": return "Moderator";
    case "user": return "User";
    default: return role;
  }
};

const getRoleColor = (role: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (role) {
    case "admin": return "destructive";
    case "moderator": return "default";
    case "user": return "secondary";
    default: return "outline";
  }
};

const getStatusDisplayName = (status: string): string => {
  switch (status) {
    case "active": return "Aktif";
    case "inactive": return "Tidak Aktif";
    case "suspended": return "Ditangguhkan";
    case "banned": return "Diblokir";
    default: return status;
  }
};

const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "active": return "default";
    case "inactive": return "secondary";
    case "suspended": return "outline";
    case "banned": return "destructive";
    default: return "secondary";
  }
};

export default function AdminUsersManagement() {
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
  } = useAdminList<UserItem>({
    endpoint: "/api/admin/users",
    searchFields: ["first_name", "last_name", "email"],
    pageSize: 10,
  });

  return (
    <div className="min-h-screen bg-gray-50 px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kelola Pengguna</h1>
          <p className="text-sm text-gray-600">Kelola pengguna, status dan peran.</p>
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
          <CardDescription>Filter pengguna berdasarkan nama, email, status atau role.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-3 items-end">
            <div className="flex-1 min-w-0 w-full">
              <Input
                placeholder="Cari nama atau email..."
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
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
                <SelectItem value="suspended">Ditangguhkan</SelectItem>
                <SelectItem value="banned">Diblokir</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => setFilter("role", v === "all" ? undefined : v)}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={resetFilters} className="w-full sm:w-auto lg:w-auto">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pengguna</CardTitle>
          <CardDescription>
            {loading ? "Memuat..." : `${meta ? meta.total : items.length} pengguna`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Nama</TableHead>
                  <TableHead className="text-center">Role</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Bergabung</TableHead>
                  <TableHead className="text-center hidden lg:table-cell">Login Terakhir</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-center">
                      <div className="text-sm font-medium">
                        {`${user.first_name} ${user.last_name}`}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getRoleColor(user.role)}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusColor(user.status)}>
                        {getStatusDisplayName(user.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      <div className="text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleString('id-ID')}
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden lg:table-cell">
                      <div className="text-sm text-gray-600">
                        {user.last_login_at
                          ? new Date(user.last_login_at).toLocaleString('id-ID')
                          : 'Belum pernah login'
                        }
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/admin/users/${user.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="Lihat Detail"
                        >
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