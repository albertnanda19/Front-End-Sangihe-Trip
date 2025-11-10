"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/api";
import ImageUploader, { ImageDto } from "@/components/admin/image-uploader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/admin/map-component"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-200 flex items-center justify-center">Loading map...</div>
});

const categoryMap: Record<string, string> = {
  "Alam": "nature",
  "Budaya": "cultural",
  "Petualangan": "adventure",
  "Religi": "religious",
  "Sejarah": "historical",
  "Kuliner": "culinary",
  "Pantai": "beach",
  "Gunung": "mountain",
};

export default function NewDestinationPage() {
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
  const [newFacility, setNewFacility] = useState("");
  const [activities, setActivities] = useState<{ name: string; startTime: string; endTime: string }[]>([]);
  const [images, setImages] = useState<{ url: string; alt?: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
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
        openingHours,
        entryFee: entryFee ? Number(entryFee) : undefined,
        categories: [categoryMap[category] || category],
        facilities,
        activities,
        images: images.map((i) => ({ url: i.url, alt: i.alt })),
      };

      const res = await post("/api/admin/destinations", body, { auth: "required" });
      const created = (res.data as Record<string, unknown> | undefined) ?? undefined;
      const id = (created?.id as string | undefined) ?? undefined;
      if (id) router.push(`/admin/destinations/${id}`);
      else router.push(`/admin/destinations`);
    } catch (err: unknown) {
      alert((err as Error)?.message ?? "Gagal membuat destinasi");
    } finally {
      setSubmitting(false);
    }
  };

  const addFacility = () => {
    if (newFacility.trim() && !facilities.includes(newFacility.trim())) {
      setFacilities(prev => [...prev, newFacility.trim()]);
      setNewFacility("");
    }
  };

  const removeFacility = (facility: string) => {
    setFacilities(prev => prev.filter(f => f !== facility));
  };

  const addActivity = () => {
    setActivities(prev => [...prev, { name: "", startTime: "", endTime: "" }]);
  };

  const updateActivity = (index: number, field: "name" | "startTime" | "endTime", value: string) => {
    setActivities(prev => prev.map((activity, i) => 
      i === index ? { ...activity, [field]: value } : activity
    ));
  };

  const removeActivity = (index: number) => {
    setActivities(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/destinations">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Destinasi Baru</h1>
          <p className="text-sm text-gray-600">Buat Destinasi baru.</p>
        </div>
      </div>
      <div>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Destinasi</label>
                <Input value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} required placeholder="Masukkan nama destinasi" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alam">Alam</SelectItem>
                    <SelectItem value="Budaya">Budaya</SelectItem>
                    <SelectItem value="Petualangan">Petualangan</SelectItem>
                    <SelectItem value="Religi">Religi</SelectItem>
                    <SelectItem value="Sejarah">Sejarah</SelectItem>
                    <SelectItem value="Kuliner">Kuliner</SelectItem>
                    <SelectItem value="Pantai">Pantai</SelectItem>
                    <SelectItem value="Gunung">Gunung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <Textarea value={description} onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)} rows={6} placeholder="Tulis deskripsi destinasi disini..." />
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
                  <label className="block text-sm font-medium mb-1">Telepon</label>
                  <Input value={phone} onChange={(e) => setPhone((e.target as HTMLInputElement).value)} placeholder="Nomor Telepon" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input value={email} onChange={(e) => setEmail((e.target as HTMLInputElement).value)} type="email" placeholder="Email" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website</label>
                  <Input value={website} onChange={(e) => setWebsite((e.target as HTMLInputElement).value)} placeholder="Website" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Waktu Buka</label>
                <Input value={openingHours} onChange={(e) => setOpeningHours((e.target as HTMLInputElement).value)} placeholder="08:00-18:00" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Biaya Masuk</label>
                <Input value={entryFee} onChange={(e) => setEntryFee((e.target as HTMLInputElement).value)} type="number" placeholder="10000" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fasilitas</label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {facilities.map((facility, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-md">
                        <span className="text-sm capitalize">{facility}</span>
                        <button
                          type="button"
                          onClick={() => removeFacility(facility)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={newFacility}
                      onChange={(e) => setNewFacility((e.target as HTMLInputElement).value)}
                      placeholder="Tambah fasilitas baru (contoh: wifi, restaurant)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFacility();
                        }
                      }}
                    />
                    <Button type="button" onClick={addFacility} variant="outline">
                      Tambah
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Tekan Enter atau klik Tambah untuk menambahkan fasilitas. Klik × untuk menghapus.
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Aktivitas</label>
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Aktivitas {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeActivity(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          🗑️ Hapus
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Nama Aktivitas</label>
                        <Input
                          value={activity.name}
                          onChange={(e) => updateActivity(index, "name", e.target.value)}
                          placeholder="Contoh: Snorkeling, Island Hopping"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">Waktu Mulai</label>
                          <Input
                            type="time"
                            value={activity.startTime}
                            onChange={(e) => updateActivity(index, "startTime", e.target.value)}
                            placeholder="09:00"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Waktu Selesai</label>
                          <Input
                            type="time"
                            value={activity.endTime}
                            onChange={(e) => updateActivity(index, "endTime", e.target.value)}
                            placeholder="11:00"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" onClick={addActivity} variant="outline" className="w-full">
                    + Tambah Aktivitas
                  </Button>
                  <p className="text-xs text-gray-500">
                    Aktivitas adalah kegiatan yang tersedia di destinasi ini. User akan memilih dari list ini saat membuat trip plan.
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gambar Destinasi</label>
                <ImageUploader
                  onUploaded={(img: ImageDto) => setImages((prev) => [...prev, { url: img.url }])}
                  multiple={true}
                  existingImages={images}
                  onRemoveExisting={(index) => setImages((prev) => prev.filter((_, i) => i !== index))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit" disabled={submitting}>{submitting ? "Menyimpan..." : "Simpan"}</Button>
                <Button variant="ghost" onClick={() => router.push("/admin/destinations")} disabled={submitting}>Batal</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
