import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Define route patterns
const publicRoutes = ["/api/auth", "/"];
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is a public route
  if (
    publicRoutes.some(
      (route) => pathname.startsWith(route) || pathname === route,
    )
  ) {
    return NextResponse.next();
  }

  // Get the token from the authToken HTTP-only cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  // If no token and not a public route, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const data = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
  const userData = typeof data === "object" ? data : JSON.parse(data as string);

  // Check for admin routes
  if (
    adminRoutes.some(
      (route) => pathname.startsWith(route) || pathname === route,
    )
  ) {
    const adminEmails =
      process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || [];
    const userEmail = userData.email as string;

    // If user is not an admin, redirect to unauthorized page
    if (!adminEmails.includes(userEmail)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // All other cases, allow the request
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api/auth (NextAuth.js authentication)
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, /robots.txt (SEO files)
     */
    "/((?!api/auth|_next|static|favicon.ico|robots.txt).*)",
  ],
};
