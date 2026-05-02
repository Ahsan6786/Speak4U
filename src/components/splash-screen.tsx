"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export function SplashScreen({ isVisible }: { isVisible: boolean }) {
  const [shouldRender, setShouldRender] = useState(isVisible);
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 1000); // Wait for fade out
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black"
        >
          {/* Main Logo Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              transition: { duration: 1, ease: "easeOut" }
            }}
            className="relative w-64 h-64 md:w-96 md:h-96"
          >
            <Image
              src="/splash.png"
              alt="REVIAL Logo"
              fill
              className="object-contain p-8"
              priority
            />
            
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
