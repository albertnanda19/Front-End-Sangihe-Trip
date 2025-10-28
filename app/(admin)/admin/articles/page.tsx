"use client";

import { useAdminList } from "@/hooks/admin/use-admin-list";
import { del, put } from "@/lib/api";
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
import { Eye, Edit, Trash2, RefreshCw, Plus, FileText, EyeOff } from "lucide-react";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  status: "draft" | "published" | "archived";
  featured_image?: string;
  view_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

const getStatusDisplayName = (status: string): string => {
  switch (status) {
    case "draft": return "Draft";
    case "published": return "Dipublikasikan";
    case "archived": return "Diarsipkan";
    default: return status;
  }
};

const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "draft": return "secondary";
    case "published": return "default";
    case "archived": return "outline";
    default: return "outline";
  }
};

const getCategoryDisplayName = (category: string): string => {
  switch (category) {
    case "travel_tips": return "Tips Perjalanan";
    case "destination_guide": return "Panduan Destinasi";
    case "culture": return "Budaya";
    case "food": return "Makanan";
    case "adventure": return "Petualangan";
    case "news": return "Berita";
    default: return category;
  }
};

export default function AdminArticlesList() {
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
  } = useAdminList<ArticleItem>({
    endpoint: "/api/admin/articles",
    searchFields: ["title", "excerpt"],
    pageSize: 20,
    enableClientSideFiltering: false,
  });

  const handleDelete = async (articleId: string, permanent: boolean = false) => {
    const confirmMessage = permanent
      ? "Apakah Anda yakin ingin menghapus artikel ini secara permanen? Tindakan ini tidak dapat dibatalkan."
      : "Apakah Anda yakin ingin menghapus artikel ini?";

    if (!confirm(confirmMessage)) return;

    try {
      await del(`/api/admin/articles/${articleId}${permanent ? "?permanent=true" : ""}`, { auth: "required" });
      alert(permanent ? "Artikel berhasil dihapus secara permanen!" : "Artikel berhasil dihapus!");
      refresh();
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Terjadi kesalahan saat menghapus artikel");
    }
  };

  const handlePublish = async (articleId: string) => {
    try {
      await put(`/api/admin/articles/${articleId}/publish`, {}, { auth: "required" });
      alert("Artikel berhasil dipublikasikan!");
      refresh();
    } catch (error) {
      console.error("Error publishing article:", error);
      alert("Terjadi kesalahan saat mempublikasikan artikel");
    }
  };

  const handleUnpublish = async (articleId: string) => {
    try {
      await put(`/api/admin/articles/${articleId}/unpublish`, {}, { auth: "required" });
      alert("Artikel berhasil tidak dipublikasikan!");
      refresh();
    } catch (error) {
      console.error("Error unpublishing article:", error);
      alert("Terjadi kesalahan saat tidak mempublikasikan artikel");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kelola Artikel</h1>
          <p className="text-sm text-gray-600">Daftar, cari dan kelola artikel konten.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Link href="/admin/articles/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Artikel Baru
            </Button>
          </Link>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Pencarian & Filter</CardTitle>
          <CardDescription>Filter artikel berdasarkan status, kategori atau konten.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-3 items-end">
            <div className="flex-1">
              <Input
                placeholder="Cari judul atau excerpt artikel..."
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Dipublikasikan</SelectItem>
                <SelectItem value="archived">Diarsipkan</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => setFilter("category", v === "all" ? undefined : v)}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="travel_tips">Tips Perjalanan</SelectItem>
                <SelectItem value="destination_guide">Panduan Destinasi</SelectItem>
                <SelectItem value="culture">Budaya</SelectItem>
                <SelectItem value="food">Makanan</SelectItem>
                <SelectItem value="adventure">Petualangan</SelectItem>
                <SelectItem value="news">Berita</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => setFilter("sortBy", v === "default" ? undefined : v)}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="created_at">Tanggal Dibuat</SelectItem>
                <SelectItem value="updated_at">Tanggal Diupdate</SelectItem>
                <SelectItem value="view_count">Jumlah View</SelectItem>
                <SelectItem value="title">Judul</SelectItem>
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
          <CardTitle>Artikel</CardTitle>
          <CardDescription>
            {loading ? "Memuat..." : `${meta ? meta.totalItems : items.length} artikel`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Judul</TableHead>
                  <TableHead className="text-center">Kategori</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Penulis</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Views</TableHead>
                  <TableHead className="text-center hidden lg:table-cell">Dibuat</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium text-sm truncate" title={article.title}>
                          {article.title}
                        </div>
                        {article.excerpt && (
                          <div className="text-xs text-gray-500 truncate mt-1" title={article.excerpt}>
                            {article.excerpt}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">
                        {getCategoryDisplayName(article.category)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusColor(article.status)}>
                        {getStatusDisplayName(article.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      <div className="text-sm">
                        {article.author.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      <div className="text-sm font-medium">
                        {(article.view_count || 0).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden lg:table-cell text-sm text-gray-600">
                      {article.created_at ? new Date(article.created_at).toLocaleDateString('id-ID') : '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/admin/articles/${article.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/articles/${article.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        {/* Publish/Unpublish Actions */}
                        {article.status === "draft" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                            onClick={() => handlePublish(article.id)}
                            title="Publikasikan"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                        {article.status === "published" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
                            onClick={() => handleUnpublish(article.id)}
                            title="Tidak Publikasikan"
                          >
                            <EyeOff className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Delete Action */}
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
                              <AlertDialogTitle>Hapus Artikel</AlertDialogTitle>
                              <AlertDialogDescription>
                                Pilih jenis penghapusan untuk artikel &quot;{article.title}&quot;.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <Button
                                variant="outline"
                                onClick={() => handleDelete(article.id)}
                              >
                                Soft Delete
                              </Button>
                              <AlertDialogAction
                                onClick={() => handleDelete(article.id, true)}
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