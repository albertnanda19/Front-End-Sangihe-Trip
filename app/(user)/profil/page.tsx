"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { patch, ApiError } from "@/lib/api";
import { useUserProfile } from "@/hooks/use-user-profile";

export default function ProfilePage() {
  const { profile, loading: profileLoading, error: profileError, refetch } = useUserProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      const parts = profile.name?.trim().split(" ") ?? [];
      setFirstName(parts[0] ?? "");
      setLastName(parts.slice(1).join(" ") ?? "");
      setAvatarUrl(profile.avatar || "");
    }
  }, [profile]);

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!firstName || firstName.trim().length < 2) {
      errs.firstName = "Nama depan minimal 2 karakter";
    }
    if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
      errs.avatarUrl = "Avatar harus berupa URL yang valid";
    }
    return errs;
  }, [firstName, avatarUrl]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      await patch("/api/users/me", {
        first_name: firstName.trim(),
        firstName: firstName.trim(),
        last_name: lastName.trim(),
        lastName: lastName.trim(),
        avatar_url: avatarUrl.trim() || undefined,
        avatar: avatarUrl.trim() || undefined,
      }, { auth: "required" });
      setSuccess("Profil berhasil diperbarui");
      await refetch();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profil</h1>
        <p className="text-sm text-slate-600">Perbarui nama dan avatar Anda.</p>
      </div>

      {profileError && (
        <Alert variant="destructive">
          <AlertTitle>Gagal memuat profil</AlertTitle>
          <AlertDescription>{profileError}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Terjadi kesalahan</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertTitle>Berhasil</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Informasi Profil</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nama Depan</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  aria-invalid={Boolean(errors.firstName)}
                  placeholder="Nama depan"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Nama Belakang</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nama belakang (opsional)"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                aria-invalid={Boolean(errors.avatarUrl)}
                placeholder="https://…"
              />
              {errors.avatarUrl && (
                <p className="text-xs text-red-600 mt-1">{errors.avatarUrl}</p>
              )}
              {avatarUrl && /^https?:\/\//i.test(avatarUrl) && (
                <div className="mt-2 h-16 w-16 relative rounded-full overflow-hidden border">
                  <Image src={avatarUrl} alt="Avatar preview" fill className="object-cover" />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={saving || profileLoading}>
                {saving ? "Menyimpan…" : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
