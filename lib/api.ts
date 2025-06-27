
export function apiUrl(path: string): string {
  const host = (process.env.NEXT_PUBLIC_API_HOST ?? "").replace(/\/+$/, "");
  const cleanedPath = path.replace(/^\/+/, "");
  return `${host}/${cleanedPath}`;
}
