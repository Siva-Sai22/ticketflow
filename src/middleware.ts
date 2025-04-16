import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";

// Define route patterns
const publicRoutes = ["/api/auth", "/login", "/signup", "/api/dept"];
const adminRoutes = ["/admin"];
const supportRoutes = ["/support"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static image files to be accessed directly
  if (/\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i.test(pathname)) {
    return NextResponse.next();
  }

  // Check if the path is a public route
  if (
    publicRoutes.some(
      (route) => pathname.startsWith(route) || pathname === route,
    ) ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Get the token from the authToken HTTP-only cookie
  const cookieStore = cookies();
  const token = (await cookieStore).get("authToken")?.value;

  // If no token and not a public route, redirect to login
  if (!token) {
    return NextResponse.redirect(
      new URL("/login?error=unauthorized", request.url),
    );
  }

  // Verify token using jose instead of jsonwebtoken
  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key"),
    );

    // Jose automatically parses the JWT payload
    const userData = payload;

    // Create a response that we'll modify based on route requirements
    const response = NextResponse.next();

    // Add user data to response headers for client-side consistency
    response.headers.set("x-user-role", userData.role as string);
    response.headers.set("x-user-id", userData.id as string);
    response.headers.set("x-user-email", userData.email as string);

    // Check for admin routes
    if (
      adminRoutes.some(
        (route) => pathname.startsWith(route) || pathname === route,
      )
    ) {
      const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
      const userEmail = userData.email as string;

      // If user is not an admin, redirect to unauthorized page
      if (!adminEmails.includes(userEmail)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    // Check for support routes
    if (
      supportRoutes.some(
        (route) => pathname.startsWith(route) || pathname === route,
      )
    ) {
      const userRole = userData.role as string;
      const userId = userData.id as string;

      // Allow support staff to access all support routes
      if (userRole === "support") {
        return response;
      }

      // Extract customer ID from the support path if it follows the pattern /support/{custId}
      const pathParts = pathname.split("/");
      if (pathParts.length >= 3 && pathParts[1] === "support") {
        const pathCustomerId = pathParts[2];

        // Allow customers to access only their own support routes
        if (userRole === "customer" && pathCustomerId === userId) {
          return response;
        }
      }

      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // All other cases, allow the request with our enhanced response
    return response;
  } catch (error) {
    // If token verification fails, redirect to login
    console.error("Token verification failed:", error);
    return NextResponse.redirect(
      new URL("/login?error=invalidToken", request.url),
    );
  }
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
     * 5. Image files (jpg, jpeg, png, gif, webp, avif, svg, ico)
     */
    "/((?!api/auth|_next|static|favicon.ico|robots.txt|\\.jpg|\\.jpeg|\\.png|\\.gif|\\.webp|\\.avif|\\.svg|\\.ico).*)",
  ],
};
