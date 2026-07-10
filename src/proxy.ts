import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

const PROTECTED_PREFIX = "/admin/dashboard";
const LOGIN_PATH = "/admin/login";
const LOGIN_ALIAS = "/login";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = path.startsWith(PROTECTED_PREFIX);
  const isLoginRoute = path === LOGIN_PATH || path === LOGIN_ALIAS;

  const cookie = request.cookies.get("admin_session")?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.adminId) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  if (isLoginRoute && session?.adminId) {
    return NextResponse.redirect(new URL(PROTECTED_PREFIX, request.url));
  }

  if (path === LOGIN_ALIAS) {
    return NextResponse.rewrite(new URL(LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
