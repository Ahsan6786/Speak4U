"use client";

import Link from "next/link";
import { Mic, Shield, TrendingUp, LogOut, ArrowRight, Play, AudioLines, Sparkles } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { AuthModal } from "@/components/auth-modal";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ["voice.", "clarity.", "confidence.", "influence."];

  // Audio Bar Animation state for the mock UI
  const [bars, setBars] = useState<number[]>(Array(24).fill(10));
  useEffect(() => {
    const interval = setInterval(() => {
      setBars(Array.from({ length: 24 }, () => Math.floor(Math.random() * 40) + 10));
    }, 300); // Reduced frequency for performance
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-zinc-100 selection:bg-yellow-500/30 overflow-hidden font-sans relative">
      
      {/* Premium Parametric Signal Wave at Top */}
      <div className="absolute top-0 left-0 w-full h-[15vh] opacity-80 pointer-events-none z-40 overflow-hidden">
        <div className="relative w-full h-full">
          {[1, 2, 3].map((i) => (
            <motion.svg
              key={i}
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 1440 120"
              initial={{ x: i % 2 === 0 ? "-20%" : "20%" }}
              animate={{ x: i % 2 === 0 ? ["-20%", "0%", "-20%"] : ["20%", "0%", "20%"] }}
              transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
            >
              <path
                d="M0,60 C360,20 720,100 1440,60"
                fill="none"
                stroke={`url(#signal-gradient-${i})`}
                strokeWidth={0.5 + i * 0.2}
                className="opacity-40"
              />
              <defs>
                <linearGradient id={`signal-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="#FFC300" stopOpacity={0.5 - i * 0.1} />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </motion.svg>
          ))}
          {/* Subtle Glow beneath waves */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-yellow-500/5 blur-[80px]" />
        </div>
      </div>

      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <img 
                src="/splash.png" 
                alt="Splash Logo" 
                className="w-64 h-64 md:w-96 md:h-96 object-contain drop-shadow-[0_0_60px_rgba(255,195,0,0.15)]" 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Navigation Header */}
      <header className="absolute top-0 left-0 w-full py-8 px-6 md:px-12 z-50">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src="/splash.png" alt="REVIAL Logo" className="w-24 h-24 md:w-32 md:h-32 object-contain" />
          </Link>

          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500 tracking-tight">
              <Link href="#platform" className="hover:text-white transition-colors">Platform</Link>
              <Link href="#" className="hover:text-white transition-colors">Enterprise</Link>
              <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
            </nav>
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="px-6 py-2 rounded-full bg-white text-black font-black text-sm hover:bg-zinc-200 transition-colors shadow-xl">
                  Dashboard
                </Link>
                <button onClick={logout} className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-2 rounded-full bg-white text-black font-black text-sm hover:bg-zinc-200 transition-colors shadow-xl"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Center-Aligned Cinematic Hero */}
      <main className="min-h-screen relative flex flex-col items-center justify-center pt-32 text-center z-10 w-full max-w-7xl mx-auto px-6 overflow-hidden">
        
        {/* ATMOSPHERIC BACKGROUND: Cinematic Scene */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="w-full h-full relative"
          >
            <img 
              src="/confident_professional_speaking_1777667624647.png" 
              alt="Background Scene" 
              className="w-full h-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-[#000000]/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-[#000000]" />
          </motion.div>
        </div>



          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="relative z-10 max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.9] text-white mb-4">
              Master your <br />
              <div className="h-[1.1em] overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={words[currentWordIndex]}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-[#FFC300] drop-shadow-[0_0_50px_rgba(255,195,0,0.2)] absolute left-0 right-0"
                  >
                    {words[currentWordIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h1>


          
          <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
            The world’s most advanced AI speech coach. <br className="hidden md:block" />
            Built for those who refuse to be ignored.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto px-12 py-6 bg-[#FFC300] text-black font-black text-xl rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,195,0,0.4)] active:scale-95"
            >
              Start Speaking Better
            </button>
            <button className="w-full sm:w-auto px-12 py-6 bg-transparent border border-white/20 text-white font-black text-xl rounded-full hover:bg-white/5 transition-all active:scale-95">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Dynamic Light Rays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,195,0,0.05)_0%,transparent_70%)]" />
        </div>

        {/* Film Grain Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </main>

      {/* The 4 Pillars Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-8">
          
          {[
            { img: "1.png", title: "Lead the Room", desc: "Take control of the conversation from the first word." },
            { img: "2.png", title: "Control the Narrative", desc: "Speak with absolute clarity and precision." },
            { img: "3.png", title: "Become Confident", desc: "Eliminate filler words and natural hesitation." },
            { img: "4.png", title: "Command Authority", desc: "Leave zero doubt in your audience's mind." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 100, damping: 20 }}
              className="flex flex-col items-center text-center group"
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="w-64 h-64 sm:w-80 sm:h-80 md:w-full md:aspect-square mb-8 relative"
              >
                <img 
                  src={`/${item.img}`} 
                  alt={item.title} 
                  className="w-full h-full object-cover rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-white/5" 
                />
              </motion.div>
              <h3 className="text-2xl font-black text-white mb-3">{item.title}</h3>
              <p className="text-lg text-zinc-400 font-medium max-w-[280px]">{item.desc}</p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* The Animated Audio Mockup Section */}
      <section className="w-full px-6 py-24 relative z-10 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] p-8 md:p-16 flex flex-col items-center text-center shadow-2xl relative"
        >
          {/* Animated Waveform */}
          <div className="flex items-end gap-1.5 md:gap-2 h-32 mb-12 w-full justify-center opacity-90 relative overflow-hidden">
            {bars.map((height, i) => (
              <motion.div 
                key={i}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.15, ease: "linear" }}
                className="w-3 md:w-5 bg-yellow-500 rounded-t-md shadow-[0_0_15px_rgba(234,179,8,0.3)]"
              />
            ))}
            {/* Unique Scanning Laser */}
            <motion.div 
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-y-0 w-1 bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)] z-10"
            />
          </div>

          <div className="inline-flex items-center gap-2 bg-zinc-800 px-5 py-2.5 rounded-full mb-6 border border-zinc-700">
            <AudioLines className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Live AI Analysis</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">
            Real-time neural feedback.
          </h2>
          <p className="text-xl text-zinc-400 font-medium max-w-2xl">
            We don't just record audio. We process every syllable, tone, and pause to give you actionable insights the second you stop speaking.
          </p>
        </motion.div>
      </section>

      {/* Out of the Box Bento Grid */}
      <section id="platform" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6">
            Everything you need.
          </h2>
          <p className="text-xl text-yellow-500 font-black uppercase tracking-widest">Built for speed. Designed for growth.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[240px]">
          {/* Card 1: AI Feedback - Large & Immersive */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="md:col-span-8 md:row-span-2 bg-zinc-900 border border-zinc-800 rounded-[3rem] p-12 flex flex-col justify-between group overflow-hidden relative shadow-2xl will-change-transform"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                <Mic className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-4xl font-black text-white mb-4">AI-Powered Insights</h3>
              <p className="text-zinc-400 text-xl max-w-md leading-relaxed">
                Our AI analyzes your tone, pace, and clarity in real-time, providing actionable feedback to master your delivery.
              </p>
            </div>
            {/* Unique Visual Element inside card */}
            <div className="absolute right-[-10%] bottom-[-10%] w-2/3 h-2/3 bg-zinc-800/50 rounded-full blur-3xl group-hover:bg-yellow-500/10 transition-colors" />
            <div className="absolute right-10 bottom-10 w-64 h-32 flex items-end gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
              {[40, 70, 45, 90, 65, 30, 85, 50, 75, 40].map((h, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [`${h}%`, `${h+10}%`, `${h}%`] }}
                  transition={{ duration: 1 + i*0.1, repeat: Infinity }}
                  className="flex-1 bg-yellow-500 rounded-full"
                />
              ))}
            </div>
          </motion.div>

          {/* Card 2: Privacy - High Gloss Small */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="md:col-span-4 md:row-span-1 bg-zinc-900/50 backdrop-blur-xl border border-zinc-700 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center group shadow-xl will-change-transform"
          >
            <Shield className="w-12 h-12 text-yellow-500 mb-6 group-hover:rotate-12 transition-transform" />
            <h3 className="text-2xl font-black text-white mb-2">100% Private</h3>
            <p className="text-zinc-500 font-medium">Your sessions are yours alone.</p>
          </motion.div>

          {/* Card 3: Growth - Horizontal */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ x: 5 }}
            className="md:col-span-4 md:row-span-1 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex items-center gap-6 group will-change-transform"
          >
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-yellow-500 transition-colors">
              <TrendingUp className="w-8 h-8 text-white group-hover:text-black transition-colors" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Daily Progress</h3>
              <p className="text-zinc-500">Track your confidence score daily.</p>
            </div>
          </motion.div>

          {/* Card 4: Launch - The Anchor */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            className="md:col-span-12 md:row-span-1 bg-yellow-500 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between group text-black overflow-hidden relative shadow-2xl"
          >
            <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="text-4xl md:text-5xl font-black mb-4">Ready to start?</h3>
              <p className="text-yellow-950 text-xl font-medium max-w-xl">
                No complex setups. No waiting. Just press start and begin transforming your voice today.
              </p>
            </div>
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="mt-8 md:mt-0 relative z-10 px-12 py-6 bg-black text-white font-black rounded-full hover:scale-105 active:scale-95 transition-all text-xl shadow-2xl"
            >
              Launch Platform
            </button>
            {/* Unique Background Decoration */}
            <div className="absolute right-[-5%] top-[-50%] w-64 h-64 bg-black/5 rounded-full blur-3xl pointer-events-none" />
            <Play className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] text-black/5 pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="w-full pt-16 pb-8 px-8 border-t border-zinc-900 bg-[#0A0A0B] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center">
            <img src="/splash.png" alt="REVIAL Logo" className="w-20 h-20 md:w-24 md:h-24 object-contain grayscale opacity-70" />
          </div>
          <div className="flex gap-8 text-zinc-600 font-black text-sm uppercase tracking-widest">
            <span className="cursor-not-allowed hover:text-white transition-colors">Privacy</span>
            <span className="cursor-not-allowed hover:text-white transition-colors">Terms</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
