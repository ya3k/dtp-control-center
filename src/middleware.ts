import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRoleEnum } from "@/types/user";
import { adminLinks, links, operatorLinks } from "./configs/routes";

const privatePath = [
  adminLinks.admin.href,
  adminLinks.dashboard.href,
  adminLinks.user.href,
  operatorLinks.operator.href,
  operatorLinks.dashboard.href,
  operatorLinks.employee.href,
  operatorLinks.tour.href,
  operatorLinks.createTour.href,
];

const authPath = [links.login.href];

const publicPaths = ['/partner']; // Add public paths here

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  const sessionToken = request.cookies.get("_auth");
  const role = request.cookies.get("role");

  // Allow access to public paths without authentication
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return response;
  }

  // Redirect unauthenticated users trying to access private paths
  if (privatePath.some((path) => pathname.startsWith(path)) && !sessionToken) {
    return NextResponse.redirect(new URL(links.login.href, request.url));
  }

  // Redirect authenticated users trying to access auth paths
  if (authPath.some((path) => pathname.startsWith(path)) && sessionToken) {
    if (sessionToken && role) {
      const userRole = role.value;
      if (userRole === UserRoleEnum.Admin) {
        return NextResponse.redirect(new URL(adminLinks.dashboard.href, request.url));
      } else if (userRole === UserRoleEnum.Operator) {
        return NextResponse.redirect(new URL(operatorLinks.dashboard.href, request.url));
      } 
    }
  }

  // Role-based authorization
  if (sessionToken && role) {
    const userRole = role.value;

    // Redirect tourist trying to access admin routes
    // if (
    //   userRole === UserRoleEnum.Tourist &&
    //   Object.values(adminLinks).some((adminLink) =>
    //     pathname.startsWith(adminLink.href)
    //   )
    // ) {
    //   return NextResponse.redirect(new URL(links.home.href, request.url));
    // }

    // Redirect tourist trying to access operator routes
    // if (
    //   userRole === UserRoleEnum.Tourist &&
    //   Object.values(operatorLinks).some((operatorLink) =>
    //     pathname.startsWith(operatorLink.href)
    //   )
    // ) {
    //   return NextResponse.redirect(new URL(links.home.href, request.url));
    // }

    // Redirect operator trying to access admin routes
    if (
      userRole === UserRoleEnum.Operator &&
      Object.values(adminLinks).some((adminLink) =>
        pathname.startsWith(adminLink.href)
      )
    ) {
      return NextResponse.redirect(new URL(operatorLinks.dashboard.href, request.url), { status: 303 });
    }

    // Redirect admin after login
    if (
      userRole === UserRoleEnum.Admin &&
      pathname === "/"
    ) {
      return NextResponse.redirect(new URL(adminLinks.dashboard.href, request.url));
    }

    // Redirect operator after login
    if (
      userRole === UserRoleEnum.Operator &&
      pathname === "/"
    ) {
      return NextResponse.redirect(new URL(operatorLinks.dashboard.href, request.url));
    }
  }

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Catch all routes except api, static files, images, favicon and partner
    '/((?!api|_next/static|_next/image|favicon.ico|partner).*)',
    
    // Auth routes
    '/login',
    
    // Admin routes
    '/admin',
    '/admin/dashboard',
    '/admin/users',
    '/admin/company',
    '/admin/destination',
    
    // Operator routes
    '/operator',
    '/operator/dashboard',
    '/operator/employees',
    '/operator/tours',
    '/operator/tours/create',
    '/operator/wallet',
    'operator/wallet/transaction'
  ]
};