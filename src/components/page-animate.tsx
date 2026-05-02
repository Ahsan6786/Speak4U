"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function PageAnimate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: "easeOut"
      }}
      className="flex flex-col min-h-screen w-full will-change-[opacity]"
      style={{ transform: "translateZ(0)" }}
    >
      {children}
    </motion.div>
  );
}
