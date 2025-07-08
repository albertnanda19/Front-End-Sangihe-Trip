import { useEffect, useState } from "react";

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
  /** Whether the destination contains a promotional video */
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
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    async function fetchDetail() {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const base = (process.env.NEXT_PUBLIC_API_HOST || "").replace(/\/$/, "");
        const res = await fetch(`${base}/api/destination/${id}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch destination (status ${res.status})`);
        }
        const json = await res.json();
        const apiData = json?.data;

        // Shape the data so that the existing UI code does not break.
        const destination: DestinationDetail = {
          id: apiData.id,
          name: apiData.name,
          category: apiData.category,
          location: apiData.location?.address || "",
          locationObj: apiData.location,
          price: apiData.price ?? null,
          openHours: apiData.openHours ?? "",
          description: apiData.description ?? "",
          facilities: apiData.facilities ?? [],
          tips: apiData.tips ?? [],
          images: apiData.images ?? [],
          hasVideo: Boolean(apiData.video),
          rating: apiData.rating ?? 0,
          totalReviews: apiData.totalReviews ?? 0,
        };

        setState({ destination, loading: false, error: null });
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setState({ destination: null, loading: false, error: err });
      }
    }

    fetchDetail();

    return () => controller.abort();
  }, [id]);

  return state;
}
