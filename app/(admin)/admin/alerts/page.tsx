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
import {
  AlertTriangle,
  AlertCircle,
  Info,
  XCircle,
  RefreshCw,
  Eye,
  CheckCircle,
  ExternalLink,
  User,
  MapPin,
  MessageSquare
} from "lucide-react";

interface AlertItem {
  id: string;
  type: "spam_review" | "suspicious_user" | "low_rating";
  severity: "low" | "medium" | "high" | "critical";
  status: "pending" | "acknowledged" | "resolved";
  title: string;
  description: string;
  entityId: string;
  entityType: "review" | "user" | "destination";
  entityTitle?: string;
  metadata: {
    userId?: string;
    userName?: string;
    destinationId?: string;
    destinationName?: string;
    reviewId?: string;
    reviewContent?: string;
    rating?: number;
    threshold?: number;
    count?: number;
  };
  created_at: string;
  updated_at: string;
}

const getSeverityDisplayName = (severity: string): string => {
  switch (severity) {
    case "low": return "Rendah";
    case "medium": return "Sedang";
    case "high": return "Tinggi";
    case "critical": return "Kritis";
    default: return severity;
  }
};

const getSeverityColor = (severity: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (severity) {
    case "low": return "secondary";
    case "medium": return "outline";
    case "high": return "default";
    case "critical": return "destructive";
    default: return "outline";
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "low": return <Info className="h-4 w-4" />;
    case "medium": return <AlertCircle className="h-4 w-4" />;
    case "high": return <AlertTriangle className="h-4 w-4" />;
    case "critical": return <XCircle className="h-4 w-4" />;
    default: return <Info className="h-4 w-4" />;
  }
};

const getTypeDisplayName = (type: string): string => {
  switch (type) {
    case "spam_review": return "Review Spam";
    case "suspicious_user": return "Pengguna Mencurigakan";
    case "low_rating": return "Rating Rendah";
    default: return type;
  }
};

const getTypeColor = (type: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (type) {
    case "spam_review": return "outline";
    case "suspicious_user": return "destructive";
    case "low_rating": return "secondary";
    default: return "outline";
  }
};

const getStatusDisplayName = (status: string): string => {
  switch (status) {
    case "pending": return "Menunggu";
    case "acknowledged": return "Diakui";
    case "resolved": return "Diselesaikan";
    default: return status;
  }
};

const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "pending": return "outline";
    case "acknowledged": return "default";
    case "resolved": return "secondary";
    default: return "outline";
  }
};

const getEntityIcon = (entityType: string) => {
  switch (entityType) {
    case "review": return <MessageSquare className="h-4 w-4" />;
    case "user": return <User className="h-4 w-4" />;
    case "destination": return <MapPin className="h-4 w-4" />;
    default: return <AlertCircle className="h-4 w-4" />;
  }
};

export default function AdminAlertsPage() {
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
  } = useAdminList<AlertItem>({
    endpoint: "/api/admin/alerts",
    searchFields: ["title", "description", "entityTitle"],
    pageSize: 10,
  });

  const handleAcknowledge = async (alertId: string) => {
    try {
      await put(`/api/admin/alerts/${alertId}/acknowledge`, undefined, { auth: "required" });
      alert("Alert berhasil diakui!");
      refresh();
    } catch (error) {
      console.error("Error acknowledging alert:", error);
      alert("Terjadi kesalahan saat mengakui alert");
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      await put(`/api/admin/alerts/${alertId}/resolve`, undefined, { auth: "required" });
      alert("Alert berhasil diselesaikan!");
      refresh();
    } catch (error) {
      console.error("Error resolving alert:", error);
      alert("Terjadi kesalahan saat menyelesaikan alert");
    }
  };

  const getEntityLink = (alert: AlertItem) => {
    switch (alert.entityType) {
      case "review":
        return `/admin/reviews/${alert.entityId}`;
      case "user":
        return `/admin/users/${alert.entityId}`;
      case "destination":
        return `/admin/destinations/${alert.entityId}`;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Alerts & Notifikasi</h1>
          <p className="text-sm text-gray-600">Sistem deteksi otomatis untuk masalah yang memerlukan perhatian.</p>
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
          <CardDescription>Filter alerts berdasarkan status, tipe atau severity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-3 items-end">
            <div className="w-full lg:w-80">
              <Input
                placeholder="Cari judul, deskripsi atau nama entitas..."
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
                <SelectItem value="acknowledged">Diakui</SelectItem>
                <SelectItem value="resolved">Diselesaikan</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => setFilter("type", v === "all" ? undefined : v)}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="spam_review">Review Spam</SelectItem>
                <SelectItem value="suspicious_user">Pengguna Mencurigakan</SelectItem>
                <SelectItem value="low_rating">Rating Rendah</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => setFilter("severity", v === "all" ? undefined : v)}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="low">Rendah</SelectItem>
                <SelectItem value="medium">Sedang</SelectItem>
                <SelectItem value="high">Tinggi</SelectItem>
                <SelectItem value="critical">Kritis</SelectItem>
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
          <CardTitle>Alert Sistem</CardTitle>
          <CardDescription>
            {loading ? "Memuat..." : `${meta ? meta.total : items.length} alert`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Severity</TableHead>
                  <TableHead className="text-center">Tipe</TableHead>
                  <TableHead>Judul & Deskripsi</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Entitas</TableHead>
                  <TableHead className="text-center hidden lg:table-cell">Waktu</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getSeverityIcon(alert.severity)}
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {getSeverityDisplayName(alert.severity)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getTypeColor(alert.type)}>
                        {getTypeDisplayName(alert.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                        {alert.metadata && (
                          <div className="text-xs text-gray-500 mt-1">
                            {alert.metadata.userName && `User: ${alert.metadata.userName}`}
                            {alert.metadata.destinationName && ` • Destinasi: ${alert.metadata.destinationName}`}
                            {alert.metadata.rating && ` • Rating: ${alert.metadata.rating}⭐`}
                            {alert.metadata.count && ` • Count: ${alert.metadata.count}`}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusColor(alert.status)}>
                        {getStatusDisplayName(alert.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      <div className="flex items-center justify-center gap-2">
                        {getEntityIcon(alert.entityType)}
                        <span className="text-sm">{alert.entityTitle || alert.entityId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden lg:table-cell text-sm text-gray-600">
                      {new Date(alert.created_at).toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getEntityLink(alert) && (
                          <Link href={getEntityLink(alert)!}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        {alert.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                            onClick={() => handleAcknowledge(alert.id)}
                            title="Akui Alert"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {alert.status !== "resolved" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                            onClick={() => handleResolve(alert.id)}
                            title="Selesaikan Alert"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
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