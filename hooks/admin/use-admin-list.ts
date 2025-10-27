import { useState, useEffect, useCallback, useMemo } from "react";
import { get, del, ApiError } from "@/lib/api";

export interface ListMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface UseAdminListOptions {
  endpoint: string;
  defaultParams?: Record<string, string | number | boolean>;
  searchFields?: string[];
  filterFields?: string[];
  pageSize?: number;
}

export interface UseAdminListReturn<T> {
  items: T[];
  meta: ListMeta | null;
  loading: boolean;
  error: string | null;
  search: string;
  filters: Record<string, string | number | boolean | undefined>;
  page: number;
  pageSize: number;
  setSearch: (search: string) => void;
  setFilter: (key: string, value: string | number | boolean | undefined) => void;
  setFilters: (filters: Record<string, string | number | boolean | undefined>) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  refresh: () => void;
  deleteItem: (id: string) => Promise<void>;
}

export function useAdminList<T = any>({
  endpoint,
  defaultParams = {},
  searchFields = [],
  filterFields = [],
  pageSize = 20,
}: UseAdminListOptions): UseAdminListReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [meta, setMeta] = useState<ListMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFiltersState] = useState<Record<string, string | number | boolean | undefined>>({});
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (debouncedSearch && searchFields.length > 0) {
        params.append("search", debouncedSearch);
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });

      params.append("page", String(page));
      params.append("limit", String(pageSize));

      Object.entries(defaultParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const path = `${endpoint}?${params.toString()}`;
      const res = await get<T[], ListMeta>(path, { auth: "required" });

      setItems(res.data ?? []);
      setMeta(res.meta ?? null);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError((err as Error)?.message ?? "Failed to load data");
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, debouncedSearch, filters, page, pageSize, defaultParams, searchFields]);

  useEffect(() => {
    fetchList();
  }, [fetchList, refreshKey]);

  const setFilter = useCallback((key: string, value: string | number | boolean | undefined) => {
    setFiltersState(prev => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const setFilters = useCallback((newFilters: Record<string, string | number | boolean | undefined>) => {
    setFiltersState(newFilters);
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setFiltersState({});
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus item ini?")) return;

    try {
      await del(`${endpoint}/${id}`, { auth: "required" });
      refresh();
    } catch (err: unknown) {
      alert((err as Error)?.message ?? "Gagal menghapus item");
      throw err;
    }
  }, [endpoint, refresh]);

  return {
    items,
    meta,
    loading,
    error,
    search,
    filters,
    page,
    pageSize,
    setSearch,
    setFilter,
    setFilters,
    setPage,
    resetFilters,
    refresh,
    deleteItem,
  };
}