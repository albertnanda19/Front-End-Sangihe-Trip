"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { get, patch, del } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit2, Check, X, MapPin, Phone, Mail, Globe, Clock, DollarSign, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUploader, { ImageDto } from "@/components/admin/image-uploader";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const MapComponent = dynamic(() => import("@/components/admin/map-component"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-200 flex items-center justify-center">Loading map...</div>
});

interface DestinationDetail {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website: string;
  opening_hours: string;
  entry_fee: number;
  status: "active" | "inactive";
  category: string;
  facilities: string[] | { name: string; icon?: string; available: boolean }[];
  activities: { name: string; startTime: string; endTime: string }[];
  view_count: number;
  avg_rating: number;
  total_reviews: number;
  is_featured: boolean;
  created_by?: {
    firstName: string;
    lastName: string;
  };
  created_at: string;
  updated_at: string;
  images: {
    id: string;
    image_url: string;
    alt_text?: string;
    caption?: string;
    image_type: string;
    sort_order: number;
    is_featured: boolean;
    created_at: string;
  }[];
}

const getCategoryDisplayName = (category?: string): string => {
  switch (category) {
    case "nature": return "Alam";
    case "cultural": return "Budaya";
    case "adventure": return "Petualangan";
    case "religious": return "Religi";
    case "historical": return "Sejarah";
    case "culinary": return "Kuliner";
    case "beach": return "Pantai";
    case "mountain": return "Gunung";
    default: return category ?? "-";
  }
};

const getStatusDisplayName = (status?: string): string => {
  switch (status) {
    case "active": return "Aktif";
    case "inactive": return "Tidak Aktif";
    default: return status ?? "unknown";
  }
};

const getStatusColor = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "active": return "default";
    case "inactive": return "secondary";
    default: return "outline";
  }
};

export default function DestinationDetailPage() {
  const params = useParams();
  const destinationId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState<DestinationDetail | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [mapLat, setMapLat] = useState<number | null>(null);
  const [mapLng, setMapLng] = useState<number | null>(null);
  const [mapAddress, setMapAddress] = useState("");
  const [newFacility, setNewFacility] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    phone: "",
    email: "",
    website: "",
    opening_hours: "",
    entry_fee: "",
    category: "",
    facilities: [] as string[],
    activities: [] as { name: string; startTime: string; endTime: string }[],
    images: [] as { url: string; alt?: string }[],
  });

  const fetchDestination = useCallback(async () => {
    try {
      const response = await get<DestinationDetail>(`/api/admin/destinations/${destinationId}`, { auth: "required" });
      setDestination(response.data);
    } catch (error) {
      console.error("Error fetching destination:", error);
      alert("Terjadi kesalahan saat memuat destinasi");
    } finally {
      setLoading(false);
    }
  }, [destinationId]);

  useEffect(() => {
    fetchDestination();
  }, [fetchDestination]);

  useEffect(() => {
    if (destination) {
      let facilitiesArray: string[] = [];
      if (Array.isArray(destination.facilities)) {
        facilitiesArray = destination.facilities.map(facility => {
          if (typeof facility === 'string') {
            return facility;
          } else if (typeof facility === 'object' && facility && 'name' in facility) {
            return facility.name;
          }
          return '';
        }).filter(f => f !== '');
      }

      setFormData({
        name: destination.name,
        description: destination.description,
        address: destination.address,
        latitude: destination.latitude != null ? String(destination.latitude) : "",
        longitude: destination.longitude != null ? String(destination.longitude) : "",
        phone: destination.phone,
        email: destination.email,
        website: destination.website,
        opening_hours: destination.opening_hours,
        entry_fee: destination.entry_fee != null ? String(destination.entry_fee) : "",
        category: destination.category,
        facilities: facilitiesArray,
        activities: destination.activities || [],
        images: destination.images.map(img => ({ url: img.image_url, alt: img.alt_text })),
      });

      setMapLat(typeof destination.latitude === "number" ? destination.latitude : null);
      setMapLng(typeof destination.longitude === "number" ? destination.longitude : null);
      setMapAddress(destination.address);
    }
  }, [destination]);

  useEffect(() => {
    if (isEditing && mapLat !== null && mapLng !== null) {
      setFormData(prev => ({
        ...prev,
        latitude: mapLat.toString(),
        longitude: mapLng.toString(),
        address: mapAddress || prev.address,
      }));
    }
  }, [mapLat, mapLng, mapAddress, isEditing]);

  const handleSave = async () => {
    const errors: {[key: string]: string} = {};
    if (formData.name.trim().length === 0) {
      errors.name = "Nama destinasi wajib diisi";
    }
    if (formData.description.trim().length === 0) {
      errors.description = "Deskripsi destinasi wajib diisi";
    }
    if (formData.address.trim().length === 0) {
      errors.address = "Alamat destinasi wajib diisi";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSaving(true);
    try {
      if (!destination) {
        alert("Data destinasi tidak tersedia");
        return;
      }

      const changedFields: Record<string, unknown> = {};
      
      if (formData.name !== destination.name) changedFields.name = formData.name;
      if (formData.description !== destination.description) changedFields.description = formData.description;
      if (formData.address !== destination.address) changedFields.address = formData.address;
      if (parseFloat(formData.latitude) !== destination.latitude) changedFields.latitude = parseFloat(formData.latitude);
      if (parseFloat(formData.longitude) !== destination.longitude) changedFields.longitude = parseFloat(formData.longitude);
      if (formData.phone !== destination.phone) changedFields.phone = formData.phone;
      if (formData.email !== destination.email) changedFields.email = formData.email;
      if (formData.website !== destination.website) changedFields.website = formData.website;
      if (formData.opening_hours !== destination.opening_hours) changedFields.opening_hours = formData.opening_hours;
      if (parseInt(formData.entry_fee) !== destination.entry_fee) changedFields.entry_fee = parseInt(formData.entry_fee);
      if (formData.category !== destination.category) changedFields.category = formData.category;
      
      const currentFacilities = Array.isArray(destination.facilities) 
        ? destination.facilities.map(f => typeof f === 'string' ? f : f?.name || '').filter(f => f !== '')
        : [];
      const facilitiesChanged = JSON.stringify(formData.facilities.sort()) !== JSON.stringify(currentFacilities.sort());
      if (facilitiesChanged) changedFields.facilities = formData.facilities;
      
      const currentActivities = destination.activities || [];
      const activitiesChanged = JSON.stringify(formData.activities) !== JSON.stringify(currentActivities);
      if (activitiesChanged) changedFields.activities = formData.activities;
      
      const currentImages = destination.images.map(img => ({ url: img.image_url }));
      const imagesChanged = JSON.stringify(formData.images) !== JSON.stringify(currentImages);
      if (imagesChanged) changedFields.images = formData.images.map(img => ({ url: img.url }));

      if (Object.keys(changedFields).length === 0) {
        setIsEditing(false);
        return;
      }

      await patch(`/api/admin/destinations/${destinationId}`, changedFields, { auth: "required" });
      alert("Destinasi berhasil diperbarui!");
      setIsEditing(false);
      fetchDestination();
    } catch (error) {
      console.error("Error updating destination:", error);
      alert("Terjadi kesalahan saat memperbarui destinasi");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      await patch(`/api/admin/destinations/${destinationId}`, { status: "active" }, { auth: "required" });
      alert("Destinasi berhasil dipublikasikan!");
      fetchDestination();
    } catch (error) {
      console.error("Error publishing destination:", error);
      alert("Terjadi kesalahan saat mempublikasikan destinasi");
    }
  };

  const handleUnpublish = async () => {
    try {
      await patch(`/api/admin/destinations/${destinationId}`, { status: "inactive" }, { auth: "required" });
      alert("Destinasi berhasil tidak dipublikasikan!");
      fetchDestination();
    } catch (error) {
      console.error("Error unpublishing destination:", error);
      alert("Terjadi kesalahan saat tidak mempublikasikan destinasi");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus destinasi ini? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }

    setDeleting(true);
    try {
      await del(`/api/admin/destinations/${destinationId}`, { auth: "required" });

      alert("Destinasi berhasil dihapus!");
      window.location.href = "/admin/destinations";
    } catch (error) {
      console.error("Error deleting destination:", error);
      alert("Terjadi kesalahan saat menghapus destinasi");
    } finally {
      setDeleting(false);
    }
  };

  const addFacility = () => {
    if (newFacility.trim() && !formData.facilities.includes(newFacility.trim())) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()]
      }));
      setNewFacility("");
    }
  };

  const removeFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter(f => f !== facility)
    }));
  };

  const addActivity = () => {
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, { name: "", startTime: "", endTime: "" }]
    }));
  };

  const updateActivity = (index: number, field: "name" | "startTime" | "endTime", value: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.map((activity, i) => 
        i === index ? { ...activity, [field]: value } : activity
      )
    }));
  };

  const removeActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat destinasi...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center">
          <p className="text-gray-600">Destinasi tidak ditemukan.</p>
          <Link href="/admin/destinations">
            <Button className="mt-4">Kembali ke Daftar Destinasi</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/destinations">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Detail Destinasi</h1>
            <p className="text-sm text-gray-600">Lihat detail destinasi.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusColor(destination.status)}>
            {getStatusDisplayName(destination.status)}
          </Badge>
          {destination.status === "inactive" && !isEditing && (
            <Button onClick={handlePublish} variant="outline">
              Publikasikan
            </Button>
          )}
          {destination.status === "active" && !isEditing && (
            <Button onClick={handleUnpublish} variant="outline">
              Tidak Publikasikan
            </Button>
          )}
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
          {!isEditing && (
            <Button
              onClick={handleDelete}
              disabled={deleting}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? "Menghapus..." : "Hapus"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Destinasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Pembuat</Label>
                <p className="text-sm text-gray-600">
                  {destination.created_by ? `${destination.created_by.firstName} ${destination.created_by.lastName}`.trim() : 'Unknown'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Kategori</Label>
                <p className="text-sm text-gray-600">{getCategoryDisplayName(destination.category)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Rating Rata-rata</Label>
                <p className="text-sm text-gray-600">
                  {destination.avg_rating ? `${destination.avg_rating} bintang` : "-"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Total Review</Label>
                <p className="text-sm text-gray-600">{destination.total_reviews}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Jumlah View</Label>
                <p className="text-sm text-gray-600">{destination.view_count.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Featured</Label>
                <p className="text-sm text-gray-600">{destination.is_featured ? "Ya" : "Tidak"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Dibuat</Label>
                <p className="text-sm text-gray-600">
                  {destination.created_at ? new Date(destination.created_at).toLocaleString("id-ID", {
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
                  {destination.updated_at ? new Date(destination.updated_at).toLocaleString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  }) : "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          {destination.images && destination.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Galeri Gambar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {destination.images.map((image, index) => (
                    <div key={image.id || index} className="relative">
                      <Image
                        src={image.image_url}
                        alt={image.alt_text || destination.name}
                        width={400}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {image.caption && (
                        <p className="text-xs text-gray-500 mt-1">{image.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Detail Destinasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Nama Destinasi</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, name: e.target.value }));
                        if (formErrors.name) setFormErrors(prev => ({ ...prev, name: "" }));
                      }}
                      className="mt-1"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
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
                        <SelectItem value="nature">Alam</SelectItem>
                        <SelectItem value="cultural">Budaya</SelectItem>
                        <SelectItem value="adventure">Petualangan</SelectItem>
                        <SelectItem value="religious">Religi</SelectItem>
                        <SelectItem value="historical">Sejarah</SelectItem>
                        <SelectItem value="culinary">Kuliner</SelectItem>
                        <SelectItem value="beach">Pantai</SelectItem>
                        <SelectItem value="mountain">Gunung</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Deskripsi</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, description: e.target.value }));
                        if (formErrors.description) setFormErrors(prev => ({ ...prev, description: "" }));
                      }}
                      rows={6}
                      className="mt-1"
                    />
                    {formErrors.description && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Alamat</Label>
                    <Textarea
                      value={formData.address}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, address: e.target.value }));
                        if (formErrors.address) setFormErrors(prev => ({ ...prev, address: "" }));
                      }}
                      rows={3}
                      className="mt-1"
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Latitude</Label>
                      <Input
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) => {
                          const v = e.target.value;
                          setFormData(prev => ({ ...prev, latitude: v }));
                          const num = v === "" ? null : Number(v);
                          if (num !== null && !Number.isNaN(num)) {
                            setMapLat(num);
                          } else {
                            setMapLat(null);
                          }
                        }}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Longitude</Label>
                      <Input
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) => {
                          const v = e.target.value;
                          setFormData(prev => ({ ...prev, longitude: v }));
                          const num = v === "" ? null : Number(v);
                          if (num !== null && !Number.isNaN(num)) {
                            setMapLng(num);
                          } else {
                            setMapLng(null);
                          }
                        }}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Lokasi di Peta</Label>
                    <div className="mt-2">
                      <div className="h-64 rounded-lg overflow-hidden border">
                        <Suspense fallback={<div className="h-full w-full bg-gray-200 flex items-center justify-center">Loading map...</div>}>
                          <MapComponent
                            lat={mapLat}
                            lng={mapLng}
                            setLat={setMapLat}
                            setLng={setMapLng}
                            setAddress={setMapAddress}
                          />
                        </Suspense>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Klik pada peta untuk mengubah lokasi, atau geser marker untuk menyesuaikan posisi.
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Telepon</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Website</Label>
                      <Input
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Waktu Buka</Label>
                      <Input
                        value={formData.opening_hours}
                        onChange={(e) => setFormData(prev => ({ ...prev, opening_hours: e.target.value }))}
                        className="mt-1"
                        placeholder="08:00-18:00"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Biaya Masuk</Label>
                      <Input
                        type="number"
                        value={formData.entry_fee}
                        onChange={(e) => setFormData(prev => ({ ...prev, entry_fee: e.target.value }))}
                        className="mt-1"
                        placeholder="50000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Fasilitas</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {formData.facilities.map((facility, index) => (
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
                          onChange={(e) => setNewFacility(e.target.value)}
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
                    <Label className="text-sm font-medium text-gray-500">Aktivitas</Label>
                    <div className="mt-2 space-y-3">
                      {formData.activities.map((activity, index) => (
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
                    <Label className="text-sm font-medium text-gray-500">Gambar Destinasi</Label>
                    <div className="mt-2">
                      <ImageUploader
                        onUploaded={(img: ImageDto) => setFormData(prev => ({ ...prev, images: [...prev.images, { url: img.url }] }))}
                        multiple={true}
                        existingImages={formData.images}
                        onRemoveExisting={(index) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Nama Destinasi</Label>
                    <h2 className="text-2xl font-bold mt-1">{destination.name}</h2>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Kategori</Label>
                    <p className="text-sm text-gray-700 mt-1">{getCategoryDisplayName(destination.category)}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Deskripsi</Label>
                    <p className="text-gray-700 mt-1 leading-relaxed">{destination.description}</p>
                  </div>

                  <div className="pt-4 border-t">
                    <Label className="text-sm font-medium text-gray-500">Informasi Kontak & Lokasi</Label>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Alamat</p>
                          <p className="text-sm text-gray-700">{destination.address}</p>
                        </div>
                      </div>
                      {destination.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Telepon</p>
                            <p className="text-sm text-gray-700">{destination.phone}</p>
                          </div>
                        </div>
                      )}
                      {destination.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-gray-700">{destination.email}</p>
                          </div>
                        </div>
                      )}
                      {destination.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Website</p>
                            <p className="text-sm text-gray-700">
                              <a href={destination.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {destination.website}
                              </a>
                            </p>
                          </div>
                        </div>
                      )}
                      {destination.opening_hours && (
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Waktu Buka</p>
                            <p className="text-sm text-gray-700">{destination.opening_hours}</p>
                          </div>
                        </div>
                      )}
                      {destination.entry_fee > 0 && (
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Biaya Masuk</p>
                            <p className="text-sm text-gray-700">Rp {destination.entry_fee.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {destination.facilities && destination.facilities.length > 0 && (
                    <div className="pt-4 border-t">
                      <Label className="text-sm font-medium text-gray-500">Fasilitas</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {destination.facilities.map((facility, index) => {
                          const facilityName = typeof facility === 'string' ? facility : facility?.name || '';
                          const key = typeof facility === 'string' ? facility : facility?.name || index;
                          return (
                            <Badge key={key} variant="outline" className="capitalize">
                              {facilityName === "accommodation" ? "Penginapan" : facilityName}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {destination.activities && destination.activities.length > 0 && (
                    <div className="pt-4 border-t">
                      <Label className="text-sm font-medium text-gray-500">Aktivitas Tersedia</Label>
                      <div className="mt-2 space-y-2">
                        {destination.activities.map((activity, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">🏖️</span>
                              <div>
                                <p className="text-sm font-medium">{activity.name}</p>
                                <p className="text-xs text-gray-500">
                                  {activity.startTime} - {activity.endTime}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
