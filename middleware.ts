import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "@/lib/jwt";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      const url = new URL("/masuk", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    const payload = decodeJwt<{ role?: string }>(token);
    const role = payload?.role;

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/masuk") || pathname.startsWith("/daftar")) {
    const token = req.cookies.get("access_token")?.value;
    
    if (token) {
      const payload = decodeJwt<{ role?: string }>(token);
      const role = payload?.role;
      
      const destination = role === "admin" ? "/admin/beranda" : "/beranda";
      return NextResponse.redirect(new URL(destination, req.url));
    }
    
    return NextResponse.next();
  }

  const isProtected =
    pathname === "/beranda" ||
    pathname === "/create-trip" ||
    pathname.startsWith("/my-trips") ||
    pathname === "/reviews" ||
    pathname.startsWith("/reviews") ||
    pathname === "/profil" ||
    pathname === "/settings";

  if (!isProtected) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("access_token")?.value;
  if (!accessToken) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/masuk";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/beranda",
    "/create-trip",
    "/my-trips/:path*",
    "/reviews/:path*",
    "/reviews",
    "/profil",
    "/settings",
    "/masuk",
    "/daftar",
  ],
};
