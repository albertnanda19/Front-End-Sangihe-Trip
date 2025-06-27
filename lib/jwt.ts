// Minimal utility to decode a JWT payload in browser only (no verification)
// NOTE: This does NOT validate signature – meant solely for extracting non-sensitive
// data such as user role on the client side.

export function decodeJwt<T = unknown>(token: string): T | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    // Convert base64url → base64
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
