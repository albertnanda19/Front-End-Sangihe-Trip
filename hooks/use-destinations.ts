import { useEffect, useMemo, useState } from "react";

export interface DestinationFilters {
  search?: string;
  category?: string;
  location?: string;
  minRating?: number;
  priceMin?: number;
  priceMax?: number;
  sortBy?: "popular" | "rating" | "price-low" | "newest";
  page?: number;
  pageSize?: number;
}

export interface DestinationItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  totalReviews: number;
  reviews: number; // alias of totalReviews to keep backward-compatibility with UI
  location: string;
  price: number | null;
  image: string;
  images: string[];
  facilities: string[];
  description: string;
}

interface DestinationResponse {
  destinations: DestinationItem[];
  meta: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  } | null;
}

/**
 * Hook to fetch a list of destinations from the back-end API.
 * All filtering is performed server-side by supplying the corresponding query params.
 * The hook returns a memoised list of destinations together with loading & error flags.
 */
export function useDestinations(filters: DestinationFilters) {
  const [state, setState] = useState<DestinationResponse>({
    destinations: [],
    meta: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Build query string once per filter change
  const query = useMemo(() => {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.category) params.append("category", filters.category);
    if (filters.location) params.append("location", filters.location);
    if (filters.minRating !== undefined) params.append("minRating", String(filters.minRating));
    if (filters.priceMin !== undefined) params.append("priceMin", String(filters.priceMin));
    if (filters.priceMax !== undefined) params.append("priceMax", String(filters.priceMax));
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.page) params.append("page", String(filters.page));
    if (filters.pageSize) params.append("pageSize", String(filters.pageSize));

    return params.toString();
  }, [filters]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDestinations() {
      setLoading(true);
      setError(null);
      try {
        const base = (process.env.NEXT_PUBLIC_API_HOST || "").replace(/\/$/, "");
        const url = `${base}/api/destination${query ? `?${query}` : ""}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to fetch destinations (status ${res.status})`);
        const json = await res.json();

        const items: DestinationItem[] = (json?.data?.data || []).map((d: any) => ({
          ...d,
          reviews: d.totalReviews, // alias for UI compatibility
        }));

        setState({
          destinations: items,
          meta: json?.data?.meta || null,
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDestinations();

    return () => controller.abort();
  }, [query]);

  return { ...state, loading, error } as const;
}
