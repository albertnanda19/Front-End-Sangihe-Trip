"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { get, del } from "@/lib/api";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiError } from "@/lib/api";

interface DestinationItem {
  id: string;
  name: string;
  slug?: string;
  category?: string;
  status?: string;
  rating?: number;
  viewCount?: number;
  createdAt?: string;
  published?: boolean;
}

export default function AdminDestinationsList() {
  const [items, setItems] = useState<DestinationItem[]>([]);
  const [meta, setMeta] = useState<{ page: number; limit: number; totalItems: number; totalPages: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (statusFilter) params.append("status", statusFilter);
        if (categoryFilter) params.append("category", categoryFilter);
        params.append("page", String(page));
        params.append("limit", String(pageSize));

        const path = `/api/admin/destinations?${params.toString()}`;
        const res = await get<DestinationItem[], { page: number; limit: number; totalItems: number; totalPages: number }>(path, { auth: "required" });
        // lib/api returns res.data (payload) and res.meta (meta) when backend follows standard envelope
        setItems(res.data ?? []);
        setMeta(res.meta ?? null);
      } catch (err: unknown) {
        if (err instanceof ApiError) setError(err.message);
        else setError((err as Error)?.message ?? "Failed to load destinations");
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [search, statusFilter, categoryFilter, page, pageSize, refreshKey]);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus destinasi ini? (soft delete). Lanjutkan?")) return;
    try {
      await del(`/api/admin/destinations/${id}`, { auth: "required" });
      // refresh list
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      alert((err as Error)?.message ?? "Gagal menghapus destinasi");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Destinations</h1>
          <p className="text-sm text-gray-600">List, search and manage destinations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/destinations/new">
            <Button>Tambah Destinasi</Button>
          </Link>
        </div>
      </div>

  {error && <div className="text-red-600 mb-4">{error}</div>}

  <Card className="mb-4">
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
          <CardDescription>Filter by name, status or category.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3">
            <Input placeholder="Cari nama / slug / deskripsi..." value={search} onChange={(e) => setSearch((e.target as HTMLInputElement).value)} />
            <Select onValueChange={(v) => setStatusFilter(v === "all" ? undefined : v)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => setCategoryFilter(v === "all" ? undefined : v)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="beach">Beach</SelectItem>
                <SelectItem value="mountain">Mountain</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1 text-right">
              <Button variant="outline" onClick={() => { setSearch(""); setStatusFilter(undefined); setCategoryFilter(undefined); setPage(1); }}>Reset</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Destinations</CardTitle>
          <CardDescription>{loading ? "Loading..." : `${meta ? meta.totalItems : items.length} items`}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <div className="font-medium text-sm">{d.name}</div>
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">{d.slug ?? "-"}</TableCell>
                  <TableCell>{d.category ?? "-"}</TableCell>
                  <TableCell>{d.published ? <Badge variant="default">Yes</Badge> : <Badge variant="secondary">No</Badge>}</TableCell>
                  <TableCell>{d.rating ?? "-"}</TableCell>
                  <TableCell>{d.createdAt ? new Date(d.createdAt).toLocaleString() : "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/destinations/${d.id}`}>
                        <Button variant="ghost" size="sm">View / Edit</Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(d.id)}>Hapus</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">{meta ? `Showing page ${meta.page} of ${meta.totalPages}` : ""}</div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={loading || (meta ? meta.page <= 1 : page <= 1)}>Prev</Button>
              {/* simple page numbers */}
              {meta && (
                <div className="hidden md:flex items-center gap-1">
                  {Array.from({ length: Math.min(meta.totalPages, 7) }).map((_, i) => {
                    const pnum = Math.min(Math.max(1, meta.page - 3 + i), meta.totalPages);
                    return (
                      <Button key={i} size="sm" variant={pnum === meta.page ? "default" : "ghost"} onClick={() => setPage(pnum)}>
                        {pnum}
                      </Button>
                    );
                  })}
                </div>
              )}
              <Button size="sm" variant="outline" onClick={() => setPage((p) => p + 1)} disabled={loading || (meta ? meta.page >= meta.totalPages : false)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
