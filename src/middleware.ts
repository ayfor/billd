import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

const AUTH_PAGES = ["/login", "/signup"];
const PROTECTED = ["/dashboard", "/expenses", "/categories", "/budgets", "/recurring"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const signedIn = !!req.auth?.user;
  const onAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));
  const onProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (signedIn && onAuthPage) return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  if (!signedIn && onProtected) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
