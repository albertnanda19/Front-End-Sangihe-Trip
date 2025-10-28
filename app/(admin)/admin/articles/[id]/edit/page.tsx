"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { get, put } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, FileText, EyeOff, Eye } from "lucide-react";
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

const categories = [
  { value: "travel_tips", label: "Tips Perjalanan" },
  { value: "destination_guide", label: "Panduan Destinasi" },
  { value: "culture", label: "Budaya" },
  { value: "food", label: "Makanan" },
  { value: "adventure", label: "Petualangan" },
  { value: "news", label: "Berita" },
];

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

export default function EditArticlePage() {
  const params = useParams();
  const articleId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    featured_image: "",
  });

  const fetchArticle = useCallback(async () => {
    try {
      const response = await get<ArticleDetail>(`/api/admin/articles/${articleId}`, { auth: "required" });
      setArticle(response.data);
      setFormData({
        title: response.data.title,
        excerpt: response.data.excerpt,
        content: response.data.content,
        category: response.data.category,
        featured_image: response.data.featured_image || "",
      });
    } catch (error) {
      console.error("Error fetching article:", error);
      alert("Terjadi kesalahan saat memuat artikel");
    } finally {
      setFetchLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({ ...prev, title }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await put(`/api/admin/articles/${articleId}`, formData, { auth: "required" });

      alert("Artikel berhasil diperbarui!");
      fetchArticle();
    } catch (error) {
      console.error("Error updating article:", error);
      alert("Terjadi kesalahan saat memperbarui artikel");
    } finally {
      setLoading(false);
    }
  };

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

  if (fetchLoading) {
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
          <Link href={`/admin/articles/${articleId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Artikel</h1>
            <p className="text-sm text-gray-600">Edit detail artikel.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusColor(article.status)}>
            {getStatusDisplayName(article.status)}
          </Badge>
          <Link href={`/admin/articles/${articleId}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </Link>
          {article.status === "draft" && (
            <Button onClick={handlePublish} variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Publikasikan
            </Button>
          )}
          {article.status === "published" && (
            <Button onClick={handleUnpublish} variant="outline" size="sm">
              <EyeOff className="h-4 w-4 mr-2" />
              Tidak Publikasikan
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Artikel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Artikel *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Masukkan judul artikel"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Ringkasan singkat artikel (max 300 karakter)"
                rows={3}
                maxLength={300}
                required
              />
              <div className="text-sm text-gray-500">
                {(formData.excerpt || "").length}/300 karakter
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Konten *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Tulis konten artikel di sini..."
                rows={20}
                required
              />
              <div className="text-sm text-gray-500">
                Gunakan format Markdown untuk styling teks.
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="featured_image">Gambar Featured (URL)</Label>
              <Input
                id="featured_image"
                type="url"
                value={formData.featured_image}
                onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href={`/admin/articles/${articleId}`}>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
