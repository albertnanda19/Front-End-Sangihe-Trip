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
  enableClientSideFiltering?: boolean;
  cacheTimeout?: number;
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

export function useAdminList<T>({
  endpoint,
  defaultParams = {},
  searchFields = [],
  filterFields = [],
  pageSize = 20,
  enableClientSideFiltering = false,
  cacheTimeout = 5 * 60 * 1000,
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

  const [cachedItems, setCachedItems] = useState<T[]>([]);
  const [cachedMeta, setCachedMeta] = useState<ListMeta | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  const applyClientSideFiltering = useCallback(() => {
    let filteredItems = [...cachedItems];

    if (debouncedSearch && searchFields.length > 0) {
      const searchLower = debouncedSearch.toLowerCase();
      filteredItems = filteredItems.filter((item) => {
        return searchFields.some((field) => {
          const value = (item as Record<string, unknown>)[field];
          return value && String(value).toLowerCase().includes(searchLower);
        });
      });
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        filteredItems = filteredItems.filter((item) => {
          const itemValue = (item as Record<string, unknown>)[key];
          return itemValue !== undefined && String(itemValue) === String(value);
        });
      }
    });

    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    setItems(paginatedItems);
    setMeta({
      page,
      limit: pageSize,
      totalItems,
      totalPages,
    });
  }, [cachedItems, debouncedSearch, searchFields, filters, page, pageSize]);

  const fetchList = useCallback(async (forceFetch = false) => {
    const now = Date.now();
    const isCacheValid = now - lastFetchTime < cacheTimeout && cachedItems.length > 0;

    if (!forceFetch && enableClientSideFiltering && isCacheValid && hasInitialFetch) {
      applyClientSideFiltering();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (enableClientSideFiltering) {
        params.append("page", "1");
        params.append("limit", "1000");
      } else {
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
      }

      Object.entries(defaultParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const path = `${endpoint}?${params.toString()}`;
      const res = await get<T[], ListMeta>(path, { auth: "required" });

      const fetchedItems = res.data ?? [];
      const fetchedMeta = res.meta ?? null;

      if (enableClientSideFiltering) {
        setCachedItems(fetchedItems);
        setCachedMeta(fetchedMeta);
        setLastFetchTime(now);
        setHasInitialFetch(true);
        applyClientSideFiltering();
      } else {
        setItems(fetchedItems);
        setMeta(fetchedMeta);
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
  }, [endpoint, debouncedSearch, filters, page, pageSize, defaultParams, searchFields, enableClientSideFiltering, cacheTimeout, lastFetchTime, cachedItems.length, hasInitialFetch, applyClientSideFiltering]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (enableClientSideFiltering && hasInitialFetch) {
      applyClientSideFiltering();
    }
  }, [debouncedSearch, filters, page, pageSize, enableClientSideFiltering, hasInitialFetch, applyClientSideFiltering]);

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