"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";


export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center group"
      aria-label="Toggle Theme"
    >
      <>
        {resolvedTheme === "dark" ? (
          <div
            key="sun"
            
            
            
            
          >
            <Sun className="w-5 h-5 text-yellow-400" />
          </div>
        ) : (
          <div
            key="moon"
            
            
            
            
          >
            <Moon className="w-5 h-5 text-slate-400" />
          </div>
        )}
      </>
    </button>
  );
}
