"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import {
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  MessageSquare,
  Trash2,
  Phone,
  Mail,
  Edit
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { get, patch, del } from "@/lib/api";

interface UserDetail {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  bio?: string;
  avatar_url?: string;
  gender?: string;
  status: "active" | "inactive" | "suspended" | "banned";
  email_verified: boolean;
  email_verified_at?: string;
  last_login_at?: string;
  preferences?: Record<string, unknown>;
  social_links?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  role: {
    id: string;
    name: string;
    description: string;
  };
  tripPlansCount: number;
  reviewsCount: number;
}

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
      const result = await get<UserDetail>(`/api/admin/users/${userId}`, { auth: "required" });
      setUser(result.data);
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
      await patch(`/api/admin/users/${userId}`, { status: newStatus }, { auth: "required" });
      alert(`Status pengguna berhasil diubah menjadi ${getStatusDisplayName(newStatus)}!`);
      fetchUser();
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Terjadi kesalahan saat memperbarui status pengguna");
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
      await del(url, { auth: "required" });
      alert(hardDelete ? "Pengguna berhasil dihapus permanen!" : "Pengguna berhasil dinonaktifkan!");
      window.location.href = "/admin/users";
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
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/admin/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Kelola Pengguna
            </Button>
          </Link>
        </div>
        {/* Header Section */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={`${user.first_name} ${user.last_name}`.trim()}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{`${user.first_name} ${user.last_name}`.trim() || 'Unknown User'}</h1>
                <p className="text-gray-600 mb-2">{user.email}</p>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={getStatusColor(user.status)} className="text-xs">
                    {getStatusDisplayName(user.status)}
                  </Badge>
                  {user.email_verified && (
                    <Badge variant="outline" className="text-xs">
                      ✓ Email Terverifikasi
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Bergabung {new Date(user.created_at).toLocaleDateString('id-ID')}</span>
                  {user.last_login_at && (
                    <>
                      <span>•</span>
                      <span>Login terakhir {new Date(user.last_login_at).toLocaleDateString('id-ID')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select onValueChange={handleStatusUpdate} disabled={actionLoading}>
                <SelectTrigger className="w-36 h-9">
                  <Edit className="h-3 w-3 mr-2" />
                  <SelectValue placeholder="Ubah Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active" disabled={user.status === 'active'}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Aktif
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive" disabled={user.status === 'inactive'}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      Tidak Aktif
                    </div>
                  </SelectItem>
                  <SelectItem value="suspended" disabled={user.status === 'suspended'}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      Ditangguhkan
                    </div>
                  </SelectItem>
                  <SelectItem value="banned" disabled={user.status === 'banned'}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Diblokir
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={actionLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
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
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{typeof user.tripPlansCount === 'number' ? user.tripPlansCount : 0}</div>
                <div className="text-sm text-gray-600">Total Perjalanan</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{typeof user.reviewsCount === 'number' ? user.reviewsCount : 0}</div>
                <div className="text-sm text-gray-600">Total Review</div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Detail</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Tanggal Lahir</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString('id-ID') : '-'}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Jenis Kelamin</label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {user.gender ? (user.gender === 'male' ? 'Laki-laki' : user.gender === 'female' ? 'Perempuan' : user.gender) : '-'}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{user.phone || '-'}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email Diverifikasi</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {user.email_verified_at ? new Date(user.email_verified_at).toLocaleDateString('id-ID') : 'Belum diverifikasi'}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <p className="text-sm text-gray-600 mt-1">{user.bio || 'Tidak ada bio'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}