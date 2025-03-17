import { adminLinks, links, operatorLinks } from "@/configs/routes";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { UserRoleEnum } from "@/types/user";

const privatePath = [
  links.passenger.href,

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

  //   if (
  //     sessionToken &&
  //     role?.value === UserRole.User &&
  //     Object.values(adminLinks).some((adminLink) =>
  //       pathname.startsWith(adminLink.href),
  //     )
  //   ) {
  //     return NextResponse.redirect(new URL(links.home.href, request.url));
  //   }

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    links.passenger.href,
    links.login.href,
    links.checkout.href,
    links.register.href,
    adminLinks.admin.href,
    adminLinks.dashboard.href,
    adminLinks.user.href,
    operatorLinks.operator.href,
    operatorLinks.dashboard.href,
    operatorLinks.employee.href,
    operatorLinks.tour.href,
    operatorLinks.createTour.href,

    // links.orders.href,
  ],
};
