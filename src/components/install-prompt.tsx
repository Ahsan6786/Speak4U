"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after a short delay for better UX
      const hasSeenPrompt = localStorage.getItem("hasSeenInstallPrompt");
      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 5000);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const closePrompt = () => {
    setShowPrompt(false);
    localStorage.setItem("hasSeenInstallPrompt", "true");
  };

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-12 md:max-w-md z-[100]"
        >
          <div className="glass-card p-6 rounded-[2rem] border-primary/20 shadow-2xl flex items-center gap-6 relative overflow-hidden bg-card/80 backdrop-blur-2xl">
            <div className="absolute top-0 right-0 p-4">
              <button 
                onClick={closePrompt}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Download className="w-6 h-6 text-primary" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-black text-foreground">Install REVIAL</h3>
              <p className="text-xs text-muted-foreground mb-4">Install our app for a faster experience and easy access from your home screen.</p>
              
              <button
                onClick={handleInstall}
                className="w-full py-3 rounded-xl blue-gradient text-white font-black text-xs uppercase tracking-widest blue-glow hover:scale-[1.02] active:scale-95 transition-all"
              >
                Install Now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
