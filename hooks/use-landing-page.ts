"use client"

import { useEffect, useState } from "react";

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
        const base = (process.env.NEXT_PUBLIC_API_HOST || "").replace(/\/$/, "");
        const url = `${base}/api/landing-page`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to fetch landing-page (status ${res.status})`);
        const json = await res.json();

        const parsed: LandingPageData = {
          hero: json?.data?.hero || null,
          filters: json?.data?.filters || [],
          destinations: json?.data?.destinations || [],
          articles: json?.data?.articles || [],
        };

        setData(parsed);
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchLanding();

    return () => controller.abort();
  }, []);

  return { ...data, loading, error } as const;
} 