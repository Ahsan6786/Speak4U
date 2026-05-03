"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Mic, Shield, TrendingUp, LogOut, ArrowRight,
  Zap, Globe, ChevronRight, Activity, Command,
  Cpu, Layers, Volume2, Fingerprint, BarChart3,
  Dna, Play, Pause, Sparkles, MoveRight, LayoutGrid
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { AuthModal } from "@/components/auth-modal";
import { SignOutModal } from "@/components/sign-out-modal";
import { cn } from "@/lib/utils";


const MobileDemo = () => {
  const images = [
    "/i1.jpg", "/i2.jpg", "/i3.jpg", "/i4.jpg"
  ];
  
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-[300px] h-[600px] md:w-[350px] md:h-[700px] mx-auto">
      {/* Phone Frame */}
      <div className="absolute inset-0 bg-[#0A0A0A] rounded-[3rem] border-[8px] border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden z-20">
        
        {/* Dynamic Island Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-40" />

        {/* Screen Content Wrapper */}
        <div className="absolute inset-0 bg-black z-30">
          <div className="absolute inset-0">
            <Image 
              src={images[index]} 
              alt="App Interface" 
              fill 
              sizes="(max-width: 768px) 300px, 350px"
              className="object-cover object-center" 
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stay = searchParams.get("stay");
  const { user, loading, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  useEffect(() => {
    if (mounted && !loading && user && !stay) {
      router.push("/dashboard");
    }
  }, [user, loading, mounted, router, stay]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-zinc-100 selection:bg-yellow-400 selection:text-black overflow-x-hidden">


      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <SignOutModal 
        isOpen={isSignOutModalOpen} 
        onClose={() => setIsSignOutModalOpen(false)} 
        onConfirm={() => {
          logout();
          setIsSignOutModalOpen(false);
        }} 
      />

      {/* --- NAVIGATION --- */}
      <nav className="absolute top-0 w-full z-[100] py-6 md:py-10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? "bg-black/60  border border-white/5 p-4 rounded-2xl shadow-2xl" : ""
            }`}>
            <Link href="/" className="flex items-center">
              <Image src="/splash.png" alt="Logo" width={320} height={100} className="w-auto h-16 md:h-32" priority />
            </Link>

            <div className="flex items-center gap-6">
              {!user ? (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-zinc-200 active:scale-95 transition-all shadow-lg shadow-white/10"
                >
                  Get Started
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/dashboard" className="text-sm font-black uppercase bg-white text-black px-8 py-3 rounded-full hover:bg-zinc-200 transition-all shadow-lg shadow-white/20">Dashboard</Link>
                  <button onClick={() => setIsSignOutModalOpen(true)} className="text-zinc-500 hover:text-white"><LogOut size={24} /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 pt-48 md:pt-60 overflow-hidden">
        
        <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 items-center gap-10 md:gap-20">
          <div className=" ">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <span className="text-yellow-500 font-black text-xs uppercase tracking-[0.4em]"></span>
            </div>

            <h1 className="text-5xl md:text-[110px] font-black leading-[0.95] tracking-tight mb-8 md:mb-10 uppercase italic pr-8">
              SPEAK WITH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-white">POWER</span> AND <br />
              CLARITY.
            </h1>

            <p className="text-zinc-400 text-xl md:text-2xl font-medium max-w-xl mb-12 leading-relaxed">
              Learn to talk like a leader. Fix your tone, stop saying "um", and make people listen every time you speak.
            </p>

            <div className="flex flex-wrap gap-6">
              {!user ? (
                <button 
                  onClick={() => setIsAuthModalOpen(true)} 
                  className="px-12 py-6 bg-white text-black font-black rounded-full flex items-center gap-3 hover:bg-zinc-200 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] text-lg uppercase tracking-wider"
                >
                  GET STARTED <MoveRight size={24} />
                </button>
              ) : (
                <Link 
                  href="/dashboard"
                  className="px-12 py-6 bg-white text-black font-black rounded-full flex items-center gap-3 hover:bg-zinc-200 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] text-lg uppercase tracking-wider"
                >
                  GO TO DASHBOARD <LayoutGrid size={24} />
                </Link>
              )}
            </div>
          </div>

          {/* Hero Visual: The "Matrix" */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[550px] aspect-square">
              {/* Glowing Background Effect */}
              <div className="absolute inset-0 bg-yellow-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none" />
              
              {/* Card 2 (Bottom Layer) */}
              <div className="absolute bottom-10 left-0 w-3/5 h-3/5 bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl transform -rotate-6 z-0 translate-z-0 flex items-center justify-center">
                 <div className="w-1/2 h-[1px] bg-white/20" />
              </div>

              {/* Card 1 (Top Layer) */}
              <div className="absolute top-0 right-0 w-4/5 h-4/5 bg-gradient-to-br from-zinc-900/80 to-black/80 backdrop-blur-2xl border border-white/20 rounded-[3rem] shadow-2xl transform rotate-3 z-10 translate-z-0 overflow-hidden group">
                <Image src="/logo.jpeg" alt="Logo" fill className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="w-20 h-1 bg-yellow-500 mb-4" />
                  <p className="text-white font-black italic uppercase tracking-widest text-xs">Vocal Analysis System</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DEMO SECTION --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 items-center gap-20">
          <div
            
            className="order-2 lg:order-1"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase italic leading-[0.9]">
              SEE HOW <span className="text-yellow-500 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">REVIAL</span> WORKS.
            </h2>
            <p className="text-zinc-400 text-xl md:text-2xl mb-12 leading-relaxed">
              See your voice change in real-time. We help you find your best speaking style and show you how to improve instantly.
            </p>
            <div className="space-y-6">
              {[
                { title: "Real-time Processing", desc: "Latency-free neural decoding of your speech patterns." },
                { title: "Visual Bio-Feedback", desc: "Dynamic heatmaps of your vocal resonance and impact." },
                { title: "Adaptive Interface", desc: "UI that evolves with your speaking style." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-black text-white uppercase italic text-sm tracking-widest">{item.title}</h4>
                    <p className="text-zinc-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            
            className="flex justify-center order-1 lg:order-2"
          >
            <MobileDemo />
          </div>
        </div>
      </section>

      {/* --- STATS STRIP --- */}
      <div className="py-10 bg-white text-black overflow-hidden relative">
        <div className="flex whitespace-nowrap gap-20 items-center animate-marquee">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex items-center gap-6">
              <span className="text-4xl font-black tracking-tighter uppercase italic">Neural Processing</span>
              <div className="w-3 h-3 bg-black rounded-full" />
              <span className="text-4xl font-black tracking-tighter uppercase italic">Vocal Mastery</span>
              <div className="w-3 h-3 bg-black rounded-full" />
              <span className="text-4xl font-black tracking-tighter uppercase italic">98% Clarity</span>
              <div className="w-3 h-3 bg-black rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* --- FEATURES: BENTO GRID --- */}
      <section id="ecosystem" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase italic">Built for <span className="text-yellow-500">Everyone.</span></h2>
          <p className="text-zinc-500 text-xl max-w-2xl mx-auto">We studied thousands of great speeches to give you the best advice on how to talk better.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Main Feature */}
          <div
            className="md:col-span-7 bg-zinc-900/30 border border-white/5 rounded-[4rem] p-10 md:p-14 overflow-hidden relative group min-h-[400px] flex flex-col justify-center"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-yellow-500 flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.3)] group-hover:scale-110 transition-transform duration-500">
                  <Mic className="text-black" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tighter italic uppercase leading-none">Vocal Identity</h3>
                  <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-[0.3em] mt-2 opacity-60">Smart Engine V2.1</p>
                </div>
              </div>
              <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
                Our app learns how you talk and gives you personal tips that feel natural and easy to follow.
              </p>
              <button className="text-yellow-500 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:gap-4 transition-all">
                LEARN MORE <ArrowRight size={18} />
              </button>
            </div>
            {/* Visual background */}
            <div className="absolute -right-20 -bottom-20 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000 pointer-events-none">
              <Dna size={500} />
            </div>
          </div>

          {/* Side Feature 1 */}
          <div
            
            className="md:col-span-5 bg-white rounded-[4rem] p-12 text-black flex flex-col justify-between  "
          >
            <div className="flex justify-between items-start">
              <Fingerprint size={48} strokeWidth={2.5} />
              <div className="bg-black text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Secure</div>
            </div>
            <div>
              <h3 className="text-4xl font-black tracking-tighter mb-4 italic">Unrivaled Privacy.</h3>
              <p className="font-bold opacity-80 leading-snug">All processing happens in an isolated enclave. Your voice is yours alone. Period.</p>
            </div>
          </div>

          {/* Small Bento 1 */}
          <div className="md:col-span-4 bg-zinc-900 border border-white/5 rounded-[3rem] p-10 hover:bg-zinc-800 transition-colors">
            <BarChart3 className="text-yellow-500 mb-6" size={32} />
            <h4 className="text-xl font-black mb-2 uppercase italic">Micro-Analytics</h4>
            <p className="text-zinc-500 text-sm">Every pause, every breath, every 'um' analyzed to the millisecond.</p>
          </div>

          {/* Small Bento 2 */}
          <div className="md:col-span-4 bg-zinc-900 border border-white/5 rounded-[3rem] p-10 hover:bg-zinc-800 transition-colors">
            <Layers className="text-yellow-500 mb-6" size={32} />
            <h4 className="text-xl font-black mb-2 uppercase italic">Multi-Modal</h4>
            <p className="text-zinc-500 text-sm">Switch between speech, debate, and interview modes instantly.</p>
          </div>

          {/* Small Bento 3 */}
          <div className="md:col-span-4 bg-zinc-900 border border-white/5 rounded-[3rem] p-10 hover:bg-zinc-800 transition-colors">
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
                <div key={i} className="p-6 bg-zinc-900/50  border border-white/5 rounded-2xl flex items-center justify-between ">
                  <span className="font-bold text-zinc-300 uppercase tracking-widest text-xs">{stat.label}</span>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        
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
            <div className="w-full aspect-video bg-zinc-900 border-4 border-yellow-500 rounded-[2.5rem] p-4 relative overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.3)]">
              <div className="absolute inset-0 bg-black opacity-20 pointer-events-none z-10" />
              
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 px-10">
                {mounted && [...Array(50)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-[3px] md:w-[4px] bg-gradient-to-t from-yellow-600 via-yellow-400 to-yellow-600 rounded-full animate-voice-flow"
                    style={{ 
                      height: `${Math.random() * 70 + 10}%`,
                      animationDelay: `${i * 0.04}s`,
                      boxShadow: '0 0 10px rgba(234, 179, 8, 0.3)'
                    }}
                  />
                ))}
              </div>
              
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                <button className="w-16 h-16 bg-yellow-500 text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl">
                  <Play fill="black" size={24} className="ml-1" />
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
              <Image src="/splash.png" alt="Logo" width={180} height={50} className="mb-10 opacity-80" />
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

      {/* Scroll to Top Button */}
      {scrolled && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-10 right-10 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 transition-all z-[200] group"
        >
          <ArrowRight className="w-8 h-8 -rotate-90 group-hover:-translate-y-1 transition-transform" />
        </button>
      )}

      {/* High-Impact Global Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes subtle-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes voice-flow {
          0%, 100% { transform: scaleY(1); opacity: 0.4; filter: blur(0.5px); }
          50% { transform: scaleY(2.8); opacity: 1; filter: blur(0px); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-voice-flow {
          animation: voice-flow 0.8s ease-in-out infinite;
        }
        body {
          overscroll-behavior: none;
        }
        ::selection {
          background: #FFD700;
          color: black;
        }
      `}} />
    </div>
  );
}
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <HomeContent />
    </Suspense>
  );
}
