"use client";

import { useState, useEffect, useRef } from "react";

import { ArrowLeft, Play, Pause, RotateCcw, Timer, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

// 60-second targeted paragraph (approx 160-180 words)
const PRACTICE_TEXT = "Public speaking is not merely about the delivery of words, but about the connection you forge with your audience through clarity and conviction. Every great speech begins with a single thought, nurtured by practice and refined by the courage to stand before others and share your truth. As you read these lines, focus on the cadence of your breath and the articulation of each syllable. Mastery of your voice is the most powerful tool you possess, allowing you to move mountains and inspire change in the hearts of those who listen. Do not rush the journey; instead, embrace the rhythm of the language and let the velocity of your thoughts match the steady pace of your delivery. Confidence is not the absence of fear, but the mastery of it. Every pause is a moment of power, and every word is a bridge between your mind and the world. Keep your head high, your shoulders relaxed, and your focus unwavering. You are the architect of your own impact, and with every sentence you complete, you are becoming a more persuasive, authentic, and powerful communicator. Stand tall, speak loud, and let your legacy be written in the resonance of your voice.";

export default function TeleprompterPage() {
  const [stage, setStage] = useState<"countdown" | "active" | "finished">("active");
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const scrollPosRef = useRef(0);
  const startTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Constants
  const TOTAL_TIME = 60;
  const SCROLL_SPEED = 1.05; // Base speed, will be tuned to finish in ~58 seconds

  const startChallenge = () => {
    setStage("active");
    setTimeLeft(TOTAL_TIME);
    scrollPosRef.current = 0;
    setIsPaused(true);
    setResult(null);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const restart = () => {
    setStage("active");
    setTimeLeft(TOTAL_TIME);
    scrollPosRef.current = 0;
    setIsPaused(true);
    setResult(null);
  };

  // Main Timer and Animation Loop
  useEffect(() => {
    if (stage !== "active" || isPaused) {
      cancelAnimationFrame(requestRef.current);
      return;
    }

    let lastTimestamp = performance.now();

    const animate = (time: number) => {
      const deltaTime = (time - lastTimestamp) / 1000;
      lastTimestamp = time;

      // Update Timer (Only every 100ms to reduce render load)
      setTimeLeft(prev => {
        const next = prev - deltaTime;
        if (next <= 0) {
          setStage("finished");
          setResult("lose");
          return 0;
        }
        return next;
      });

      // Update Scroll
      // Target: contentHeight - viewportHeight
      if (scrollRef.current) {
        const contentHeight = scrollRef.current.scrollHeight;
        const viewportHeight = scrollRef.current.clientHeight;
        const targetScroll = contentHeight + viewportHeight; // scroll all the way out
        
        const speed = (contentHeight / TOTAL_TIME) * SCROLL_SPEED;
        scrollPosRef.current += speed * deltaTime;

        // Apply GPU accelerated transform
        scrollRef.current.style.transform = `translateY(-${scrollPosRef.current}px)`;

        if (scrollPosRef.current > contentHeight) {
          setStage("finished");
          setResult("win");
          return;
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [stage, isPaused]);

  return (
    <div className="fixed inset-0 bg-black text-white font-sans selection:bg-white selection:text-black overflow-hidden flex flex-col">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_80%)] pointer-events-none" />
      
      {/* Top Header: Navigation & Timer */}
      <header className="relative z-50 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Exit</span>
        </Link>
        
        <div className="flex flex-col items-center">
            <div className={`text-4xl font-black italic tracking-tighter tabular-nums ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white/90'}`}>
                {Math.ceil(timeLeft)}s
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Remaining</span>
        </div>

        <div className="w-20" /> {/* Spacer */}
      </header>

      {/* Main Experience Area */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center">
        <>

          {stage === "countdown" && (
            <div 
              key="countdown"
              
              
              
              className="absolute inset-0 flex items-center justify-center bg-black z-[100]"
            >
              <span className="text-[20rem] font-black italic leading-none">{countdown}</span>
            </div>
          )}

          {stage === "active" && (
            <div 
              key="active"
              
              
              className="absolute inset-0 flex flex-col items-center"
            >
              {/* Focus Guides */}
              <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black via-black/80 to-transparent z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />

              {/* Scrolling Window Container */}
              <div 
                className="w-full flex-1 overflow-hidden px-10 relative"
                onClick={() => isPaused && setIsPaused(false)}
              >
                <div 
                  ref={scrollRef}
                  className="w-full flex flex-col items-center  pt-[45vh]"
                  style={{ willChange: 'transform' }}
                >
                  <div className="w-full max-w-4xl text-center pb-[100vh]">
                    <p className="text-[3rem] md:text-[5rem] font-black italic leading-[1.1] text-white uppercase tracking-tighter opacity-90">
                      {PRACTICE_TEXT}
                    </p>
                  </div>
                </div>
              </div>

              {/* Start Overlay Removed */}
            </div>
          )}

          {stage === "finished" && (
            <div 
              key="finished"
              
              
              className="max-w-xl w-full text-center space-y-12 px-6"
            >
              <div className="space-y-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${result === 'win' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {result === 'win' ? <CheckCircle2 className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
                </div>
                <div className="space-y-2">
                    <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
                        {result === 'win' ? "STRONG DELIVERY" : "FELL BEHIND"}
                    </h2>
                    <p className="text-xl text-white/40 font-medium">
                        {result === 'win' ? "You kept the pace perfectly. Great control." : "Your pacing needs work. Try again."}
                    </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={startChallenge}
                  className="p-6 rounded-3xl bg-white text-black font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  Retry Training
                </button>
                <Link
                  href="/dashboard"
                  className="p-6 rounded-3xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center"
                >
                  Exit Arena
                </Link>
              </div>
            </div>
          )}
        </>
      </main>

      {/* Bottom Controls */}
      {stage === "active" && (
        <footer className="relative z-50 p-12 flex justify-center items-center gap-8 bg-gradient-to-t from-black to-transparent">
          <button
            onClick={restart}
            className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/60 hover:text-white"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <button
            onClick={togglePause}
            className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-white/10"
          >
            {isPaused ? <Play className="w-10 h-10 fill-current ml-1" /> : <Pause className="w-10 h-10 fill-current" />}
          </button>

          <div className="w-16 h-16 flex items-center justify-center">
            <span className="text-xs font-black uppercase tracking-widest text-white/20 italic">1.0x</span>
          </div>
        </footer>
      )}
    </div>
  );
}
