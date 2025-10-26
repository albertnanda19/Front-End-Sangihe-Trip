import { useEffect, useState } from "react";
import { get, ApiError } from "@/lib/api";

interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface Facility {
  icon: string;
  name: string;
  available: boolean;
}

interface RawDestinationDetail {
  id: string;
  name: string;
  category: string;
  location: string | Location;
  price: number | null;
  openHours?: string;
  description: string;
  facilities?: Facility[];
  tips?: string[];
  images: string[];
  rating: number;
  totalReviews: number;
}

export interface DestinationDetail {
  id: string;
  name: string;
  category: string;
  location: string;
  locationObj?: Location;
  price: number | null;
  openHours: string;
  description: string;
  facilities: Facility[];
  tips: string[];
  images: string[];
  hasVideo: boolean;
  /** Computed or placeholder rating so the existing UI keeps working */
  rating: number;
  /** Computed or placeholder review count so the existing UI keeps working */
  totalReviews: number;
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
export function useDestinationDetail(id: string) {
  const [state, setState] = useState<HookState>({
    destination: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    async function fetchDetail() {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const result = await get<RawDestinationDetail>(`/api/destination/${id}`, {
          auth: false,
          signal: controller.signal,
        });

        const apiData = result.data;

        const destination: DestinationDetail = {
          id: apiData.id,
          name: apiData.name,
          category: apiData.category,
          location: typeof apiData.location === "object"
            ? apiData.location.address
            : apiData.location || "",
          locationObj: typeof apiData.location === "object"
            ? apiData.location
            : undefined,
          price: apiData.price ?? null,
          openHours: apiData.openHours ?? "",
          description: apiData.description ?? "",
          facilities: apiData.facilities ?? [],
          tips: apiData.tips ?? [],
          images: apiData.images ?? [],
          hasVideo: Array.isArray(apiData.images)
            ? apiData.images.some((url: string) => /\.(mp4|mov|webm)$/i.test(url))
            : false,
          rating: apiData.rating ?? 0,
          totalReviews: apiData.totalReviews ?? 0,
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
  }, [id]);

  return state;
}
