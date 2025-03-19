import { adminLinks, links, operatorLinks } from "@/configs/routes";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { UserRoleEnum } from "@/types/user";

const privatePath = [
  links.passenger.href,
  links.checkout.href,

  adminLinks.admin.href,
  adminLinks.dashboard.href,
  adminLinks.user.href,

  operatorLinks.operator.href,
  operatorLinks.dashboard.href,
  operatorLinks.employee.href,
  operatorLinks.tour.href,
  operatorLinks.createTour.href,
];


const authPath = [links.login.href, links.register.href];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  const sessionToken = request.cookies.get("sessionToken");
  const role = request.cookies.get("role");

  if (privatePath.some((path) => pathname.startsWith(path)) && !sessionToken) {
    return NextResponse.redirect(new URL(links.login.href, request.url));
  }
  if (authPath.some((path) => pathname.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL(links.home.href, request.url));
  }


  // Role-based authorization
  if (sessionToken && role) {
    const userRole = role.value;

    // Redirect tourist trying to access admin routes
    if (
      userRole === UserRoleEnum.Tourist &&
      Object.values(adminLinks).some((adminLink) =>
        pathname.startsWith(adminLink.href)
      )
    ) {
      return NextResponse.redirect(new URL(links.home.href, request.url));
    }

    // Redirect tourist trying to access operator routes
    if (
      userRole === UserRoleEnum.Tourist &&
      Object.values(operatorLinks).some((operatorLink) =>
        pathname.startsWith(operatorLink.href)
      )
    ) {
      return NextResponse.redirect(new URL(links.home.href, request.url));
    }

    // Redirect operator trying to access admin routes
    if (
      userRole === UserRoleEnum.Operator &&
      Object.values(adminLinks).some((adminLink) =>
        pathname.startsWith(adminLink.href)
      )
    ) {
      return NextResponse.redirect(new URL(operatorLinks.dashboard.href, request.url));
    }

    // Redirect admin after login
    if (
      userRole === UserRoleEnum.Admin &&
      pathname === links.home.href
    ) {
      return NextResponse.redirect(new URL(adminLinks.dashboard.href, request.url));
    }

    // Redirect operator after login
    if (
      userRole === UserRoleEnum.Operator &&
      pathname === links.home.href
    ) {
      return NextResponse.redirect(new URL(operatorLinks.dashboard.href, request.url));
    }
  } 

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    links.passenger.href,
    links.login.href,
    `${links.checkout.href}/:id*`,
    links.register.href,

    //admin
    adminLinks.admin.href,
    adminLinks.dashboard.href,
    adminLinks.user.href,

    //operator
    operatorLinks.operator.href,
    operatorLinks.dashboard.href,
    operatorLinks.employee.href,
    operatorLinks.tour.href,
    operatorLinks.createTour.href,

    // links.orders.href,
  ],
};
