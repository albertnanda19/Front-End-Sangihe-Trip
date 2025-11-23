import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { getCookie } from "@/lib/cookies";

export type AuthRequirement = boolean | "required" | "optional";

export interface RequestOptions {
  auth?: AuthRequirement;
  noAutoRedirectOn401?: boolean;
  headers?: Record<string, string>;
}

export interface ApiResult<TData = unknown, TMeta = unknown> {
  data: TData;
  meta?: TMeta;
  message?: string;
  raw?: unknown;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;
  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function extractMessage(json: unknown, fallback: string) {
  if (!json || typeof json !== "object") return fallback;
  const j = json as Record<string, unknown>;
  const msg = j["message"];
  if (typeof msg === "string" && msg) return msg;
  const errField = j["error"];
  if (typeof errField === "string" && errField) return errField;
  const errors = j["errors"] as unknown;
  if (Array.isArray(errors) && errors.length > 0) {
    const first = errors[0] as unknown;
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      const msgField = (first as Record<string, unknown>)["message"];
      if (typeof msgField === "string") return msgField;
    }
  }
  return fallback;
}

function handleUnauthorized(options?: RequestOptions) {
  const requireAuth = options?.auth === true || options?.auth === "required";
  if (!requireAuth) return;
  if (options?.noAutoRedirectOn401) return;
  if (typeof window !== "undefined") {
    const next = `${window.location.pathname}${window.location.search}`;
    const dest = `/masuk?next=${encodeURIComponent(next)}`;
    window.location.href = dest;
  }
}

function handleForbidden() {
  if (typeof window !== "undefined") {
    window.location.href = "/unauthorized";
  }
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_HOST ?? "").replace(/\/+$/, ""),
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        if (typeof window !== "undefined") {
          const next = `${window.location.pathname}${window.location.search}`;
          const dest = `/masuk?next=${encodeURIComponent(next)}`;
          window.location.href = dest;
        }
      }
      if (status === 403) {
        handleForbidden();
      }
    }
    return Promise.reject(error);
  }
);

export function apiUrl(path: string): string {
  const host = (process.env.NEXT_PUBLIC_API_HOST ?? "").replace(/\/+$/, "");
  const cleanedPath = path.replace(/^\/+/, "");
  return `${host}/${cleanedPath}`;
}

export async function request<TData = unknown, TMeta = unknown>(
  path: string,
  options: RequestOptions & { method?: string; body?: unknown } = {}
): Promise<ApiResult<TData, TMeta>> {
  try {
    const config: AxiosRequestConfig = {
      url: path.replace(/^\/+/, ""),
      method: (options.method || "GET") as AxiosRequestConfig["method"],
      headers: options.headers,
      data: options.body,
    };

    const response = await apiClient.request(config);
    const json = response.data;

    const j = (json && typeof json === "object" ? (json as Record<string, unknown>) : {});
    const jData = j["data"] as Record<string, unknown> | undefined;
    const meta = (jData?.["meta"] as unknown) ?? (j["meta"] as unknown) ?? undefined;
    const payload = (jData?.["data"] as unknown) ?? (j["data"] as unknown) ?? json;
    const message = j["message"] as string | undefined;

    return { data: payload as TData, meta: meta as TMeta, message, raw: json };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const json = error.response?.data;

      // Handle 401/403 with custom options
      if (status === 401) {
        handleUnauthorized(options);
      }
      if (status === 403) {
        handleForbidden();
      }

      const fallback = `Request failed (status ${status})`;
      const message = extractMessage(json, fallback);
      const j = (json && typeof json === "object" ? (json as Record<string, unknown>) : {});
      const code = j["code"] as string | undefined;
      const details = (j["errors"] as unknown) ?? (j["data"] as unknown);
      throw new ApiError(message, status, code, details);
    }
    throw error;
  }
}

export async function get<TData = unknown, TMeta = unknown>(path: string, options: RequestOptions = {}) {
  return request<TData, TMeta>(path, { ...options, method: "GET" });
}

export async function post<TData = unknown, TMeta = unknown>(path: string, body?: unknown, options: RequestOptions = {}) {
  return request<TData, TMeta>(path, { ...options, method: "POST", body });
}

export async function patch<TData = unknown, TMeta = unknown>(path: string, body?: unknown, options: RequestOptions = {}) {
  return request<TData, TMeta>(path, { ...options, method: "PATCH", body });
}

export async function put<TData = unknown, TMeta = unknown>(path: string, body?: unknown, options: RequestOptions = {}) {
  return request<TData, TMeta>(path, { ...options, method: "PUT", body });
}

export async function del<TData = unknown, TMeta = unknown>(path: string, options: RequestOptions = {}) {
  return request<TData, TMeta>(path, { ...options, method: "DELETE" });
}
