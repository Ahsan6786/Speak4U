"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mic, Shield, TrendingUp, LogOut, ArrowRight,
  Zap, Globe, ChevronRight, Activity, Command,
  Cpu, Layers, Volume2, Fingerprint, BarChart3,
  Dna, Play, Pause, Sparkles, MoveRight
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { AuthModal } from "@/components/auth-modal";
import { motion, AnimatePresence, useScroll, useSpring, useInView } from "framer-motion";

// --- SUB-COMPONENT: DYNAMIC PARTICLE BACKGROUND ---
const HeroParticles = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      id: i,
      x: Math.random() * 100 + "%",
      y: Math.random() * 100 + "%",
      opacity: Math.random() * 0.5 + 0.1,
      targetY: Math.random() * -100 - 50,
      duration: Math.random() * 5 + 10,
    }));
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#FFD70005_0%,transparent_50%)]" />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1.5 h-1.5 bg-yellow-500/10 rounded-full will-change-transform"
          style={{ transform: "translateZ(0)", left: p.x, top: p.y }}
          initial={{ opacity: 0 }}
          animate={{
            y: [0, p.targetY],
            opacity: [0, p.opacity, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// --- SUB-COMPONENT: AI TERMINAL MOCKUP ---
const TerminalMockup = () => {
  const [lines, setLines] = useState<string[]>([]);
  const consoleStrings = [
    "> Initialize Neural Voice Engine...",
    "> Frequency Analysis: OPTIMAL",
    "> Detecting Filler Words: 'Uh', 'Like' suppressed.",
    "> Confidence Quotient: 98.4%",
    "> Resonance Calibration: ACTIVE",
    "> Deploying Vocal Authority Matrix..."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLines((prev) => [...prev, consoleStrings[i]].slice(-5));
      i = (i + 1) % consoleStrings.length;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-yellow-500/20 rounded-xl p-4 font-mono text-[10px] md:text-xs text-yellow-500/80 shadow-2xl">
      <div className="flex gap-1.5 mb-3 border-b border-white/5 pb-2">
        <div className="w-2 h-2 rounded-full bg-red-500/50" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
        <div className="w-2 h-2 rounded-full bg-green-500/50" />
      </div>
      {lines.map((line, idx) => (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={idx} className="mb-1">
          {line}
        </motion.div>
      ))}
      <motion.div animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-2 h-4 bg-yellow-500 align-middle ml-1" />
    </div>
  );
};

// --- SUB-COMPONENT: VISUALIZER MOCKUP ---
const VisualizerMockup = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const bars = useMemo(() => {
    return [...Array(40)].map((_, i) => ({
      id: i,
      heights: [10, Math.random() * 80 + 20, 10],
      duration: 1.5,
      delay: i * 0.05
    }));
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full gap-1">
        {[...Array(40)].map((_, i) => (
          <div key={i} className="w-1.5 h-4 bg-yellow-500/20 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full gap-1">
      {bars.map((bar) => (
        <motion.div
          key={bar.id}
          animate={{ height: bar.heights }}
          transition={{ duration: bar.duration, repeat: Infinity, ease: "easeInOut", delay: bar.delay }}
          className="w-1.5 bg-yellow-500/40 rounded-full will-change-transform"
          style={{ transform: "translateZ(0)" }}
        />
      ))}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function Home() {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // High-performance scroll tracking
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-zinc-100 selection:bg-yellow-400 selection:text-black overflow-x-hidden">


      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${scrolled ? "py-4" : "py-10"
        }`}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? "bg-black/60 supports-[backdrop-filter]:backdrop-blur-2xl border border-white/5 p-4 rounded-2xl shadow-2xl" : ""
            }`}>
            <Link href="/" className="flex items-center no-underline border-none outline-none">
              <Image src="/splash.png" alt="Logo" width={220} height={80} className="w-auto h-16 md:h-20" priority />
            </Link>

            <div className="flex items-center gap-6">
              {!user ? (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="relative overflow-hidden bg-yellow-500 text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all group shadow-lg shadow-yellow-500/10"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/dashboard" className="text-[10px] font-black uppercase text-yellow-500 border border-yellow-500/20 px-4 py-2 rounded-lg hover:bg-yellow-500/10 transition-all">Dashboard</Link>
                  <button onClick={logout} className="text-zinc-500 hover:text-white"><LogOut size={20} /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-svh flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
        <HeroParticles />

        {/* Animated Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-yellow-500 blur-[180px] rounded-full animate-pulse" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 items-center gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="transform-gpu will-change-transform"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-yellow-500" />
              <span className="text-yellow-500 font-black text-xs uppercase tracking-[0.4em]"></span>
            </div>

            <h1 className="text-7xl md:text-[110px] font-black leading-[0.85] tracking-tighter mb-10">
              UNLEASH THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-white">DOMINANT</span><br />
              VOICE.
            </h1>

            <p className="text-zinc-400 text-xl md:text-2xl font-medium max-w-xl mb-12 leading-relaxed">
              Proprietary neural algorithms that decode your vocal impact.
              Refine tone, eliminate hesitation, and master any room.
            </p>

            <div className="flex flex-wrap gap-6">
              <button onClick={() => setIsAuthModalOpen(true)} className="px-10 py-5 bg-white text-black font-black rounded-2xl flex items-center gap-3 hover:bg-[#00d2ff] hover:scale-105 transition-all shadow-2xl shadow-white/10">
                ACCESS PLATFORM <MoveRight size={20} />
              </button>

            </div>
          </motion.div>

          {/* Hero Visual: The "Matrix" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="relative flex justify-center lg:justify-end transform-gpu will-change-transform"
          >
            <div className="relative w-full max-w-[500px] aspect-square">
              {/* Glass Card 1 */}
              <div className="absolute top-0 right-0 w-4/5 h-4/5 bg-zinc-900/50 supports-[backdrop-filter]:backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl transform rotate-3 z-10 translate-z-0">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Volume2 className="text-black" />
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Confidence Score</div>
                    <div className="text-3xl font-black text-yellow-500">98.2%</div>
                  </div>
                </div>

                <div className="space-y-6">
                  {[70, 40, 90].map((w, i) => (
                    <div key={i} className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${w}%` }}
                        transition={{ duration: 2, delay: 1 }}
                        className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                      />
                    </div>
                  ))}
                </div>
              </div>


              {/* Background Geometric Decoration */}
              <div className="absolute inset-0 border-2 border-yellow-500/20 rounded-full animate-[spin_20s_linear_infinity] opacity-20" />
              <div className="absolute inset-4 border border-dashed border-white/10 rounded-full animate-[spin_30s_linear_infinity_reverse]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS STRIP --- */}
      <div className="py-10 bg-white text-black overflow-hidden relative">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex whitespace-nowrap gap-20 items-center"
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-6">
              <span className="text-4xl font-black tracking-tighter uppercase italic">Neural Processing</span>
              <div className="w-3 h-3 bg-black rounded-full" />
              <span className="text-4xl font-black tracking-tighter uppercase italic">Vocal Mastery</span>
              <div className="w-3 h-3 bg-black rounded-full" />
              <span className="text-4xl font-black tracking-tighter uppercase italic">98% Clarity</span>
              <div className="w-3 h-3 bg-black rounded-full" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* --- FEATURES: BENTO GRID --- */}
      <section id="ecosystem" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase italic">Built for the <span className="text-yellow-500">Elite.</span></h2>
          <p className="text-zinc-500 text-xl max-w-2xl mx-auto">We've spent 40,000 hours training our model on the world's most successful speeches.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Main Feature */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:col-span-7 bg-zinc-900/30 supports-[backdrop-filter]:backdrop-blur-3xl border border-white/5 rounded-[4rem] p-12 overflow-hidden relative group transform-gpu will-change-transform"
          >
            <div className="relative z-10">
              <div className="flex gap-4 items-center mb-10">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10">
                  <Cpu className="text-yellow-500" size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tighter">Bio-Metric Vocal ID</h3>
                  <p className="text-zinc-500 text-sm">Personalized feedback tailored to your DNA.</p>
                </div>
              </div>
              <p className="text-zinc-400 text-xl leading-relaxed mb-8">Our engine identifies your unique pitch baseline and resonance profile, ensuring that coaching feels natural, never robotic.</p>
              <button className="text-yellow-500 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                LEARN MORE <ArrowRight size={18} />
              </button>
            </div>
            {/* Visual background */}
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-30 transition-opacity">
              <Dna size={400} />
            </div>
          </motion.div>

          {/* Side Feature 1 */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:col-span-5 bg-yellow-500 rounded-[4rem] p-12 text-black flex flex-col justify-between transform-gpu will-change-transform"
          >
            <div className="flex justify-between items-start">
              <Fingerprint size={48} strokeWidth={2.5} />
              <div className="bg-black text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Secure</div>
            </div>
            <div>
              <h3 className="text-4xl font-black tracking-tighter mb-4 italic">Unrivaled Privacy.</h3>
              <p className="font-bold opacity-80 leading-snug">All processing happens in an isolated enclave. Your voice is yours alone. Period.</p>
            </div>
          </motion.div>

          {/* Small Bento 1 */}
          <div className="md:col-span-4 bg-zinc-900 border border-white/5 rounded-[3rem] p-10 hover:border-yellow-500/50 transition-colors">
            <BarChart3 className="text-yellow-500 mb-6" size={32} />
            <h4 className="text-xl font-black mb-2 uppercase italic">Micro-Analytics</h4>
            <p className="text-zinc-500 text-sm">Every pause, every breath, every 'um' analyzed to the millisecond.</p>
          </div>

          {/* Small Bento 2 */}
          <div className="md:col-span-4 bg-zinc-900 border border-white/5 rounded-[3rem] p-10 hover:border-yellow-500/50 transition-colors">
            <Layers className="text-yellow-500 mb-6" size={32} />
            <h4 className="text-xl font-black mb-2 uppercase italic">Multi-Modal</h4>
            <p className="text-zinc-500 text-sm">Switch between speech, debate, and interview modes instantly.</p>
          </div>

          {/* Small Bento 3 */}
          <div className="md:col-span-4 bg-zinc-900 border border-white/5 rounded-[3rem] p-10 hover:border-yellow-500/50 transition-colors">
            <Sparkles className="text-yellow-500 mb-6" size={32} />
            <h4 className="text-xl font-black mb-2 uppercase italic">AI Persona</h4>
            <p className="text-zinc-500 text-sm">Practice against challenging AI personas that simulate real high-stakes environments.</p>
          </div>

        </div>
      </section>

      {/* --- SHOWCASE: REAL-TIME FEEDBACK --- */}
      <section className="py-32 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-6xl font-black tracking-tighter mb-8 italic">THE ENGINE IN <br /><span className="text-yellow-500">ACTION.</span></h2>
            <p className="text-zinc-400 text-xl mb-10 leading-relaxed">Stop guessing how you sound. Get the neural heat-map of your influence the moment you speak.</p>

            <div className="space-y-6">
              {[
                { label: "Vocal Clarity", val: 94 },
                { label: "Command Presence", val: 88 },
                { label: "Emotional Resonance", val: 91 },
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-zinc-900/50 supports-[backdrop-filter]:backdrop-blur-lg border border-white/5 rounded-2xl flex items-center justify-between transform-gpu">
                  <span className="font-bold text-zinc-300 uppercase tracking-widest text-xs">{stat.label}</span>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} whileInView={{ width: `${stat.val}%` }}
                        viewport={{ once: true }}
                        className="h-full bg-yellow-500"
                      />
                    </div>
                    <span className="font-black text-yellow-500">{stat.val}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="w-full aspect-video bg-zinc-900 border border-white/10 rounded-[2.5rem] p-4 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
              {/* Simulated Waveform Visualizer */}
              <VisualizerMockup />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
                <button className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Pause fill="black" size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER: THE SIGNATURE --- */}
      <footer className="pt-40 pb-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
            <div className="md:col-span-2">
              <Image src="/splash.png" alt="Logo" width={220} height={80} className="mb-10 opacity-80 h-16 w-auto" />
              <p className="text-zinc-500 text-xl max-w-sm mb-10 leading-relaxed">Forging the next generation of global leaders through the power of peak communication.</p>
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center border border-white/5 hover:border-yellow-500/50 transition-colors cursor-pointer">
                  <Globe size={20} />
                </div>
                <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center border border-white/5 hover:border-yellow-500/50 transition-colors cursor-pointer">
                  <Command size={20} />
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-yellow-500 font-black uppercase text-[10px] tracking-[0.3em] mb-8">Navigation</h5>
              <ul className="space-y-4 text-zinc-400 font-bold text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">Platform</li>
                <li className="hover:text-white transition-colors cursor-pointer">Intelligence</li>
                <li className="hover:text-white transition-colors cursor-pointer">Enterprise</li>
                <li className="hover:text-white transition-colors cursor-pointer">Pricing</li>
              </ul>
            </div>

            <div>
              <h5 className="text-yellow-500 font-black uppercase text-[10px] tracking-[0.3em] mb-8">Legal</h5>
              <ul className="space-y-4 text-zinc-400 font-bold text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-white transition-colors cursor-pointer">Security Protocol</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-8">
            <p className="text-zinc-600 font-black text-[10px] uppercase tracking-[0.5em]">©2026 REVIAL LABS INC.</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">System Status: All Engines Nominal</span>
            </div>
          </div>
        </div>
      </footer>

      {/* High-Impact Global Styles (Tailwind can handle most, but adding for fine-tuning) */}
      <style jsx global>{`
        @keyframes subtle-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        body {
          overscroll-behavior: none;
        }
        ::selection {
          background: #FFD700;
          color: black;
        }
      `}</style>
    </div>
  );
}