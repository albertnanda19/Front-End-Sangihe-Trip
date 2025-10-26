import { useEffect, useState } from "react";
import { get, ApiError } from "@/lib/api";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  publishDate: string;
  readingTime: string;
  image: string;
  slug: string;
}

export interface ArticlesResponse {
  featured: Article | null;
  articles: Article[];
}

/**
 * Hook to fetch articles from the back-end API.
 * Returns featured article and list of articles together with loading & error flags.
 */
export function useArticles() {
  const [state, setState] = useState<ArticlesResponse>({
    featured: null,
    articles: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchArticles() {
      setLoading(true);
      setError(null);
      try {
        const result = await get<ArticlesResponse>("/api/article", {
          auth: false,
          signal: controller.signal,
        });

        setState({
          featured: result.data.featured || null,
          articles: result.data.articles || [],
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err instanceof ApiError ? err : (err instanceof Error ? err : new Error("Failed to fetch articles")));
        }
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();

    return () => controller.abort();
  }, []);

  return { ...state, loading, error } as const;
}