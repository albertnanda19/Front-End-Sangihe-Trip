"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface ArticleFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  featured_image?: string;
}

const categories = [
  { value: "travel_tips", label: "Tips Perjalanan" },
  { value: "destination_guide", label: "Panduan Destinasi" },
  { value: "culture", label: "Budaya" },
  { value: "food", label: "Makanan" },
  { value: "adventure", label: "Petualangan" },
  { value: "news", label: "Berita" },
];

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    featured_image: "",
  });

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({ ...prev, title }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="min-h-screen bg-gray-50 p-6">
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

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Artikel</CardTitle>
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
                {formData.excerpt.length}/300 karakter
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
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/articles">
            <Button type="button" variant="outline">
              Batal
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Membuat..." : "Buat Artikel"}
          </Button>
        </div>
      </form>
    </div>
  );
}
