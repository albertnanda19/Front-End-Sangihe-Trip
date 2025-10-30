
export interface DecodedToken {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  iss: string;
  aud: string;
  type: string;
  iat: number;
  exp: number;
}

export function decodeJwt<T = unknown>(token: string): T | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");

    let json: string;
    if (typeof window !== "undefined") {
      json = atob(base64);
    } else {
      json = Buffer.from(base64, "base64").toString("utf-8");
    }

    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
