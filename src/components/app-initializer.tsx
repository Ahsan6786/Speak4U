"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { SplashScreen } from "@/components/splash-screen";

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem("splash-shown");
    if (splashShown) {
      setShowSplash(false);
      setMinTimePassed(true);
      return;
    }

    // Ensure splash is visible for at least 2 seconds for aesthetic impact
    const timer = setTimeout(() => {
      setMinTimePassed(true);
      sessionStorage.setItem("splash-shown", "true");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Hide splash only when BOTH auth is loaded and minimum time has passed
    if (!loading && minTimePassed) {
      setShowSplash(false);
    }
  }, [loading, minTimePassed]);

  return (
    <>
      <SplashScreen isVisible={showSplash} />
      <div className={showSplash ? "opacity-0" : "opacity-100 transition-opacity duration-1000"}>
        {children}
      </div>
    </>
  );
}
