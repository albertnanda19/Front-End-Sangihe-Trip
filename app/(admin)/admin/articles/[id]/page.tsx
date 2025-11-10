"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { get, put, patch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit2, FileText, EyeOff, Check, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ArticleStatus = "draft" | "published";

interface ArticleDetail {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  status: ArticleStatus;
  featuredImage?: string;
  viewCount: number;
  readingTime: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
}

const getStatusDisplayName = (status: ArticleStatus): string => {
  switch (status) {
    case "draft": return "Draft";
    case "published": return "Dipublikasikan";
    default: return status;
  }
};

const getStatusColor = (status: ArticleStatus): "default" | "secondary" => {
  switch (status) {
    case "draft": return "secondary";
    case "published": return "default";
    default: return "secondary";
  }
};

const getCategoryDisplayName = (category: string): string => {
  switch (category) {
    case "tips": return "Tips";
    case "guide": return "Panduan";
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
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    featuredImage: "",
  });

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

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        excerpt: article.excerpt || "",
        content: article.content,
        category: article.category,
        featuredImage: article.featuredImage || "",
      });
    }
  }, [article]);

  const handleSave = async () => {
    const errors: {[key: string]: string} = {};
    if (formData.content.length < 50) {
      errors.content = "Konten artikel harus minimal 50 karakter";
    }
    if (formData.title.trim().length === 0) {
      errors.title = "Judul artikel wajib diisi";
    }
    if (formData.excerpt.trim().length === 0) {
      errors.excerpt = "Excerpt wajib diisi";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSaving(true);
    try {
      if (!article) {
        alert("Data artikel tidak tersedia");
        return;
      }

      const changedFields: Partial<typeof formData> = {};
      
      if (formData.title !== article.title) changedFields.title = formData.title;
      if (formData.excerpt !== (article.excerpt || "")) changedFields.excerpt = formData.excerpt;
      if (formData.content !== article.content) changedFields.content = formData.content;
      if (formData.category !== article.category) changedFields.category = formData.category;
      if (formData.featuredImage !== (article.featuredImage || "")) changedFields.featuredImage = formData.featuredImage;

      if (Object.keys(changedFields).length === 0) {
        setIsEditing(false);
        return;
      }

      await patch(`/api/admin/articles/${articleId}`, changedFields, { auth: "required" });
      alert("Artikel berhasil diperbarui!");
      setIsEditing(false);
      fetchArticle();
    } catch (error) {
      console.error("Error updating article:", error);
      alert("Terjadi kesalahan saat memperbarui artikel");
    } finally {
      setSaving(false);
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
    <div className="min-h-screen bg-gray-50 px-6">
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
          {isEditing ? (
            <>
              <Button onClick={handleSave} disabled={saving}>
                <Check className="h-4 w-4 mr-2" />
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Batal
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {article.status === "draft" && !isEditing && (
            <Button onClick={handlePublish} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Publikasikan
            </Button>
          )}
          {article.status === "published" && !isEditing && (
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
                <p className="text-sm text-gray-600">{`${article.author.firstName} ${article.author.lastName}`.trim() || 'Unknown'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Kategori</Label>
                <p className="text-sm text-gray-600">{getCategoryDisplayName(article.category)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Waktu Baca</Label>
                <p className="text-sm text-gray-600">{article.readingTime} menit baca</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Jumlah View</Label>
                <p className="text-sm text-gray-600">{(article.viewCount || 0).toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Dibuat</Label>
                <p className="text-sm text-gray-600">
                  {article.createdAt ? new Date(article.createdAt).toLocaleString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  }) : "-"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Terakhir Diupdate</Label>
                <p className="text-sm text-gray-600">
                  {article.updatedAt ? new Date(article.updatedAt).toLocaleString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  }) : "-"}
                </p>
              </div>
              {article.publishedAt && (
                <div>
                  <Label className="text-sm font-medium">Dipublikasikan</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(article.publishedAt).toLocaleString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {article.featuredImage && (
            <Card>
              <CardHeader>
                <CardTitle>Gambar Featured</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  width={400}
                  height={200}
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
              {isEditing ? (
                <>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Judul</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, title: e.target.value }));
                        if (formErrors.title) setFormErrors(prev => ({ ...prev, title: "" }));
                      }}
                      className="mt-1"
                    />
                    {formErrors.title && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Kategori</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tips">Tips</SelectItem>
                        <SelectItem value="guide">Panduan</SelectItem>
                        <SelectItem value="culture">Budaya</SelectItem>
                        <SelectItem value="food">Makanan</SelectItem>
                        <SelectItem value="adventure">Petualangan</SelectItem>
                        <SelectItem value="news">Berita</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Excerpt</Label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, excerpt: e.target.value }));
                        if (formErrors.excerpt) setFormErrors(prev => ({ ...prev, excerpt: "" }));
                      }}
                      rows={3}
                      className="mt-1"
                    />
                    {formErrors.excerpt && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.excerpt}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Konten Artikel</Label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, content: e.target.value }));
                        if (formErrors.content) setFormErrors(prev => ({ ...prev, content: "" }));
                      }}
                      rows={20}
                      className="mt-1"
                    />
                    {formErrors.content && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>
                    )}
                    <div className="text-sm text-gray-500 mt-1">
                      Minimal 50 karakter. Saat ini: {formData.content.length} karakter.
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Gambar Featured (URL)</Label>
                    <Input
                      type="url"
                      value={formData.featuredImage}
                      onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                      className="mt-1"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Judul</Label>
                    <h2 className="text-2xl font-bold mt-1">{article.title}</h2>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Excerpt</Label>
                    <p className="text-gray-700 mt-1 leading-relaxed">{article.excerpt || ""}</p>
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
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}