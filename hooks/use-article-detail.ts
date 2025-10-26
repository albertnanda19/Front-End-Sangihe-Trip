import { useEffect, useState } from "react";
import { get, ApiError } from "@/lib/api";

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
  tableOfContents: unknown[];
  relatedArticles: unknown[];
  comments: unknown[];
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
        const result = await get<ArticleDetailResponse>(`/api/article/${slug}`, {
          auth: false,
          signal: controller.signal,
        });

        setState({
          article: result.data.article || null,
          tableOfContents: result.data.tableOfContents || [],
          relatedArticles: result.data.relatedArticles || [],
          comments: result.data.comments || [],
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err instanceof ApiError ? err : (err instanceof Error ? err : new Error("Failed to fetch article detail")));
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