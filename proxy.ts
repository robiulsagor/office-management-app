import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const pathname = req.nextUrl.pathname;

  const isLoggedIn = !!req.auth;

  const isPublicPage =
    pathname === "/login" ||
    pathname === "/admin-setup" ||
    pathname === "/change-password";

  if (!isLoggedIn && !isPublicPage) {
    return NextResponse.redirect(
      new URL("/login", req.nextUrl),
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};