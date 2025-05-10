import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiRoute = nextUrl.pathname.startsWith("/api");
  if (isApiRoute) return NextResponse.next();

  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  const baseUrl = `${nextUrl.protocol || "http:"}//${req.headers.get("host")}`;

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(`${baseUrl}/dashboard`);
  }

  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(`${baseUrl}/login`);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|.*\\.(?:css|js|png|jpg|jpeg|svg|woff2?)).*)",
  ],
};
