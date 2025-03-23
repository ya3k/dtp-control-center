"use client";
import { Menu, ShoppingCart, User } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { links } from "@/configs/routes";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sessionToken } from "@/lib/http";
import AuthMenu from "@/components/common/Header/AuthMenu";

interface MobileHeaderProps {
  scrolled: boolean;
  specialLinks?: string[];
}

export default function MobileHeader({
  scrolled,
  specialLinks,
}: MobileHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const navLinks = [links.home, links.tour, links.blog, links.about];

  return (
    <header
      className={cn(
        "header",
        `fixed left-0 right-0 top-0 z-50 block transition-all duration-300 lg:hidden`,
        `${specialLinks?.includes(pathname) ? "" : "bg-white"}`,
        `${scrolled ? "bg-background/80 shadow-sm backdrop-blur-md" : "bg-transparent"}`,
      )}
    >
      <div className="mx-auto flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button
            className={cn(
              `${specialLinks?.includes(pathname) ? (scrolled ? "border-black text-black" : "text-white hover:text-white") : ""}`,
              "bg-transparent hover:bg-transparent",
            )}
            onClick={() => setIsOpen(true)}
            size="default"
            variant="outline"
          >
            <Menu size={28} />
          </Button>
          <Sheet open={isOpen} onOpenChange={() => setIsOpen(false)}>
            <SheetContent className="max-w-60">
              <nav className="mb-6 flex flex-col gap-4 p-2">
                {navLinks.map((link, index) => (
                  <div key={index}>
                    {pathname === link.href ? (
                      <Link href={link.href}>
                        <h1 className="text-lg font-bold text-core">
                          {link.label}
                        </h1>
                      </Link>
                    ) : (
                      <Link href={link.href} onClick={() => setIsOpen(false)}>
                        <h1 className="text-lg font-bold text-gray-600 transition duration-100 hover:text-core">
                          {link.label}
                        </h1>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
              {/* <div className="items-center gap-4">
                <Button className="bg-core text-base">
                  <Link href={links.login.href}>{links.login.label}</Link>
                </Button>
                <Button variant="ghost" className="text-base">
                  <Link href={links.register.href}>{links.register.label}</Link>
                </Button>
              </div> */}
            </SheetContent>
          </Sheet>
          <Link href={links.home.href}>
            <Image
              width={400}
              height={400}
              src="/images/binhdinhtour3.png"
              alt="logo"
              className="h-8 w-auto object-cover md:h-10"
              priority
            />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {sessionToken.value ? (
            <AuthMenu>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </AuthMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                `${specialLinks?.includes(pathname) ? (scrolled ? "border-black text-black" : "text-white") : ""}`,
                "md:text-sm lg:text-base",
                `${specialLinks?.includes(pathname) ? "bg-transparent" : ""}`,
                "sm:text-base",
              )}
            >
              <Link href={links.login.href}>
                <User />
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className={cn(
              `${specialLinks?.includes(pathname) ? (scrolled ? "border-black text-black" : "text-white") : ""}`,
              "md:text-sm lg:text-base",
              `${specialLinks?.includes(pathname) ? "bg-transparent" : ""}`,
              "sm:text-base",
            )}
            onClick={() => router.push(links.shoppingCart.href)}
          >
            <ShoppingCart />
          </Button>
        </div>
      </div>
    </header>
  );
}
