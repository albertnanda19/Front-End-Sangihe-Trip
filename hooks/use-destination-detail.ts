import { useEffect, useState } from "react";
import { get, ApiError } from "@/lib/api";

interface Activity {
  name: string;
  startTime: string;
  endTime: string;
}

interface ImageDetail {
  id: string;
  image_url: string;
  alt_text: string | null;
  image_type: string;
  sort_order: number;
  is_featured: boolean;
}

interface RawDestinationDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website: string;
  opening_hours: string;
  entry_fee: number;
  category: string;
  facilities: string[];
  avg_rating: number;
  total_reviews: number;
  is_featured: boolean;
  activities: Activity[];
  images: ImageDetail[];
}

export interface DestinationDetail {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website: string;
  openHours: string;
  entryFee: number;
  facilities: string[];
  avgRating: number;
  totalReviews: number;
  isFeatured: boolean;
  activities: Activity[];
  images: ImageDetail[];
}

interface HookState {
  destination: DestinationDetail | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches a single destination detail by id from the back-end REST API.
 * Returned data is normalised so that existing UI can consume it without major changes.
 */
export function useDestinationDetail(slug: string) {
  const [state, setState] = useState<HookState>({
    destination: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();

    async function fetchDetail() {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const result = await get<RawDestinationDetail>(`/api/destination/slug/${slug}`, {
          auth: false,
          signal: controller.signal,
        });

        const apiData = result.data;

        const destination: DestinationDetail = {
          id: apiData.id,
          name: apiData.name,
          slug: apiData.slug,
          category: apiData.category,
          description: apiData.description,
          address: apiData.address,
          latitude: apiData.latitude,
          longitude: apiData.longitude,
          phone: apiData.phone,
          email: apiData.email,
          website: apiData.website,
          openHours: apiData.opening_hours,
          entryFee: apiData.entry_fee,
          facilities: apiData.facilities || [],
          avgRating: apiData.avg_rating,
          totalReviews: apiData.total_reviews,
          isFeatured: apiData.is_featured,
          activities: apiData.activities || [],
          images: apiData.images || [],
        };

        setState({ destination, loading: false, error: null });
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setState({
          destination: null,
          loading: false,
          error: err instanceof ApiError ? err : (err instanceof Error ? err : new Error("Failed to fetch destination")),
        });
      }
    }

    fetchDetail();

    return () => controller.abort();
  }, [slug]);

  return state;
}
