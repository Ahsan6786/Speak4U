"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, LogIn, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "./auth-provider";
import { cn } from "@/lib/utils";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md glass-card rounded-[2.5rem] p-8 md:p-10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6">
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-16 h-16 blue-gradient rounded-2xl flex items-center justify-center blue-glow mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-2">
                {isLogin ? "Welcome Back" : "Join the Elite"}
              </h2>
              <p className="text-muted-foreground font-medium">
                {isLogin ? "Sign in to continue your journey." : "Start your path to vocal mastery."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full blue-gradient py-4 rounded-full text-white font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all blue-glow disabled:opacity-50"
              >
                {loading ? "PROCESSING..." : isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
                <span className="bg-background px-4 text-muted-foreground">OR CONTINUE WITH</span>
              </div>
            </div>

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full py-3.5 rounded-full border-2 border-gray-400/60 bg-white hover:bg-gray-50 text-[#1f1f1f] font-medium text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-sm"
            >
              <Image src="/google.png" alt="Google" width={30} height={30} className="mr-2" />
              {isLogin ? "Sign in with Google" : "Sign up with Google"}
            </button>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              {isLogin ? "New to SpeakMirror?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-bold hover:underline"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
