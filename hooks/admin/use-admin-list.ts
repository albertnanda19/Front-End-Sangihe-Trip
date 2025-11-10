import { useState, useEffect, useCallback } from "react";
import { get, del, ApiError } from "@/lib/api";

export interface ListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UseAdminListOptions {
  endpoint: string;
  defaultParams?: Record<string, string | number | boolean>;
  searchFields?: string[];
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
  setSearchAndFetch: (search: string) => void;
  setFilter: (key: string, value: string | number | boolean | undefined) => void;
  setFilters: (filters: Record<string, string | number | boolean | undefined>) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  refresh: () => void;
  deleteItem: (id: string) => Promise<void>;
}

export function useAdminList<T>({
  endpoint,
  defaultParams = {},
  searchFields = [],
  pageSize = 20,
}: UseAdminListOptions): UseAdminListReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [meta, setMeta] = useState<ListMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFiltersState] = useState<Record<string, string | number | boolean | undefined>>({});
  const [page, setPage] = useState(1);

  const defaultParamsKey = JSON.stringify(defaultParams ?? {});

  const fetchData = useCallback(async (currentPage: number = 1, currentSearch: string = search, currentFilters: Record<string, string | number | boolean | undefined> = filters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("page", String(currentPage));
      params.append("limit", String(pageSize));

      if (currentSearch && searchFields.length > 0) {
        params.append("search", currentSearch);
        params.append("search_fields", searchFields.join(","));
      }

      const actions: string[] = [];
      const otherFilters: Record<string, string> = {};

      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (key.startsWith("action_")) {
            actions.push(String(value));
          } else {
            otherFilters[key] = String(value);
          }
        }
      });

      if (actions.length > 0) {
        params.append("action", actions.join(","));
      }

      Object.entries(otherFilters).forEach(([key, value]) => {
        params.append(key, value);
      });

      const dp = defaultParamsKey ? JSON.parse(defaultParamsKey) : {};
      Object.entries(dp).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const path = `${endpoint}?${params.toString()}`;
      const res = await get<T[], ListMeta>(path, { auth: "required" });

      const fetchedItems = res.data ?? [];
      setItems(fetchedItems);

      const serverMeta = res.meta;
      if (serverMeta) {
        const totalPages = Math.ceil(serverMeta.total / serverMeta.limit);
        setMeta({
          ...serverMeta,
          totalPages,
        });
      } else {
        setMeta(null);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError((err as Error)?.message ?? "Failed to load data");
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, defaultParamsKey, searchFields, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = useCallback(async () => {
    fetchData(1, search, filters);
    setPage(1);
  }, [fetchData, search, filters]);

  const setFilter = useCallback((key: string, value: string | number | boolean | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFiltersState(newFilters);
    fetchData(1, search, newFilters);
    setPage(1);
  }, [fetchData, search, filters]);

  const setFilters = useCallback((newFilters: Record<string, string | number | boolean | undefined>) => {
    setFiltersState(newFilters);
    fetchData(1, search, newFilters);
    setPage(1);
  }, [fetchData, search]);

  const resetFilters = useCallback(() => {
    setSearch("");
    setFiltersState({});
    fetchData(1, "", {});
    setPage(1);
  }, [fetchData]);

  const setSearchAndFetch = useCallback((newSearch: string) => {
    setSearch(newSearch);
    fetchData(1, newSearch, filters);
    setPage(1);
  }, [fetchData, filters]);

  const setPageAndFetch = useCallback((newPage: number) => {
    setPage(newPage);
    fetchData(newPage, search, filters);
  }, [fetchData, search, filters]);

  const deleteItem = useCallback(async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus item ini?")) return;

    try {
      await del(`${endpoint}/${id}`, { auth: "required" });

      setItems(prev => prev.filter(item => (item as Record<string, unknown>).id !== id));

      await fetchData();
    } catch (err: unknown) {
      alert((err as Error)?.message ?? "Gagal menghapus item");
      throw err;
    }
  }, [endpoint, fetchData]);

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
    setSearchAndFetch,
    setFilter,
    setFilters,
    setPage: setPageAndFetch,
    resetFilters,
    refresh,
    deleteItem,
  };
}