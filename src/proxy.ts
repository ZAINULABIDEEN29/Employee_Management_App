import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/login", "/"].includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.startsWith("/dashboard");
  const isEmployeeRoute = nextUrl.pathname.startsWith("/employee");

  if (isApiAuthRoute) return NextResponse.next();

  if (isLoggedIn && nextUrl.pathname === "/login") {
    if (role === 'Employee') {
      return NextResponse.redirect(new URL("/employee/dashboard", nextUrl));
    }
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn) {
    if (isAdminRoute && role === 'Employee') {
      return NextResponse.redirect(new URL("/employee/dashboard", nextUrl));
    }
    if (isEmployeeRoute && ['SuperAdmin', 'Admin', 'Manager'].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
