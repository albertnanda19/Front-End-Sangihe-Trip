import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/masuk") || pathname.startsWith("/daftar")) {
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
  matcher: ["/beranda", "/create-trip", "/my-trips/:path*", "/reviews/:path*", "/reviews", "/profil", "/settings"],
};
