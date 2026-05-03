"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

export function ThemeColorHandler() {
  const pathname = usePathname();
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    // Determine the correct color based on route and theme
    // You can customize colors for specific pages here
    let color = "#000000"; // Default dark

    const isDark = resolvedTheme === "dark" || theme === "dark";

    if (isDark) {
      // Dark mode backgrounds for different pages
      if (pathname === "/") color = "#000000"; // Landing
      else if (pathname === "/dashboard") color = "#0a0a0a"; // Dashboard
      else if (pathname === "/results") color = "#0a0a0a"; // Results
      else color = "#000000";
    } else {
      // Light mode backgrounds
      color = "#F5F5F5"; // The user's requested light color
    }

    // Update meta tag
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", color);
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "theme-color";
      newMeta.content = color;
      document.head.appendChild(newMeta);
    }

    // iOS Safari specific: Add apple-mobile-web-app-status-bar-style
    // 'default' uses white text on dark backgrounds and black text on light backgrounds
    const appleMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (appleMeta) {
      appleMeta.setAttribute("content", "default");
    }

  }, [pathname, theme, resolvedTheme]);

  return null;
}
