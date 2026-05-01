"use client";

import Link from "next/link";
import { Mic, Shield, Zap, TrendingUp, ChevronRight, Sparkles, LogOut, User, Brain } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/auth-provider";
import { AuthModal } from "@/components/auth-modal";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = ["CONFIDENCE", "CLARITY", "AUTHORITY"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden transition-colors duration-300">

      {/* ALWAYS CREAM Hero Frame */}
      <div className="p-2 md:p-4 bg-[#FDFBF7]">
        {/* Framed Content Container */}
        <div className="flex-1 flex flex-col bg-[#0A1A2F] rounded-[1.5rem] md:rounded-[3rem] relative overflow-hidden shadow-2xl border border-white/5 min-h-[100dvh] md:min-h-0">

        {/* Animated Water Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

        {/* Navigation - Transparent for Hero */}
        <header className="absolute top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 md:h-24 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Mic className="text-white w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="text-lg md:text-xl font-black tracking-tighter text-white">SpeakMirror</span>
            </Link>

            <div className="flex items-center gap-2 md:gap-4">
              <ThemeToggle />
              {user ? (
                <div className="flex items-center gap-2">
                  <Link href="/dashboard" className="px-3 md:px-6 py-2 rounded-xl bg-white text-[#0A1A2F] font-bold text-xs md:text-sm hover:bg-[#FDFBF7] transition-colors shadow-xl whitespace-nowrap">
                    Dashboard
                  </Link>
                  <button 
                    onClick={logout}
                    className="p-2 md:p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors shrink-0"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 md:px-6 py-2 rounded-xl bg-white text-[#0A1A2F] font-bold text-xs md:text-sm hover:bg-[#FDFBF7] transition-colors shadow-xl"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section Content */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-24 md:pt-32 md:pb-56 relative z-10">

          <div className="flex flex-col items-center justify-center mb-8 md:mb-12">
            <h1 className="text-4xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase text-[#FDFBF7]">
              SPEAK WITH <br />
              <div className="relative inline-flex flex-col items-center min-h-[1.1em]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phrases[currentPhrase]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="text-blue-400 italic whitespace-nowrap absolute inset-0 flex items-center justify-center"
                  >
                    {phrases[currentPhrase]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h1>
          </div>

          <p className="text-blue-100/70 text-base md:text-2xl max-w-xl md:max-w-2xl mb-12 md:mb-16 leading-relaxed font-medium">
            Master the art of speaking. Practice daily with AI to build
            unshakeable confidence in just 7 days.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            {user ? (
              <Link
                href="/dashboard"
                className="px-10 md:px-12 py-4 md:py-5 rounded-2xl bg-blue-500 text-white font-black text-lg md:text-xl flex items-center gap-3 hover:bg-blue-400 transition-colors shadow-2xl shadow-blue-500/20"
              >
                Master Your Speech
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-10 md:px-12 py-4 md:py-5 rounded-2xl bg-blue-500 text-white font-black text-lg md:text-xl flex items-center gap-3 hover:bg-blue-400 transition-colors shadow-2xl shadow-blue-500/20"
              >
                Start Training Now
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}
          </div>
        </main>
      </div>
    </div>

      {/* Bento Grid Showcase */}
      <div className="mt-32 w-full max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:auto-rows-[240px]">

          {/* Main Feature - Large */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-8 md:row-span-2 glass-card rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 flex flex-col justify-end relative overflow-hidden border-primary/20 bg-primary/5"
          >
            <div className="absolute top-0 right-0 p-8 md:p-12 opacity-10 md:opacity-20 pointer-events-none">
              <Brain className="w-32 h-32 md:w-48 md:h-48 text-primary" />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl md:text-6xl font-black tracking-tight mb-4 md:mb-6 italic">Perfect Analysis.</h3>
              <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl">
                Our AI listens to every word. It finds your mistakes, tracks your "umms,"
                and helps you fix them in real-time.
              </p>
            </div>
          </motion.div>

          {/* Feature 2 - Tall */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-4 md:row-span-3 glass-card rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 flex flex-col items-center justify-center text-center border-blue-500/20 bg-blue-500/5"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 md:mb-8">
              <Shield className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black mb-3 md:mb-4">Real Truth.</h3>
            <p className="text-sm md:text-base text-muted-foreground font-medium italic">
              "We don't give nice feedback. We give you the truth."
            </p>
          </motion.div>

          {/* Feature 3 - Wide */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-8 md:row-span-1 glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 flex items-center gap-4 md:gap-8 border-purple-500/20 bg-purple-500/5"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black mb-1">Daily Habits.</h3>
              <p className="text-muted-foreground text-xs md:text-sm font-medium">1 minute a day to build unshakeable confidence.</p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Simple Storytelling Section */}
      <section id="how-it-works" className="w-full max-w-5xl mx-auto mt-24 px-6 space-y-24 pb-32">

        {/* Step 1: The Problem */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest">The Problem</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tight mb-8">
            Tired of <span className="text-red-500 italic">hesitating?</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            We all have great ideas. But sometimes, we feel nervous or use too many "umms."
            It stops people from hearing how smart you really are.
          </p>
        </motion.div>

        {/* Step 2: The Solution */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest">The Solution</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tight mb-8">
            Practice with <span className="text-primary italic">AI.</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Record yourself for just 60 seconds. Our AI will listen and show you
            exactly what to fix and how to improve your structure.
          </p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-8 rounded-[2rem] border-primary/20">
              <div className="text-3xl font-black text-primary mb-2">Listen</div>
              <p className="text-sm text-muted-foreground">AI hears every word.</p>
            </div>
            <div className="glass-card p-8 rounded-[2rem] border-primary/20">
              <div className="text-3xl font-black text-primary mb-2">Analyze</div>
              <p className="text-sm text-muted-foreground">AI finds the mistakes.</p>
            </div>
            <div className="glass-card p-8 rounded-[2rem] border-primary/20">
              <div className="text-3xl font-black text-primary mb-2">Improve</div>
              <p className="text-sm text-muted-foreground">Get tips to get better.</p>
            </div>
          </div>
        </motion.div>

        {/* Step 3: The Result */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-primary/5 rounded-[4rem] p-12 md:p-24 border border-primary/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest">The Result</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tight mb-10 leading-[0.9]">
            Speak with <br /> <span className="text-primary italic">Confidence.</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto mb-16">
            Stop worrying about your English. Land your dream job, lead meetings,
            and make people listen to you.
          </p>
          <Link
            href="/dashboard"
            className="blue-gradient px-12 py-8 rounded-[2.5rem] text-white font-black text-2xl inline-flex items-center gap-4 blue-glow hover:scale-110 transition-transform shadow-2xl shadow-primary/30"
          >
            Start Free Training
            <ChevronRight className="w-8 h-8" />
          </Link>
        </motion.div>

      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-24 px-8 bg-muted/30 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 blue-gradient rounded-xl flex items-center justify-center">
                  <Mic className="text-white w-6 h-6" />
                </div>
                <span className="font-black text-2xl tracking-tighter">SpeakMirror</span>
              </div>
              <p className="text-muted-foreground font-medium max-w-xs">
                The world's most advanced AI speaking coach. Master your voice, master your future.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="font-black text-sm uppercase tracking-[0.2em] text-foreground">Navigation</h4>
              <div className="flex flex-col gap-4 text-muted-foreground font-bold text-sm">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-black text-sm uppercase tracking-[0.2em] text-foreground">Company</h4>
              <div className="flex flex-col gap-4 text-muted-foreground font-bold text-sm">
                <span className="cursor-default opacity-50">Privacy Policy</span>
                <span className="cursor-default opacity-50">Terms of Service</span>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-muted-foreground font-bold text-[10px] tracking-widest uppercase">
              © 2026 SPEAKMIRROR. ALL RIGHTS RESERVED.
            </div>
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center hover:text-primary transition-colors cursor-pointer">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-card p-8 rounded-3xl text-left hover:border-zinc-700 transition-colors group">
      <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
