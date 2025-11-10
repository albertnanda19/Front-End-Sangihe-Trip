"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import ImageUploader, { ImageDto } from "@/components/admin/image-uploader";

interface ArticleFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage?: string;
  status: "draft" | "published" | "archived";
}

const categories = [
  { value: "tips", label: "Tips" },
  { value: "guide", label: "Panduan" },
  { value: "culture", label: "Budaya" },
  { value: "food", label: "Makanan" },
  { value: "adventure", label: "Petualangan" },
  { value: "news", label: "Berita" },
];

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    coverImage: "",
    status: "draft",
  });

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({ ...prev, title }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: {[key: string]: string} = {};
    if (formData.title.trim().length < 3) {
      errors.title = "Judul artikel harus minimal 3 karakter";
    }
    if (formData.title.trim().length > 200) {
      errors.title = "Judul artikel maksimal 200 karakter";
    }
    if (formData.content.length < 50) {
      errors.content = "Konten artikel harus minimal 50 karakter";
    }
    if (formData.excerpt.length > 300) {
      errors.excerpt = "Excerpt maksimal 300 karakter";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setLoading(true);

    try {
      const response = await post<{ id: string }>("/api/admin/articles", formData, { auth: "required" });

      alert("Artikel berhasil dibuat!");
      router.push(`/admin/articles/${response.data.id}`);
    } catch (error) {
      console.error("Error creating article:", error);
      alert("Terjadi kesalahan saat membuat artikel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/articles">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Artikel Baru</h1>
          <p className="text-sm text-gray-600">Buat artikel konten baru.</p>
        </div>
      </div>

      <div>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Judul Artikel *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => {
                    handleTitleChange(e.target.value);
                    if (formErrors.title) setFormErrors(prev => ({ ...prev, title: "" }));
                  }}
                  placeholder="Masukkan judul artikel"
                  required
                />
                {formErrors.title && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Kategori *</label>
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

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as ArticleFormData['status'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Excerpt *</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, excerpt: e.target.value }));
                    if (formErrors.excerpt) setFormErrors(prev => ({ ...prev, excerpt: "" }));
                  }}
                  placeholder="Ringkasan singkat artikel (max 300 karakter)"
                  rows={3}
                  maxLength={300}
                  required
                />
                <div className="text-sm text-gray-500 mt-1">
                  {formData.excerpt.length}/300 karakter
                </div>
                {formErrors.excerpt && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.excerpt}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Konten *</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, content: e.target.value }));
                    if (formErrors.content) setFormErrors(prev => ({ ...prev, content: "" }));
                  }}
                  placeholder="Tulis konten artikel di sini..."
                  rows={20}
                  required
                />
                <div className="text-sm text-gray-500 mt-1">
                  Gunakan format Markdown untuk styling teks. Minimal 50 karakter. Saat ini: {formData.content.length} karakter.
                </div>
                {formErrors.content && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gambar Artikel</label>
                <div className="mt-2">
                  <ImageUploader
                    onUploaded={(img: ImageDto) => setFormData(prev => ({ ...prev, coverImage: img.url }))}
                    multiple={false}
                    existingImages={formData.coverImage ? [{ url: formData.coverImage }] : []}
                    onRemoveExisting={() => setFormData(prev => ({ ...prev, coverImage: "" }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Membuat..." : "Buat Artikel"}
                </Button>
                <Button variant="ghost" onClick={() => router.push("/admin/articles")} disabled={loading}>
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
