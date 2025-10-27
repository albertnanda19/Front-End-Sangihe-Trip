"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import {
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Star,
  MessageSquare,
  UserX,
  Trash2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "moderator";
  status: "active" | "inactive" | "suspended" | "banned";
  created_at: string;
  updated_at: string;
  last_login?: string;
  email_verified: boolean;
  avatar?: string;
  bio?: string;
  trip_count: number;
  review_count: number;
  average_rating?: number;
  recent_trips: Array<{
    id: string;
    title: string;
    status: string;
    created_at: string;
  }>;
  recent_reviews: Array<{
    id: string;
    title: string;
    rating: number;
    created_at: string;
    destination: {
      name: string;
    };
  }>;
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

export default function AdminUserDetail() {
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`);

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setError("Gagal memuat detail pengguna");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Terjadi kesalahan saat memuat pengguna");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert("Status pengguna berhasil diperbarui!");
        fetchUser();
      } else {
        const error = await response.json();
        alert(`Gagal memperbarui status: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Terjadi kesalahan saat memperbarui status pengguna");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleUpdate = async (newRole: string) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        alert("Role pengguna berhasil diperbarui!");
        fetchUser();
      } else {
        const error = await response.json();
        alert(`Gagal memperbarui role: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Terjadi kesalahan saat memperbarui role pengguna");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (hardDelete: boolean = false) => {
    const confirmMessage = hardDelete
      ? "PERINGATAN: Ini akan menghapus pengguna secara permanen. Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin?"
      : "Apakah Anda yakin ingin menonaktifkan pengguna ini?";

    if (!confirm(confirmMessage)) return;

    try {
      setActionLoading(true);
      const url = `/api/admin/users/${userId}${hardDelete ? "?hard=true" : ""}`;
      const response = await fetch(url, {
        method: "DELETE",
      });

      if (response.ok) {
        alert(hardDelete ? "Pengguna berhasil dihapus permanen!" : "Pengguna berhasil dinonaktifkan!");
        window.location.href = "/admin/users";
      } else {
        const error = await response.json();
        alert(`Gagal menghapus pengguna: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Terjadi kesalahan saat menghapus pengguna");
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
            <p>Memuat detail pengguna...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error || "Pengguna tidak ditemukan"}</p>
          <Link href="/admin/users">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Kelola Pengguna
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Detail Pengguna</h1>
            <p className="text-sm text-gray-600">Kelola detail dan aktivitas pengguna</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* User Profile */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profil Pengguna
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.email_verified && (
                      <Badge variant="outline" className="mt-1">
                        Email Terverifikasi
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Role:</span>
                    <Badge variant={getRoleColor(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant={getStatusColor(user.status)}>
                      {getStatusDisplayName(user.status)}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Bergabung: {new Date(user.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                  {user.last_login && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Login terakhir: {new Date(user.last_login).toLocaleDateString('id-ID')}</span>
                    </div>
                  )}
                </div>

                {user.bio && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Bio</h4>
                      <p className="text-sm text-gray-600">{user.bio}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ubah Status</label>
                  <Select onValueChange={handleStatusUpdate} disabled={actionLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
                      <SelectItem value="suspended">Ditangguhkan</SelectItem>
                      <SelectItem value="banned">Diblokir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Ubah Role</label>
                  <Select onValueChange={handleRoleUpdate} disabled={actionLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(false)}
                    disabled={actionLoading}
                    className="w-full"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Nonaktifkan
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={actionLoading}
                        className="w-full"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus Permanen
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Pengguna Permanen</AlertDialogTitle>
                        <AlertDialogDescription>
                          PERINGATAN: Tindakan ini tidak dapat dibatalkan. Semua data pengguna akan dihapus secara permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(true)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Hapus Permanen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">{user.trip_count}</div>
                  <div className="text-sm text-gray-600">Trips</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">{user.review_count}</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                  <div className="text-2xl font-bold">{user.average_rating?.toFixed(1) || "-"}</div>
                  <div className="text-sm text-gray-600">Rating Rata-rata</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold">
                    {Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm text-gray-600">Hari Bergabung</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Trips */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                {user.recent_trips.length > 0 ? (
                  <div className="space-y-3">
                    {user.recent_trips.map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{trip.title}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(trip.created_at).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <Badge variant="outline">{trip.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Belum ada trip</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Review Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                {user.recent_reviews.length > 0 ? (
                  <div className="space-y-3">
                    {user.recent_reviews.map((review) => (
                      <div key={review.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{review.title}</h4>
                          <p className="text-sm text-gray-600">
                            {review.destination.name} • {new Date(review.created_at).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{review.rating}</span>
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Belum ada review</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}