"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLoadingStore } from "@/store/loadingStore";

const PageLoader = () => {
  const pathname = usePathname();
  const { setLoading } = useLoadingStore();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000); // Loading ít nhất 1s
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

export default PageLoader;
