"use client";

import { useEffect, useState } from "react";
import { useLoadingStore } from "@/store/loadingStore";
import { motion } from "framer-motion";

const LoadingBar = () => {
  const { isLoading } = useLoadingStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(20);
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 20, 90)); // Tăng dần tới 90%
      }, 300);

      return () => clearInterval(interval);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 300); // Reset về 0 sau khi hoàn thành
    }
  }, [isLoading]);

  return (
    <motion.div
      className="fixed top-0 left-0 h-1 bg-blue-500 z-50"
      initial={{ width: "0%" }}
      animate={{ width: `${progress}%` }}
      transition={{ ease: "linear", duration: 0.3 }}
    />
  );
};

export default LoadingBar;
