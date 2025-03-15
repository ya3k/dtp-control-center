"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";


import { links } from "@/configs/routes";
import MobileHeader from "@/components/common/Header/MobileHeader";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sessionToken } from "@/lib/https";
import authApiRequest from "@/apiRequests/auth";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const navLinks = [links.home, links.tour, links.blog, links.about];
  const specialLinks = [links.tour.href, links.blog.href, links.about.href];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleLogOut() {
    try {
      const response = await authApiRequest.logout();
      if(!response.payload.success) {
        console.error(response.payload.message);
        return;
      }
      const responseFromNextServer = await authApiRequest.removeToken();
      if (responseFromNextServer.payload.success) {
        toast.success("Đăng xuất thành công");
        router.refresh();
      } else {
        console.error(responseFromNextServer.payload.message);
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  }

  return (
    <>
      <header
        className={cn(
          "header",
          `fixed left-0 right-0 top-0 z-50 block transition-all duration-300 max-lg:hidden`,
          `${scrolled ? "bg-background/80 shadow-sm backdrop-blur-md" : "bg-transparent"}`,
        )}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between p-4 sm:px-6 md:max-w-4xl lg:max-w-6xl">
          <Link href={links.home.href}>
            <Image
              width={400}
              height={400}
              src="/images/binhdinhtour3.png"
              alt="logo"
              priority
              className="h-10 w-auto object-cover"
            />
          </Link>
          <nav className="flex items-center justify-start gap-2 lg:gap-14">
            {navLinks.map((link, index) => (
              <div key={index}>
                {pathname === link.href ? (
                  <Link
                    href={link.href}
                    className={cn(
                      "relative font-bold transition-colors md:text-sm lg:text-base",
                      `${
                        specialLinks.includes(pathname)
                          ? !scrolled
                            ? "text-white"
                            : "text-black"
                          : "text-black hover:opacity-70"
                      }`,
                    )}
                  >
                    {link.label}
                    <motion.span
                      layoutId="underline"
                      className={cn(
                        "absolute bottom-0 left-0 h-0.5 w-full",
                        `bg-${specialLinks.includes(pathname) ? (scrolled ? "black" : "white") : "black"}`,
                      )}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  </Link>
                ) : (
                  <Link
                    prefetch
                    href={link.href}
                    className={cn(
                      `font-bold transition-colors md:text-sm lg:text-base`,
                      `${specialLinks.includes(pathname) ? (!scrolled ? "text-gray-200" : "text-gray-800") : "text-gray-800"}`,
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          {sessionToken.value ? (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Giỏ hàng</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={()=> handleLogOut()}>
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
            <ShoppingCart />
          </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                variant={specialLinks.includes(pathname) ? "outline" : "core"}
                className={cn(
                  "md:text-sm lg:text-base",
                  `${specialLinks.includes(pathname) ? (scrolled ? "border-black text-black" : "text-white") : ""}`,
                  `${specialLinks.includes(pathname) ? "bg-transparent" : ""}`,
                )}
              >
                <Link href={links.login.href}>{links.login.label}</Link>
              </Button>
              <Button
                variant="outline"
                className={cn(
                  `${specialLinks.includes(pathname) ? (scrolled ? "border-black text-black" : "text-white") : "border-2 border-black text-black"}`,
                  "bg-transparent text-base md:text-sm",
                )}
              >
                <Link href={links.register.href}>{links.register.label}</Link>
              </Button>
            </div>
          )}
        </div>
      </header>
      <MobileHeader scrolled={scrolled} specialLinks={specialLinks} />
    </>
  );
}
