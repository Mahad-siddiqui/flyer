import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Allow access to public routes and API webhooks
    if (
      req.nextUrl.pathname.startsWith("/api/webhook") ||
      req.nextUrl.pathname.startsWith("/api/auth")
    ) {
      return NextResponse.next();
    }

    // Check if user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      // Add admin check logic here if needed
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to public routes
        if (
          pathname.startsWith("/api/webhook") ||
          pathname.startsWith("/api/auth") ||
          pathname === "/" ||
          pathname.startsWith("/auth/") ||
          pathname.startsWith("/pricing") ||
          pathname.startsWith("/terms") ||
          pathname.startsWith("/privacy")
        ) {
          return true;
        }

        // Require authentication for dashboard and protected API routes
        if (
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/api/flyers") ||
          pathname.startsWith("/api/user") ||
          pathname.startsWith("/api/stripe/checkout") ||
          pathname.startsWith("/api/stripe/portal")
        ) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/flyers/:path*",
    "/api/user/:path*",
    "/api/stripe/checkout",
    "/api/stripe/portal",
  ],
};
