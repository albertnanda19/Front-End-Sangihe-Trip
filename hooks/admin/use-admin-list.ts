import { useState, useEffect, useCallback, useMemo } from "react";
import { get, ApiError } from "@/lib/api";

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
  pageSize?: number;
  enableClientSideFiltering?: boolean;
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
  pageSize = 20,
  enableClientSideFiltering = false,
}: UseAdminListOptions): UseAdminListReturn<T> {
  const [allItems, setAllItems] = useState<T[]>([]);
  const [items, setItems] = useState<T[]>([]);
  const [meta, setMeta] = useState<ListMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFiltersState] = useState<Record<string, string | number | boolean | undefined>>({});
  const [page, setPage] = useState(1);
  const [hasFetched, setHasFetched] = useState(false);

  const searchFieldsKey = searchFields ? searchFields.join(",") : "";
  const defaultParamsKey = JSON.stringify(defaultParams ?? {});

  const filteredData = useMemo(() => {
    const sf = searchFieldsKey ? searchFieldsKey.split(",").filter(Boolean) : [];
    if (!enableClientSideFiltering || allItems.length === 0) {
      return { items: allItems, meta: null };
    }

    let filteredItems = [...allItems];

    if (search && sf.length > 0) {
      const searchLower = search.toLowerCase();
      filteredItems = filteredItems.filter((item) => {
        return sf.some((field) => {
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

    return {
      items: paginatedItems,
      meta: {
        page,
        limit: pageSize,
        totalItems,
        totalPages,
      }
    };
  }, [allItems, search, searchFieldsKey, filters, page, pageSize, enableClientSideFiltering]);

  useEffect(() => {
    if (enableClientSideFiltering && hasFetched) {
      setItems(filteredData.items);
      setMeta(filteredData.meta);
    }
  }, [filteredData, enableClientSideFiltering, hasFetched]);

  const fetchInitialData = useCallback(async () => {
    const dp = defaultParamsKey ? JSON.parse(defaultParamsKey) : {};
    if (hasFetched) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("limit", "100");

        Object.entries(dp).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const path = `${endpoint}?${params.toString()}`;
      const res = await get<T[], ListMeta>(path, { auth: "required" });

      const fetchedItems = res.data ?? [];
      setAllItems(fetchedItems);
      setHasFetched(true);

      if (enableClientSideFiltering) {
        const filteredItems = [...fetchedItems];
        const totalItems = filteredItems.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const paginatedItems = filteredItems.slice(0, pageSize);

        setItems(paginatedItems);
        setMeta({
          page: 1,
          limit: pageSize,
          totalItems,
          totalPages,
        });
      } else {
        setItems(fetchedItems);
        setMeta(res.meta ?? null);
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
  }, [endpoint, defaultParamsKey, hasFetched, enableClientSideFiltering, pageSize]);

  const refresh = useCallback(async () => {
    const dp = defaultParamsKey ? JSON.parse(defaultParamsKey) : {};
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("limit", "100");

        Object.entries(dp).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const path = `${endpoint}?${params.toString()}`;
      const res = await get<T[], ListMeta>(path, { auth: "required" });

      const fetchedItems = res.data ?? [];
      setAllItems(fetchedItems);

      if (enableClientSideFiltering) {
        setItems(fetchedItems.slice(0, pageSize));
        setMeta({
          page: 1,
          limit: pageSize,
          totalItems: fetchedItems.length,
          totalPages: Math.ceil(fetchedItems.length / pageSize),
        });
      } else {
        setItems(fetchedItems);
        setMeta(res.meta ?? null);
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
  }, [endpoint, defaultParamsKey, enableClientSideFiltering, pageSize]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

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
    setFiltersState({});
    setPage(1);
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus item ini?")) return;

    try {
      setAllItems(prev => prev.filter(item => (item as Record<string, unknown>).id !== id));
    } catch (err: unknown) {
      alert((err as Error)?.message ?? "Gagal menghapus item");
      throw err;
    }
  }, []);

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