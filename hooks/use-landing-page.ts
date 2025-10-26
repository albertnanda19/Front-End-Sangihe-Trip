"use client"

import { useEffect, useState } from "react";
import { get, ApiError } from "@/lib/api";

export interface HeroData {
  title: string;
  highlight: string;
  subtitle: string;
  backgroundImage: string;
  ctas: {
    label: string;
    type: "primary" | "outline";
    href: string;
  }[];
}

export interface DestinationData {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: string;
  image: string;
}

export interface ArticleData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

export interface LandingPageData {
  hero: HeroData | null;
  filters: string[];
  destinations: DestinationData[];
  articles: ArticleData[];
}

/**
 * Hook to fetch landing-page content (hero, filters, destinations, articles)
 * from the back-end API.
 */
export function useLandingPage() {
  const [data, setData] = useState<LandingPageData>({
    hero: null,
    filters: [],
    destinations: [],
    articles: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchLanding() {
      setLoading(true);
      setError(null);
      try {
        const result = await get<LandingPageData>("/api/landing-page", {
          auth: false,
          signal: controller.signal,
        });

        const parsed: LandingPageData = {
          hero: result.data.hero || null,
          filters: result.data.filters || [],
          destinations: result.data.destinations || [],
          articles: result.data.articles || [],
        };

        setData(parsed);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err instanceof ApiError ? err : (err instanceof Error ? err : new Error("Failed to fetch landing-page")));
        }
      } finally {
        setLoading(false);
      }
    }

    fetchLanding();

    return () => controller.abort();
  }, []);

  return { ...data, loading, error } as const;
}