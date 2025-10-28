"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { get, put } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit2, FileText, EyeOff } from "lucide-react";
import Link from "next/link";

interface ArticleDetail {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: "draft" | "published" | "archived";
  featured_image?: string;
  tags: string[];
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

export default function ArticleViewPage() {
  const params = useParams();
  const articleId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<ArticleDetail | null>(null);

  const fetchArticle = useCallback(async () => {
    try {
      const response = await get<ArticleDetail>(`/api/admin/articles/${articleId}`, { auth: "required" });
      setArticle(response.data);
    } catch (error) {
      console.error("Error fetching article:", error);
      alert("Terjadi kesalahan saat memuat artikel");
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  const handlePublish = async () => {
    try {
      await put(`/api/admin/articles/${articleId}/publish`, {}, { auth: "required" });
      alert("Artikel berhasil dipublikasikan!");
      fetchArticle();
    } catch (error) {
      console.error("Error publishing article:", error);
      alert("Terjadi kesalahan saat mempublikasikan artikel");
    }
  };

  const handleUnpublish = async () => {
    try {
      await put(`/api/admin/articles/${articleId}/unpublish`, {}, { auth: "required" });
      alert("Artikel berhasil tidak dipublikasikan!");
      fetchArticle();
    } catch (error) {
      console.error("Error unpublishing article:", error);
      alert("Terjadi kesalahan saat tidak mempublikasikan artikel");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat artikel...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center">
          <p className="text-gray-600">Artikel tidak ditemukan.</p>
          <Link href="/admin/articles">
            <Button className="mt-4">Kembali ke Daftar Artikel</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/articles">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Detail Artikel</h1>
            <p className="text-sm text-gray-600">Lihat detail artikel.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusColor(article.status)}>
            {getStatusDisplayName(article.status)}
          </Badge>
          <Link href={`/admin/articles/${articleId}/edit`}>
            <Button variant="default">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          {article.status === "draft" && (
            <Button onClick={handlePublish} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Publikasikan
            </Button>
          )}
          {article.status === "published" && (
            <Button onClick={handleUnpublish} variant="outline">
              <EyeOff className="h-4 w-4 mr-2" />
              Tidak Publikasikan
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Artikel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Penulis</Label>
                <p className="text-sm text-gray-600">{article.author.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Kategori</Label>
                <p className="text-sm text-gray-600">{getCategoryDisplayName(article.category)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Jumlah View</Label>
                <p className="text-sm text-gray-600">{(article.view_count || 0).toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Dibuat</Label>
                <p className="text-sm text-gray-600">
                  {article.created_at ? new Date(article.created_at).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  }) : "-"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Terakhir Diupdate</Label>
                <p className="text-sm text-gray-600">
                  {article.updated_at ? new Date(article.updated_at).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  }) : "-"}
                </p>
              </div>
              {article.published_at && (
                <div>
                  <Label className="text-sm font-medium">Dipublikasikan</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(article.published_at).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {article.featured_image && (
            <Card>
              <CardHeader>
                <CardTitle>Gambar Featured</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Konten Artikel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Judul</Label>
                <h2 className="text-2xl font-bold mt-1">{article.title}</h2>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Excerpt</Label>
                <p className="text-gray-700 mt-1 leading-relaxed">{article.excerpt}</p>
              </div>

              <div className="pt-4 border-t">
                <Label className="text-sm font-medium text-gray-500">Konten Artikel</Label>
                <div className="mt-3 p-6 bg-white rounded-lg border border-gray-200">
                  <div className="prose prose-sm md:prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {article.content}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}