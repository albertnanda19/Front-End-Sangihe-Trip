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
  CheckCircle,
  XCircle,
  Edit,
  User,
  MessageSquare,
  RefreshCw,
  Clock,
  Shield
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "user_registration" | "review" | "system" | "backup" | "login" | "failed_login" | "admin_action";
  userId?: string;
  userName?: string;
  action?: string;
  metadata?: Record<string, string | number | boolean>;
  createdAt: string;
}

const getTypeDisplayName = (type: string): string => {
  switch (type) {
    case "user_registration": return "Pendaftaran Pengguna";
    case "review": return "Review";
    case "system": return "Sistem";
    case "backup": return "Backup";
    case "login": return "Login";
    case "failed_login": return "Login Gagal";
    case "admin_action": return "Aksi Admin";
    default: return type;
  }
};

const getTypeColor = (type: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (type) {
    case "user_registration": return "secondary";
    case "review": return "default";
    case "system": return "outline";
    case "backup": return "secondary";
    case "login": return "default";
    case "failed_login": return "destructive";
    case "admin_action": return "outline";
    default: return "outline";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "user_registration": return <User className="h-4 w-4" />;
    case "review": return <MessageSquare className="h-4 w-4" />;
    case "system": return <Shield className="h-4 w-4" />;
    case "backup": return <RefreshCw className="h-4 w-4" />;
    case "login": return <CheckCircle className="h-4 w-4" />;
    case "failed_login": return <XCircle className="h-4 w-4" />;
    case "admin_action": return <Edit className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const formatActivityDescription = (activity: ActivityItem): string => {
  const type = getTypeDisplayName(activity.type);
  let description = type;

  if (activity.userName) {
    description += ` oleh ${activity.userName}`;
  }

  if (activity.action) {
    description += ` - ${activity.action}`;
  }

  // Add metadata details if available
  if (activity.metadata) {
    const metaKeys = Object.keys(activity.metadata);
    if (metaKeys.length > 0) {
      const metaStr = metaKeys.map(key => `${key}: ${activity.metadata![key]}`).join(', ');
      description += ` (${metaStr})`;
    }
  }

  return description;
};

export default function AdminActivitiesPage() {
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
  } = useAdminList<ActivityItem>({
    endpoint: "/api/admin/activities",
    searchFields: ["userName", "action"],
    pageSize: 50,
    enableClientSideFiltering: false,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Aktivitas Admin</h1>
          <p className="text-sm text-gray-600">Log aktivitas dan perubahan yang dilakukan admin.</p>
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
          <CardDescription>Filter aktivitas berdasarkan tipe aktivitas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-3 items-end">
            <div className="flex-1">
              <Input
                placeholder="Cari nama pengguna atau aksi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select onValueChange={(v) => setFilter("type", v === "all" ? undefined : v)}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Tipe Aktivitas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="user_registration">Pendaftaran Pengguna</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="system">Sistem</SelectItem>
                <SelectItem value="backup">Backup</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="failed_login">Login Gagal</SelectItem>
                <SelectItem value="admin_action">Aksi Admin</SelectItem>
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
          <CardTitle>Log Aktivitas</CardTitle>
          <CardDescription>
            {loading ? "Memuat..." : `${meta ? meta.totalItems : items.length} aktivitas`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Tipe</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Pengguna</TableHead>
                  <TableHead className="text-center hidden lg:table-cell">Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getTypeIcon(activity.type)}
                        <Badge variant={getTypeColor(activity.type)}>
                          {getTypeDisplayName(activity.type)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm font-medium">
                          {formatActivityDescription(activity)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      <div className="text-sm">
                        {activity.userName || "System"}
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden lg:table-cell text-sm text-gray-600">
                      {new Date(activity.createdAt).toLocaleString('id-ID')}
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