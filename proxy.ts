import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

const protectedRoutes = ["/account", "/orders", "/admin", "/staff"];

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);

  if (!user && isProtectedRoute(request.nextUrl.pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Only run proxy on page navigations — skip:
     * - /api/* routes (handled server-side, no cookie refresh needed)
     * - /auth/* routes (callback handler, must NOT intercept)
     * - _next/* (static/image/data assets)
     * - favicon and other public files
     * Keeping this scope tight prevents HTTP 431 from RSC header accumulation.
     */
    "/((?!api|auth|_next/static|_next/image|_next/data|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json)$).*)",
  ],
};
