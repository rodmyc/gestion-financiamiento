import { NextResponse, type NextRequest } from "next/server";
import { getCookieCache } from "better-auth/cookies";

import { getDefaultRedirectPath, isAdminRole } from "@/lib/auth-helpers";

const protectedPrefixes = ["/panel", "/admin", "/cambiar-contrasena"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getCookieCache(request);
  const isProtectedRoute = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!session) {
    return NextResponse.next();
  }

  const sessionUser = session.user as Record<string, unknown>;
  const userState = {
    role: typeof sessionUser.role === "string" ? sessionUser.role : null,
    mustChangePassword: sessionUser.mustChangePassword === true,
  };

  if (pathname === "/login" || pathname === "/") {
    return NextResponse.redirect(new URL(getDefaultRedirectPath(userState), request.url));
  }

  if (userState.mustChangePassword && pathname !== "/cambiar-contrasena") {
    return NextResponse.redirect(new URL("/cambiar-contrasena", request.url));
  }

  if (!userState.mustChangePassword && pathname === "/cambiar-contrasena") {
    return NextResponse.redirect(new URL(getDefaultRedirectPath(userState), request.url));
  }

  if (pathname.startsWith("/admin") && !isAdminRole(userState.role)) {
    return NextResponse.redirect(new URL("/panel", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
