import { useEffect, useState } from "react";

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
        const base = (process.env.NEXT_PUBLIC_API_HOST || "").replace(/\/$/, "");
        const url = `${base}/api/article`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to fetch articles (status ${res.status})`);
        const json = await res.json();

        setState({
          featured: json?.data?.featured || null,
          articles: json?.data?.articles || [],
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err);
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