import { getCookie } from "@/lib/cookies";

export function apiUrl(path: string): string {
  const host = (process.env.NEXT_PUBLIC_API_HOST ?? "").replace(/\/+$/, "");
  const cleanedPath = path.replace(/^\/+/, "");
  return `${host}/${cleanedPath}`;
}

export type AuthRequirement = boolean | "required" | "optional";

export interface RequestOptions extends RequestInit {
  auth?: AuthRequirement;
  noAutoRedirectOn401?: boolean;
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

function buildHeaders(options?: RequestOptions): HeadersInit {
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string> | undefined),
  };
  if (options?.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const requireAuth = options?.auth === true || options?.auth === "required";
  const optionalAuth = options?.auth === "optional";
  if (requireAuth || optionalAuth) {
    const token = getCookie("access_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
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

export async function request<TData = unknown, TMeta = unknown>(path: string, options: RequestOptions = {}): Promise<ApiResult<TData, TMeta>> {
  const url = apiUrl(path);
  const headers = buildHeaders(options);

  const res = await fetch(url, { ...options, headers });

  let json: unknown = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try { json = await res.json(); } catch { json = null; }
  } else {
    try { json = await res.text(); } catch { json = null; }
  }

  if (!res.ok) {
    if (res.status === 401) {
      handleUnauthorized(options);
    }
    const fallback = `Request failed (status ${res.status})`;
    const message = extractMessage(json, fallback);
    const j = (json && typeof json === "object" ? (json as Record<string, unknown>) : {});
    const code = j["code"] as string | undefined;
    const details = (j["errors"] as unknown) ?? (j["data"] as unknown);
    throw new ApiError(message, res.status, code, details);
  }

  const j = (json && typeof json === "object" ? (json as Record<string, unknown>) : {});
  const jData = j["data"] as Record<string, unknown> | undefined;
  const meta = (jData?.["meta"] as unknown) ?? (j["meta"] as unknown) ?? undefined;
  const payload = (jData?.["data"] as unknown) ?? (j["data"] as unknown) ?? json;
  const message = j["message"] as string | undefined;

  return { data: payload as TData, meta: meta as TMeta, message, raw: json };
}

export async function get<TData = unknown, TMeta = unknown>(path: string, options: RequestOptions = {}) {
  return request<TData, TMeta>(path, { ...options, method: "GET" });
}

export async function post<TData = unknown, TMeta = unknown>(path: string, body?: unknown, options: RequestOptions = {}) {
  const init: RequestOptions = { ...options, method: "POST" };
  if (body !== undefined) init.body = typeof body === "string" ? body : JSON.stringify(body);
  return request<TData, TMeta>(path, init);
}

export async function patch<TData = unknown, TMeta = unknown>(path: string, body?: unknown, options: RequestOptions = {}) {
  const init: RequestOptions = { ...options, method: "PATCH" };
  if (body !== undefined) init.body = typeof body === "string" ? body : JSON.stringify(body);
  return request<TData, TMeta>(path, init);
}

export async function put<TData = unknown, TMeta = unknown>(path: string, body?: unknown, options: RequestOptions = {}) {
  const init: RequestOptions = { ...options, method: "PUT" };
  if (body !== undefined) init.body = typeof body === "string" ? body : JSON.stringify(body);
  return request<TData, TMeta>(path, init);
}

export async function del<TData = unknown, TMeta = unknown>(path: string, options: RequestOptions = {}) {
  return request<TData, TMeta>(path, { ...options, method: "DELETE" });
}
