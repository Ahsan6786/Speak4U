"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles, Flame, Mic, Camera, BarChart3, Users, Book, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  targetId: string;
  title: string;
  description: string;
  accent: string;
  icon: React.ReactNode;
  isCircle?: boolean;
}

const steps: Step[] = [
  {
    id: "practice",
    targetId: "practice-btn",
    title: "Practice Conversations",
    description: "Train your speaking skills with real-time AI feedback on clarity, confidence, pace, and filler words.",
    accent: "#ffffff",
    icon: <Mic className="w-5 h-5" />
  },
  {
    id: "profile-nav",
    targetId: "profile-nav-btn",
    title: "Performance Profile",
    description: "All your speaking reports, analytics, confidence scores, and progress history are stored here.",
    accent: "#10b981",
    icon: <User className="w-5 h-5" />,
    isCircle: true
  },
  {
    id: "streak",
    targetId: "streak-indicator",
    title: "Daily Streak",
    description: "Maintain your speaking streak daily to build consistency and unlock performance milestones.",
    accent: "#f97316",
    icon: <Flame className="w-5 h-5" />,
    isCircle: true
  }
];

export function GuidedTour({ tourCompleted, onComplete }: { tourCompleted: boolean; onComplete: () => Promise<void> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Spring animations for the spotlight to make it feel "organic"
  const springConfig = { stiffness: 100, damping: 20, mass: 1 };
  const spotX = useSpring(0, springConfig);
  const spotY = useSpring(0, springConfig);
  const spotW = useSpring(0, springConfig);
  const spotH = useSpring(0, springConfig);

  useEffect(() => {
    setMounted(true);
    if (tourCompleted === false) {
      const timer = setTimeout(() => setIsOpen(true), 1500); // Delayed entry for better UX
      return () => clearTimeout(timer);
    }
  }, [tourCompleted]);

  const updateCoords = useCallback(() => {
    if (!isActive || currentStep >= steps.length) return;
    const target = document.getElementById(steps[currentStep].targetId);

    if (target) {
      const rect = target.getBoundingClientRect();
      const padding = 0;

      spotX.set(rect.left - padding);
      spotY.set(rect.top - padding);
      spotW.set(rect.width + padding * 2);
      spotH.set(rect.height + padding * 2);

      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });

      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isActive, currentStep, spotX, spotY, spotW, spotH]);

  useEffect(() => {
    if (isActive) {
      updateCoords();
      window.addEventListener("resize", updateCoords);
      window.addEventListener("scroll", updateCoords);
      return () => {
        window.removeEventListener("resize", updateCoords);
        window.removeEventListener("scroll", updateCoords);
      };
    }
  }, [isActive, updateCoords]);

  const handleStart = () => {
    setIsOpen(false);
    setIsActive(true);
    setCurrentStep(0);
  };

  const handleEnd = () => {
    setIsActive(false);
    onComplete();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!mounted) return null;

  const activeStepData = steps[currentStep];

  return (
    <>
      {/* Intro Modal: The "Hook" */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-zinc-950 border border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-6 ring-8 ring-white/[0.02]">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Master the Platform</h2>
              <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                Take a 30-second tour to discover how to level up your communication skills.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="py-3 rounded-xl bg-zinc-900 text-zinc-400 font-semibold text-sm hover:text-white transition-colors"
                >
                  Maybe later
                </button>
                <button
                  onClick={handleStart}
                  className="py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-transform active:scale-95"
                >
                  Let's go
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Tour Engine */}
      <AnimatePresence>
        {isActive && (
          <div className="fixed inset-0 z-[250] pointer-events-none">
            {/* The Dynamic Spotlight Overlay */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <mask id="spotlight-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <motion.rect
                    x={spotX}
                    y={spotY}
                    width={spotW}
                    height={spotH}
                    rx={activeStepData.isCircle ? 9999 : 16}
                    fill="black"
                  />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="rgba(0, 0, 0, 0.8)"
                mask="url(#spotlight-mask)"
                className="pointer-events-auto"
                onClick={handleEnd}
              />
            </svg>

            {/* Tooltip Card */}
            {coords && (
              <motion.div
                layoutId="tour-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute pointer-events-auto w-[320px] bg-black border border-white/10 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                style={{
                  left: Math.min(Math.max(20, coords.left + coords.width / 2 - 160), window.innerWidth - 340),
                  top: coords.top + coords.height + 25 > window.innerHeight - 250
                    ? coords.top - 210
                    : coords.top + coords.height + 25,
                }}
              >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden rounded-t-2xl">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between mt-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${activeStepData.accent}20`, color: activeStepData.accent }}
                    >
                      {activeStepData.icon}
                    </div>
                    <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500">
                      Step {currentStep + 1} / {steps.length}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">{activeStepData.title}</h3>
                    <p className="text-zinc-400 text-sm leading-snug font-medium">
                      {activeStepData.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handleEnd}
                      className="text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Skip
                    </button>
                    <div className="flex gap-2">
                      {currentStep > 0 && (
                        <button
                          onClick={() => setCurrentStep(s => s - 1)}
                          className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => currentStep === steps.length - 1 ? handleEnd() : setCurrentStep(s => s + 1)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-bold text-xs hover:bg-zinc-200"
                      >
                        {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}