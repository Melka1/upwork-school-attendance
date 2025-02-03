import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Check if path already has a locale
  if (pathname.startsWith("/en") || pathname.startsWith("/de")) {
    return NextResponse.next();
  }

  // Default to English if no locale is found
  return NextResponse.redirect(new URL(`/en${pathname}`, req.url));
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // Ignore API routes & static files
};
