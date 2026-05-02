"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { useAuth } from "./auth-provider";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password);
      }
      onClose();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 touch-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 supports-[backdrop-filter]:backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md bg-black border border-zinc-800 rounded-[2.5rem] p-8 md:p-10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] transform-gpu will-change-transform"
          >
            <div className="absolute top-0 right-0 p-6">
              <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center mb-8">
              <img src="/splash.png" alt="REVIAL Logo" className="w-32 h-32 object-contain mb-2" />
              <h2 className="text-3xl font-black tracking-tight text-white">
                {isLogin ? "Welcome Back." : "Create Account."}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111111] border border-zinc-800 text-white placeholder:text-zinc-500 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111111] border border-zinc-800 text-white placeholder:text-zinc-500 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              {error && <p className="text-red-400 text-sm font-medium text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white hover:bg-zinc-100 py-4 rounded-full text-black font-black flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg"
              >
                {loading ? "PROCESSING..." : isLogin ? "SIGN IN" : "CONTINUE"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
                <span className="bg-black px-4 text-zinc-500">OR</span>
              </div>
            </div>

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full py-4 rounded-full border border-zinc-700 bg-white hover:bg-zinc-100 text-black font-black text-[15px] flex items-center justify-center gap-4 transition-all disabled:opacity-50"
            >
              <Image src="/google.png" alt="Google" width={32} height={32} className="mr-1" />
              {isLogin ? "Sign in with Google" : "Sign up with Google"}
            </button>

            <p className="mt-8 text-center text-sm text-zinc-400 font-medium">
              {isLogin ? "New to REVIAL?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white font-black hover:text-blue-400 transition-colors"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
