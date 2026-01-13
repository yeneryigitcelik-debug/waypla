import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/hesabim",
  "/hesabim/cihazlar",
  "/hesabim/policeler",
  "/hesabim/hasarlar",
  "/hesabim/profil-duzenle",
  "/hasar-bildir",
  "/admin",
  "/partner",
];

const adminOnlyRoutes = ["/admin"];
const partnerOnlyRoutes = ["/partner"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if route needs protection
  const isProtected = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Get session
  const session = await auth();

  // If no session, redirect to login
  if (!session) {
    const loginUrl = new URL("/giris", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based checks
  const isAdminRoute = adminOnlyRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );

  const isPartnerRoute = partnerOnlyRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );

  if (isAdminRoute && session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPartnerRoute && session.user.role !== "PARTNER") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
