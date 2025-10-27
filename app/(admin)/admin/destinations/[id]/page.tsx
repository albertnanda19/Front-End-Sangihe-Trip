"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { get, patch } from "@/lib/api";
import ImageUploader, { ImageDto } from "@/components/admin/image-uploader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiError } from "@/lib/api";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/admin/map-component"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-200 flex items-center justify-center">Loading map...</div>
});

const categoryMap: Record<string, string> = {
  "Pantai": "beach",
  "Kuliner": "culinary",
  "Alam": "nature",
  "Budaya": "cultural",
};

const reverseCategoryMap: Record<string, string> = {
  "beach": "Pantai",
  "culinary": "Kuliner",
  "nature": "Alam",
  "cultural": "Budaya",
};

export default function DestinationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const id = resolvedParams?.id;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [entryFee, setEntryFee] = useState<string>("");
  const [facilities, setFacilities] = useState<string[]>([]);
  const [images, setImages] = useState<{ url: string; alt?: string }[]>([]);
  const [published, setPublished] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await get(`/api/admin/destinations/${id}`, { auth: "required" });
        const data = res.data as Record<string, unknown> | undefined;
        if (!data) throw new Error("No data returned");
        setName((data?.name as string) ?? "");
        setDescription((data?.description as string) ?? "");
        setAddress((data?.address as string) ?? "");
        setLat(typeof data?.latitude === 'number' ? data.latitude : null);
        setLng(typeof data?.longitude === 'number' ? data.longitude : null);
        setPhone((data?.phone as string) ?? "");
        setEmail((data?.email as string) ?? "");
        setWebsite((data?.website as string) ?? "");
        setOpeningHours((data?.opening_hours as string) ?? "");
        setEntryFee(data?.entry_fee ? String(data.entry_fee) : "");
        const categoryValue = reverseCategoryMap[data?.category as string] || (data?.category as string) || "";
        setCategory(categoryValue);
        const facs = (data?.facilities as unknown) ?? [];
        setFacilities(Array.isArray(facs) ? facs as string[] : []);
        const imgs = (data?.images as unknown) ?? [];
        setImages(Array.isArray(imgs) ? (imgs as unknown[]).map((i) => {
          const it = i as Record<string, unknown>;
          return { url: String(it?.image_url ?? ""), alt: String(it?.alt_text ?? "") };
        }) : []);
        setPublished(Boolean(data?.status === 'active'));
      } catch (err: unknown) {
        if (err instanceof ApiError) setError(err.message);
        else setError((err as Error)?.message ?? "Gagal memuat destinasi");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        name,
        description,
        address,
        latitude: lat,
        longitude: lng,
        phone,
        email,
        website,
        opening_hours: openingHours,
        entry_fee: entryFee ? Number(entryFee) : undefined,
        categories: [categoryMap[category] || category],
        facilities,
        images: images.map((i) => ({ image_url: i.url, alt: i.alt })),
        published: Boolean(published),
      };

      await patch(`/api/admin/destinations/${id}`, body, { auth: "required" });
      alert("Perubahan disimpan");
    } catch (err: unknown) {
      alert((err as Error)?.message ?? "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const toggleFacility = (facility: string) => {
    setFacilities(prev =>
      prev.includes(facility)
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-3">Edit Destinasi</h1>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        <Card>
          <CardHeader>
            <CardTitle>Detail Destinasi</CardTitle>
            <CardDescription>Edit informasi dasar dan status.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Nama</label>
                <Input value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pantai">Pantai</SelectItem>
                    <SelectItem value="Kuliner">Kuliner</SelectItem>
                    <SelectItem value="Alam">Alam</SelectItem>
                    <SelectItem value="Budaya">Budaya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <Textarea value={description} onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)} rows={6} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lokasi</label>
                <div className="space-y-2">
                  <Input value={address} onChange={(e) => setAddress((e.target as HTMLInputElement).value)} placeholder="Alamat" />
                  <div className="h-64">
                    <Suspense fallback={<div className="h-full w-full bg-gray-200 flex items-center justify-center">Loading map...</div>}>
                      <MapComponent
                        lat={lat}
                        lng={lng}
                        setLat={setLat}
                        setLng={setLng}
                        setAddress={setAddress}
                      />
                    </Suspense>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={lat?.toString() || ""} readOnly placeholder="Latitude" />
                    <Input value={lng?.toString() || ""} readOnly placeholder="Longitude" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input value={phone} onChange={(e) => setPhone((e.target as HTMLInputElement).value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input value={email} onChange={(e) => setEmail((e.target as HTMLInputElement).value)} type="email" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website</label>
                  <Input value={website} onChange={(e) => setWebsite((e.target as HTMLInputElement).value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Opening Hours</label>
                <Input value={openingHours} onChange={(e) => setOpeningHours((e.target as HTMLInputElement).value)} placeholder="08:00-18:00" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Entry Fee</label>
                <Input value={entryFee} onChange={(e) => setEntryFee((e.target as HTMLInputElement).value)} type="number" placeholder="10000" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Facilities</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="toilet"
                      checked={facilities.includes("toilet")}
                      onChange={() => toggleFacility("toilet")}
                      className="rounded"
                    />
                    <label htmlFor="toilet" className="text-sm">Toilet</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="parking"
                      checked={facilities.includes("parking")}
                      onChange={() => toggleFacility("parking")}
                      className="rounded"
                    />
                    <label htmlFor="parking" className="text-sm">Parkir</label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Images</label>
                <ImageUploader
                  onUploaded={(img: ImageDto) => setImages((prev) => [...prev, { url: img.url, alt: img.alt }])}
                  multiple={true}
                  existingImages={images}
                  onRemoveExisting={(index) => setImages((prev) => prev.filter((_, i) => i !== index))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Published</label>
                <label className="inline-flex items-center">
                  <input type="checkbox" checked={published} onChange={(e) => setPublished((e.target as HTMLInputElement).checked)} className="mr-2" />
                  <span className="text-sm">Published</span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</Button>
                <Button variant="ghost" onClick={() => router.push("/admin/destinations")}>Kembali</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
