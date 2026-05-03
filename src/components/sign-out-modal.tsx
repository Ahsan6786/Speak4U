"use client";

import { LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SignOutModal({ isOpen, onClose, onConfirm }: SignOutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-background border border-border rounded-[2.5rem] p-8 shadow-2xl overflow-hidden group">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 -mr-16 -mt-16 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-6">
            <LogOut size={32} />
          </div>

          <h3 className="text-2xl font-black italic tracking-tight uppercase mb-2 text-foreground">Sign Out?</h3>
          <p className="text-muted-foreground text-sm font-medium mb-8">
            Are you sure you want to end your current session? You'll need to log back in to access your dashboard.
          </p>

          <div className="flex flex-col w-full gap-4 mt-4">
            <button
              onClick={onConfirm}
              className="w-full py-4 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:bg-red-500 transition-all active:scale-95 shadow-lg shadow-red-600/20"
            >
              Confirm Sign Out
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 rounded-full bg-muted border border-border text-foreground font-black text-xs uppercase tracking-widest hover:bg-accent transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
