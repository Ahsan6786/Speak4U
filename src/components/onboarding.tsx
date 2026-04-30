"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles, Mic, User, Target, Rocket } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";

interface OnboardingProps {
  user: any;
  onComplete: (name: string) => void;
}

const STEPS = [
  {
    id: "welcome",
    title: "How you speak says a lot about you.",
    subtitle: "Are you ready to speak with more confidence?",
    icon: <Sparkles className="w-8 h-8" />,
    bgColor: "bg-[#0e87cc]",
    textColor: "text-white"
  },
  {
    id: "pain",
    title: "Do you ever feel nervous when speaking to others?",
    subtitle: "We're here to help you speak clearly and feel better.",
    icon: <Target className="w-8 h-8" />,
    bgColor: "bg-[#FF007F]",
    textColor: "text-white"
  },
  {
    id: "name",
    title: "Let's get started.",
    subtitle: "What is your name?",
    icon: <User className="w-8 h-8" />,
    bgColor: "bg-[#FF8C00]",
    textColor: "text-white",
    isInput: true
  },
  {
    id: "final",
    title: "Welcome, {name}.",
    subtitle: "Your journey to better speaking starts now. Let's go.",
    icon: <Rocket className="w-8 h-8" />,
    bgColor: "bg-[#228B22]",
    textColor: "text-white"
  }
];

export function Onboarding({ user, onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);

  const step = STEPS[currentStep];

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      if (step.id === "name" && !name.trim()) return;
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinishing(true);
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: name.trim(),
          onboarded: true,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        onComplete(name);
      } catch (error) {
        console.error("Error saving onboarding:", error);
      }
    }
  };

  return (
    <div className={cn("fixed inset-0 z-[200] flex items-center justify-center overflow-hidden transition-colors duration-1000", step.bgColor)}>
      <div className="relative w-full max-w-4xl px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 rounded-3xl flex items-center justify-center bg-white/20 backdrop-blur-md text-white shadow-2xl mb-12"
            >
              {step.icon}
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[1.1] max-w-3xl italic text-white">
              {step.title.replace("{name}", name)}
            </h1>

            <p className="text-xl md:text-2xl text-white/80 font-medium mb-16 max-w-2xl leading-relaxed">
              {step.subtitle}
            </p>

            {step.isInput && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-md mb-16"
              >
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  className="w-full bg-white/10 border-b-2 border-white/30 focus:border-white px-4 py-6 text-3xl font-bold text-center outline-none transition-all placeholder:text-white/30 text-white"
                />
              </motion.div>
            )}

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={handleNext}
              disabled={isFinishing || (step.id === "name" && !name.trim())}
              className="group flex items-center gap-4 bg-white text-black px-10 py-5 rounded-[2rem] font-black text-xl hover:scale-105 transition-transform disabled:opacity-50 shadow-2xl shadow-black/10"
            >
              {currentStep === STEPS.length - 1 ? "START NOW" : "NEXT"}
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
        {STEPS.map((_, i) => (
          <div 
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i === currentStep ? "w-12 bg-white" : "w-3 bg-white/30"
            )}
          ></div>
        ))}
      </div>
    </div>
  );
}
