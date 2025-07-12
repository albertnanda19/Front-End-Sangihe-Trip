import { useEffect, useState } from "react";

export interface ArticleDetailAuthor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  fullBio: string;
  followers: number;
  totalArticles: number;
}

export interface ArticleDetail {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: ArticleDetailAuthor;
  publishDate: string | null;
  readingTime: number;
  featuredImage: string;
  tags: string[];
  content: string;
  wordCount: number;
}

export interface ArticleDetailResponse {
  article: ArticleDetail | null;
  tableOfContents: any[];
  relatedArticles: any[];
  comments: any[];
}

/**
 * Hook to fetch article detail from the back-end API.
 * Returns article detail data together with loading & error flags.
 */
export function useArticleDetail(slug: string) {
  const [state, setState] = useState<ArticleDetailResponse>({
    article: null,
    tableOfContents: [],
    relatedArticles: [],
    comments: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    async function fetchArticleDetail() {
      setLoading(true);
      setError(null);
      try {
        const base = (process.env.NEXT_PUBLIC_API_HOST || "").replace(/\/$/, "");
        const url = `${base}/api/article/${slug}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to fetch article detail (status ${res.status})`);
        const json = await res.json();

        setState({
          article: json?.data?.article || null,
          tableOfContents: json?.data?.tableOfContents || [],
          relatedArticles: json?.data?.relatedArticles || [],
          comments: json?.data?.comments || [],
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchArticleDetail();

    return () => controller.abort();
  }, [slug]);

  return { ...state, loading, error } as const;
} 