"use client";
import { Menu } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { links } from "@/configs/routes";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const navLinks = [links.home, links.tour, links.blog, links.about];
  return (
    <div id="mobileNav" className="lg:hidden">
      <Button onClick={() => setIsOpen(true)} className="bg-core">
        <Menu size={28} />
      </Button>
      <Sheet open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <SheetContent className="max-w-60">
          <nav className="flex flex-col gap-4 p-2 mb-6">
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
          <div className="items-center gap-4">
            <Button className="bg-core text-base">Đăng nhập</Button>
            <Button variant="ghost" className="text-base">
              Đăng ký
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
