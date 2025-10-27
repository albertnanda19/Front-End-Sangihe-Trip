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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, Trash2, RefreshCw, UserCheck, UserX, Shield, ShieldCheck } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "moderator";
  status: "active" | "inactive" | "suspended" | "banned";
  created_at: string;
  updated_at: string;
  last_login?: string;
  trip_count: number;
  review_count: number;
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
    setSearch,
    setFilter,
    setPage,
    resetFilters,
    refresh,
  } = useAdminList<UserItem>({
    endpoint: "/api/admin/users",
    searchFields: ["name", "email"],
    pageSize: 20,
    enableClientSideFiltering: false,
  });

  const handleStatusUpdate = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert("Status pengguna berhasil diperbarui!");
        refresh();
      } else {
        const error = await response.json();
        alert(`Gagal memperbarui status: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Terjadi kesalahan saat memperbarui status pengguna");
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        alert("Role pengguna berhasil diperbarui!");
        refresh();
      } else {
        const error = await response.json();
        alert(`Gagal memperbarui role: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Terjadi kesalahan saat memperbarui role pengguna");
    }
  };

  const handleDelete = async (userId: string, hardDelete: boolean = false) => {
    const confirmMessage = hardDelete
      ? "PERINGATAN: Ini akan menghapus pengguna secara permanen. Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin?"
      : "Apakah Anda yakin ingin menonaktifkan pengguna ini?";

    if (!confirm(confirmMessage)) return;

    try {
      const url = `/api/admin/users/${userId}${hardDelete ? "?hard=true" : ""}`;
      const response = await fetch(url, {
        method: "DELETE",
      });

      if (response.ok) {
        alert(hardDelete ? "Pengguna berhasil dihapus permanen!" : "Pengguna berhasil dinonaktifkan!");
        refresh();
      } else {
        const error = await response.json();
        alert(`Gagal menghapus pengguna: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Terjadi kesalahan saat menghapus pengguna");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
            <div className="flex-1">
              <Input
                placeholder="Cari nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
          <CardTitle>Pengguna</CardTitle>
          <CardDescription>
            {loading ? "Memuat..." : `${meta ? meta.totalItems : items.length} pengguna`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Nama</TableHead>
                  <TableHead className="text-center">Email</TableHead>
                  <TableHead className="text-center">Role</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Trips</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Reviews</TableHead>
                  <TableHead className="text-center hidden lg:table-cell">Terakhir Login</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-center">
                      <div className="font-medium">{user.name}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-sm">{user.email}</div>
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
                      {user.trip_count}
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      {user.review_count}
                    </TableCell>
                    <TableCell className="text-center hidden lg:table-cell text-sm text-gray-600">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString('id-ID') : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/admin/users/${user.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>

                        {/* Status Actions */}
                        <div className="flex gap-1">
                          {user.status !== "active" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                              onClick={() => handleStatusUpdate(user.id, "active")}
                              title="Aktifkan"
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          )}
                          {user.status !== "suspended" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
                              onClick={() => handleStatusUpdate(user.id, "suspended")}
                              title="Tangguhkan"
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          )}
                          {user.status !== "banned" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              onClick={() => handleStatusUpdate(user.id, "banned")}
                              title="Blokir"
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        {/* Role Actions */}
                        <div className="flex gap-1">
                          {user.role !== "moderator" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                              onClick={() => handleRoleUpdate(user.id, "moderator")}
                              title="Jadikan Moderator"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                          )}
                          {user.role !== "admin" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700"
                              onClick={() => handleRoleUpdate(user.id, "admin")}
                              title="Jadikan Admin"
                            >
                              <ShieldCheck className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        {/* Delete Actions */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
                              <AlertDialogDescription>
                                Pilih jenis penghapusan untuk pengguna {user.name}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <Button
                                variant="outline"
                                onClick={() => handleDelete(user.id, false)}
                              >
                                Nonaktifkan
                              </Button>
                              <AlertDialogAction
                                onClick={() => handleDelete(user.id, true)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Hapus Permanen
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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