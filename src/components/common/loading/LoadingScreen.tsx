"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const LoadingScreen = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  return isLoading ? (
    <>
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Image
            width={400}
            height={400}
            src="/images/binhdinhtour3.png"
            priority
            alt="logo"
            className="h-20 sm:h-28 md:h-32 w-auto object-cover"
          />
        </motion.div>
      </div>
    </>
  ) : (
    children
  );
};

export default LoadingScreen;
