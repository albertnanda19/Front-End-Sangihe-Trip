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
        interface LandingApiResponse {
          featuredDestinations?: DestinationData[];
          popularDestinations?: DestinationData[];
          recentArticles?: ArticleData[];
          statistics?: Record<string, number>;
        }
        const result = await get<LandingApiResponse>("/api/landing-page", {
          auth: false,
          signal: controller.signal,
        });

        // Use featured or popular destinations
        const destinations = result.data.featuredDestinations || result.data.popularDestinations || [];
        const articles = result.data.recentArticles || [];

        // Generate hero from first destination or use defaults
        const firstDest = destinations[0];
        const hero: HeroData = firstDest ? {
          title: "Jelajahi Keindahan",
          highlight: "Kepulauan Sangihe",
          subtitle: "Temukan destinasi wisata terbaik di ujung utara Indonesia",
          backgroundImage: firstDest.image || "/placeholder.svg",
          ctas: [
            { label: "Jelajahi Destinasi", type: "primary", href: "/destinasi" },
            { label: "Rencanakan Trip", type: "outline", href: "/create-trip" },
          ],
        } : {
          title: "Jelajahi Keindahan",
          highlight: "Kepulauan Sangihe",
          subtitle: "Temukan destinasi wisata terbaik di ujung utara Indonesia",
          backgroundImage: "/placeholder.svg",
          ctas: [
            { label: "Jelajahi Destinasi", type: "primary", href: "/destinasi" },
            { label: "Rencanakan Trip", type: "outline", href: "/create-trip" },
          ],
        };

        // Generate filters from available categories
        const categories = Array.from(new Set(destinations.map(d => d.location || "").filter(Boolean)));
        const filters = ["Semua", ...categories];

        const parsed: LandingPageData = {
          hero,
          filters: filters.length > 1 ? filters : ["Semua", "Pantai", "Kuliner", "Alam", "Budaya"],
          destinations: destinations.slice(0, 6),
          articles: articles.slice(0, 3),
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