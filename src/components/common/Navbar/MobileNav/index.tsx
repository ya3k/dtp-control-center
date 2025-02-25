"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import React from "react";

export default function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div id="mobileNav" className="md:hidden">
      <Button onClick={() => setIsOpen(true)} className="bg-core">
        <Menu size={28} />
      </Button>
      <Sheet open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <SheetContent className="max-w-60">
          <nav className="flex flex-col gap-4 p-2">
            <h1 className="text-lg font-bold text-primary">Trang chủ</h1>
            <h1 className="text-lg font-bold text-gray-600 transition duration-100 hover:text-primary">
              Tour
            </h1>
            <h1 className="text-lg font-bold text-gray-600 transition duration-100 hover:text-primary">
              Về chúng tôi
            </h1>
            <h1 className="text-lg font-bold text-gray-600 transition duration-100 hover:text-primary">
              Liên hệ
            </h1>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
