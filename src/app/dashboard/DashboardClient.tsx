"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Flame, History, LayoutGrid, Mic, Play, RotateCcw, StopCircle, Trash2, ChevronRight, LogOut, Timer, Brain, Sparkles, Calendar, MessageSquare, Wand2, FastForward, CheckCircle2 } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot, collection, query, orderBy, limit, deleteDoc } from "firebase/firestore";

export default function DashboardClient() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { isRecording, transcript, startRecording, stopRecording, clearTranscript, audioBlob, requestPermission } = useVoiceRecorder();
  const [timeLeft, setTimeLeft] = useState(60);
  const [prompt, setPrompt] = useState("");
  const [streak, setStreak] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [view, setView] = useState<"history" | "practice">("history");
  const [sessions, setSessions] = useState<any[]>([]);
  const [assistMode, setAssistMode] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFetchingAssist, setIsFetchingAssist] = useState(false);
  const [isFetchingQuestion, setIsFetchingQuestion] = useState(false);
  const [isRapidFire, setIsRapidFire] = useState(false);
  const [rapidFireStep, setRapidFireStep] = useState(0);
  const [rapidFireAnswers, setRapidFireAnswers] = useState<{q: string, a: string}[]>([]);
  const searchParams = useSearchParams();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const fetchNewQuestion = async (force = false) => {
    if (isFetchingQuestion && !force) return;
    setIsFetchingQuestion(true);
    try {
      const history = JSON.parse(sessionStorage.getItem("question_history") || "[]");
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, streak }),
      });
      const data = await response.json();
      setPrompt(data.question);

      const newHistory = [data.question, ...history].slice(0, 5);
      sessionStorage.setItem("question_history", JSON.stringify(newHistory));
    } catch (err) {
      console.error("Failed to fetch question:", err);
      if (!prompt) setPrompt("Describe a challenge you overcame recently.");
    } finally {
      setIsFetchingQuestion(false);
    }
  };

  const startPractice = async (rapid = false) => {
    // 1. Switch View IMMEDIATELY to eliminate lag
    setView("practice");
    setIsRapidFire(rapid);
    if (rapid) {
      setRapidFireStep(1);
      setRapidFireAnswers([]);
    } else {
      setRapidFireStep(0);
    }

    // 2. Handle permissions and data in background
    const granted = await requestPermission();
    if (granted) {
      await fetchNewQuestion();
      if (rapid) {
        setTimeout(() => {
          handleStart();
        }, 800); 
      }
    } else {
      alert("Microphone access is required to practice. Please enable it in your browser settings.");
      setView("history");
    }
  };

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      startPractice();
    }
  }, [searchParams]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/");
      return;
    }

    if (!prompt) fetchNewQuestion();

    const userDocRef = doc(db, "users", user.uid);
    const unsubUser = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setStreak(data.streak || 0);
        setUserName(data.name || "");
        if (!data.onboarded) {
          router.push("/onboarding");
        } else {
          setDataLoading(false);
        }
      } else {
        setDoc(userDocRef, { streak: 0, onboarded: false }, { merge: true });
        router.push("/onboarding");
      }
    });

    const sessionsRef = collection(db, "users", user.uid, "sessions");
    const q = query(sessionsRef, orderBy("timestamp", "desc"), limit(10));
    const unsubHistory = onSnapshot(q, (snapshot) => {
      setSessions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubUser();
      unsubHistory();
    };
  }, [user, authLoading, router]);

  useEffect(() => {
    if (isRecording && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRecording) {
      if (timerRef.current) clearInterval(timerRef.current);
      handleFinish();
    } else if (!isRecording) {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, timeLeft]);

  useEffect(() => {
    if (!isRecording || !assistMode || !transcript || transcript.length < 10) return;

    const timeoutId = setTimeout(async () => {
      setIsFetchingAssist(true);
      try {
        const response = await fetch("/api/assist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript, prompt }),
        });
        const data = await response.json();
        if (data.suggestions) {
          setSuggestions(data.suggestions);
        }
      } catch (err) {
        console.error("Assist failed:", err);
      } finally {
        setIsFetchingAssist(false);
      }
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [transcript, isRecording, assistMode, prompt]);

  const confirmDelete = async () => {
    if (!user || !sessionToDelete) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "sessions", sessionToDelete));
      setSessionToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const deleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setSessionToDelete(sessionId);
  };

  const handleStart = () => {
    setTimeLeft(60);
    startRecording();
  };

  const handleFinish = async () => {
    if (isAnalyzing) return;
    if (isRecording) stopRecording();
    setIsAnalyzing(true);

    try {
      const currentAnswer = { q: prompt, a: transcript };

      if (isRapidFire && rapidFireStep < 6) {
        setRapidFireAnswers(prev => [...prev, currentAnswer]);
        const nextStep = rapidFireStep + 1;
        setRapidFireStep(nextStep);
        setIsAnalyzing(false);
        setTimeLeft(60);
        
        // INSTANT TRANSITION
        stopRecording(); 
        clearTranscript();
        await fetchNewQuestion(true);
        
        // AUTO-START NEXT RECORDING IMMEDIATELY
        setTimeout(() => {
          startRecording();
        }, 100); 
        return;
      }

      // Final step
      const allAnswers = isRapidFire 
        ? [...rapidFireAnswers, currentAnswer]
        : [currentAnswer];

      sessionStorage.setItem("last_transcript", transcript);
      sessionStorage.setItem("last_prompt", prompt);
      sessionStorage.setItem("is_rapid_fire", isRapidFire ? "true" : "false");
      sessionStorage.setItem("rapid_fire_data", JSON.stringify(allAnswers));
      
      if (isRapidFire) {
        setIsAnalyzing(false);
        setRapidFireStep(7); 
        stopRecording();
        return;
      }

      if (audioBlob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          sessionStorage.setItem("last_audio", reader.result as string);
          fetchNewQuestion(true);
          router.push("/results");
        };
        reader.readAsDataURL(audioBlob);
      } else {
        fetchNewQuestion(true);
        router.push("/results");
      }
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-black animate-pulse uppercase tracking-[0.3em] text-[10px]">REVIAL Engine Loading</p>
        </div>
      </div>
    );
  }

  // --- RAPID FIRE FULLSCREEN MODE ---
  if (view === "practice" && isRapidFire && rapidFireStep <= 6) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#000000] text-white flex flex-col items-center justify-between p-8 md:p-20 overflow-hidden font-sans">
        {/* Top: Progress */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl flex items-center justify-between"
        >
          <div className="flex items-center gap-6">
            <button
              onClick={() => setView("history")}
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all shadow-sm"
              title="Go Back"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">Rapid Fire Drill</span>
              <h3 className="text-xl font-bold tracking-tighter">Question {rapidFireStep} of 6</h3>
            </div>
          </div>
          <div className="flex gap-1">
            {[1,2,3,4,5,6].map(s => (
              <div key={s} className={cn("h-1.5 w-8 rounded-full transition-all duration-500", s <= rapidFireStep ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-white/10")} />
            ))}
          </div>
        </motion.div>

        {/* Center: Question */}
        <div className="w-full max-w-5xl text-center flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={prompt}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className="space-y-12"
            >
              <h2 className="text-4xl md:text-7xl font-black leading-[1.1] tracking-tight italic">
                "{prompt}"
              </h2>
              {isRecording && (
                <div className="flex flex-col items-center gap-6">
                   <div className="flex items-center gap-4 text-red-500 font-black text-xl tracking-tighter animate-pulse">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    {timeLeft}s REMAINING
                  </div>
                  <p className="text-white/40 text-lg md:text-2xl font-medium italic max-w-3xl line-clamp-2">
                    {transcript || "Listening..."}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom: Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          {!isRecording && !isAnalyzing ? (
            <button
              onClick={handleStart}
              className="group flex items-center justify-center gap-6 bg-white text-black px-16 py-8 rounded-[2.5rem] font-black text-3xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              <Mic className="w-8 h-8" />
              START DRILL
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center">
               <button
                onClick={stopRecording}
                className="w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-6 rounded-3xl bg-white/5 border-2 border-white/10 text-white/60 font-bold hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-95"
              >
                <StopCircle className="w-6 h-6" />
                STOP
              </button>
              <button
                onClick={handleFinish}
                className="w-full sm:w-auto flex items-center justify-center gap-6 px-16 py-7 rounded-[2.5rem] bg-red-600 text-white font-black text-2xl hover:bg-red-500 hover:scale-105 transition-all shadow-[0_0_50px_rgba(220,38,38,0.3)] active:scale-95"
              >
                {rapidFireStep < 6 ? "NEXT QUESTION" : "FINISH DRILL"}
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // --- FINAL CELEBRATION SCREEN ---
  if (view === "practice" && rapidFireStep === 7) {
    return (
      <div className="fixed inset-0 z-[300] bg-[#000000] text-white flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-red-500 flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(239,68,68,0.5)]">
            <CheckCircle2 className="w-14 h-14 text-white" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter italic">DRILL COMPLETE</h2>
          <p className="text-xl md:text-2xl text-white/50 mb-16 max-w-2xl font-medium">
            Excellent focus. All 6 responses have been captured. Your performance audit is ready for analysis.
          </p>
          <button 
            onClick={() => router.push("/results")}
            className="group px-16 py-8 rounded-[3rem] bg-white text-black font-black text-3xl flex items-center justify-center gap-6 hover:scale-105 transition-all shadow-2xl active:scale-95"
          >
            SEE YOUR RESULTS
            <ChevronRight className="w-10 h-10 group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 overflow-hidden selection:bg-primary/30 transition-colors duration-300 relative">
      <AnimatePresence>
        {sessionToDelete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border p-8 rounded-[2rem] shadow-2xl max-w-md w-full text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-2">Delete Report?</h3>
              <p className="text-muted-foreground mb-8">This action cannot be undone. Are you sure you want to permanently delete this practice report?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setSessionToDelete(null)}
                  className="flex-1 py-4 rounded-xl font-bold bg-muted text-foreground hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-4 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSignOutConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border p-8 rounded-[2rem] shadow-2xl max-w-md w-full text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto mb-6">
                <LogOut className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-2">Sign Out?</h3>
              <p className="text-muted-foreground mb-8">Are you sure you want to sign out of your account?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowSignOutConfirm(false)}
                  className="flex-1 py-4 rounded-xl font-bold bg-muted text-foreground hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="flex-1 py-4 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full -mr-64 -mt-64 pointer-events-none opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full -ml-64 -mb-64 pointer-events-none opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <button
              onClick={() => view === "practice" ? setView("history") : router.push("/")}
              className="w-12 h-12 rounded-2xl bg-card border-2 border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all hover:scale-105 shadow-sm"
              title="Menu"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setShowSignOutConfirm(true)}
              className="w-12 h-12 rounded-2xl bg-card border-2 border-border flex items-center justify-center text-foreground hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all hover:scale-105 shadow-sm"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-12 px-6 rounded-2xl bg-orange-500/10 border-2 border-orange-500/30 flex items-center gap-2 text-orange-600 dark:text-orange-400 font-black shadow-sm">
              <Flame className="w-5 h-5 fill-current" />
              <span>{streak}</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === "history" ? (
            <motion.div
              key="history-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-40 transition duration-1000" />
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-10 rounded-[3rem] p-10 md:p-14 bg-card/40 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden ring-1 ring-white/10 will-change-transform">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[100px] -mr-40 -mt-40" />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/70">Session Ready</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground italic leading-none">
                      Hello, {userName || "Speaker"}
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium italic">
                      Ready to perfect your delivery?
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto relative z-10">
                    <button 
                      onClick={() => startPractice(false)}
                      className="group flex items-center justify-center gap-3 bg-white text-black px-10 py-5 rounded-[2rem] font-black text-xl hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-white/5"
                    >
                      <Play className="w-6 h-6 fill-current" />
                      PRACTICE
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => startPractice(true)}
                      className="group flex items-center justify-center gap-3 bg-red-600 text-white px-10 py-5 rounded-[2rem] font-black text-xl hover:bg-red-500 hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-red-600/20"
                    >
                      <Flame className="w-6 h-6 fill-current" />
                      RAPID FIRE
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {/* THE TELEPROMPTER - GOD TIER */}
                <Link
                  href="/speak-with-me"
                  className="group relative flex flex-col items-start p-12 rounded-[4rem] bg-gradient-to-br from-white/[0.08] to-transparent backdrop-blur-xl border border-white/10 hover:border-primary/50 transition-all duration-700 shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden will-change-transform"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15)_0%,transparent_50%)]" />
                  <div className="absolute -inset-[100%] group-hover:inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out" />
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full translate-x-1/4 translate-y-1/4 group-hover:scale-150 transition-transform duration-1000" />
                  
                  <div className="relative z-10 w-20 h-20 rounded-[2rem] bg-primary text-white flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-[0_0_40px_rgba(59,130,246,0.5)]">
                    <FastForward className="w-10 h-10" />
                  </div>
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-[2px] bg-primary rounded-full" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Challenge Mode</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black tracking-tighter italic text-foreground leading-[0.9] uppercase">THE <br/> TELEPROMPTER</h3>
                    <p className="text-lg md:text-xl text-muted-foreground font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">
                      Master the art of <span className="text-primary font-bold">focus</span> under fire.
                    </p>
                  </div>

                  <div className="relative z-10 mt-12 flex items-center gap-3 px-8 py-3.5 rounded-full bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/30 hover:scale-105 transition-all">
                    START NOW <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>

                {/* PERFORMANCE HISTORY - GOD TIER */}
                <Link
                  href="/reports"
                  className="group relative flex flex-col items-start p-12 rounded-[4rem] bg-gradient-to-br from-white/[0.08] to-transparent backdrop-blur-xl border border-white/10 hover:border-emerald-500/50 transition-all duration-700 shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden will-change-transform"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15)_0%,transparent_50%)]" />
                  <div className="absolute -inset-[100%] group-hover:inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out" />
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full translate-x-1/4 translate-y-1/4 group-hover:scale-150 transition-transform duration-1000" />
                  
                  <div className="relative z-10 w-20 h-20 rounded-[2rem] bg-emerald-500 text-white flex items-center justify-center mb-10 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                    <History className="w-10 h-10" />
                  </div>
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-[2px] bg-emerald-500 rounded-full" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Data Vault</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black tracking-tighter italic text-foreground leading-[0.9] uppercase">SPEECH <br/> ANALYTICS</h3>
                    <p className="text-lg md:text-xl text-muted-foreground font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">
                      Your journey to <span className="text-emerald-500 font-bold">mastery</span> is mapped here.
                    </p>
                  </div>

                  <div className="relative z-10 mt-12 flex items-center gap-3 px-8 py-3.5 rounded-full bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all">
                    VIEW REPORTS <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="practice-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AnimatePresence mode="wait">
                {rapidFireStep === 7 ? (
                  <motion.div 
                    key="rapid-fire-finished"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card rounded-[2.5rem] p-10 md:p-14 text-center flex flex-col items-center shadow-2xl"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mb-8">
                      <Flame className="w-10 h-10 fill-current" />
                    </div>
                    <h2 className="text-4xl font-black mb-4 italic">Rapid Fire Complete! 🎉</h2>
                    <p className="text-xl text-muted-foreground mb-12 max-w-lg">
                      You've successfully powered through 6 intense speaking challenges. Ready to see your comprehensive performance audit?
                    </p>
                    <button 
                      onClick={() => router.push("/results")}
                      className="w-full sm:w-auto px-12 py-6 rounded-[2rem] bg-red-500 text-white font-black text-2xl flex items-center justify-center gap-4 hover:scale-105 transition-transform shadow-2xl shadow-red-500/20"
                    >
                      SEE RESULT
                      <ChevronRight className="w-8 h-8" />
                    </button>
                  </motion.div>
                ) : !isRecording && !isAnalyzing && !transcript ? (
                  <motion.div
                    key="prompt-card"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0, y: -20 }}
                    className="glass-card rounded-[2.5rem] p-10 md:p-14 mb-12 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-10">
                      <Brain className="w-20 h-20 text-primary opacity-10 group-hover:opacity-20 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={cn("px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest", isRapidFire ? "bg-red-500 text-white shadow-lg shadow-red-500/30" : "bg-primary/10 text-primary border border-primary/20")}>
                        {isRapidFire ? `Rapid Fire: Round ${rapidFireStep}/6` : "Daily Challenge"}
                      </div>
                    </div>
                    {isFetchingQuestion && !prompt ? (
                      <div className="space-y-4 mb-10">
                        <div className="h-12 w-full bg-muted animate-pulse rounded-xl"></div>
                        <div className="h-12 w-3/4 bg-muted animate-pulse rounded-xl"></div>
                      </div>
                    ) : (
                      <h2 className="text-3xl md:text-5xl font-bold mb-10 leading-[1.1] max-w-3xl tracking-tight min-h-[3.3em]">
                        "{prompt}"
                      </h2>
                    )}
                    <div className="flex items-center justify-between w-full mt-10 border-t border-border/50 pt-8">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20"><Sparkles className="w-4 h-4 text-primary" /></div>
                        <span className="font-bold text-sm uppercase tracking-widest text-primary"></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setAssistMode(!assistMode)}
                          className={cn("flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all text-sm uppercase tracking-widest border", assistMode ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground border-border hover:bg-muted/80")}
                        >
                          <Wand2 className="w-4 h-4" />
                          Expert Guidance {assistMode ? "ON" : "OFF"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="live-transcript-area"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="min-h-[400px] flex flex-col items-center justify-center text-center px-4"
                  >
                    <div className="relative mb-12">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-40 h-40 rounded-full blue-gradient flex items-center justify-center blue-glow relative z-10"
                      >
                        <span className="text-5xl font-black text-white">{timeLeft}</span>
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 border-4 border-primary rounded-full"
                      ></motion.div>
                    </div>
                    <p className="text-xl md:text-3xl font-bold text-foreground leading-tight max-w-4xl italic mb-12">
                      {transcript || "Speak now. I am listening..."}
                    </p>

                    <AnimatePresence>
                      {assistMode && isRecording && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50"
                        >
                          <div className="glass-card p-6 rounded-[2rem] border-primary/30 shadow-2xl flex flex-col items-center gap-4">
                            <div className="flex items-center gap-3">
                              <Sparkles className={cn("w-4 h-4 text-primary", isFetchingAssist && "animate-spin")} />
                              <span className="text-primary font-black text-xs uppercase tracking-[0.2em]">
                                {isFetchingAssist ? "AI Analysis in progress..." : "Recommended Talk Points"}
                              </span>
                            </div>
                            <div className="flex flex-wrap justify-center gap-3">
                              {(suggestions.length > 0 ? suggestions : ["Loading points..."]).map((sug, i) => (
                                <motion.div 
                                  key={i}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm md:text-base whitespace-nowrap"
                                >
                                  {sug}
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col items-center justify-center py-8">
                <AnimatePresence mode="wait">
                  {isRecording ? (
                    <motion.div
                      key="recording"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex flex-col items-center gap-12 w-full"
                    >
                      <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center">
                        <button
                          onClick={stopRecording}
                          className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-red-500/10 text-red-500 border-2 border-red-500/20 font-bold hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
                        >
                          <StopCircle className="w-6 h-6" />
                          STOP NOW
                        </button>
                        {isRapidFire && (
                          <button
                            onClick={handleFinish}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 rounded-2xl bg-foreground text-background font-black text-xl hover:scale-105 transition-all shadow-2xl active:scale-95"
                          >
                            NEXT QUESTION
                            <ChevronRight className="w-7 h-7" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="start"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-10"
                    >
                      {!transcript ? (
                        <button
                          onClick={handleStart}
                          className="w-32 h-32 rounded-[2.5rem] blue-gradient flex flex-col items-center justify-center blue-glow hover:scale-110 transition-transform group relative"
                        >
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-[2.5rem] transition-opacity"></div>
                          <Mic className="w-10 h-10 text-white mb-1 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black text-white/80 tracking-widest">60S</span>
                        </button>
                      ) : (
                        <div className="flex flex-col items-center gap-10 w-full max-w-2xl">
                          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
                            <button
                              onClick={handleStart}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-5 rounded-[1.8rem] bg-card border-2 border-border text-foreground hover:bg-muted hover:border-primary/30 transition-all font-black text-lg shadow-sm active:scale-95"
                            >
                              <RotateCcw className="w-5 h-5" />
                              RETAKE
                            </button>
                            <button
                              onClick={handleFinish}
                              disabled={isAnalyzing}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-[1.8rem] blue-gradient text-white font-black text-lg blue-glow hover:scale-[1.03] active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-blue-500/20"
                            >
                              {isAnalyzing 
                                ? "ANALYZING..." 
                                : isRapidFire 
                                  ? (rapidFireStep < 6 ? "NEXT QUESTION" : "FINISH ROUND") 
                                  : "SEE RESULT"
                              }
                              <ChevronRight className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
