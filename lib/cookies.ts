// Reusable cookie utilities for client-side usage
// Keeping implementation minimal to avoid external dependencies.
// If you prefer using a library such as "js-cookie" you can swap the internals
// and keep the public API intact.

export interface CookieOptions {
  /** Number of days until the cookie expires. If omitted, the cookie becomes a session cookie */
  days?: number;
  /** Restrict cookie to a specific path. Defaults to "/" */
  path?: string;
  /** Whether the cookie should only be sent over HTTPS. Defaults to true when current protocol is https */
  secure?: boolean;
  /** Same-Site attribute; defaults to "Strict" for security */
  sameSite?: "Strict" | "Lax" | "None";
}

function buildCookieString(
  name: string,
  value: string,
  { days, path = "/", secure, sameSite = "Strict" }: CookieOptions = {}
) {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path};`;

  // Expiration
  if (typeof days === "number") {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    cookie += ` expires=${date.toUTCString()};`;
  }

  // SameSite
  cookie += ` SameSite=${sameSite};`;

  // Secure flag – default to true if served over HTTPS unless explicitly set to false
  const secureFlag = secure ?? window.location.protocol === "https:";
  if (secureFlag) cookie += " Secure;";

  return cookie;
}

export function setCookie(
  name: string,
  value: string,
  options?: CookieOptions
) {
  document.cookie = buildCookieString(name, value, options);
}

export function getCookie(name: string): string | undefined {
  const prefix = `${encodeURIComponent(name)}=`;
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(prefix));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : undefined;
}

export function deleteCookie(name: string, path: string = "/") {
  // Set the expiration in the past to remove the cookie
  document.cookie = `${encodeURIComponent(name)}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict;`;
}
